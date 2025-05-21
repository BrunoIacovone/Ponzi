import { Amount } from "../schemas/balance";
import { AddFundsResponse } from "../schemas/addFunds";
import { api } from "./config";

export interface Transaction {
  amount: number;
  direction: 'received' | 'sent'; // puedes ajustarlo si hay otros valores posibles
  timestamp: number; // puedes convertirlo a Date si lo deseas
  user: string;
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

