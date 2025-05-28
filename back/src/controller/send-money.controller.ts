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

@Controller('api/send-money')
export class SendMoneyController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post()
  async send(
    @Req() req: AuthenticatedRequest,
    @Body() body: { recipientMail: string; amount: number },
  ) {
    const { recipientMail, amount } = body;

    console.log('Recipient Mail:', recipientMail);

    const recipientUid = await this.walletService.getIdFromEmail(recipientMail);

    if (!recipientUid) {
      throw new BadRequestException('Recipient mail is invalid');
    }
    if (amount === undefined || amount === null) {
      throw new BadRequestException('Amount is required');
    }
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }
    return await this.walletService.sendMoney(req.user.uid, recipientUid, amount);
  }
}
