import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // 비디오 다운로드 이벤트 처리 (Kafka를 활용한 비동기 통신)
  // @EventPattern: video-service에서 발행한 video_downloaded 이벤트를 비동기로 수신하여 핸들링 (비동기이벤트이므로 응답 반환X)
  @EventPattern('video_downloaded')
  async handleVideoDownloaded(@Payload() message: any) {
    console.info(`message: ${message}`);
    this.analyticsService.updateVideoDownloadCnt(message.id);
  }
}