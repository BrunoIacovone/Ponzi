import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { TransactionsService } from '../services/transactions.service';

interface AuthenticatedRequest extends Request {
  user: { uid: string };
}

@Controller('api/transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get()
  async get(@Req() req: AuthenticatedRequest) {
    return await this.service.getTransactions(req.user.uid);
  }
}
