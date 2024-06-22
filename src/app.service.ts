import { Injectable } from '@nestjs/common';
import { PrismaService } from 'database/prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class AppService {
  constructor( private prisma: PrismaService){}
  public async logout(id: number, res: Response) {
    res.clearCookie("access_token")
    return await this.prisma.user.update({where: {id}, data: {
      status: "offline"
    }})
  }
}
