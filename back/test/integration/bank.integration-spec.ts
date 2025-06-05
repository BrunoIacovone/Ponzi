import request from 'supertest';
import { TestUtils } from '../test-utils';
import { BankDto } from 'src/dto/bank.dto';

describe('/api/bank (e2e)', () => {
  let user: { uid: string; token: string; email: string };

  beforeAll(async () => {
    await TestUtils.initializeApp();
    user = await TestUtils.createTestUser();
  });

  afterAll(async () => {
    await TestUtils.cleanup();
  });

  beforeEach(async () => {
    // Ensure a clean slate for each test
    await TestUtils.getDb().ref(`users/${user.uid}`).set(null);
  });

  it('should add funds to the user account', async () => {
    // Arrange
    const initialBalance = await TestUtils.getBalance(user.uid);
    expect(initialBalance).toBe(0);
    const dto: BankDto = { bankEmail: user.email, amount: 250 };

    // Act
    await request(TestUtils.app.getHttpServer())
      .post('/api/bank')
      .send(dto)
      .expect(201);

    // Assert
    const finalBalance = await TestUtils.getBalance(user.uid);
    expect(finalBalance).toBe(250);

    // Also check the transaction log
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
      .expect(500); // The service throws a generic error
  });
});
