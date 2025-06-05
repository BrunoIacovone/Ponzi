import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from 'src/controller/transactions.controller';
import { TransactionsService } from 'src/services/transactions.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockTransactionsService = {
    getTransactions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call service.getTransactions with correct UID and return result', async () => {
    const uid = 'user123';
    const mockReq = { user: { uid } } as any;
    const mockResult = [
      { id: 1, amount: 100 },
      { id: 2, amount: 50 },
    ];

    mockTransactionsService.getTransactions.mockResolvedValue(mockResult);

    const result = await controller.get(mockReq);

    expect(service.getTransactions).toHaveBeenCalledWith(uid);
    expect(result).toBe(mockResult);
  });
});
