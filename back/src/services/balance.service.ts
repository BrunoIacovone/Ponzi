import { Injectable } from '@nestjs/common';
import { WalletRepository } from '../repositories/wallet.repository';

@Injectable()
export class BalanceService {
  constructor(private repo: WalletRepository) {}

  async getBalance(uid: string): Promise<number> {
    return await this.repo.getBalance(uid);
  }
}
