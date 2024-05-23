import { ConfigService } from '@nestjs/config';


const configService = new ConfigService(); // Instantiate ConfigService

export const jwtOptions = {
    secret: configService.get<string>("JWT_SECRET"),
    signOptions: {expiresIn: configService.get<string>("JWT_EXPIRY")}
}