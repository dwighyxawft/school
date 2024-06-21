import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public async logout(id: number) {
    return 'Hello World!';
  }
}
