import admin from '../firebase';

export async function addFunds(uid: string, amount: number) {
  const txId = admin.database().ref().push().key!;
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
  await admin.database().ref().update(updates);
  const balanceSnap = await admin.database().ref(`users/${uid}/balance`).get();
  return { balance: balanceSnap.val(), transaction: { txId, amount, timestamp: now } };
}

export async function sendMoney(senderUid: string, recipientUid: string, amount: number) {
  if (senderUid === recipientUid) throw new Error('Cannot send money to self');
  if (amount <= 0) throw new Error('Amount must be positive');
  const senderSnap = await admin.database().ref(`users/${senderUid}/balance`).get();
  if (!senderSnap.exists() || senderSnap.val() < amount) throw new Error('Insufficient funds');
  const txId = admin.database().ref().push().key!;
  const now = Date.now();
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
      amount,
      timestamp: now,
    },
    [`users/${recipientUid}/transactions/${txId}`]: {
      direction: 'received',
      user: senderUid,
      amount,
      timestamp: now,
    },
    [`users/${senderUid}/balance`]: admin.database.ServerValue.increment(-amount),
    [`users/${recipientUid}/balance`]: admin.database.ServerValue.increment(amount)
  };
  await admin.database().ref().update(updates);
  return { txId, amount, timestamp: now };
}

export async function getBalance(uid: string) {
  const snap = await admin.database().ref(`users/${uid}/balance`).get();
  return { balance: snap.val() || 0 };
}

export async function getTransactions(uid: string) {
  const snap = await admin.database().ref(`users/${uid}/transactions`).get();
  const txs = snap.val() || {};
  return Object.entries(txs)
    .map(([id, tx]: any) => ({ id, ...tx }))
    .sort((a, b) => b.timestamp - a.timestamp);
} 