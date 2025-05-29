import { Module } from '@nestjs/common';
import { BalanceController } from './controller/balance.controller';
import { TransactionsController } from './controller/transactions.controller';
import { FundsController } from './controller/funds.controller';
import { SendMoneyController } from './controller/send-money.controller';
// import { WalletService } from './services/wallet.service';
import { WalletRepository } from './repositories/wallet.repository';
import { TransactionsService } from './services/transactions.service';
import { FundsService } from './services/funds.service';
import { SendMoneyService } from './services/send-money.service';
import { BalanceService } from './services/balance.service';

@Module({
  imports: [],
  controllers: [
    BalanceController,
    TransactionsController,
    FundsController,
    SendMoneyController,
  ],
  providers: [
    // WalletService,
    WalletRepository,
    TransactionsService,
    FundsService,
    SendMoneyService,
    BalanceService
  ],
})
export class AppModule {}
