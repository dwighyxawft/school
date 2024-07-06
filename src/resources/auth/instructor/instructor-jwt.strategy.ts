import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { instructorJwtStrategy } from 'src/constants/jwt.constant';

@Injectable()
export class InstructorJwtStrategy extends PassportStrategy(Strategy, "instructor-jwt") {
  constructor() {
    super(instructorJwtStrategy);
  }

  public async validate(payload: any) {
    return {
      id: payload.sub,
      name: payload.name,
    };
  }
}
