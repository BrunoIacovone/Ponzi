import { Controller, Post, Req, UseGuards, Body, BadRequestException, InternalServerErrorException, UnauthorizedException, ForbiddenException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { addFunds } from '../services/wallet.service';

interface AuthenticatedRequest extends Request {
  user: { uid: string };
}

@Controller('api/add-funds')
export class FundsController {
  @UseGuards(FirebaseAuthGuard)
  @Post()
  async add(@Req() req: AuthenticatedRequest, @Body('amount') amount: number) {
    if (amount <= 0) throw new UnprocessableEntityException('Amount must be a positive number');
    
    return await addFunds(req.user.uid, amount);
  }
} 