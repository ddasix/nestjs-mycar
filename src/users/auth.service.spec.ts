import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { UsersService } from "./users.service";
import { User } from "./user.entity";

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        // Create a fake copyt of the users service
        const users: User[] = [];
        fakeUsersService = {
            findAllByEmail: (email: string): Promise<User[]> => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string): Promise<User> => {
                const user: User = {
                    id: Math.floor(Math.random() * 999999),
                    email,
                    password
                } as User
                users.push(user);

                return Promise.resolve(user);
            }
        }
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();
    
        service = module.get(AuthService);
    
    });
    
    it('AuthService 생성 테스트', async () => {
    
        expect(service).toBeDefined();
    });

    it('비밀번호 생성 테스트', async () => {
        const user = await service.signup('test@test.com', '1234')

        expect(user.password).not.toEqual('1234');
        const [salt, hash] = user.password.split('.')
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('새 계정 생성시 사용중인 이메일 사용 테스트', async () => {
        await service.signup('test22@test.com', '1234');
        await expect(service.signup('test22@test.com', '1234')).rejects.toThrow(BadRequestException);
    });

    it('로그인 시 없는사용자 테스트', async () => {
        await expect(service.signin('dsdsd@test.com', '1234')).rejects.toThrow(NotFoundException);
    });

    it('틀린 비밀번호 입력 테스트', async () => {
        await service.signup('test22@test.com', 'fsdfsd');
        await expect(service.signin('test22@test.com', 'mypassword')).rejects.toThrow(BadRequestException);
    });

    it('맞는 비밀번호 입력 테스트', async () => {
        // fakeUsersService.findAllByEmail = (email) => Promise.resolve([
        //     {
        //         email,
        //         password: '12341234'
        //     } as User
        // ]);

        // const user = await service.signin('test22@test.com', 'mypassword');

        // expect(user).toBeDefined();

        /**
         * Bad!!💀
         */
        // 임시 계정 하나 생성
        // const user = await service.signup('test33@test.com', 'mypassword');

        // 임시 계정에서 password 추출
        // console.log(user);
        // ```
        //    console.log
        //    {
        //      id: 1,
        //      email: 'test33@test.com',
        //      password: 'b5f2bec71a5ce9fc.52e147f9c8708d30568087fc113e88030a26193f37d724e649b5c4ddc78e03fc'
        //    }
        //
        // ```
        // 임시 계정의 password를 fakeUsersService.findAllByEmail의 반환값으로 고정
        // fakeUsersService.findAllByEmail = (email) => Promise.resolve([
        //     {
        //         email: 'test33@test.com',
        //         password: 'b5f2bec71a5ce9fc.52e147f9c8708d30568087fc113e88030a26193f37d724e649b5c4ddc78e03fc',
        //     } as User
        // ]);
        // const user = await service.signin('test33@test.com', 'mypassword');
        // expect(user).toBeDefined();

        /**
         * Good!! 😌
         */
        await service.signup('test33@test.com', 'mypassword');
        const user = await service.signin('test33@test.com', 'mypassword');
        expect(user).toBeDefined();
    });

});
