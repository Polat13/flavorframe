import { Injectable } from '@nestjs/common';
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
    const base64Image = file.buffer.toString('base64');
    const dataURI = `data:${file.mimetype};base64,${base64Image}`;

  const output = await this.replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          image: dataURI,
          // Komutu stili daha agresif uygulaması için güncelledik
          prompt: `A striking, highly detailed ${style} version of this exact food and background. Completely transform the lighting, materials, and atmosphere to strongly match the ${style} theme, but tightly preserve the original geometry of the food and the table. 8k resolution, masterpiece, dramatic illumination`,
          
          // Tatlı Nokta: Ne çok özgür (0.75) ne de çok korkak (0.45)
          prompt_strength: 0.60, 
          
          num_outputs: 1
        }
      }
    );

    // Çıktıyı alıyoruz
    const stream = Array.isArray(output) ? output[0] : output;

    // 1. İhtimal: Replicate objesinin içinde hazır url() metodu varsa direkt onu kullan
    if (stream && typeof stream.url === 'function') {
      return stream.url().toString();
    } 
    
    // 2. İhtimal: Doğrudan ReadableStream geldiyse, bunu okuyup Base64'e çevir
    const response = new Response(stream as any);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    
    return `data:image/jpeg;base64,${base64}`;
  }
}