import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Flutterwave from 'flutterwave-node-v3';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating unique transaction references

@Injectable()
export class FlutterwaveProvider {
  private flw: Flutterwave;

  constructor() {
    this.flw = new Flutterwave(
      process.env.FLW_PUBLIC_KEY,
      process.env.FLW_SECRET_KEY,
    );
  }

  async initializePayment(data: {name: string, email: string, phone: string, report: string, amount: number, description: string}) {
    try {
      const payload = {
        tx_ref: uuidv4(), // Generate a unique transaction reference
        amount: data.amount,
        currency: 'NGN',
        redirect_url: 'http://',
        payment_options: 'card',
        customer: {
          email: data.email,
          phonenumber: data.phone,
          name: data.name,
        },
        customizations: {
          title: data.report,
          description: data.description,
          logo: 'https://via.placeholder.com/200x200',
        },
      };

      const response = await this.flw.Payment.initialize(payload);
      return response.data.link; // Return the payment link
    } catch (error) {
      console.error(error);
      throw new HttpException('Payment initialization failed', HttpStatus.BAD_REQUEST);
    }
  }

  async verifyPayment(transactionId: string) {
    try {
      const response = await this.flw.Transaction.verify({ id: transactionId });
      return response.data; // Return the transaction details
    } catch (error) {
      console.error(error);
      throw new Error('Payment verification failed');
    }
  }
}
