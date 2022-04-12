import { EmailService } from './email.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './configs/email.config';
import { AuthModule } from 'src/auth/auth.module';
import EmailScheduleController from './emailSchedule.controller';
import { EmailScheduleService } from './emailSchedule.service';

@Module({
  imports: [ConfigModule.forFeature(emailConfig), AuthModule],
  controllers: [EmailScheduleController],
  providers: [EmailService, EmailScheduleService],
  exports: [EmailService],
})
export class EmailModule {}