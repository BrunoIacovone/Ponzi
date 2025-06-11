import { Test, TestingModule } from '@nestjs/testing';
import { SendMoneyController } from 'src/controller/send-money.controller';
import { SendMoneyService } from 'src/services/send-money.service';
import { BadRequestException } from '@nestjs/common';
import { SendMoneyDto } from 'src/dto/send-money.dto';

describe('SendMoneyController', () => {
  let controller: SendMoneyController;
  let service: SendMoneyService;

  const mockSendMoneyService = {
    getIdFromEmail: jest.fn(),
    sendMoney: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendMoneyController],
      providers: [
        {
          provide: SendMoneyService,
          useValue: mockSendMoneyService,
        },
      ],
    }).compile();

    controller = module.get<SendMoneyController>(SendMoneyController);
    service = module.get<SendMoneyService>(SendMoneyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send money if recipient is valid and different from sender', async () => {
    const dto: SendMoneyDto = {
      recipientMail: 'recipient@example.com',
      amount: 100,
    };
    const req = { user: { uid: 'senderUid' } } as any;

    mockSendMoneyService.getIdFromEmail.mockResolvedValue('recipientUid');
    mockSendMoneyService.sendMoney.mockResolvedValue({ success: true });

    const result = await controller.send(req, dto);

    expect(service.getIdFromEmail).toHaveBeenCalledWith(
      'recipient@example.com',
    );
    expect(service.sendMoney).toHaveBeenCalledWith(
      'senderUid',
      'recipientUid',
      100,
    );
    expect(result).toEqual({ success: true });
  });

  it('should throw if recipient email is invalid', async () => {
    const dto: SendMoneyDto = {
      recipientMail: 'invalid@example.com',
      amount: 100,
    };
    const req = { user: { uid: 'senderUid' } } as any;

    mockSendMoneyService.getIdFromEmail.mockResolvedValue(null);

    await expect(controller.send(req, dto)).rejects.toThrow(
      BadRequestException,
    );
    expect(service.getIdFromEmail).toHaveBeenCalledWith('invalid@example.com');
  });

  it('should throw if sender tries to send money to themselves', async () => {
    const dto: SendMoneyDto = { recipientMail: 'me@example.com', amount: 100 };
    const req = { user: { uid: 'sameUid' } } as any;

    mockSendMoneyService.getIdFromEmail.mockResolvedValue('sameUid');

    await expect(controller.send(req, dto)).rejects.toThrow(
      BadRequestException,
    );
  });
});
