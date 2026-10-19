import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('inquiries')
export class InquiryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ length: 30 })
  category: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: ['OPEN', 'ANSWERED', 'CLOSED'],
    default: 'OPEN',
  })
  status: 'OPEN' | 'ANSWERED' | 'CLOSED';

  @Column({ type: 'text', nullable: true })
  answer: string;

  @Column({ name: 'answered_by', type: 'uuid', nullable: true })
  answeredBy: string;

  @Column({ name: 'answered_at', type: 'timestamptz', nullable: true })
  answeredAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
