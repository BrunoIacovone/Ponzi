import { Injectable } from '@nestjs/common';
import { WalletRepository } from '../repositories/wallet.repository';

@Injectable()
export class TransactionsService {
  constructor(private repo: WalletRepository) {}
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
      }),
    );

    return txsWithDetails.sort((a, b) => b.timestamp - a.timestamp);
  }
}
