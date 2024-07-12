import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { jwtStrategy } from 'src/config/jwt.config';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super(jwtStrategy);
  }

  public async validate(payload: any) {
    return {
      id: payload.sub,
      name: payload.name,
    };
  }
}
