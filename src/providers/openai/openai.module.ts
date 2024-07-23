import { Module } from '@nestjs/common';
import { OpenAIProvider } from './openai.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    providers: [OpenAIProvider],
    exports: [OpenAIProvider],
    imports: [ConfigModule]
})
export class OpenaiModule {}
