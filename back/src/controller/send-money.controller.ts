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
import { sendMoney } from '../services/wallet.service';

interface AuthenticatedRequest extends Request {
  user: { uid: string };
}

@Controller('api/send-money')
export class SendMoneyController {
  @UseGuards(FirebaseAuthGuard)
  @Post()
  async send(
    @Req() req: AuthenticatedRequest,
    @Body() body: { recipientUid: string; amount: number },
  ) {
    const { recipientUid, amount } = body;
    if (!recipientUid) {
      throw new BadRequestException('Recipient UID is required');
    }
    if (amount === undefined || amount === null) {
      throw new BadRequestException('Amount is required');
    }
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }
    return await sendMoney(req.user.uid, recipientUid, amount);
  }
}
