import { useState } from 'react';
import { addAmountSchema, AddFundsResponse } from '../schemas/addFunds';
import {
  addMoney,
  getBalance,
  getTransactions,
  sendMoney,
  Transaction,
} from '../api/wallet';
import { SendMoneyResponse } from '../schemas/sendMoney.ts';

export function useGetBalance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      return await getBalance();
    } catch (err: any) {
      console.error('Error fetching balance:', err);
      setError(err.response?.data?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return { getBalance: fetchBalance, loading, error };
}

export function useAddFunds() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFunds = async (amount: number): Promise<AddFundsResponse | void> => {
    const parsed = addAmountSchema.safeParse({ amount });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      return await addMoney(amount);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return { addFunds, loading, error };
}

export function useGetTransactions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async (): Promise<Transaction[] | void> => {
    try {
      setLoading(true);
      setError(null);
      return await getTransactions();
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      setError(err.response?.data?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return { getTransactions: fetchTransactions, loading, error };
}

export function useSendMoney() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transferMoney = async (
    recipientMail: string,
    amount: number,
  ): Promise<SendMoneyResponse | void> => {
    try {
      setLoading(true);
      setError(null);
      return await sendMoney(recipientMail, amount);
    } catch (err: any) {
      console.error('Error sending money money:', JSON.stringify(err, null, 2));
      setError(err.response?.data?.message || 'Unexpected errorr');
    } finally {
      setLoading(false);
    }
  };

  return { transferMoney, loading, error };
}
