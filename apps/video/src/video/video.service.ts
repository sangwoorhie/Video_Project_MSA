import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Video } from './entity/video.entity';
import { join } from 'path';
import { readFile, stat, writeFile } from 'fs/promises';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class VideoService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Video) private videoRepository: Repository<Video>,
    @Inject('VIDEO_SERVICE') private client: ClientProxy,
  ) {}

  // 1. 비디오 업로드 로직 처리
  async upload(
    userId: string,
    title: string,
    mimetype: string,
    extension: string,
    buffer: Buffer,
  ): Promise<Video> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    let error;
    try {
      // 비디오 메타데이터 DB 저장
      const video = await queryRunner.manager.save(
        queryRunner.manager.create(Video, { title, mimetype, userId }),
      );
      // 비디오 파일 로컬에 저장
      await this.uploadVideo(video.id, extension, buffer);
      await queryRunner.commitTransaction();
      return video;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      error = e;
    } finally {
      await queryRunner.release();
      if (error) throw error;
    }
  }

  // 2. 비디오 다운로드 로직 처리
  async download(
    id: string,
  ): Promise<{ buffer: Buffer; mimetype: string; size: number }> {
    const video = await this.videoRepository.findOneBy({ id });
    if (!video) throw new NotFoundException('No video');

    const { mimetype } = video;
    const extension = mimetype.split('/')[1];
    const videoPath = join(
      process.cwd(),
      'video-storage',
      `${id}.${extension}`,
    );
    const { size } = await stat(videoPath);
    const buffer = await readFile(videoPath);

    // 비동기 이벤트 발행 (Kafka 사용)
    this.client.emit('video_downloaded', { id: video.id });

    return { buffer, mimetype, size };
  }

  // 비디오 파일 저장 메서드
  private async uploadVideo(id: string, extension: string, buffer: Buffer) {
    const filePath = join(process.cwd(), 'video-storage', `${id}.${extension}`);
    await writeFile(filePath, Buffer.from(buffer));
  }
}
