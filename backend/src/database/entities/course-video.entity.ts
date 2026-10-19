import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseEntity } from './course.entity';

@Entity('course_videos')
export class CourseVideoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'course_id', type: 'uuid' })
  courseId: string;

  @Column({ name: 'step_id', type: 'uuid', nullable: true })
  stepId: string;

  @Column({ length: 300 })
  title: string;

  @Column({
    type: 'enum',
    enum: ['HEYGEN', 'YOUTUBE_EMBED', 'OWN_HLS', 'VIMEO'],
    default: 'HEYGEN',
  })
  source: 'HEYGEN' | 'YOUTUBE_EMBED' | 'OWN_HLS' | 'VIMEO';

  @Column({ name: 'external_ref', length: 200, nullable: true })
  externalRef: string;

  @Column({ name: 'original_url', length: 500, nullable: true })
  originalUrl: string;

  @Column({ name: 'embed_url', length: 500, nullable: true })
  embedUrl: string;

  @Column({ name: 'duration_seconds', default: 0 })
  durationSeconds: number;

  @Column({ name: 'display_order', default: 0 })
  displayOrder: number;

  @Column({ name: 'is_preview', default: false })
  isPreview: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => CourseEntity, (course) => course.videos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;
}
