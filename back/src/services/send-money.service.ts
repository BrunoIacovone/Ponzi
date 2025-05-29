import { Injectable } from '@nestjs/common';
import { WalletRepository } from '../repositories/wallet.repository';
import admin from '../firebase';

@Injectable()
export class SendMoneyService {
  constructor(private repo: WalletRepository) {}
  async sendMoney(senderUid: string, recipientUid: string, amount: number) {
    const senderBalance = await this.repo.getBalance(senderUid);
    if (senderBalance < amount) throw new Error('Insufficient funds');

    const now = Date.now();
    const txId = await this.repo.pushKey();

    let senderNameOrEmail = senderUid;
    try {
      const senderUser = await this.repo.getUserById(senderUid);
      senderNameOrEmail =
        senderUser.displayName || senderUser.email || senderUid;
    } catch {}

    let recipientNameOrEmail = recipientUid;
    try {
      const recipientUser = await this.repo.getUserById(recipientUid);
      recipientNameOrEmail =
        recipientUser.displayName || recipientUser.email || recipientUid;
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
      [`users/${senderUid}/balance`]:
        admin.database.ServerValue.increment(-amount),
      [`users/${recipientUid}/balance`]:
        admin.database.ServerValue.increment(amount),
    };

    await this.repo.update(updates);
    return { txId, amount, timestamp: now };
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
