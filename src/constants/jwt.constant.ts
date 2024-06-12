import { ConfigService } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';


const configService = new ConfigService(); // Instantiate ConfigService

export const jwtOptions = {
    secret: configService.get<string>("JWT_SECRET"),
    signOptions: {expiresIn: "1d"}
}

export const jwtStrategy = {
    jwtFromRequest: ExtractJwt.fromExtractors([
      (request) => {
        let token = null;
        if (request && request.cookies) {
          token = request.cookies['access_token'];
        }
        if (!token && request.headers.authorization) {
          token = request.headers.authorization.replace('Bearer ', '');
        }
        console.log('Extracted Token:', token); // Log the extracted token
        return token;
      },
    ]),
    secretOrKey: 'xawftacademyxawfthost', // replace it with config service JWT_SECRET later
  };