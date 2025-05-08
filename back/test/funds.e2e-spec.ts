import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('/api/add-funds (e2e)', () => {
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
      .post('/api/add-funds')
      .send({ amount: 100 })
      .expect(401);
  });

  it('should reject invalid amount', async () => {
    // You would mock auth here for a real test
    const res = await request(app.getHttpServer())
      .post('/api/add-funds')
      .set('Authorization', 'Bearer test')
      .send({ amount: -10 });
    expect(res.status).toBe(400);
  });

  // Add more tests for valid input with mocks as needed

  afterAll(async () => {
    await app.close();
  });
}); 