import {
  Controller,
  Post,
  Req,
  UseGuards,
  Body,
  BadRequestException,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { SendMoneyDto } from '../dto/send-money.dto';
import { SendMoneyService } from '../services/send-money.service';

interface AuthenticatedRequest extends Request {
  user: { uid: string };
}

@Controller('api/send-money')
export class SendMoneyController {
  constructor(private readonly service: SendMoneyService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async send(@Req() req: AuthenticatedRequest, @Body() body: SendMoneyDto) {
    const { recipientMail, amount } = body;
    const recipientUid = await this.service.getIdFromEmail(recipientMail);
    if (!recipientUid) {
      throw new BadRequestException('Recipient mail is invalid');
    }
    const senderUid = req.user.uid;
    if (recipientUid === senderUid) {
      throw new BadRequestException('Cannot send money to yourself');
    }
    return await this.service.sendMoney(req.user.uid, recipientUid, amount);
  }
}
