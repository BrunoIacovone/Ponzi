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
        let userName = tx.user;
        if (tx.user !== 'DEBIN' && tx.user !== 'Bank Transfer') {
          try {
            const user = await this.repo.getUserById(tx.user);
            userName = user.displayName || user.email || tx.user;
          } catch {}
        }
        return { id, ...tx, userName: userName };
      }),
    );

    return txsWithDetails.sort((a, b) => b.timestamp - a.timestamp);
  }
}
