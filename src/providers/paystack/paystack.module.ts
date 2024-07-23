import { Module } from '@nestjs/common';
import { PaystackProvider } from './paystack.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    providers: [PaystackProvider],
    exports: [PaystackProvider],
    imports: [HttpModule]
})
export class PaystackModule {}
