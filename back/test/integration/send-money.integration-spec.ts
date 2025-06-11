import request from 'supertest';
import { TestUtils } from '../test-utils';

describe('/api/send-money (integration)', () => {
  let sender: { uid: string; token: string; email: string };
  let recipient: { uid: string; token: string; email: string };

  beforeAll(async () => {
    await TestUtils.initializeApp();
  });

  beforeEach(async () => {
    sender = await TestUtils.createTestUser();
    recipient = await TestUtils.createTestUser();
  });

  afterAll(async () => {
    await TestUtils.cleanup();
  });

  it('should reject unauthorized', () => {
    return request(TestUtils.app.getHttpServer())
      .post('/api/send-money')
      .send({ recipientMail: 'some-email@test.com', amount: 50 })
      .expect(401);
  });

  it('should reject sending money to an invalid recipient email', async () => {
    return request(TestUtils.app.getHttpServer())
      .post('/api/send-money')
      .set('Authorization', `Bearer ${sender.token}`)
      .send({ recipientMail: 'invalid-email@test.com', amount: 50 })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContain(
          'Recipient mail is invalid: invalid-email@test.com',
        );
        expect(res.body.error).toBe('INVALID_RECIPIENT');
      });
  });

  it('should reject sending money to oneself', async () => {
    return request(TestUtils.app.getHttpServer())
      .post('/api/send-money')
      .set('Authorization', `Bearer ${sender.token}`)
      .send({ recipientMail: sender.email, amount: 50 })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContain('Cannot send money to yourself');
        expect(res.body.error).toBe('CANNOT_SEND_TO_SELF');
      });
  });

  it('should reject sending with insufficient funds', async () => {
    await TestUtils.setBalance(sender.uid, 20);

    return request(TestUtils.app.getHttpServer())
      .post('/api/send-money')
      .set('Authorization', `Bearer ${sender.token}`)
      .send({ recipientMail: recipient.email, amount: 50 })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContain('Insufficient funds');
        expect(res.body.error).toBe('INSUFFICIENT_FUNDS');
      });
  });

  it('should perform a successful transfer and update balances and transactions for both users', async () => {
    await TestUtils.setBalance(sender.uid, 100);
    await TestUtils.setBalance(recipient.uid, 50);

    await request(TestUtils.app.getHttpServer())
      .post('/api/send-money')
      .set('Authorization', `Bearer ${sender.token}`)
      .send({ recipientMail: recipient.email, amount: 75 })
      .expect(201);

    const senderBalance = await TestUtils.getBalance(sender.uid);
    const recipientBalance = await TestUtils.getBalance(recipient.uid);
    expect(senderBalance).toBe(25);
    expect(recipientBalance).toBe(125);

    const senderTxs = (
      await TestUtils.getDb().ref(`users/${sender.uid}/transactions`).get()
    ).val();
    const senderTxId = Object.keys(senderTxs)[0];
    expect(senderTxs[senderTxId].direction).toBe('sent');
    expect(senderTxs[senderTxId].amount).toBe(75);
    expect(senderTxs[senderTxId].user).toBe(recipient.uid);

    const recipientTxs = (
      await TestUtils.getDb().ref(`users/${recipient.uid}/transactions`).get()
    ).val();
    const recipientTxId = Object.keys(recipientTxs)[0];
    expect(recipientTxId).toBe(senderTxId);
    expect(recipientTxs[recipientTxId].direction).toBe('received');
    expect(recipientTxs[recipientTxId].amount).toBe(75);
    expect(recipientTxs[recipientTxId].user).toBe(sender.uid);
  }, 30000);
});
