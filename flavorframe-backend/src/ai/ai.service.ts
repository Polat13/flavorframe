// src/ai/ai.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import sharp from 'sharp';
import Replicate from 'replicate';
import { UsageLog } from './schemas/usage-log.schema';

@Injectable()
export class AiService {
  private replicate: Replicate;

  constructor(
    // MongoDB modelimizi servise dahil ediyoruz
    @InjectModel(UsageLog.name) private usageLogModel: Model<UsageLog>
  ) {
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }

  async optimizeImage(fileBuffer: Buffer): Promise<Buffer> {
    return await sharp(fileBuffer).resize({ width: 1024, height: 1024, fit: 'inside' }).jpeg({ quality: 80 }).toBuffer();
  }

  async generateImage(imageBuffer: Buffer, styleId: string): Promise<string> {
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    const selectedPrompt = styleId; // Şimdilik basit tutalım

    try {
      const output = await this.replicate.run(
        "stability-ai/stable-diffusion-img2img:15a3689ee13b0d2616e98820eca31d4c3abcd36672ff6afce5cb94283c7d6c4a",
        { input: { image: base64Image, prompt: selectedPrompt, prompt_strength: 0.75 } }
      );

      // MongoDB'ye Başarılı Kayıt
      await new this.usageLogModel({ styleId, status: 'SUCCESS' }).save();

      return (output as string[])[0];

    } catch (error) {
      // MongoDB'ye Hatalı Kayıt
      await new this.usageLogModel({ styleId, status: 'ERROR' }).save();
      throw error;
    }
  }
}