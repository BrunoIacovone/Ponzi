import { Amount } from '../schemas/balance';
import { AddFundsResponse } from '../schemas/addFunds';
import { api } from './config';
import { SendMoneyResponse } from '../schemas/sendMoney.ts';

export interface Transaction {
  amount: number;
  direction: 'received' | 'sent';
  timestamp: number;
  user: string;
  userName: string;
}

export async function getBalance(): Promise<Amount> {
  const response = await api.get('/api/balance');
  return response.data;
}

export async function addMoney(amount: number): Promise<AddFundsResponse> {
  const response = await api.post('/api/add-funds', { amount });
  return response.data;
}

export async function getTransactions(): Promise<Transaction[]> {
  const response = await api.get('/api/transactions');
  return response.data;
}

export async function sendMoney(
  recipientMail: string,
  amount: number,
): Promise<SendMoneyResponse> {
  const response = await api.post('/api/send-money', { recipientMail, amount });
  return response.data;
}
