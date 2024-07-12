import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { instructorJwtStrategy } from 'src/config/jwt.config';

@Injectable()
export class InstructorJwtStrategy extends PassportStrategy(Strategy, "jwt") {
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
