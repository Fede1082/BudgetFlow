import { Module } from '@nestjs/common'
import { StatsService } from './stats.service'
import { StatsController } from './stats.controller'
import { TransactionsModule } from '../transactions/transactions.module'

@Module({
  imports: [TransactionsModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
