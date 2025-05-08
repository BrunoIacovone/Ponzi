import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

export async function createUserProfile(uid: string): Promise<void> {
  const userRef = admin.database().ref(`users/${uid}`);
    const snapshot = await userRef.get();

    if (!snapshot.exists()) {
      await userRef.set({
        balance: 0,
        transactions: {}
      });     
    }
}
