import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { FirebaseAuthGuard } from '../../src/auth/firebase-auth.guard';
import admin from '../../src/firebase';

jest.mock('../../src/firebase', () => ({
  auth: jest.fn(),
}));

describe('FirebaseAuthGuard', () => {
  let guard: FirebaseAuthGuard;
  let mockContext: ExecutionContext;
  let mockRequest: any;

  beforeEach(() => {
    guard = new FirebaseAuthGuard();
    mockRequest = {
      headers: {},
    };
    mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as any;
  });

  it('should throw UnauthorizedException if no auth header is present', async () => {
    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if auth header is not Bearer', async () => {
    mockRequest.headers['authorization'] = 'Basic some-token';
    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token verification fails', async () => {
    mockRequest.headers['authorization'] = 'Bearer invalid-token';
    const verifyIdToken = jest
      .fn()
      .mockRejectedValue(new Error('Invalid token'));
    (admin.auth as any).mockReturnValue({ verifyIdToken });

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(verifyIdToken).toHaveBeenCalledWith('invalid-token');
  });

  it('should return true and attach user to request if token is valid', async () => {
    const token = 'valid-token';
    const decodedToken = { uid: 'test-uid', email: 'test@test.com' };
    mockRequest.headers['authorization'] = `Bearer ${token}`;

    const verifyIdToken = jest.fn().mockResolvedValue(decodedToken);
    (admin.auth as any).mockReturnValue({ verifyIdToken });

    const result = await guard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockRequest.user).toBe(decodedToken);
    expect(verifyIdToken).toHaveBeenCalledWith(token);
  });
});
