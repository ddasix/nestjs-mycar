import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dtos';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes, scryptSync } from 'crypto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // 1. email이 이미 존재하는지 확인
    const users = await this.usersService.findAllByEmail(email);
    if (users.length > 0) {
      throw new BadRequestException('사용중인 이메일.');
    }

    // 2. password를 Hash화
    // a. SALT 만들기
    const salt: string = randomBytes(8).toString('hex');

    // b. SALT와 password를 Hash화
    const hash: Buffer = await scryptSync(password, salt, 32);

    // c. Hash화 한 SALT와 password를 결합하기
    const hashed_password = `${salt}.${hash.toString('hex')}`;

    // 3. 새로운 사용자 저장
    const user = await this.usersService.create(email, hashed_password);

    // 4. 저장한 User 반환
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.findAllByEmail(email);

    if (!user) {
      throw new NotFoundException('없는 사용자.');
    }

    const [salt, stored_hash] = user.password.split('.');
    const hash = await scryptSync(password, salt, 32);

    if (hash.toString('hex') !== stored_hash) {
      throw new BadRequestException('비밀번호가 틀렸습니다.');
    }

    return user;
  }
}
