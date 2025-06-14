import { Injectable } from '@nestjs/common';
import { WalletRepository } from '../repositories/wallet.repository';
import admin from '../firebase';
import { InsufficientFundsException } from 'src/exceptions/insufficient-funds.exception';

@Injectable()
export class SendMoneyService {
  constructor(private repo: WalletRepository) {}
  async sendMoney(senderUid: string, recipientUid: string, amount: number) {
    const senderBalance = await this.repo.getBalance(senderUid);
    if (senderBalance < amount) throw new InsufficientFundsException();

    const now = Date.now();
    const txId = await this.repo.pushKey();

    const senderUser = await this.repo.getUserById(senderUid);
    const senderNameOrEmail =
      senderUser.displayName || senderUser.email || senderUid;

    const recipientUser = await this.repo.getUserById(recipientUid);
    const recipientNameOrEmail =
      recipientUser.displayName || recipientUser.email || recipientUid;

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
