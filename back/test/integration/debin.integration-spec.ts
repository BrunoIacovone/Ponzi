import request from 'supertest';
import { TestUtils } from '../test-utils';
import { DebinDto } from 'src/dto/debin.dto';
import { INestApplication } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

describe('/api/debin (integration)', () => {
  let app: INestApplication;
  let user: { uid: string; token: string; email: string };

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

  it('should successfully process a DEBIN transfer by calling the real bank-api', async () => {
    const initialBalance = await TestUtils.getBalance(user.uid);
    expect(initialBalance).toBe(0);
    const dto: DebinDto = { bankEmail: 'user@bank.com', amount: 350 };

    await request(app.getHttpServer())
      .post('/api/debin')
      .set('Authorization', `Bearer ${user.token}`)
      .send(dto)
      .expect(201);

    const finalBalance = await TestUtils.getBalance(user.uid);
    expect(finalBalance).toBe(350);

    const txs = (
      await TestUtils.getDb().ref(`users/${user.uid}/transactions`).get()
    ).val();
    const txId = Object.keys(txs)[0];
    expect(txs[txId].direction).toBe('received');
    expect(txs[txId].amount).toBe(350);
    expect(txs[txId].user).toBe('DEBIN');
  });

  it('should process a DEBIN transfer with mocked bank-api (success)', async () => {
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
    const dto: DebinDto = { bankEmail: 'mock@bank.com', amount: 123 };
    await request(app.getHttpServer())
      .post('/api/debin')
      .set('Authorization', `Bearer ${user.token}`)
      .send(dto)
      .expect(201);
    const finalBalance = await TestUtils.getBalance(user.uid);
    expect(finalBalance).toBe(123);
  });

  it('should handle error from mocked bank-api (rejected)', async () => {
    const mockHttpService = {
      post: jest.fn().mockReturnValue(
        of({
          data: { success: false, message: 'Mocked rejection' },
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
    const dto: DebinDto = { bankEmail: 'mock@bank.com', amount: 123 };
    await request(app.getHttpServer())
      .post('/api/debin')
      .set('Authorization', `Bearer ${user.token}`)
      .send(dto)
      .expect(500)
      .expect((res) => {
        expect(res.body.message).toBe('Internal server error');
      });
  });

  it('should handle bank-api down (network error)', async () => {
    const mockHttpService = {
      post: jest
        .fn()
        .mockReturnValue(throwError(() => new Error('ECONNREFUSED'))),
    };
    await TestUtils.initializeApp(undefined, mockHttpService);
    app = TestUtils.app;
    user = await TestUtils.createTestUser();
    const dto: DebinDto = { bankEmail: 'mock@bank.com', amount: 123 };
    await request(app.getHttpServer())
      .post('/api/debin')
      .set('Authorization', `Bearer ${user.token}`)
      .send(dto)
      .expect(500)
      .expect((res) => {
        expect(res.body.message).toBe('Internal server error');
      });
  });
});
