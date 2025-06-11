import { Injectable } from '@nestjs/common';
import admin from '../firebase';
import { WalletRepository } from '../repositories/wallet.repository';
import { UserNotFoundException } from 'src/exceptions/user-not-found.exception';

@Injectable()
export class BankService {
  constructor(private repo: WalletRepository) {}

  async bankTransfer(bankEmail: string, amount: number) {
    try {
      const txId = await this.repo.pushKey();
      const now = Date.now();
      const user = await this.repo.getUserByEmail(bankEmail);
      const uid = user.uid;

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
      if (error.code === 'auth/user-not-found') {
        throw new UserNotFoundException(bankEmail);
      }
      throw error;
    }
  }
}
