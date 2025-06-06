import { WalletRepository } from '../../src/repositories/wallet.repository';
import admin from '../../src/firebase';

jest.mock('../../src/firebase', () => ({
  database: jest.fn(),
  auth: jest.fn(),
}));

describe('WalletRepository', () => {
  let repository: WalletRepository;
  let mockDb: { ref: any };

  beforeEach(() => {
    const get = jest.fn().mockResolvedValue({ val: () => 0 });
    const update = jest.fn().mockResolvedValue(undefined);
    const ref = jest.fn(() => ({
      get,
      update,
    }));

    mockDb = {
      ref,
    };

    (admin.database as any) = jest.fn(() => mockDb);

    repository = new WalletRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBalance', () => {
    it('should return the balance for a given user', async () => {
      const uid = 'test-uid';
      const balance = 100;
      const get = jest.fn().mockResolvedValue({ val: () => balance });
      mockDb.ref.mockReturnValue({ get });

      const result = await repository.getBalance(uid);

      expect(result).toBe(balance);
      expect(mockDb.ref).toHaveBeenCalledWith(`users/${uid}/balance`);
    });

    it('should return 0 if the user has no balance', async () => {
      const uid = 'test-uid-no-balance';
      const get = jest.fn().mockResolvedValue({ val: () => null });
      mockDb.ref.mockReturnValue({ get });

      const result = await repository.getBalance(uid);

      expect(result).toBe(0);
    });
  });

  describe('update', () => {
    it('should call the database update method with the correct payload', async () => {
      const updates = { 'users/test-uid/balance': 100 };
      const updateFn = jest.fn().mockResolvedValue(undefined);
      mockDb.ref.mockReturnValue({ update: updateFn });

      await repository.update(updates);

      expect(mockDb.ref).toHaveBeenCalledWith();
      expect(updateFn).toHaveBeenCalledWith(updates);
    });
  });

  describe('getTransactions', () => {
    it('should return transactions for a given user', async () => {
      const uid = 'test-uid';
      const transactions = { tx1: { amount: 50 }, tx2: { amount: -20 } };
      const get = jest.fn().mockResolvedValue({ val: () => transactions });
      mockDb.ref.mockReturnValue({ get });

      const result = await repository.getTransactions(uid);

      expect(result).toEqual(transactions);
      expect(mockDb.ref).toHaveBeenCalledWith(`users/${uid}/transactions`);
    });

    it('should return an empty object if there are no transactions', async () => {
      const uid = 'test-uid-no-tx';
      const get = jest.fn().mockResolvedValue({ val: () => null });
      mockDb.ref.mockReturnValue({ get });

      const result = await repository.getTransactions(uid);

      expect(result).toEqual({});
    });
  });
});
