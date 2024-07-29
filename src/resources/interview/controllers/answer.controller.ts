import { Body, Controller, Patch, Post, Request, UseGuards, UseInterceptors } from "@nestjs/common";
import { InterviewAnswerService } from "../services/answer.service";
import { CreateObjectiveAnswerDto } from "../dto/create-objective-answer.dto";
import { CreateTheoryAnswerDto } from "../dto/create-theory-answer.dto";
import { UpdateTheoryAnswerDto } from "../dto/update-theory-answer.dto";
import { InstructorJwtAuthGuard } from "src/resources/auth/instructor/instructor-jwt-auth.guard";
import { InstructorAuthInterceptor } from "src/interceptors/instructor-auth.interceptor";

@Controller("interview/answer")
export class InterviewAnswerController{
    constructor(private answerService: InterviewAnswerService){}


    @UseGuards(InstructorJwtAuthGuard)
    @UseInterceptors(InstructorAuthInterceptor)
    @Post("objective/create")
    createObjectiveAnswer(@Body() answer: CreateObjectiveAnswerDto, @Request() req){
        return this.answerService.createObjectiveAnswer(answer, req.user.id)
    }

    @UseGuards(InstructorJwtAuthGuard)
    @UseInterceptors(InstructorAuthInterceptor)
    @Post("theory/create")
    createTheoryAnswer(@Body() answer: CreateTheoryAnswerDto, @Request() req){
        return this.answerService.createTheoryAnswer(answer, req.user.id)
    }

    @UseGuards(InstructorJwtAuthGuard)
    @UseInterceptors(InstructorAuthInterceptor)
    @Patch("objective/update")
    updateObjectiveAnswer(@Body() answer: CreateTheoryAnswerDto, @Request() req){
        return this.answerService.updateObjectiveAnswer(answer, req.user.id)
    }

    @UseGuards(InstructorJwtAuthGuard)
    @UseInterceptors(InstructorAuthInterceptor)
    @Patch("theory/update")
    updateTheoryAnswer(@Body() answer: UpdateTheoryAnswerDto, @Request() req){
        return this.answerService.updateTheoryAnswer(answer, req.user.id)
    }
        

}