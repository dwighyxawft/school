import { Injectable } from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';

@Injectable()
export class InstructorService {
  create(createInstructorDto: CreateInstructorDto) {
    return 'This action adds a new instructor';
  }

  findAll() {
    return `This action returns all instructor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} instructor`;
  }

  update(id: number, updateInstructorDto: UpdateInstructorDto) {
    return `This action updates a #${id} instructor`;
  }

  remove(id: number) {
    return `This action removes a #${id} instructor`;
  }
}
