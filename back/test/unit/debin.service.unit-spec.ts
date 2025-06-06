import { Test, TestingModule } from '@nestjs/testing';
import { DebinService } from 'src/services/debin.service';
import { WalletRepository } from 'src/repositories/wallet.repository';
import { DebinBankClientService } from 'src/services/debin-bank-client.service';
import admin from 'src/firebase';

jest.mock('src/firebase', () => ({
  database: {
    ServerValue: {
      increment: jest.fn((val) => `increment(${val})`),
    },
  },
}));

describe('DebinService', () => {
  let service: DebinService;
  let repo: WalletRepository;
  let debinBankClient: DebinBankClientService;

  const mockWalletRepository = {
    pushKey: jest.fn(),
    update: jest.fn(),
    getBalance: jest.fn(),
  };

  const mockDebinBankClientService = {
    requestTransfer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DebinService,
        {
          provide: WalletRepository,
          useValue: mockWalletRepository,
        },
        {
          provide: DebinBankClientService,
          useValue: mockDebinBankClientService,
        },
      ],
    }).compile();

    service = module.get<DebinService>(DebinService);
    repo = module.get<WalletRepository>(WalletRepository);
    debinBankClient = module.get<DebinBankClientService>(
      DebinBankClientService,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('debinTransfer', () => {
    it('should throw an error if debin bank client fails', async () => {
      mockDebinBankClientService.requestTransfer.mockRejectedValue(
        new Error('Bank client error'),
      );
      await expect(
        service.debinTransfer('uid', 'email@test.com', 100),
      ).rejects.toThrow('Bank client error');
    });

    it('should correctly perform the debin transfer', async () => {
      mockDebinBankClientService.requestTransfer.mockResolvedValue(undefined);
      mockWalletRepository.pushKey.mockResolvedValue('tx123');
      mockWalletRepository.getBalance.mockResolvedValue(1100);

      const result = await service.debinTransfer('uid', 'email@test.com', 100);

      expect(debinBankClient.requestTransfer).toHaveBeenCalledWith(
        'email@test.com',
        100,
      );
      expect(repo.update).toHaveBeenCalledWith(
        expect.objectContaining({
          'users/uid/balance': 'increment(100)',
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
