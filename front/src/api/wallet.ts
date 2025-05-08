import { Amount } from "../schemas/balance";
import { AddFundsResponse } from "../schemas/addFunds";
import { api } from "./config";

export async function getBalance(): Promise<Amount> {
    const response = await api.get('/api/balance');
    return response.data;
}

export async function addMoney(amount: number): Promise<AddFundsResponse> {
    const response = await api.post('/api/add-funds', { amount });
    return response.data;
}

