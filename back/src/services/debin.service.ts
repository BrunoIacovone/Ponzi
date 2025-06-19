import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import admin from '../firebase';
import { WalletRepository } from '../repositories/wallet.repository';
import { DebinBankClientService } from './debin-bank-client.service';

@Injectable()
export class DebinService {
  constructor(
    private repo: WalletRepository,
    private debinBankClient: DebinBankClientService,
  ) {}

  async debinTransfer(uid: string, bankEmail: string, amount: number) {
    try {
      await this.debinBankClient.requestTransfer(bankEmail, amount);

      const txId = await this.repo.pushKey();
      const now = Date.now();

      const updates: any = {
        [`users/${uid}/balance`]: admin.database.ServerValue.increment(amount),
        [`users/${uid}/transactions/${txId}`]: {
          direction: 'received',
          user: 'DEBIN',
          amount,
          timestamp: now,
        },
      };

      await this.repo.update(updates);

      const balance = await this.repo.getBalance(uid);
      return {
        success: true,
        balance,
        transaction: { txId, amount, timestamp: now },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
