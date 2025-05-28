import admin from '../firebase';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WalletRepository {
  private db = admin.database();
  private auth = admin.auth();

  async incrementBalance(uid: string, amount: number) {
    return this.db.ref(`users/${uid}/balance`)
      .set(admin.database.ServerValue.increment(amount));
  }

  async getBalance(uid: string): Promise<number> {
    const snap = await this.db.ref(`users/${uid}/balance`).get();
    return snap.val() || 0;
  }

  async createTransaction(
    uid: string,
    txId: string,
    tx: any
  ) {
    return this.db.ref(`users/${uid}/transactions/${txId}`).set(tx);
  }

  async pushKey(): Promise<string> {
    return this.db.ref().push().key!;
  }

  async getTransactions(uid: string): Promise<any> {
    const snap = await this.db.ref(`users/${uid}/transactions`).get();
    return snap.val() || {};
  }

  async update(updates: Record<string, any>) {
    return this.db.ref().update(updates);
  }

  async getUserById(uid: string) {
    return this.auth.getUser(uid);
  }

  async getUserByEmail(email: string) {
    return this.auth.getUserByEmail(email);
  }
}
