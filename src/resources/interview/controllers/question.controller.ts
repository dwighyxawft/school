import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { InterviewQuestionService } from "../services/question.service";
import { CreateObjectiveQuestionDto } from "../dto/create-objective-question.dto";
import { AdminAuthInterceptor } from "src/interceptors/admin-auth.interceptor";
import { AdminJwtAuthGuard } from "src/resources/auth/admin/admin-jwt-auth.guard";
import { UpdateObjectiveQuestionDto } from "../dto/update-objective-question.dto";
import { CreateTheoryQuestionDto } from "../dto/create-theory-question.dto";
import { UpdateTheoryQuestionDto } from "../dto/update-theory-question.dto";

@Controller("interview/question")
export class InterViewQuestionController{
    constructor(private questionService: InterviewQuestionService){}

    @UseGuards(AdminJwtAuthGuard)
    @UseInterceptors(AdminAuthInterceptor)
    @UsePipes(ValidationPipe)
    @Post("objective/create:id")
    createObjectiveQuestion(@Body() body: CreateObjectiveQuestionDto, @Param("id") id: string, @Request() req){
        return this.questionService.createObjectiveQuestion(req.user.id, body, +id)
    }

    @UseGuards(AdminJwtAuthGuard)
    @UseInterceptors(AdminAuthInterceptor)
    @UsePipes(ValidationPipe)
    @Post("objective/generate:id")
    createObjectiveQuestionWithGPT(@Body() body: UpdateObjectiveQuestionDto, @Param("id") id: string, @Request() req){
        return this.questionService.createObjectiveQuestionWithGPT(req.user.id, body, +id)
    }

    @UseGuards(AdminJwtAuthGuard)
    @UseInterceptors(AdminAuthInterceptor)
    @UsePipes(ValidationPipe)
    @Post("theory/create:id")
    createTheoryQuestion(@Body() body: CreateTheoryQuestionDto, @Param("id") id: string, @Request() req){
        return this.questionService.createTheoryQuestion(req.user.id, body, +id)
    }

    @UseGuards(AdminJwtAuthGuard)
    @UseInterceptors(AdminAuthInterceptor)
    @UsePipes(ValidationPipe)
    @Post("theory/generate:id")
    createTheoryQuestionWith(@Body() body: UpdateTheoryQuestionDto, @Param("id") id: string, @Request() req){
        return this.questionService.createTheoryQuestionWithGPT(req.user.id, body, +id)
    }

    @UseGuards(AdminJwtAuthGuard)
    @UseInterceptors(AdminAuthInterceptor)
    @Get("")
    getAllQuestions(){
        return this.questionService.getAllQuestions()
    }

    @UseGuards(AdminJwtAuthGuard)
    @UseInterceptors(AdminAuthInterceptor)
    @Get(":id")
    getQuestionById(@Param("id") id: string){
        return this.questionService.getQuestionById(+id)
    }

    @UseGuards(AdminJwtAuthGuard)
    @UseInterceptors(AdminAuthInterceptor)
    @Get("theory:id")
    getQuestionsOfTheoryId(@Param("id") id: string){
        return this.questionService.getQuestionsOfTheoryId(+id)
    }

    @UseGuards(AdminJwtAuthGuard)
    @UseInterceptors(AdminAuthInterceptor)
    @Get("objective:id")
    getQuestionsOfObjectiveId(@Param("id") id: string){
        return this.questionService.getQuestionsofObjectiveId(+id)
    }

    @UseGuards(AdminJwtAuthGuard)
    @UseInterceptors(AdminAuthInterceptor)
    @UsePipes(ValidationPipe)
    @Patch("objective:objectiveId/update:id")
    updateObjectiveQuestionById(@Body() body: UpdateObjectiveQuestionDto, @Param("id") id: string, @Request() req, @Param("objectiveId") objectiveId: string){
        return this.questionService.updateObjectiveQuestionById(+objectiveId, +id, req.user.id, body)
    }

    @UseGuards(AdminJwtAuthGuard)
    @UseInterceptors(AdminAuthInterceptor)
    @UsePipes(ValidationPipe)
    @Patch("theory:theoryId/update:id")
    updateTheoryQuestionById(@Body() body: UpdateTheoryQuestionDto, @Param("id") id: string, @Request() req, @Param("theoryId") theoryId: string){
        return this.questionService.updateTheoryQuestionById(+theoryId, +id, req.user.id, body)
    }

    @UseGuards(AdminJwtAuthGuard)
    @UseInterceptors(AdminAuthInterceptor)
    @Delete("objective:objectiveId/delete:id")
    deleteObjectiveQuestion(@Request() req, @Param("objectiveId") objectiveId: string, @Param("id") id: string){
        return this.questionService.deleteObjectiveQuestion(+objectiveId, +id, req.user.id)
    }

    @UseGuards(AdminJwtAuthGuard)
    @UseInterceptors(AdminAuthInterceptor)
    @Delete("theory:theoryId/delete:id")
    deleteTheoryQuestion(@Request() req, @Param("theoryId") theoryId: string, @Param("id") id: string){
        return this.questionService.deleteTheoryQuestion(+theoryId, +id, req.user.id)
    }
}