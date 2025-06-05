import request from 'supertest';
import { TestUtils } from '../test-utils';

describe('/api/send-money (e2e)', () => {
  let sender: { uid: string; token: string; email: string };
  let recipient: { uid: string; token: string; email: string };

  beforeAll(async () => {
    await TestUtils.initializeApp();
  });

  beforeEach(async () => {
    // Create fresh users for each test to ensure isolation
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
        expect(res.body.message).toContain('Recipient mail is invalid');
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
      });
  });

  it('should perform a successful transfer and update balances and transactions for both users', async () => {
    // Arrange
    await TestUtils.setBalance(sender.uid, 100);
    await TestUtils.setBalance(recipient.uid, 50);

    // Act
    await request(TestUtils.app.getHttpServer())
      .post('/api/send-money')
      .set('Authorization', `Bearer ${sender.token}`)
      .send({ recipientMail: recipient.email, amount: 75 })
      .expect(201);

    // Assert
    // 1. Check final balances
    const senderBalance = await TestUtils.getBalance(sender.uid);
    const recipientBalance = await TestUtils.getBalance(recipient.uid);
    expect(senderBalance).toBe(25);
    expect(recipientBalance).toBe(125);

    // 2. Check sender's transaction log
    const senderTxs = (
      await TestUtils.getDb().ref(`users/${sender.uid}/transactions`).get()
    ).val();
    const senderTxId = Object.keys(senderTxs)[0];
    expect(senderTxs[senderTxId].direction).toBe('sent');
    expect(senderTxs[senderTxId].amount).toBe(75);
    expect(senderTxs[senderTxId].user).toBe(recipient.uid);

    // 3. Check recipient's transaction log
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
