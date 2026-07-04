// src/ai/ai.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiService } from './ai.service';
import 'multer';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('enhance')
  @UseInterceptors(FileInterceptor('image')) 
  async enhanceImage(
    @UploadedFile() file: Express.Multer.File, // Frontend'den gelen fotoğraf
    @Body('styleId') styleId: string // Frontend'den gelen stil seçimi (örn: "modern_restoran")
  ) {
    
    // 1. Görseli küçült ve optimize et
    const optimizedImageBuffer = await this.aiService.optimizeImage(file.buffer);

    // 2. Optimize edilmiş görseli ve seçilen stili yapay zekaya gönder
    const generatedImageUrl = await this.aiService.generateImage(optimizedImageBuffer, styleId);

    // 3. Ortaya çıkan şaheserin URL'sini frontend'e geri dön
    return {
      message: 'Görsel başarıyla işlendi!',
      resultUrl: generatedImageUrl,
    };
  }
}