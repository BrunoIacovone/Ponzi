import request from 'supertest';
import { TestUtils } from './test-utils';

describe('/api/send-money (e2e)', () => {
  beforeAll(async () => {
    await TestUtils.initializeApp();
    await TestUtils.loginTestUser();
  });

  it('should reject unauthorized', () => {
    return request(TestUtils.app.getHttpServer())
      .post('/api/send-money')
      .send({ recipientId: 'some-recipient', amount: 50, currency: 'USD' })
      .expect(401);
  });

  /*
  it('should send money for authorized user', async () => {
    // TODO: Consider creating a recipient user or mocking the recipient validation
    return request(TestUtils.app.getHttpServer())
      .post('/api/send-money')
      .set(TestUtils.getAuthHeader())
      .send({ recipientId: 'test-recipient-uid', amount: 50, currency: 'USD' })
      .expect(200) // Assuming 200 OK for successful transfer
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Transfer successful'); // Example message
        // Optionally, check for transaction ID or updated balance if returned
      });
  });
  */

  it('should reject sending money with insufficient funds', async () => {
    return request(TestUtils.app.getHttpServer())
      .post('/api/send-money')
      .set(TestUtils.getAuthHeader())
      .send({
        recipientId: 'test-recipient-uid',
        amount: 1000000,
        currency: 'USD',
      }) // Large amount likely to be insufficient
      .expect(400); // Assuming 400 for insufficient funds or other business logic errors
  });

  it('should reject sending money to invalid recipient', async () => {
    return request(TestUtils.app.getHttpServer())
      .post('/api/send-money')
      .set(TestUtils.getAuthHeader())
      .send({ recipientId: 'invalid-recipient', amount: 50, currency: 'USD' })
      .expect(400); // Assuming 400 for invalid recipient
  });

  afterAll(async () => {
    await TestUtils.cleanup();
  });
});
