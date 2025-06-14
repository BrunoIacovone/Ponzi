import accounts from '../storage/db.js';

export function transfer(email, amount) {
  const current = accounts.get(email);

  if (current === undefined) {
    return { success: false, message: 'Account not found' };
  }

  if (current < amount) {
    return { success: false, message: 'Insufficient funds' };
  }

  accounts.set(email, current - amount);
  return { success: true, transferred: amount, remaining: accounts.get(email) };
}
