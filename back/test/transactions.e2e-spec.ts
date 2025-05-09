import request from 'supertest';
import { TestUtils } from './test-utils';

describe('/api/transactions (e2e)', () => {
  beforeAll(async () => {
    await TestUtils.initializeApp();
    await TestUtils.loginTestUser();
  });

  it('should reject unauthorized', () => {
    return request(TestUtils.app.getHttpServer())
      .get('/api/transactions')
      .expect(401);
  });

  it('should return transactions for authorized user', async () => {
    // Consider adding some transactions first (e.g., by calling /api/funds or /api/send-money)
    // to ensure there are transactions to retrieve.
    return request(TestUtils.app.getHttpServer())
      .get('/api/transactions')
      .set(TestUtils.getAuthHeader())
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        // Optionally, check the structure of transaction objects if the array is not empty
        if (res.body.length > 0) {
          const transaction = res.body[0];
          expect(transaction).toHaveProperty('id');
          expect(transaction).toHaveProperty('direction');
          expect(transaction).toHaveProperty('amount');
          expect(transaction).toHaveProperty('timestamp');
          expect(transaction).toHaveProperty('user');
        }
      });
  });
  
  afterAll(async () => {
    await TestUtils.cleanup();
  });
}); 