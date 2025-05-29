import { Injectable } from '@nestjs/common';
import admin from '../firebase';
import { WalletRepository } from '../repositories/wallet.repository';

@Injectable()
export class FundsService {
  constructor(private repo: WalletRepository) {}
  async addFunds(uid: string, amount: number) {
    const txId = await this.repo.pushKey();
    const now = Date.now();

    const updates: any = {
      [`users/${uid}/balance`]: admin.database.ServerValue.increment(amount),
      [`users/${uid}/transactions/${txId}`]: {
        direction: 'received',
        user: 'system',
        amount,
        timestamp: now,
      },
    };

    await this.repo.update(updates);

    const balance = await this.repo.getBalance(uid);
    return {
      balance,
      transaction: { txId, amount, timestamp: now },
    };
  }
}