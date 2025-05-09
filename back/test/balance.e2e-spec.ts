import request from 'supertest';
import { TestUtils } from './test-utils';

describe('/api/balance (e2e)', () => {
  beforeAll(async () => {
    await TestUtils.initializeApp();
    await TestUtils.loginTestUser();
  });

  it('should reject unauthorized', () => {
    return request(TestUtils.app.getHttpServer())
      .get('/api/balance')
      .expect(401);
  });

  it('should return balance for authorized user', async () => {
    return request(TestUtils.app.getHttpServer())
      .get('/api/balance')
      .set(TestUtils.getAuthHeader())
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('balance');
        expect(typeof res.body.balance).toBe('number');
      });
  });

  afterAll(async () => {
    await TestUtils.cleanup();
  });
});
