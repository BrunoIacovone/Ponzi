import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('/api/transactions (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should reject unauthorized', () => {
    return request(app.getHttpServer())
      .get('/api/transactions')
      .expect(401);
  });

  // Add more tests for authorized access with mocks as needed

  afterAll(async () => {
    await app.close();
  });
}); 