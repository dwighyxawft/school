import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { adminJwtStrategy } from 'src/config/jwt.config';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    super(adminJwtStrategy);
  }

  public async validate(payload: any) {
    return {
      id: payload.sub,
      name: payload.name,
    };
  }
}
