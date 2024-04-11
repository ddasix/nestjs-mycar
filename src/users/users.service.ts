import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) protected userRepository: Repository<User>,
  ) {}

  create(email: string, password: string): Promise<User> {
    const user: User = this.userRepository.create({ email, password });

    return this.userRepository.save(user);
  }

  findOne(id: number): Promise<User> {
    if (!id) {
      throw new UnauthorizedException('로그인이 필요한 서비스');
    }
    return this.userRepository.findOneBy({ id });
  }

  findAllByEmail(email: string): Promise<User[]> {
    const criteria: FindManyOptions<User> = {
      where: {
        email,
      },
      order: {
        id: 'ASC',
      },
    };

    return this.userRepository.find(criteria);
  }

  async update(id: number, updateUser: Partial<User>): Promise<User> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User Not Found!`);
    }

    Object.assign(user, updateUser);

    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User Not Found!`);
    }

    return this.userRepository.remove(user);
  }
}
