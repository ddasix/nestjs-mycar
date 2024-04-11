import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { User } from '../src/users/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/signup (POST)', () => {
    const user = {
      email: 'test32@test.com',
      password: '123123',
    } as User;

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(201)
      .then(({ body }) => {
        const { id, email } = body;
        expect(id).toBeDefined();
        expect(email).toEqual(user.email);
      });
  });

  it('새로운 계정 추가 하고 현재 로그인된 계정 정보 가져오기', async () => {
    const email = 'test@test.com';

    const result = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: '123123' })
      .expect(201);

    const cookie = result.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', cookie)
      .expect(200);

    expect(email).toEqual(body.email);
  });
});
