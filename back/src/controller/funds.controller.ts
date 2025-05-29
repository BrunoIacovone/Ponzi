import {
  Controller,
  Post,
  Req,
  UseGuards,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { WalletService } from '../services/wallet.service';
import { AddFundsDto } from '../dto/add-funds.dto';

interface AuthenticatedRequest extends Request {
  user: { uid: string };
}

@Controller('api/add-funds')
export class FundsController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async add(@Req() req: AuthenticatedRequest, @Body() body: AddFundsDto) {
    return await this.walletService.addFunds(req.user.uid, body.amount);
  }
}
