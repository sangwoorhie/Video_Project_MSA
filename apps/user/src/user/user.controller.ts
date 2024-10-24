import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @MessagePattern : api-gateway의 userService에서 오는 요청을 동기적으로 처리 (요청-응답 패턴)

  // 1. 이메일로 사용자 조회 (동기 통신, TCP 사용)
  @MessagePattern({ cmd: 'findOneByEmail' })
  async findOneByEmail(email: string): Promise<{ id: string }> {
    const user = await this.userService.findOneByEmail(email);
    return { id: user?.id || null };
  }

  // 2. 사용자 생성 (동기 통신, TCP 사용)
  @MessagePattern({ cmd: 'create' })
  async create({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ id: string }> {
    const user = await this.userService.create(email, password);
    return { id: user.id };
  }

  // 3. 사용자 인증 (동기 통신, TCP 사용)
  @MessagePattern({ cmd: 'validate' })
  async validate({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ id: string }> {
    const { id } = await this.userService.validate(email, password);
    return { id };
  }
}