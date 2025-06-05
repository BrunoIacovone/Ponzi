import { Test, TestingModule } from '@nestjs/testing';
import { BalanceService } from 'src/services/balance.service';
import { WalletRepository } from 'src/repositories/wallet.repository';

describe('BalanceService', () => {
  let service: BalanceService;
  let repo: WalletRepository;

  const mockWalletRepository = {
    getBalance: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceService,
        {
          provide: WalletRepository,
          useValue: mockWalletRepository,
        },
      ],
    }).compile();

    service = module.get<BalanceService>(BalanceService);
    repo = module.get<WalletRepository>(WalletRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBalance', () => {
    it('should call repository.getBalance with the correct uid', async () => {
      const uid = 'test-uid';
      const expectedBalance = 100;
      mockWalletRepository.getBalance.mockResolvedValue(expectedBalance);

      const result = await service.getBalance(uid);

      expect(repo.getBalance).toHaveBeenCalledWith(uid);
      expect(result).toBe(expectedBalance);
    });
  });
}); 