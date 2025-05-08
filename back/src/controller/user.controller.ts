import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { createUserProfile } from '../services/user.service';

interface AuthenticatedRequest extends Request {
    user: { uid: string };
  }

@Controller('user')
export class UserController {
  @Post()
  @UseGuards(FirebaseAuthGuard)
  async createProfile(@Req() req: AuthenticatedRequest) {
    const uid = req.user.uid;
    await createUserProfile(uid);
    return;
  }
}
