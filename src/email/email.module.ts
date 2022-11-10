import { EmailService } from './email.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './configs/email.config';
import EmailScheduleController from './email-schedule.controller';
import { EmailScheduleService } from './email-schedule.service';

@Module({
  imports: [ConfigModule.forFeature(emailConfig)],
  controllers: [EmailScheduleController],
  providers: [EmailService, EmailScheduleService],
  exports: [EmailService],
})
export class EmailModule {}
