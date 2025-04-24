import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { FirebaseAuthGuard } from './auth/firebase-auth.guard';

@Controller()
export class AppController {
  @UseGuards(FirebaseAuthGuard)
  @Get('protected')
  getProtected(@Req() req) {
    return { message: `Hello ${req.user.name || req.user.uid}` };
  }
}
