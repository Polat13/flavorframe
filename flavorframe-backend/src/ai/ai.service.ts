import { Injectable, BadRequestException } from '@nestjs/common';
import Replicate from 'replicate';

@Injectable()
export class AiService {
  private replicate: Replicate;

  constructor() {
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }

  async generateFuturisticImage(file: Express.Multer.File, style: string) {
    try {
      const base64Image = file.buffer.toString('base64');
      const dataURI = `data:${file.mimetype};base64,${base64Image}`;

      console.log('Görsel doğrudan Image-to-Image modeline gönderiliyor...');

      const output = await this.replicate.run(
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        {
          input: {
            image: dataURI,
            // Komut: Yemeğe dokunma, sadece etrafındaki ışığı ve atmosferi değiştir.
            prompt: `A highly detailed, professional product photography shot of this exact food. Enhance the background and lighting to match a dramatic, cinematic ${style} restaurant setting. 8k resolution, masterpiece, perfect studio illumination.`,
            
            // KRİTİK AYAR: 0.35 (Model yemeğin orijinal yapısına ve malzemelerine sadık kalacak)
            prompt_strength: 0.35, 
            
            num_outputs: 1
          }
        }
      );

      console.log('İşlem başarıyla tamamlandı!');

      // Çıktıyı alıyoruz
      const stream = Array.isArray(output) ? output[0] : output;

      // 1. İhtimal: URL olarak geldiyse
      if (stream && typeof stream.url === 'function') {
        return stream.url().toString();
      } 
      
      // 2. İhtimal: Doğrudan ReadableStream geldiyse
      const response = new Response(stream as any);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      
      return `data:image/jpeg;base64,${base64}`;

    } catch (error) {
      console.error("Yapay Zeka Mimarisi Hatası:", error);
      throw new BadRequestException('Görsel işlenirken sunucu tarafında bir hata oluştu.');
    }
  }
}