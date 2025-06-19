import request from 'supertest';
import { TestUtils } from '../test-utils';
import { of } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { INestApplication } from '@nestjs/common';
import { AxiosResponse } from 'axios';

describe('Home Banking flow (e2e)', () => {
  let user: { uid: string; token: string; email: string };
  let app: INestApplication<any>;

  beforeAll(async () => {
    const mockHttpService = {
      post: jest.fn().mockReturnValue(
        of({
          data: { success: true },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        } as AxiosResponse),
      ),
    };
    await TestUtils.initializeApp(undefined, mockHttpService);
    app = TestUtils.app;
    user = await TestUtils.createTestUser();
  });

  afterAll(async () => {
    await TestUtils.cleanup();
  });

  beforeEach(async () => {
    await TestUtils.getDb().ref(`users/${user.uid}`).set(null);
  });

  it('should add funds to the user account via the external homeBanking API', async () => {
    const initialBalance = await TestUtils.getBalance(user.uid);
    expect(initialBalance).toBe(0);
    const payload = { emailWallet: user.email, amount: 250 };

    await request(app.getHttpServer())
      .post('/api/bank')
      .send({ bankEmail: user.email, amount: 250 })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
      });

    const finalBalance = await TestUtils.getBalance(user.uid);
    expect(finalBalance).toBe(250);

    const txs = (
      await TestUtils.getDb().ref(`users/${user.uid}/transactions`).get()
    ).val();
    const txId = Object.keys(txs)[0];
    expect(txs[txId].direction).toBe('received');
    expect(txs[txId].amount).toBe(250);
    expect(txs[txId].user).toBe('Bank Transfer');
  });

  it('should return an error for a non-existent user email', async () => {
    const payload = {
      bankEmail: 'non-existent-user@test.com',
      amount: 100,
    };

    await request(app.getHttpServer())
      .post('/api/bank')
      .send(payload)
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toContain(
          'User with email non-existent-user@test.com not found',
        );
      });
  });
});
