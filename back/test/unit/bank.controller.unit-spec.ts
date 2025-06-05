import { Test, TestingModule } from '@nestjs/testing';
import { BankController } from 'src/controller/bank.controller';
import { BankService } from 'src/services/bank.service';
import { BankDto } from 'src/dto/bank.dto';

describe('BankController', () => {
  let controller: BankController;
  let service: BankService;

  const mockBankService = {
    bankTransfer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankController],
      providers: [
        {
          provide: BankService,
          useValue: mockBankService,
        },
      ],
    }).compile();

    controller = module.get<BankController>(BankController);
    service = module.get<BankService>(BankService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addFundsFromBank', () => {
    it('should call bankService.bankTransfer with the correct parameters', async () => {
      const bankDto: BankDto = {
        bankEmail: 'test@example.com',
        amount: 100,
      };
      const expectedResult = { success: true };
      mockBankService.bankTransfer.mockResolvedValue(expectedResult);

      const result = await controller.addFundsFromBank(bankDto);

      expect(service.bankTransfer).toHaveBeenCalledWith(
        bankDto.bankEmail,
        bankDto.amount,
      );
      expect(result).toBe(expectedResult);
    });
  });
}); 