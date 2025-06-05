import request from 'supertest';
import { TestUtils } from '../test-utils';
import { DebinDto } from 'src/dto/debin.dto';
import { DebinBankClientService } from 'src/services/debin-bank-client.service';
import { INestApplication } from '@nestjs/common';

describe('/api/debin (e2e)', () => {
  let app: INestApplication;
  let user: { uid: string; token: string; email: string };
  const mockDebinBankClient = {
    requestTransfer: jest.fn(),
  };

  beforeAll(async () => {
    await TestUtils.initializeApp((builder) =>
      builder
        .overrideProvider(DebinBankClientService)
        .useValue(mockDebinBankClient),
    );
    app = TestUtils.app;
    user = await TestUtils.createTestUser();
  });

  afterAll(async () => {
    await TestUtils.cleanup();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestUtils.getDb().ref(`users/${user.uid}`).set(null);
  });

  it('should successfully process a DEBIN transfer', async () => {
    // Arrange
    const initialBalance = await TestUtils.getBalance(user.uid);
    expect(initialBalance).toBe(0);
    const dto: DebinDto = { bankEmail: 'some-bank@test.com', amount: 300 };
    mockDebinBankClient.requestTransfer.mockResolvedValue(undefined); // Simulate successful bank call

    // Act
    await request(app.getHttpServer())
      .post('/api/debin')
      .set('Authorization', `Bearer ${user.token}`)
      .send(dto)
      .expect(201);

    // Assert
    const finalBalance = await TestUtils.getBalance(user.uid);
    expect(finalBalance).toBe(300);
    expect(mockDebinBankClient.requestTransfer).toHaveBeenCalledWith(
      dto.bankEmail,
      dto.amount,
    );
  });

  it('should return an error if the bank client fails', async () => {
    const dto: DebinDto = { bankEmail: 'failing-bank@test.com', amount: 100 };
    mockDebinBankClient.requestTransfer.mockRejectedValue(
      new Error('Bank API is down'),
    );

    await request(app.getHttpServer())
      .post('/api/debin')
      .set('Authorization', `Bearer ${user.token}`)
      .send(dto)
      .expect(500);

    const finalBalance = await TestUtils.getBalance(user.uid);
    expect(finalBalance).toBe(0); // Balance should not have changed
  });
}); 