import { Test, TestingModule } from '@nestjs/testing';
import { SendMoneyService } from 'src/services/send-money.service';
import { WalletRepository } from 'src/repositories/wallet.repository';
import admin from 'src/firebase';

jest.mock('src/firebase', () => ({
  database: {
    ServerValue: {
      increment: jest.fn((val) => `increment(${val})`),
    },
  },
}));

describe('SendMoneyService', () => {
  let service: SendMoneyService;
  let repo: WalletRepository;

  const mockWalletRepository = {
    getBalance: jest.fn(),
    pushKey: jest.fn(),
    update: jest.fn(),
    getUserById: jest.fn(),
    getUserByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendMoneyService,
        {
          provide: WalletRepository,
          useValue: mockWalletRepository,
        },
      ],
    }).compile();

    service = module.get<SendMoneyService>(SendMoneyService);
    repo = module.get<WalletRepository>(WalletRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMoney', () => {
    it('should throw an error if sender has insufficient funds', async () => {
      mockWalletRepository.getBalance.mockResolvedValue(50);
      await expect(service.sendMoney('sender', 'recipient', 100)).rejects.toThrow(
        'Insufficient funds',
      );
    });

    it('should correctly perform the money transfer', async () => {
      mockWalletRepository.getBalance.mockResolvedValue(200);
      mockWalletRepository.pushKey.mockResolvedValue('tx123');
      mockWalletRepository.getUserById.mockImplementation(async (id) => ({
        displayName: `${id}-name`,
      }));

      const result = await service.sendMoney('senderUid', 'recipientUid', 100);

      expect(repo.update).toHaveBeenCalledWith(
        expect.objectContaining({
          'users/senderUid/balance': 'increment(-100)',
          'users/recipientUid/balance': 'increment(100)',
        }),
      );
      expect(result).toHaveProperty('txId', 'tx123');
    });
  });

  describe('getIdFromEmail', () => {
    it('should return uid if email is found', async () => {
      mockWalletRepository.getUserByEmail.mockResolvedValue({
        uid: 'test-uid',
      });
      const result = await service.getIdFromEmail('test@test.com');
      expect(result).toBe('test-uid');
    });

    it('should return null if email is not found', async () => {
      mockWalletRepository.getUserByEmail.mockRejectedValue(new Error('not found'));
      const result = await service.getIdFromEmail('test@test.com');
      expect(result).toBeNull();
    });
  });
}); 