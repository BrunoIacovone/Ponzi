import { Injectable } from '@nestjs/common';
import admin from '../firebase';
import { WalletRepository } from '../repositories/wallet.repository';

@Injectable()
export class BankService {
  constructor(private repo: WalletRepository) {}

  async bankTransfer(bankEmail: string, amount: number) {
    try {
      const txId = await this.repo.pushKey();
      const now = Date.now();
      const uid = (await this.repo.getUserByEmail(bankEmail)).uid;

      const updates: any = {
        [`users/${uid}/balance`]: admin.database.ServerValue.increment(amount),
        [`users/${uid}/transactions/${txId}`]: {
          direction: 'received',
          user: 'Bank Transfer',
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
      throw new Error(error.message);
    }
  }
}
