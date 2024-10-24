import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ReadStream } from 'fs';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VideoService {
  constructor(@Inject('VIDEO_SERVICE') private client: ClientProxy) {}

  // api-gateway의 VideoService => 내부 로직을 처리하는 것이 아니라, 외부 video-service로 요청을 보내고 응답을 받아오는 역할
  // 비디오 관련 로직을 직접 처리하지 않고, 마이크로서비스 아키텍처의 원칙에 따라 책임을 분리함
  //client.send() 메서드를 사용하여 TCP를 통한 동기 통신

  // 1. 비디오 메타데이터 업로드 요청 처리 (동기 통신, TCP 사용)
  async upload(
    userId: string,
    title: string,
    mimetype: string,
    extension: string,
    buffer: Buffer,
  ): Promise<{ id: string }> {
    const pattern = { cmd: 'upload' };
    const payload = { userId, title, mimetype, extension, buffer };
    const { id } = await firstValueFrom<{ id: string }>(
      this.client.send<{ id: string }>(pattern, payload),
    );
    return { id };
  }

  // 2. 비디오 다운로드 요청 처리 (동기 통신, TCP 사용)
  async download(id: string) {
    const pattern = { cmd: 'download' };
    const payload = { id };
    const { buffer, mimetype, size } = await firstValueFrom<{
      buffer: { type: 'buffer'; data: number[] };
      mimetype: string;
      size: number;
    }>(
      this.client.send<{
        buffer: { type: 'buffer'; data: number[] };
        mimetype: string;
        size: number;
      }>(pattern, payload),
    );
    return {
      stream: ReadStream.from(Buffer.from(buffer.data)),
      mimetype,
      size,
    };
  }
}