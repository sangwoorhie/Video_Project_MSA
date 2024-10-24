import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

  // api-gateway의 UserService => 내부 로직을 처리하는 것이 아니라, 외부 user-service로 요청을 보내고 응답을 받아오는 역할
  // 사용자 관련 로직을 직접 처리하지 않고, 마이크로서비스 아키텍처의 원칙에 따라 책임을 분리함

  // 1. 이메일로 사용자 조회 (동기 통신, TCP 사용)
  async findOneByEmail(email: string) {
    const pattern = { cmd: 'findOneByEmail' };
    const payload = email;
    const { id: userId } = await firstValueFrom<{ id: string }>(
      this.client.send<{ id: string }>(pattern, payload),
    );
    return userId;
  }

  // 2. 사용자 생성 (동기 통신, TCP 사용)
  async create(email: string, password: string) {
    const pattern = { cmd: 'create' };
    const payload = { email, password };
    const { id: userId } = await firstValueFrom<{ id: string }>(
      this.client.send<{ id: string }>(pattern, payload),
    );
    return userId;
  }

  // 3. 사용자 인증 (동기 통신, TCP 사용)
  async validateUser(email: string, password: string) {
    const pattern = { cmd: 'validate' };
    const payload = { email, password };
    const { id } = await firstValueFrom<{ id: string }>(
      this.client.send<{ id: string }>(pattern, payload),
    );
    return id;
  }

  // 4. 관리자 권한 확인
  async checkUserIsAdmin(id: string) {
    return true;
  }
}