import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { AccountsModule } from './accounts/accounts.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [TransactionsModule, AccountsModule, StatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
