import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

const configService = new ConfigService(); // Instantiate ConfigService

export const mailer = {
  transport: {
    host: configService.get<string>('MAIL_HOST'),
    port: configService.get<number>('MAIL_PORT'),
    secure: configService.get<boolean>('MAIL_TCP'),
    auth: {
      user: configService.get<string>('MAIL_AUTH_USER'),
      pass: configService.get<string>('MAIL_AUTH_PASS'),
    },
  },
  defaults: {
    from: configService.get<string>('MAIL_AUTH_USER'),
  },
  template: {
    dir: path.join(__dirname, "..", "..", "..", "src", "templates"),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
