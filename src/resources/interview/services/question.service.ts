import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'database/prisma/prisma.service';
import { CreateObjectiveQuestionDto } from '../dto/create-objective-question.dto';
import { AdminService } from 'src/resources/admin/admin.service';
import { InterviewService } from './interview.service';
import { OpenAIProvider } from 'src/providers/openai/openai.service';
import { UpdateObjectiveQuestionDto } from '../dto/update-objective-question.dto';
import { CreateTheoryQuestionDto } from '../dto/create-theory-question.dto';
import { UpdateTheoryQuestionDto } from '../dto/update-theory-question.dto';

@Injectable()
export class InterviewQuestionService {
  constructor(
    private prisma: PrismaService,
    private adminService: AdminService,
    private interview: InterviewService,
    private openai: OpenAIProvider,
  ) {}

  // CREATE QUESTIONS ENDPOINT

  // Create Objectives Question Services
  public async createObjectiveQuestion(
    id: number,
    question: CreateObjectiveQuestionDto,
    test_id: number,
  ) {
    const admin = await this.adminService.findOne(id);
    if (!admin)
      throw new HttpException('Admin not found', HttpStatus.UNAUTHORIZED);
    const objective = await this.interview.getObjectiveTest(test_id);
    if (!objective)
      throw new HttpException(
        'Objective Test not found',
        HttpStatus.NOT_ACCEPTABLE,
      );
    if(objective.questions.length >= 30) throw new HttpException("Cannot create more than 30 questions", HttpStatus.FORBIDDEN); 
    return this.prisma.interviewObjectiveQuestion.create({
      data: {
        objectiveId: test_id,
        text: question.text,
        correctOption: question.correctOption,
        options: {
          createMany: {
            data: [
              {
                text: question.option1,
              },
              {
                text: question.option2,
              },
              {
                text: question.option3,
              },
              {
                text: question.option4,
              },
            ],
          },
        },
      },
    });
  }

  public async createObjectiveQuestionWithGPT(
    id: number,
    question: UpdateObjectiveQuestionDto,
    test_id: number,
  ) {
    const admin = await this.adminService.findOne(id);
    if (!admin)
      throw new HttpException('Admin not found', HttpStatus.UNAUTHORIZED);
    const objective = await this.interview.getObjectiveTest(test_id);
    if (!objective)
      throw new HttpException(
        'Objective Test not found',
        HttpStatus.NOT_ACCEPTABLE,
      );
      if(objective.questions.length >= 30) throw new HttpException("Cannot create more than 30 questions", HttpStatus.FORBIDDEN); 
    const allTestQuestionsAndOptions =
      await this.getQuestionsofObjectiveId(test_id);
    const allTestQuestions = allTestQuestionsAndOptions.map(
      (testers) => testers.text,
    );
    const generatedQuestion = await this.openai.generateQuestion(
      allTestQuestions,
      `Provide a new and unique question for an instructor whose major is ${objective.interview.instructor.major}`,
    );
    question.text = String(generatedQuestion);
    const payload: {
      question: string;
      option1?: string;
      option2?: string;
      option3?: string;
      option4?: string;
    } = { question: question.text };
    question.option1 = String(
      await this.openai.generateOption(
        payload,
        `Provide a new and unique option for the question in the object and do not repeat any of the options in the object provided if there are options provided in the object`,
      ),
    );
    payload.option1 = question.option1;
    question.option2 = String(
      await this.openai.generateOption(
        payload,
        `Provide a new and unique option for the question in the object and do not repeat any of the options in the object provided if there are options provided in the object`,
      ),
    );
    payload.option2 = question.option2;
    question.option3 = String(
      await this.openai.generateOption(
        payload,
        `Provide a new and unique option for the question in the object and do not repeat any of the options in the object provided if there are options provided in the object`,
      ),
    );
    payload.option3 = question.option3;
    question.option4 = String(
      await this.openai.generateOption(
        payload,
        `Provide a new and unique option for the question in the object and do not repeat any of the options in the object provided if there are options provided in the object`,
      ),
    );
    payload.option4 = question.option4;
    question.correctOption = +(await this.openai.generateCorrectOption(
      payload,
      `Select the correct option among the options that best answers the question as a number ike option1 as 1, option2 as 2, option3 as 3 and option4 as 4`,
    ));
    return this.prisma.interviewObjectiveQuestion.create({
      data: {
        objectiveId: test_id,
        text: question.text,
        correctOption: question.correctOption,
        options: {
          createMany: {
            data: [
              {
                text: question.option1,
              },
              {
                text: question.option2,
              },
              {
                text: question.option3,
              },
              {
                text: question.option4,
              },
            ],
          },
        },
      },
    });
  }

