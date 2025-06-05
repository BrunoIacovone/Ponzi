import request from 'supertest';
import { TestUtils } from '../test-utils';

describe('/api/transactions (e2e)', () => {
  let token: string;
  let uid: string;
  let otherUser: { uid: string; email: string };

  beforeAll(async () => {
    await TestUtils.initializeApp();
    const mainUser = await TestUtils.createTestUser();
    token = mainUser.token;
    uid = mainUser.uid;
    otherUser = await TestUtils.createTestUser(); // For transaction details
  });

  afterAll(async () => {
    await TestUtils.cleanup();
  });

  it('should reject unauthorized', () => {
    return request(TestUtils.app.getHttpServer())
      .get('/api/transactions')
      .expect(401);
  });

  it('should return an empty array for a user with no transactions', () => {
    return request(TestUtils.app.getHttpServer())
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .expect(200, []);
  });

  it('should return transactions for an authorized user, sorted by timestamp', async () => {
    // Arrange: Create some transactions directly in the DB
    const tx1 = {
      direction: 'sent',
      user: otherUser.uid,
      amount: 10,
      timestamp: Date.now() - 1000,
    };
    const tx2 = {
      direction: 'received',
      user: 'system',
      amount: 50,
      timestamp: Date.now(),
    };
    await TestUtils.getDb().ref(`users/${uid}/transactions/tx1`).set(tx1);
    await TestUtils.getDb().ref(`users/${uid}/transactions/tx2`).set(tx2);

    // Act & Assert
    return request(TestUtils.app.getHttpServer())
      .get('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(2);
        // Transactions should be sorted by timestamp descending
        expect(res.body[0].id).toBe('tx2');
        expect(res.body[0].amount).toBe(50);
        expect(res.body[1].id).toBe('tx1');
        expect(res.body[1].amount).toBe(10);
        // Check that the user name/email was populated
        expect(res.body[1].user).toBe(otherUser.email);
      });
  }, 30000);
});
