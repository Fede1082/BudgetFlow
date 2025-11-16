import { Module } from '@nestjs/common'
import { StatsService } from './stats.service'
import { StatsController } from './stats.controller'
import { TransactionsModule } from '../transactions/transactions.module'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [TransactionsModule, PrismaModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
