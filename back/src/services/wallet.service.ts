import { receiveMessageOnPort } from 'worker_threads';
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
  return {
    balance: balanceSnap.val(),
    transaction: { txId, amount, timestamp: now },
  };
}

export async function sendMoney(
  senderUid: string,
  recipientUid: string,
  amount: number,
) {
  const senderSnap = await admin
    .database()
    .ref(`users/${senderUid}/balance`)
    .get();

  if (!senderSnap.exists() || senderSnap.val() < amount)
    throw new Error('Insufficient funds');

  let senderNameOrEmail = senderUid;
  try {
    const senderUserRecord = await admin.auth().getUser(senderUid);
    senderNameOrEmail = senderUserRecord.displayName || senderUserRecord.email || senderUid;
  } catch (error) {
    console.error(`Error fetching sender user details for uid ${senderUid}:`, error);
  }

  let recipientNameOrEmail = recipientUid;
  try {
    const recipientUserRecord = await admin.auth().getUser(recipientUid);
    recipientNameOrEmail = recipientUserRecord.displayName || recipientUserRecord.email || recipientUid;
  } catch (error) {
    console.error(`Error fetching recipient user details for uid ${recipientUid}:`, error);
  }

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
  const transactionsWithUserDetails = await Promise.all(
    Object.entries(txs).map(async ([id, tx]: [string, any]) => {
      let userNameOrEmail = tx.user;
      if (tx.user && tx.user !== 'system') {
        try {
          const userRecord = await admin.auth().getUser(tx.user);
          userNameOrEmail = userRecord.displayName || userRecord.email || tx.user;
        } catch (error) {
          console.error(`Error fetching user details for uid ${tx.user}:`, error);
        }
      }
      return { id, ...tx, user: userNameOrEmail };
    }),
  );
  return transactionsWithUserDetails.sort((a, b) => b.timestamp - a.timestamp);
}


export async function getIdFromEmail(email: string) {
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    return userRecord.uid;
  } catch {
    return null;
  }
}