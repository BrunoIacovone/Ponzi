import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from '../src/controller/balance.controller';
import { BalanceService } from '../src/services/balance.service';

describe('BalanceController', () => {
  let controller: BalanceController;
  let service: BalanceService;

  const mockBalanceService = {
    getBalance: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
      providers: [
        {
          provide: BalanceService,
          useValue: mockBalanceService,
        },
      ],
    }).compile();

    controller = module.get<BalanceController>(BalanceController);
    service = module.get<BalanceService>(BalanceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call service.getBalance with correct UID and return { balance } object', async () => {
    const uid = 'user456';
    const mockReq = { user: { uid } } as any;
    const mockBalance = 250;

    mockBalanceService.getBalance.mockResolvedValue(mockBalance);

    const result = await controller.get(mockReq);

    expect(service.getBalance).toHaveBeenCalledWith(uid);
    expect(result).toEqual({ balance: mockBalance });
  });
});
