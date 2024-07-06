import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AdminJwtAuthGuard extends AuthGuard("admin-jwt"){
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        console.log('JwtAuthGuard - Authorization Header:', request.headers.authorization);
        return super.canActivate(context);
      }
}