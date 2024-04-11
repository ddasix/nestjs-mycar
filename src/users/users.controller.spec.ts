import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: '123123',
        } as User);
      },
      findAllByEmail: (email: string) => {
        return Promise.resolve([
          { id: 1, email, password: '123123' } as User,
          { id: 2, email, password: '123123' } as User,
        ]);
      },
      // create(email: string, password: string) {
      //   return Promise.resolve({ id: 1, email, password } as User)
      // },
      // remove(id: number) {
      //   return Promise.resolve({ id } as User);
      // },
      // update(id: number, updateUser: User) {
      //   return Promise.resolve({ id, email: updateUser.email, password: updateUser.password } as User)
      // },
    };
    fakeAuthService = {
      signin(email, password) {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      // signup(email, password) {

      // },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('이메일로 모든 사용자 찾기', async () => {
    const users = await controller.findUsersByEmail('test@test.com');

    expect(users.length).toEqual(2);
    expect(users[0].email).toEqual('test@test.com');
  });

  it('ID로 사용자 찾기 테스트', async () => {
    await expect(controller.findOneById('1')).toBeDefined();
  });

  it('없는 사용자 ID를 이용하여 사용자찾기 시 테스트', async () => {
    fakeUsersService.findOne = () => null;

    await expect(controller.findOneById('1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('로그인 후 세션 업데이트 및 사용자 반환 테스트', async () => {
    const session = { userId: -1 };
    const user = await controller.signin(
      { email: 'test@test.com', password: 'mypassword' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
    expect(user.id).toEqual(session.userId);
  });
});
