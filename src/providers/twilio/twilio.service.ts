import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

@Injectable()
export class TwilioProvider {
  private readonly client: twilio.Twilio;
  constructor(private config: ConfigService) {
    this.client = twilio(this.config.get<string>("TWILIO_ACCOUNT_SID"), this.config.get<string>("TWILIO_AUTH_TOKEN"));
  }
  public async sendSMS(to: string, body: string): Promise<void> {
    await this.client.messages.create({
      body: body,
      to: to,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
    });
  }

  public async sendWhatsAppMessage(to: string, body: string) {
    return await this.client.messages.create({
      body: body,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${to}`,
    });
  }
}
