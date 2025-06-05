import { Test, TestingModule } from '@nestjs/testing';
import { FundsController } from 'src/controller/funds.controller';
import { FundsService } from 'src/services/funds.service';
import { AddFundsDto } from 'src/dto/add-funds.dto';

describe('FundsController', () => {
  let controller: FundsController;
  let service: FundsService;

  const mockFundsService = {
    addFunds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FundsController],
      providers: [
        {
          provide: FundsService,
          useValue: mockFundsService,
        },
      ],
    }).compile();

    controller = module.get<FundsController>(FundsController);
    service = module.get<FundsService>(FundsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call service.addFunds with correct UID and amount', async () => {
    const uid = 'user123';
    const dto: AddFundsDto = { amount: 50 };
    const mockReq = { user: { uid } } as any;

    mockFundsService.addFunds.mockResolvedValue('mocked result');

    const result = await controller.add(mockReq, dto);

    expect(service.addFunds).toHaveBeenCalledWith(uid, 50);
    expect(result).toBe('mocked result');
  });
});
