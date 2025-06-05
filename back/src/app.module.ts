import { Module } from '@nestjs/common';
import { BalanceController } from './controller/balance.controller';
import { TransactionsController } from './controller/transactions.controller';
import { DebinController } from './controller/debin.controller';
import { SendMoneyController } from './controller/send-money.controller';
import { WalletRepository } from './repositories/wallet.repository';
import { TransactionsService } from './services/transactions.service';
import { DebinService } from './services/debin.service';
import { SendMoneyService } from './services/send-money.service';
import { BalanceService } from './services/balance.service';
import { DebinBankClientService } from './services/debin-bank-client.service';
import { HttpModule } from '@nestjs/axios';
import { BankService } from './services/bank.service';
import { BankController } from './controller/bank.controller';

@Module({
  imports: [HttpModule],
  controllers: [
    BalanceController,
    TransactionsController,
    DebinController,
    SendMoneyController,
    BankController,
  ],
  providers: [
    WalletRepository,
    TransactionsService,
    DebinService,
    SendMoneyService,
    BalanceService,
    DebinBankClientService,
    BankService,
  ],
})
export class AppModule {}
