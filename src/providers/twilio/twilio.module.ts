import { Module } from '@nestjs/common';
import { TwilioProvider } from './twilio.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    providers: [TwilioProvider],
    exports: [TwilioProvider],
    imports: [ConfigModule]
})
export class TwilioModule {}
