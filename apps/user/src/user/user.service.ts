import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // 1. 이메일로 사용자 조회
  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  // 2. 사용자 생성
  async create(email: string, password: string) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const userEntity = this.userRepository.create({
      email,
      password: hash,
    });
    const user = await this.userRepository.save(userEntity);
    return user;
  }

  // 3. 사용자 인증
  async validate(email: string, password: string) {
    const user = await this.findOneByEmail(email);
    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException();
    return user;
  }
}