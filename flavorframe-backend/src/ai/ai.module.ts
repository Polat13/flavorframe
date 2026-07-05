import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { UsageLog, UsageLogSchema } from './schemas/usage-log.schema'; 

@Module({
  imports: [
    // Hatayı çözecek kritik satır: Mongoose'a bu modülde bu şemayı kullanacağımızı söylüyoruz
    MongooseModule.forFeature([{ name: UsageLog.name, schema: UsageLogSchema }])
  ],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}