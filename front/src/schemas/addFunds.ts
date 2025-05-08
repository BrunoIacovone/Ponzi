import { z } from "zod";

export const addAmountSchema = z.object({
    amount: z.number().positive({ message: 'Amount must be greater than 0' }),
});
  
export const addFundsResponseSchema = z.object({
    balance: z.number(),
    transaction: z.object({
      txId: z.string(),
      amount: z.number(),
      timestamp: z.number()
    })
});
  
export type AddFundsResponse = z.infer<typeof addFundsResponseSchema>;