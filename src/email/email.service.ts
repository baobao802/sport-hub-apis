import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as Mail from 'nodemailer/lib/mailer';
import { createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;

  constructor(private configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      service: configService.get<string>('email.service'),
      auth: {
        user: configService.get<string>('email.user'),
        pass: configService.get<string>('email.password'),
      },
    });
  }

  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }
}
