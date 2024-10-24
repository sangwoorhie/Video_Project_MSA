import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  // RefreshToken 엔티티 (리프레시 토큰 저장용)
  @Entity()
  export class RefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    token: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  
    @Column()
    userId: string;
  }
  