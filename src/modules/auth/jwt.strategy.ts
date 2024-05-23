import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
   constructor(private configService: ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
            secretOrKey: "xawftacademyxawfthost" // replace it with config service JWT_SECRET later
        })
   }

   public async validate(payload: any){
    return {
        id: payload.sub,
        name: payload.name
    }
   }
}