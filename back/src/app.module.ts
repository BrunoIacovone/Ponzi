import { Module } from '@nestjs/common';
import { BalanceController } from './controller/balance.controller';
import { TransactionsController } from './controller/transactions.controller';
import { FundsController } from './controller/funds.controller';
import { SendMoneyController } from './controller/send-money.controller';

@Module({
  imports: [],
  controllers: [
    BalanceController,
    TransactionsController,
    FundsController,
    SendMoneyController,
  ],
  providers: [],
})
export class AppModule {}
