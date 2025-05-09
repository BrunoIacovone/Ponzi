import request from 'supertest';
import { TestUtils } from './test-utils';

describe('/api/add-funds (e2e)', () => {
  beforeAll(async () => {
    await TestUtils.initializeApp();
    await TestUtils.loginTestUser();
  });

  it('should reject unauthorized', () => {
    return request(TestUtils.app.getHttpServer())
      .post('/api/add-funds')
      .send({ amount: 100, currency: 'USD' })
      .expect(401);
  });

  it('should add funds for authorized user', async () => {
    return request(TestUtils.app.getHttpServer())
      .post('/api/add-funds')
      .set(TestUtils.getAuthHeader())
      .send({ amount: 100, currency: 'USD' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('balance');
        expect(typeof res.body.balance).toBe('number');
        expect(res.body).toHaveProperty('transaction');
        expect(res.body.transaction).toHaveProperty('amount');
        expect(res.body.transaction.amount).toEqual(100);
        expect(res.body.transaction).toHaveProperty('timestamp');
        expect(typeof res.body.transaction.timestamp).toBe('number');
        expect(res.body.transaction).toHaveProperty('txId');
        expect(typeof res.body.transaction.txId).toBe('string');
      });
  });

  it('should reject invalid fund amount', async () => {
    return request(TestUtils.app.getHttpServer())
      .post('/api/add-funds')
      .set(TestUtils.getAuthHeader())
      .send({ amount: -100, currency: 'USD' })
      .expect(400);
  });

  afterAll(async () => {
    await TestUtils.cleanup();
  });
});
