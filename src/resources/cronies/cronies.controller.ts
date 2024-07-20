import { Controller } from '@nestjs/common';
import { CroniesService } from './cronies.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('cronies')
export class CroniesController {
  constructor(private readonly croniesService: CroniesService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async setupDailyCronJobs() {
    await this.croniesService.signalAllUsersForTodaysClasses();
  }
}
