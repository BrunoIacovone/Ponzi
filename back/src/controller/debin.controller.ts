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
import { DebinDto } from '../dto/debin.dto';
import { DebinService } from '../services/debin.service';

interface AuthenticatedRequest extends Request {
  user: { uid: string };
}

@Controller('api/debin')
export class DebinController {
  constructor(private readonly service: DebinService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async add(@Req() req: AuthenticatedRequest, @Body() body: DebinDto) {
    return await this.service.debinTransfer(
      req.user.uid,
      body.bankEmail,
      body.amount,
    );
  }
}
