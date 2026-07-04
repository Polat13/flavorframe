// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { AllExceptionsFilter } from './common/filters/http-exception.filter'; // Filtremizi import ettik

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Global Exception Filter'ı devreye alıyoruz
  app.useGlobalFilters(new AllExceptionsFilter());

  // 2. CORS Ayarı (Cross-Origin Resource Sharing)
  // Tarayıcılar güvenlik gereği localhost:3000'den localhost:3500'e giden istekleri bloke eder.
  // Bu ayar ile sadece belirlediğimiz frontend domain'ine izin veriyoruz.
  app.enableCors({
    origin: 'http://localhost:3000', // React projemizin çalışacağı adres
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // İleride cookie veya token kullanırsak diye aktif ediyoruz
  });

  // 3. Dosya yükleme boyut sınırları
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  await app.listen(3500); // Backend servis portu[cite: 1]
}
bootstrap();