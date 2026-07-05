import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  Body, 
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiService } from './ai.service'; // Servisimizi dahil ettik
import'multer';

@Controller('ai')
export class AiController {
  
  // Dependency Injection ile servisi bağlıyoruz
  constructor(private readonly aiService: AiService) {}

  @Post('enhance')
  @UseInterceptors(FileInterceptor('file')) 
  async enhanceImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { id: string; style: string } 
  ) {
    if (!file) {
      throw new BadRequestException('Lütfen bir görsel yükleyin.');
    }

    try {
      console.log('Görsel yapay zekaya gönderiliyor... Lütfen bekleyin.');
      
      // Gerçek AI motorunu çalıştır
      const generatedImageUrl = await this.aiService.generateFuturisticImage(file, body.style);
      console.log('Replicate Çıktısı:', generatedImageUrl);
      console.log('Yapay zeka işlemi tamamlandı!');

      return {
        id: body.id,
        originalImageUrl: 'isleme-alindi',
        generatedImageUrl: generatedImageUrl, // Replicate'ten gelen gerçek link
        status: 'success',
        message: 'Yapay zeka görseli başarıyla üretti!'
      };
    } catch (error) {
      console.error("Replicate AI Hatası:", error);
      throw new BadRequestException('Görsel işlenirken yapay zeka servisinde bir hata oluştu.');
    }
  }
}