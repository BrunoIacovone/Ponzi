import { Module } from '@nestjs/common';
import { BalanceController } from './controller/balance.controller';
import { TransactionsController } from './controller/transactions.controller';
import { FundsController } from './controller/funds.controller';
import { SendMoneyController } from './controller/send-money.controller';
import { UserController } from './controller/user.controller';

@Module({
  imports: [],
  controllers: [BalanceController, TransactionsController, FundsController, SendMoneyController, UserController],
  providers: [],
})
export class AppModule {}
