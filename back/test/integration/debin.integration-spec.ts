import request from 'supertest';
import { TestUtils } from '../test-utils';
import { DebinDto } from 'src/dto/debin.dto';
import { INestApplication } from '@nestjs/common';

describe('/api/debin (integration)', () => {
  let app: INestApplication;
  let user: { uid: string; token: string; email: string };

  beforeAll(async () => {
    await TestUtils.initializeApp();
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
}); 