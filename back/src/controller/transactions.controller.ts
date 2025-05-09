import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { getTransactions } from '../services/wallet.service';

interface AuthenticatedRequest extends Request {
  user: { uid: string };
}

@Controller('api/transactions')
export class TransactionsController {
  @UseGuards(FirebaseAuthGuard)
  @Get()
  async get(@Req() req: AuthenticatedRequest) {
    return await getTransactions(req.user.uid);
  }
}
