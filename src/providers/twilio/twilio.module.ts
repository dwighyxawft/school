import { Module } from '@nestjs/common';
import { TwilioProvider } from './twilio.service';

@Module({
    providers: [TwilioProvider],
    exports: [TwilioProvider]
})
export class TwilioModule {}
