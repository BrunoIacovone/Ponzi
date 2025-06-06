import request from 'supertest';
import { TestUtils } from '../test-utils';

describe('Home Banking flow (e2e)', () => {
  let user: { uid: string; token: string; email: string };
  const bankApi = request('http://localhost:3005');

  beforeAll(async () => {
    await TestUtils.initializeApp();
    await TestUtils.app.listen(3000);
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

    await bankApi
      .post('/homeBanking/transfer')
      .send(payload)
      .expect(200)
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
      emailWallet: 'non-existent-user@test.com',
      amount: 100,
    };

    return bankApi
      .post('/homeBanking/transfer')
      .send(payload)
      .expect(500)
      .expect((res) => {
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('User with email non-existent-user@test.com not found');
      });
  });
});
