import admin from 'src/firebase';
import { WalletRepository } from '../repositories/wallet.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WalletService {
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

  async sendMoney(senderUid: string, recipientUid: string, amount: number) {
    const senderBalance = await this.repo.getBalance(senderUid);
    if (senderBalance < amount) throw new Error('Insufficient funds');

    const now = Date.now();
    const txId = await this.repo.pushKey();

    let senderNameOrEmail = senderUid;
    try {
      const senderUser = await this.repo.getUserById(senderUid);
      senderNameOrEmail = senderUser.displayName || senderUser.email || senderUid;
    } catch {}

    let recipientNameOrEmail = recipientUid;
    try {
      const recipientUser = await this.repo.getUserById(recipientUid);
      recipientNameOrEmail = recipientUser.displayName || recipientUser.email || recipientUid;
    } catch {}

    const updates: any = {
      [`transfers/${txId}`]: {
        from: senderUid,
        to: recipientUid,
        amount,
        timestamp: now,
      },
      [`users/${senderUid}/transactions/${txId}`]: {
        direction: 'sent',
        user: recipientUid,
        userName: recipientNameOrEmail,
        amount,
        timestamp: now,
      },
      [`users/${recipientUid}/transactions/${txId}`]: {
        direction: 'received',
        user: senderUid,
        userName: senderNameOrEmail,
        amount,
        timestamp: now,
      },
      [`users/${senderUid}/balance`]: admin.database.ServerValue.increment(-amount),
      [`users/${recipientUid}/balance`]: admin.database.ServerValue.increment(amount),
    };

    await this.repo.update(updates);
    return { txId, amount, timestamp: now };
  }

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

  async getBalance(uid: string) {
    return await this.repo.getBalance(uid);
  }

  async getIdFromEmail(email: string) {
    try {
      const user = await this.repo.getUserByEmail(email);
      return user.uid;
    } catch {
      return null;
    }
  }
}
