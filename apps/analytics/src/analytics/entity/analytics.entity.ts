import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  // Analytics 엔티티 (다운로드 수 등 통계 데이터를 저장)
  @Entity()
  export class Analytics {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ name: 'download_cnt', default: 0 })
    downloadCnt: number;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  
    @Column()
    videoId: string;
  }
  