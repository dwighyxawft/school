import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Injectable()
export class UserJwtAuthGuard extends AuthGuard("user"){
    canActivate(context: ExecutionContext) {
        const request: Request = context.switchToHttp().getRequest();
        console.log("User Auth Guard Token: ",request.cookies["access_token"]);
        return super.canActivate(context);
      }
}