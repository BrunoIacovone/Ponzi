import { TestUtils } from '../test-utils';
import { AppModule } from 'src/app.module';
import { WalletRepository } from 'src/repositories/wallet.repository';
import admin from 'src/firebase';

describe('WalletRepository (Integration)', () => {
  let repository: WalletRepository;
  let user: { uid: string; email: string; token: string };

  beforeAll(async () => {
    // We need a running app to get the repository instance from the container
    await TestUtils.initializeApp();
    repository = TestUtils.app.get(WalletRepository);
    user = await TestUtils.createTestUser();
  });

  afterAll(async () => {
    await TestUtils.cleanup();
  });

  beforeEach(async () => {
    // Clean slate for each test
    await TestUtils.getDb().ref(`users/${user.uid}`).set(null);
  });

  it('should get a balance of 0 for a new user', async () => {
    const balance = await repository.getBalance(user.uid);
    expect(balance).toBe(0);
  });

  it('should correctly increment the balance', async () => {
    // Arrange: Set initial balance
    await TestUtils.getDb().ref(`users/${user.uid}/balance`).set(100);

    // Act: Increment by 50
    await repository.incrementBalance(user.uid, 50);

    // Assert: Check final balance directly
    const finalBalance = (
      await TestUtils.getDb().ref(`users/${user.uid}/balance`).get()
    ).val();
    expect(finalBalance).toBe(150);
  });

  it('should create and retrieve transactions', async () => {
    // Arrange
    const tx1 = { description: 'test tx 1' };
    const tx2 = { description: 'test tx 2' };

    // Act
    await repository.createTransaction(user.uid, 'tx1', tx1);
    await repository.createTransaction(user.uid, 'tx2', tx2);

    // Assert
    const transactions = await repository.getTransactions(user.uid);
    expect(Object.keys(transactions).length).toBe(2);
    expect(transactions.tx1).toEqual(tx1);
    expect(transactions.tx2).toEqual(tx2);
  });

  it('should update multiple paths at once', async () => {
    // Arrange
    const updates = {
      [`users/${user.uid}/balance`]: 500,
      [`users/${user.uid}/profile/name`]: 'Test User',
      [`users/some-other-path`]: 'test value',
    };

    // Act
    await repository.update(updates);

    // Assert
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

    // Clean up the other path
    await TestUtils.getDb().ref('users/some-other-path').set(null);
  });
}); 