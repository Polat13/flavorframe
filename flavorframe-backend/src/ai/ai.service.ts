import { Injectable, BadRequestException } from '@nestjs/common';
import Replicate from 'replicate';
import sharp from 'sharp';

// API Limitlerine takılmamak için mola fonksiyonumuz
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

@Injectable()
export class AiService {
  private replicate: Replicate;

  constructor() {
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }

  // Yardımcı Fonksiyon: Çıktıları Buffer'a (Okunabilir Görsele) çevirir
  private async getBufferFromOutput(output: any): Promise<Buffer> {
    const data = Array.isArray(output) ? output[0] : output;
    if (typeof data === 'string' && data.startsWith('http')) {
      const res = await fetch(data);
      const arr = await res.arrayBuffer();
      return Buffer.from(arr);
    }
    const response = new Response(data as any);
    const arr = await response.arrayBuffer();
    return Buffer.from(arr);
  }

  async generateFuturisticImage(file: Express.Multer.File, style: string) {
    try {
      const base64Image = file.buffer.toString('base64');
      const dataURI = `data:${file.mimetype};base64,${base64Image}`;
console.log('1. İşlem: Orijinal yemek kusursuzca maskelenip kesiliyor...');
      
      const rembgModel = await this.replicate.models.get("cjwbw", "rembg");
      
      // TypeScript'i rahatlatmak ve güvenliği sağlamak için eklenen kontrol
      if (!rembgModel || !rembgModel.latest_version) {
        throw new BadRequestException('Arka plan silme modelinin versiyon bilgisine ulaşılamadı.');
      }

      const bgRemovalOutput = await this.replicate.run(
        `cjwbw/rembg:${rembgModel.latest_version.id}`,
        { input: { image: dataURI } }
      );
      const originalFoodBuffer = await this.getBufferFromOutput(bgRemovalOutput);

      console.log('Replicate API limitleri için 10 saniye nefes alınıyor...');
      await delay(10000); 

      console.log('2. İşlem: AI serbest bırakılıyor (Gölgeler ve atmosfer inşa ediliyor)...');
      
      // SDXL'e 0.60 güç veriyoruz. Arka planı harika yapacak, yemeği biraz bozacak ama geometrisini koruyacak.
      const aiGenerationOutput = await this.replicate.run(
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        {
          input: {
            image: dataURI,
            prompt: `A highly detailed, professional product photography shot of this food on a table. Enhance the background and lighting to match a dramatic, cinematic ${style} restaurant setting. 8k resolution, masterpiece, perfect studio illumination.`,
            prompt_strength: 0.60, 
            num_outputs: 1
          }
        }
      );
      const aiBackgroundBuffer = await this.getBufferFromOutput(aiGenerationOutput);

      console.log('3. İşlem: Sihirli Birleştirme (Magic Overlay) yapılıyor...');
      
      // Yapay zekanın ürettiği görselin boyutlarını öğreniyoruz
      const aiImageInfo = await sharp(aiBackgroundBuffer).metadata();

      // Orijinal kesilmiş yemeğimizi, yapay zekanın görseliyle milimetrik aynı boyuta getiriyoruz
      const resizedOriginalFood = await sharp(originalFoodBuffer)
        .resize(aiImageInfo.width, aiImageInfo.height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toBuffer();

      // BOZUK YEMEĞİN ÜZERİNE KUSURSUZ YEMEĞİ YAPIŞTIRIYORUZ!
      // Alttaki gölgeler korunur, üstteki yemek %100 orijinal kalır.
      const finalImageBuffer = await sharp(aiBackgroundBuffer)
        .composite([
          { 
            input: resizedOriginalFood, 
            gravity: 'center' 
          }
        ])
        .jpeg({ quality: 95 })
        .toBuffer();

      console.log('İşlem mükemmel şekilde tamamlandı!');
      
      return `data:image/jpeg;base64,${finalImageBuffer.toString('base64')}`;

    } catch (error) {
      console.error("Yapay Zeka Mimarisi Hatası:", error);
      throw new BadRequestException('Görsel işlenirken sunucu tarafında bir hata oluştu.');
    }
  }
}