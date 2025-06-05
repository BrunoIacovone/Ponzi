import { Test, TestingModule } from '@nestjs/testing';
import { BankService } from 'src/services/bank.service';
import { WalletRepository } from 'src/repositories/wallet.repository';
import admin from 'src/firebase';

jest.mock('src/firebase', () => ({
  database: {
    ServerValue: {
      increment: jest.fn((val) => `increment(${val})`),
    },
  },
}));

describe('BankService', () => {
  let service: BankService;
  let repo: WalletRepository;

  const mockWalletRepository = {
    pushKey: jest.fn(),
    update: jest.fn(),
    getUserByEmail: jest.fn(),
    getBalance: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BankService,
        {
          provide: WalletRepository,
          useValue: mockWalletRepository,
        },
      ],
    }).compile();

    service = module.get<BankService>(BankService);
    repo = module.get<WalletRepository>(WalletRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('bankTransfer', () => {
    it('should throw an error if user is not found', async () => {
      mockWalletRepository.getUserByEmail.mockRejectedValue(
        new Error('User not found'),
      );
      await expect(service.bankTransfer('test@test.com', 100)).rejects.toThrow(
        'User not found',
      );
    });

    it('should correctly perform the bank transfer', async () => {
      mockWalletRepository.getUserByEmail.mockResolvedValue({ uid: 'test-uid' });
      mockWalletRepository.pushKey.mockResolvedValue('tx123');
      mockWalletRepository.getBalance.mockResolvedValue(1100);

      const result = await service.bankTransfer('test@test.com', 100);

      expect(repo.update).toHaveBeenCalledWith(
        expect.objectContaining({
          'users/test-uid/balance': 'increment(100)',
        }),
      );
      expect(result).toEqual({
        success: true,
        balance: 1100,
        transaction: expect.any(Object),
      });
    });
  });
}); 