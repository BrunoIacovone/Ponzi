import {
  Controller,
  Post,
  Req,
  UseGuards,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { WalletService } from '../services/wallet.service';

interface AuthenticatedRequest extends Request {
  user: { uid: string };
}

@Controller('api/add-funds')
export class FundsController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post()
  async add(@Req() req: AuthenticatedRequest, @Body('amount') amount: number) {
    if (amount <= 0)
      throw new BadRequestException('Amount must be a positive number');
    return await this.walletService.addFunds(req.user.uid, amount);
  }
}
