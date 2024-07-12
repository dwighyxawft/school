import { ExtractJwt } from 'passport-jwt';


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

  export const instructorJwtStrategy = {
    jwtFromRequest: ExtractJwt.fromExtractors([
      (request) => {
        let token = null;
        if (request && request.cookies) {
          token = request.cookies['instructor_token'];
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

  export const adminJwtStrategy = {
    jwtFromRequest: ExtractJwt.fromExtractors([
      (request) => {
        let token = null;
        if (request && request.cookies) {
          token = request.cookies['admin_token'];
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