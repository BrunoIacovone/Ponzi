import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from 'src/services/transactions.service';
import { WalletRepository } from 'src/repositories/wallet.repository';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repo: WalletRepository;

  const mockWalletRepository = {
    getTransactions: jest.fn(),
    getUserById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: WalletRepository,
          useValue: mockWalletRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repo = module.get<WalletRepository>(WalletRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTransactions', () => {
    it('should retrieve and process transactions correctly', async () => {
      const uid = 'test-uid';
      const rawTxs = {
        tx1: {
          direction: 'sent',
          user: 'user2',
          amount: 10,
          timestamp: 1,
        },
        tx2: {
          direction: 'received',
          user: 'user3',
          amount: 20,
          timestamp: 2,
        },
      };
      mockWalletRepository.getTransactions.mockResolvedValue(rawTxs);
      mockWalletRepository.getUserById.mockImplementation(async (id) => ({
        displayName: `${id}-name`,
      }));

      const result = await service.getTransactions(uid);

      expect(repo.getTransactions).toHaveBeenCalledWith(uid);
      expect(result).toEqual([
        {
          id: 'tx2',
          direction: 'received',
          user: 'user3-name',
          amount: 20,
          timestamp: 2,
        },
        {
          id: 'tx1',
          direction: 'sent',
          user: 'user2-name',
          amount: 10,
          timestamp: 1,
        },
      ]);
    });
  });
}); 