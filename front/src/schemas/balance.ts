import { z } from 'zod';

export const AmountSchema = z.object({
  balance: z.number(),
});

export type Amount = z.infer<typeof AmountSchema>;
