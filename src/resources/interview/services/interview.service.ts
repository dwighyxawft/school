import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInterviewDto } from '../dto/create-interview.dto';
import { UpdateInterviewDto } from '../dto/update-interview.dto';
import { AdminService } from 'src/resources/admin/admin.service';
import { InstructorService } from 'src/resources/instructor/instructor.service';
import { PrismaService } from 'database/prisma/prisma.service';

@Injectable()
export class InterviewService {
  constructor(private adminService: AdminService, private instructService: InstructorService, private prisma: PrismaService){}
  public async create(id: number, interview: CreateInterviewDto) {
    const admin = await this.adminService.findOne(id);
    if(!admin) throw new HttpException("Admin Not Found", HttpStatus.NOT_FOUND);
    const instructor = await this.instructService.findOne(interview.instructorId);
    if(!instructor) throw new HttpException("Instructor Not Found", HttpStatus.NOT_FOUND);
    let testType: string;
    if(interview.type === "Objective"){
      testType = "objectiveTest";
    }else{
      testType = "theoryTest";
    }
    const payload = {
      name: interview.name,
      instructorId: interview.instructorId,
      type: interview.type,
      phase: interview.phase,
      status: interview.status,
    }
    payload[testType] = {
      create: {
        score: 0,
        passed: false
      }
    }
    return this.prisma.interview.create({data: payload})
  }

  public async getObjectiveTest(id: number){
    return this.prisma.objectiveTest.findUnique({where: {id}, include: {
      questions: {
        select: {
          text: true,
          options: {
            select: {
              text: true
            }
          },
          correctOption: true,
          answersProvided: true
        }
      },
      interview: {
        select: {
          instructor: true
      }
    }}});
  }

  public async getTheoryTest(id: number){
    return this.prisma.theoryTest.findUnique({where: {id}, include: {
      interview: {
        select: {
          instructor: true
      }
    },
    questions: {
      select: {
        text: true,
        answer: true,
        answersProvided: true
      }
    }
  }});
  }

  public async findAll() {
    return this.prisma.interview.findMany({ include: {
      objectiveTest: true,
      theoryTest: true,
    }})
  }

  public async findOne(id: number) {
    return this.prisma.interview.findUnique({ where: {id}, include: {
      objectiveTest: true,
      theoryTest: true,
      instructor: true
    }})
  }

  public async update(id: number, interview: UpdateInterviewDto, interviewId: number) {
    const admin = await this.adminService.findOne(id);
    const test = await this.findOne(interviewId);
    if(!test) throw new HttpException("Interview not found", HttpStatus.BAD_REQUEST);
    if(!admin) throw new HttpException("Admin Not Found", HttpStatus.NOT_FOUND);
    const instructor = await this.instructService.findOne(interview.instructorId);
    if(!instructor) throw new HttpException("Instructor Not Found", HttpStatus.NOT_FOUND);
    return this.prisma.interview.update({where: {id: interviewId}, data:  {
      name: interview.name,
      instructorId: interview.instructorId,
      type: interview.type,
      phase: interview.phase,
      status: interview.status,
    }})
  }

  public async remove(id: number, interviewId: number) {
    const admin = await this.adminService.findOne(id);
    if(!admin) throw new HttpException("Admin not found", HttpStatus.BAD_GATEWAY);
    await this.prisma.interview.delete({where: {id: interviewId}});
    await this.prisma.objectiveTest.delete({where: {interviewId}});
    await this.prisma.theoryTest.delete({where: {interviewId}});
    return {status: true, msg: "Interview deleted successfully"};
  }
}
