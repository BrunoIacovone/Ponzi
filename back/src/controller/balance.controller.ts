import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { WalletService } from '../services/wallet.service';

interface AuthenticatedRequest extends Request {
  user: { uid: string };
}

@Controller('api/balance')
export class BalanceController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get()
  async get(@Req() req: AuthenticatedRequest) {
    return await this.walletService.getBalance(req.user.uid);
  }
}
