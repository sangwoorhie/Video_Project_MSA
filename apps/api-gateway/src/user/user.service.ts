import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

  async findOneByEmail(email: string) {
    const pattern = { cmd: 'findOneByEmail' };
    const payload = email;
    const { id: userId } = await firstValueFrom<{ id: string }>(
      this.client.send<{ id: string }>(pattern, payload),
    );
    return userId;
  }

  async create(email: string, password: string) {
    const pattern = { cmd: 'create' };
    const payload = { email, password };
    const { id: userId } = await firstValueFrom<{ id: string }>(
      this.client.send<{ id: string }>(pattern, payload),
    );
    return userId;
  }

  // 회원여부 검증
  async validateUser(email: string, password: string) {
    const pattern = { cmd: 'validate' };
    const payload = { email, password };
    const { id } = await firstValueFrom<{ id: string }>(
      this.client.send<{ id: string }>(pattern, payload),
    );
    return id;
  }

  // 관리자여부 검증
  async checkUserIsAdmin(id: string) {
    return true;
  }
}