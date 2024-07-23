import { Injectable, HttpException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaystackProvider {
  constructor(
    private httpService: HttpService,
    private config: ConfigService,
  ) {}

  private readonly secretKey = this.config.get<string>('PAYSTACK_SECRET'); // Replace with your actual secret key

  public async initializeTransaction(
    email: string,
    amount: number,
  ): Promise<any> {
    const url = 'https://api.paystack.co/transaction/initialize';
    const headers = {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };
    const data = {
      email: email,
      amount: amount,
    };

    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(url, data, { headers }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Paystack API error',
        error.response?.status || 500,
      );
    }
  }

  public async verifyTransaction(reference: string): Promise<any> {
    const url = `https://api.paystack.co/transaction/verify/${reference}`;
    const headers = {
      Authorization: `Bearer ${this.secretKey}`,
    };

    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(url, { headers }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Paystack API error',
        error.response?.status || 500,
      );
    }
  }
}