  // Create Theory Question Services

  public async createTheoryQuestion(
    id: number,
    question: CreateTheoryQuestionDto,
    test_id: number,
    ) {
    const admin = await this.adminService.findOne(id);
    if (!admin)
      throw new HttpException('Admin not found', HttpStatus.UNAUTHORIZED);
    const theory = await this.interview.getTheoryTest(test_id);
    if (!theory)
      throw new HttpException(
        'Theory Test not found',
        HttpStatus.NOT_ACCEPTABLE,
      );
      if(theory.questions.length >= 20) throw new HttpException("Cannot create more than 20 questions", HttpStatus.FORBIDDEN); 
    return this.prisma.interviewTheoryQuestion.create({
      data: {
        text: question.text,
        answer: question.answer,
        theoryId: test_id,
      },
    });
  }

  public async createTheoryQuestionWithGPT(
    id: number,
    question: UpdateTheoryQuestionDto,
    test_id: number,
  ) {
    const admin = await this.adminService.findOne(id);
    if (!admin)
      throw new HttpException('Admin not found', HttpStatus.UNAUTHORIZED);
    const theory = await this.interview.getTheoryTest(test_id);
    if (!theory)
      throw new HttpException(
        'Theory Test not found',
        HttpStatus.NOT_ACCEPTABLE,
      );
      if(theory.questions.length >= 20) throw new HttpException("Cannot create more than 20 questions", HttpStatus.FORBIDDEN); 
    const allTestQuestionsAndOptions =
      await this.getQuestionsOfTheoryId(test_id);
    const allTestQuestions = allTestQuestionsAndOptions.map(
      (testers) => testers.text,
    );
    const generatedQuestion = await this.openai.generateQuestion(
      allTestQuestions,
      `Provide a new and unique question for an instructor whose major is ${theory.interview.instructor.major}`,
    );
    question.text = String(generatedQuestion);
    question.answer = String(
      await this.openai.generateAnswer(
        question.text,
        `Provide a good answer that best answers the question`,
      ),
    );

    return this.prisma.interviewTheoryQuestion.create({
      data: {
        theoryId: test_id,
        text: question.text,
        answer: question.answer,
      },
    });
  }

  public async submitObjectiveTest(id: number, objectiveId: number){
    const admin = await this.adminService.findOne(id);
    const objective = await this.interview.getObjectiveTest(objectiveId);
    if(!admin) throw new HttpException("Admin not found", HttpStatus.UNAUTHORIZED);
    if(!objective) throw new HttpException("Objective Test not found", HttpStatus.NOT_FOUND);
    let markGiven: number = 0;
    objective.questions.forEach(async (question) => {
      if(question.answersProvided.optionPicked === question.correctOption){
          markGiven += 3;
      }
    })
    const avg = (markGiven/90)*100
    if(avg >= 70){
      return this.prisma.objectiveTest.update({ where: {id: objectiveId}, data: {
        score: avg,
        passed: true
      }})
    }else{
      return this.prisma.objectiveTest.update({ where: {id: objectiveId}, data: {
        score: avg,
        passed: false
      }})
    }
  }

  public async submitTheoryTest(id: number, theoryId: number){
    const admin = await this.adminService.findOne(id);
    const theory = await this.interview.getTheoryTest(theoryId);
    if(!admin) throw new HttpException("Admin not found", HttpStatus.UNAUTHORIZED);
    if(!theory) throw new HttpException("Theory Test not found", HttpStatus.NOT_FOUND);
    let markGiven: number = 0;
    theory.questions.forEach(async (question) => {
      const payload = {question: question.text, correct_answer: question.answer, answerProvided: question.answersProvided.answer};
      const check = await this.openai.checkAnswer(payload, "verify if the answer provided is correct.");
      if(Boolean(check)){
        markGiven += 5
      }
    })
    if(markGiven >= 70){
      return this.prisma.theoryTest.update({ where: {id: theoryId}, data: {
        score: markGiven,
        passed: true
      }})
    }else{
      return this.prisma.theoryTest.update({ where: {id: theoryId}, data: {
        score: markGiven,
        passed: false
      }})
    }
  }

