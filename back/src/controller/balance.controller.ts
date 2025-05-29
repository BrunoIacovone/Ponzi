import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { BalanceService } from '../services/balance.service';

interface AuthenticatedRequest extends Request {
  user: { uid: string };
}

@Controller('api/balance')
export class BalanceController {
  constructor(private readonly service: BalanceService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get()
  async get(@Req() req: AuthenticatedRequest) {
    return { balance: await this.service.getBalance(req.user.uid) };
  }
}
