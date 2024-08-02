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
      { role: 'system', content: 'You are a helpful assistant. Here is the object with options that have already been generated: ' + JSON.stringify(constraint) + '. Only provide a new and unique option for the question without any additional information or preamble, making sure it does not duplicate any of the existing options and if the correct option is not among the ones in the object, generate the correct option text for the question' },
      { role: 'user', content: msg }
    ];
    return await this.createCompletion(message);
  }

  public async generateCorrectOption(constraint: { question: string, option1?: string, option2?: string, option3?: string, option4?: string,}, msg: string) {
    const message = [
      { role: 'system', content: 'You are a helpful assistant. Here is the object with question and options that have already been generated: ' + JSON.stringify(constraint) + '. Only provide the correct option from the options provided in the object above that best answers the question without any additional information or preamble' },
      { role: 'user', content: msg }
    ];
    return await this.createCompletion(message);
  }

  public async generateAnswer(question: string, msg: string) {
    const message = [
      { role: 'system', content: 'You are a helpful assistant. Here is the question that have already been generated: ' + question + '. Provide the correct answer that best answers the question without any additional information or preamble' },
      { role: 'user', content: msg }
    ];
    return await this.createCompletion(message);
  }

  public async checkAnswer(constraint: {question: string, correct_answer: string, answerProvided: string}, msg: string) {
    const message = [
      { role: 'system', content: 'You are a helpful assistant. Here is the object that have already been generated: ' + JSON.stringify(constraint) + '. which contains the question, correct answer and the answer provided by the candidate. you are to cross reference the answer given to the answer provided. If the answer provided is relating or like the correct answer, you will give me the true and if not, give me false as your response, some answers provided might be correct but may not be provided as the correct answer, you can check it out and not necessarily compare with the correct answer given to you and answer true or false as response depending on whether the answer provided is correct or wrong without any additional information or preamble' },
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
