import { TestUtils } from '../test-utils';
import { WalletRepository } from 'src/repositories/wallet.repository';

describe('WalletRepository (Integration)', () => {
  let repository: WalletRepository;
  let user: { uid: string; email: string; token: string };

  beforeAll(async () => {
    await TestUtils.initializeApp();
    repository = TestUtils.app.get(WalletRepository);
    user = await TestUtils.createTestUser();
  });

  afterAll(async () => {
    await TestUtils.cleanup();
  });

  beforeEach(async () => {
    await TestUtils.getDb().ref(`users/${user.uid}`).set(null);
  });

  it('should get a balance of 0 for a new user', async () => {
    const balance = await repository.getBalance(user.uid);
    expect(balance).toBe(0);
  });

  it('should correctly increment the balance', async () => {
    await TestUtils.getDb().ref(`users/${user.uid}/balance`).set(100);

    await repository.incrementBalance(user.uid, 50);

    const finalBalance = (
      await TestUtils.getDb().ref(`users/${user.uid}/balance`).get()
    ).val();
    expect(finalBalance).toBe(150);
  });

  it('should create and retrieve transactions', async () => {
    const tx1 = { description: 'test tx 1' };
    const tx2 = { description: 'test tx 2' };

    await repository.createTransaction(user.uid, 'tx1', tx1);
    await repository.createTransaction(user.uid, 'tx2', tx2);

    const transactions = await repository.getTransactions(user.uid);
    expect(Object.keys(transactions).length).toBe(2);
    expect(transactions.tx1).toEqual(tx1);
    expect(transactions.tx2).toEqual(tx2);
  });

  it('should update multiple paths at once', async () => {
    const updates = {
      [`users/${user.uid}/balance`]: 500,
      [`users/${user.uid}/profile/name`]: 'Test User',
      [`users/some-other-path`]: 'test value',
    };

    await repository.update(updates);

    const userBalance = await repository.getBalance(user.uid);
    const userName = (
      await TestUtils.getDb().ref(`users/${user.uid}/profile/name`).get()
    ).val();
    const otherPath = (
      await TestUtils.getDb().ref('users/some-other-path').get()
    ).val();

    expect(userBalance).toBe(500);
    expect(userName).toBe('Test User');
    expect(otherPath).toBe('test value');

    await TestUtils.getDb().ref('users/some-other-path').set(null);
  });
}); 