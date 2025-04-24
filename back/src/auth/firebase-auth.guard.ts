import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import admin from '../firebase';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) throw new UnauthorizedException();

    const idToken = authHeader.split('Bearer ')[1];

    try {
      req.user = await admin.auth().verifyIdToken(idToken);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
