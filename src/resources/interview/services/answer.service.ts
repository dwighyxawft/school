import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InstructorService } from "src/resources/instructor/instructor.service";
import { CreateObjectiveAnswerDto } from "../dto/create-objective-answer.dto";
import { CreateTheoryAnswerDto } from "../dto/create-theory-answer.dto";
import { InterviewQuestionService } from "./question.service";
import { PrismaService } from "database/prisma/prisma.service";
import { UpdateObjectiveAnswerDto } from "../dto/update-objective-answer.dto";
import { UpdateTheoryAnswerDto } from "../dto/update-theory-answer.dto";

@Injectable()
export class InterviewAnswerService{

    constructor(private instructService: InstructorService, private questionService: InterviewQuestionService, private prisma: PrismaService){}

    public async createObjectiveAnswer(answer: CreateObjectiveAnswerDto, id: number){
        const instructor = await this.instructService.findOne(id);
        const question = await this.questionService.getQuestionById(answer.questionId);
        if(!instructor) throw new HttpException("Instructor not found", HttpStatus.UNAUTHORIZED);
        if(!question) throw new HttpException("Question not found", HttpStatus.NOT_FOUND);
        return this.prisma.interviewObjectiveAnswers.create({ data: answer})
    }

    public async createTheoryAnswer(answer: CreateTheoryAnswerDto, id: number){
        const instructor = await this.instructService.findOne(id);
        const question = await this.questionService.getQuestionById(answer.questionId);
        if(!instructor) throw new HttpException("Instructor not found", HttpStatus.UNAUTHORIZED);
        if(!question) throw new HttpException("Question not found", HttpStatus.NOT_FOUND);
        return this.prisma.interviewTheoryAnswers.create({ data: answer})
    }


    public async updateObjectiveAnswer(answer: UpdateObjectiveAnswerDto, id: number){
        const instructor = await this.instructService.findOne(id);
        const question = await this.questionService.getQuestionById(answer.questionId);
        if(!instructor) throw new HttpException("Instructor not found", HttpStatus.UNAUTHORIZED);
        if(!question) throw new HttpException("Question not found", HttpStatus.NOT_FOUND);
        return this.prisma.interviewObjectiveAnswers.update({ where: {questionId: answer.questionId},data: {
            optionPicked: answer.optionPicked
        }})
    }

    public async updateTheoryAnswer(answer: UpdateTheoryAnswerDto, id: number){
        const instructor = await this.instructService.findOne(id);
        const question = await this.questionService.getQuestionById(answer.questionId);
        if(!instructor) throw new HttpException("Instructor not found", HttpStatus.UNAUTHORIZED);
        if(!question) throw new HttpException("Question not found", HttpStatus.NOT_FOUND);
        return this.prisma.interviewTheoryAnswers.update({ where: {questionId: answer.questionId}, data: {
            answer: answer.answer
        }})
    }
    
}