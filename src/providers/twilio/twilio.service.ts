import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';

@Injectable()
export class TwilioProvider {
  private readonly client: twilio.Twilio;

  constructor() {
    this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
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
