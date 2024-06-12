import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { jwtStrategy } from 'src/constants/jwt.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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