  // GET QUESTIONS ENDPOINT

  // Get Objectives Questions Services
  public async getQuestionsofObjectiveId(objectiveId: number) {
    return this.prisma.interviewObjectiveQuestion.findMany({
      where: { objectiveId },
      include: {
        options: {
          select: {
            text: true,
          },
        },
        answersProvided: {
          select: {
            instructorId: true,
            optionPicked: true
          }
        }
      },
    });
  }

  // Get Theory Questions Services
  public async getQuestionsOfTheoryId(theoryId: number) {
    return this.prisma.interviewTheoryQuestion.findMany({
      where: { theoryId }, include: {
        answersProvided: {
          select: {
            answer: true, 
            instructorId: true
          }
        }
      }
    });
  }

  public async getQuestionById(id: number) {
    return this.prisma.interviewObjectiveQuestion.findMany({
      where: { id },
      include: {
        options: {
          select: {
            text: true,
          },
        },
      },
    });
  }

  public async getAllQuestions() {
    return this.prisma.interviewObjectiveQuestion.findMany({
      include: {
        options: {
          select: {
            text: true,
          },
        },
      },
    });
  }

  // UPDATE QUESTIONS ENDPOINT

  // Update Objective Question Service
  public async updateObjectiveQuestionById(
    objectiveId: number,
    id: number,
    adminId: number,
    detail: UpdateObjectiveQuestionDto,
  ) {
    const objective = await this.interview.getObjectiveTest(objectiveId);
    const admin = await this.adminService.findOne(adminId);
    const question = await this.getQuestionById(id);
    if (!admin)
      throw new HttpException('Admin not found', HttpStatus.UNAUTHORIZED);
    if (!objective)
      throw new HttpException('Objective not valid', HttpStatus.CONFLICT);
    if (!question)
      throw new HttpException('Question not found', HttpStatus.BAD_REQUEST);
    return this.prisma.interviewObjectiveQuestion.update({
      where: { id },
      data: detail,
    });
  }

  // Update Theory Question Service
  public async updateTheoryQuestionById(
    theoryId: number,
    id: number,
    adminId: number,
    detail: UpdateTheoryQuestionDto,
  ) {
    const theory = await this.interview.getTheoryTest(theoryId);
    const admin = await this.adminService.findOne(adminId);
    const question = await this.getQuestionById(id);
    if (!admin)
      throw new HttpException('Admin not found', HttpStatus.UNAUTHORIZED);
    if (!theory)
      throw new HttpException('Objective not valid', HttpStatus.CONFLICT);
    if (!question)
      throw new HttpException('Question not found', HttpStatus.BAD_REQUEST);
    return this.prisma.interviewTheoryQuestion.update({
      where: { id },
      data: detail,
    });
  }

  // DELETE QUESTIONS ENDPOINTS

  // Delete Objective Question Service
  public async deleteObjectiveQuestion(
    objectiveId: number,
    id: number,
    adminId: number,
  ) {
    const objective = await this.interview.getObjectiveTest(objectiveId);
    const admin = await this.adminService.findOne(adminId);
    const question = await this.getQuestionById(id);
    if (!admin)
      throw new HttpException('Admin not found', HttpStatus.UNAUTHORIZED);
    if (!objective)
      throw new HttpException('Objective not valid', HttpStatus.CONFLICT);
    if (!question)
      throw new HttpException('Question not found', HttpStatus.BAD_REQUEST);
    return this.prisma.interviewObjectiveQuestion.delete({ where: { id } });
  }

  // Delete Theory Question Service
  public async deleteTheoryQuestion(
    theoryId: number,
    id: number,
    adminId: number,
  ) {
    const theory = await this.interview.getTheoryTest(theoryId);
    const admin = await this.adminService.findOne(adminId);
    const question = await this.getQuestionById(id);
    if (!admin)
      throw new HttpException('Admin not found', HttpStatus.UNAUTHORIZED);
    if (!theory)
      throw new HttpException('Theory not valid', HttpStatus.CONFLICT);
    if (!question)
      throw new HttpException('Question not found', HttpStatus.BAD_REQUEST);
    return this.prisma.interviewTheoryQuestion.delete({ where: { id } });
  }
}
