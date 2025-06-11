import request from 'supertest';
import { TestUtils } from '../test-utils';

describe('/api/balance (integration)', () => {
  let token: string;
  let uid: string;

  beforeAll(async () => {
    await TestUtils.initializeApp();
    const user = await TestUtils.createTestUser();
    token = user.token;
    uid = user.uid;
  });

  beforeEach(async () => {
    await TestUtils.getDb().ref(`users/${uid}`).set(null);
  });

  afterAll(async () => {
    await TestUtils.cleanup();
  });

  it('should reject unauthorized', () => {
    return request(TestUtils.app.getHttpServer())
      .get('/api/balance')
      .expect(401);
  });

  it('should return the correct balance for an authorized user', async () => {
    await TestUtils.setBalance(uid, 123.45);

    return request(TestUtils.app.getHttpServer())
      .get('/api/balance')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('balance');
        expect(res.body.balance).toBe(123.45);
      });
  });

  it('should return a balance of 0 if the user has no balance set', async () => {
    return request(TestUtils.app.getHttpServer())
      .get('/api/balance')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('balance');
        expect(res.body.balance).toBe(0);
      });
  });
});
