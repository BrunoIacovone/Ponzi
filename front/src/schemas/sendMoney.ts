import { z } from "zod";

export const sendMoneySchema = z.object({
  amount: z.number().positive({ message: 'Amount must be greater than 0' }),
});

export const sendMoneyResponseSchema = z.object({
  balance: z.number(),
  transaction: z.object({
    txId: z.string(),
    amount: z.number(),
    timestamp: z.number()
  })
});

export type SendMoneyResponse = z.infer<typeof sendMoneyResponseSchema>;