import { Test, TestingModule } from '@nestjs/testing';
import { DebinController } from 'src/controller/debin.controller';
import { DebinService } from 'src/services/debin.service';
import { DebinDto } from 'src/dto/debin.dto';

describe('DebinController', () => {
  let controller: DebinController;
  let service: DebinService;

  const mockDebinService = {
    debinTransfer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DebinController],
      providers: [
        {
          provide: DebinService,
          useValue: mockDebinService,
        },
      ],
    }).compile();

    controller = module.get<DebinController>(DebinController);
    service = module.get<DebinService>(DebinService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('add', () => {
    it('should call debinService.debinTransfer with the correct parameters', async () => {
      const debinDto: DebinDto = {
        bankEmail: 'test@example.com',
        amount: 100,
      };
      const req = { user: { uid: 'test-uid' } } as any;
      const expectedResult = { success: true };
      mockDebinService.debinTransfer.mockResolvedValue(expectedResult);

      const result = await controller.add(req, debinDto);

      expect(service.debinTransfer).toHaveBeenCalledWith(
        req.user.uid,
        debinDto.bankEmail,
        debinDto.amount,
      );
      expect(result).toBe(expectedResult);
    });
  });
}); 