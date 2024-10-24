import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Analytics } from './entity/analytics.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Analytics)
    private analyticsRepository: Repository<Analytics>,
  ) {}

   // 비디오 다운로드 수 업데이트
  async updateVideoDownloadCnt(videoId: string) {
    const analytics = await this.analyticsRepository.findOneBy({ videoId });
    if (!analytics) {
      // 해당 비디오의 통계 데이터가 없으면 새로 생성
      this.analyticsRepository.save(
        this.analyticsRepository.create({ videoId, downloadCnt: 1 }),
      );
      return;
    }

    // 기존 통계 데이터의 다운로드 수 증가
    await this.analyticsRepository.update(
      { id: analytics.id },
      { downloadCnt: () => 'download_cnt + 1' },
    );
  }
}