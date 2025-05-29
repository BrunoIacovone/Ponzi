import admin from 'src/firebase';
import { WalletRepository } from '../repositories/wallet.repository';
import { Injectable } from '@nestjs/common';


// @Injectable()
// export class WalletService {
  // constructor(private repo: WalletRepository) {}

  /*
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
   */

  /*
  async getTransactions(uid: string) {
    const txs = await this.repo.getTransactions(uid);
    const entries = Object.entries(txs);

    const txsWithDetails = await Promise.all(
      entries.map(async ([id, tx]: [string, any]) => {
        let userNameOrEmail = tx.user;
        if (tx.user !== 'system') {
          try {
            const user = await this.repo.getUserById(tx.user);
            userNameOrEmail = user.displayName || user.email || tx.user;
          } catch {}
        }
        return { id, ...tx, user: userNameOrEmail };
      })
    );

    return txsWithDetails.sort((a, b) => b.timestamp - a.timestamp);
  }
  */

  /*
  async getBalance(uid: string) {
    return await this.repo.getBalance(uid);
  }
  */

  /*
  async getIdFromEmail(email: string) {
    try {
      const user = await this.repo.getUserByEmail(email);
      return user.uid;
    } catch {
      return null;
    }
  }
  */
// }
