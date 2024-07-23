import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

@Injectable()
export class OpenAIProvider {
  private openai: OpenAI;

  constructor(private config: ConfigService) {
    this.openai = new OpenAI({
      apiKey: config.get<string>("OPENAI_API_KEY"),
      organization: config.get<string>("OPENAI_ORG_ID"),
      project: config.get<string>("OPENAI_PROJECT_ID"),
    });
  }

  public async createCompletion(messages: any[]) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
    });
    return response.choices[0].message;
  }

  public async generateQuestion(questions: string[], msg: string) {
    const message = [
      { role: 'system', content: 'You are a helpful assistant. Here is the array of questions that have already been generated: ' + questions + ' .Only provide a new and unique question text without any additional information or preamble' },
      { role: 'user', content: msg }
    ];
    return await this.createCompletion(message);
  }

  public async generateOption(constraint: { question: string, option1?: string, option2?: string, option3?: string }, msg: string) {
    const message = [
      { role: 'system', content: 'You are a helpful assistant. Here is the object with options that have already been generated: ' + JSON.stringify(constraint) + '. Only provide a new and unique option for the question without any additional information or preamble, making sure it does not duplicate any of the existing options' },
      { role: 'user', content: msg }
    ];
    return await this.createCompletion(message);
  }

  public async generateText(msg: string) {
    const message = [
      { role: 'system', content: 'You are a helpful assistant' },
      { role: 'user', content: msg }
    ];
    return await this.createCompletion(message);
  }
}
