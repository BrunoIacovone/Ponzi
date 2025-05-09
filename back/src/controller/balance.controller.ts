import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { getBalance } from '../services/wallet.service';

interface AuthenticatedRequest extends Request {
  user: { uid: string };
}

@Controller('api/balance')
export class BalanceController {
  @UseGuards(FirebaseAuthGuard)
  @Get()
  async get(@Req() req: AuthenticatedRequest) {
    return await getBalance(req.user.uid);
  }
}
