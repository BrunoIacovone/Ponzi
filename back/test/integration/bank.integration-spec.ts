import request from 'supertest';
import { TestUtils } from '../test-utils';
import { BankDto } from 'src/dto/bank.dto';

describe('/api/bank (integration)', () => {
  let user: { uid: string; token: string; email: string };

  beforeAll(async () => {
    await TestUtils.initializeApp();
    user = await TestUtils.createTestUser();
  });

  afterAll(async () => {
    await TestUtils.cleanup();
  });

  beforeEach(async () => {
    await TestUtils.getDb().ref(`users/${user.uid}`).set(null);
  });

  it('should add funds to the user account', async () => {
    const initialBalance = await TestUtils.getBalance(user.uid);
    expect(initialBalance).toBe(0);
    const dto: BankDto = { bankEmail: user.email, amount: 250 };

    await request(TestUtils.app.getHttpServer())
      .post('/api/bank')
      .send(dto)
      .expect(201);
    
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

  it('should throw an error for a non-existent user email', async () => {
    const dto: BankDto = {
      bankEmail: 'non-existent-user@test.com',
      amount: 100,
    };

    return request(TestUtils.app.getHttpServer())
      .post('/api/bank')
      .send(dto)
      .expect(404) 
      .expect((res) => {
        expect(res.body.message).toContain('User with email non-existent-user@test.com not found');
        expect(res.body.error).toBe('USER_NOT_FOUND');
      });
  });
});
