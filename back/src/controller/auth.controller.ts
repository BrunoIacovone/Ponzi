import { Controller, Post, Headers, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Controller('auth')
export class AuthController {
  @Post('verify')
  async verify(@Headers('authorization') authHeader: string) {
    const token = authHeader?.split(' ')[1];
    if (!token) throw new UnauthorizedException('No token provided');

    try {
      const decoded = await admin.auth().verifyIdToken(token);
      return { uid: decoded.uid, email: decoded.email };
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
