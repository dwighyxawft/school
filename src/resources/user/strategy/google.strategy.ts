import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()

export class UserGoogleStrategy extends PassportStrategy(Strategy, "google-user"){ constructor(private config: ConfigService){
    super({
        clientID: config.get<string>("GOOGLE_AUTH_ID"),
        clientSecret: config.get<string>("GOOGLE_AUTH_SECRET"),
        callbackURL: "http://localhost:3000/user/google/callback",
        scope: ["email", "profile", 'https://www.googleapis.com/auth/user.gender.read']
    })
}
async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any>{
    const {name, emails, photos} = profile; 
    const rawProfile = profile._json;
    console.log(rawProfile) // Get the raw profile JSON
    const gender = rawProfile.gender || null; // Extract gender information
    const fullName = rawProfile.name;
    const user = {
    email: emails[0].value,
    firstName: name.givenName,
    lastName: name.familyName,
    picture: photos[0].value,
    gender: gender, // Add gender information
    name: fullName,
    accessToken,
    };
    done(null, user);
}}