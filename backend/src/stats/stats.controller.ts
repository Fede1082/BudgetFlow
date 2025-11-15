import { Controller, Get, Query } from '@nestjs/common'
import { StatsService } from './stats.service'

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('summary')
  getSummary() {
    return this.statsService.getSummary()
  }

  @Get('spending-by-category')
  getSpendingByCategory() {
    return this.statsService.getSpendingByCategory()
  }

  @Get('monthly-summary')
  getMonthlySummary(@Query('month') month?: string) {
    return this.statsService.getMonthlySummary(month)
  }
}
