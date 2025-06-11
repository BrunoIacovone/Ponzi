import { Test, TestingModule } from '@nestjs/testing';
import { DebinBankClientService } from 'src/services/debin-bank-client.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('DebinBankClientService', () => {
  let service: DebinBankClientService;
  let httpService: HttpService;

  const mockHttpService = {
    post: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DebinBankClientService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<DebinBankClientService>(DebinBankClientService);
    httpService = module.get<HttpService>(HttpService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('requestTransfer', () => {
    it('should not throw an error if the request is successful', async () => {
      const response: AxiosResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as any },
      };
      mockHttpService.post.mockReturnValue(of(response));

      await expect(
        service.requestTransfer('test@test.com', 100),
      ).resolves.not.toThrow();
    });

    it('should throw an error if the request is rejected by the bank', async () => {
      const response: AxiosResponse = {
        data: { success: false, message: 'Insufficient funds' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as any },
      };
      mockHttpService.post.mockReturnValue(of(response));
      await expect(
        service.requestTransfer('test@test.com', 100),
      ).rejects.toThrow('Request rejected: Insufficient funds');
    });

    it('should throw an error if the http call fails', async () => {
      mockHttpService.post.mockReturnValue(
        throwError(() => new Error('Network error')),
      );
      await expect(
        service.requestTransfer('test@test.com', 100),
      ).rejects.toThrow('Error contacting DEBIN: Network error');
    });
  });
});
