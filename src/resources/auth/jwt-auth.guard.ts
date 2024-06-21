import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt"){
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        console.log('JwtAuthGuard - Authorization Header:', request.headers.authorization);
        return super.canActivate(context);
      }
}