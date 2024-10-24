import { Controller, Get } from '@nestjs/common';
import { VideoService } from './video.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

// @MessagePattern : api-gateway의 videoService에서 오는 요청을 동기적으로 처리 (요청-응답 패턴)

  // 1. 비디오 업로드 처리 (동기 통신, TCP 사용)
  @MessagePattern({ cmd: 'upload' })
  async upload({
    userId,
    title,
    mimetype,
    extension,
    buffer,
  }: {
    userId: string;
    title: string;
    mimetype: string;
    extension: string;
    buffer: { type: 'buffer'; data: number[] };
  }): Promise<{ id: string }> {
    const video = await this.videoService.upload(
      userId,
      title,
      mimetype,
      extension,
      Buffer.from(buffer.data),
    );
    return { id: video.id };
  }

  // 2. 비디오 다운로드 처리 (동기 통신, TCP 사용)
  @MessagePattern({ cmd: 'download' })
  async download({ id }: { id: string }) {
    return this.videoService.download(id);
  }
}
