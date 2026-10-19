import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { CourseEntity } from './course.entity';

@Entity('curriculum_steps')
export class CurriculumStepEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'course_id', type: 'uuid' })
  courseId: string;

  @Column({ name: 'step_number' })
  stepNumber: number;

  @Column({
    name: 'step_type',
    type: 'enum',
    enum: ['THEORY_TEXT', 'PRACTICAL_VIDEO', 'MOCK_EXAM', 'FINAL_EXAM'],
  })
  stepType: 'THEORY_TEXT' | 'PRACTICAL_VIDEO' | 'MOCK_EXAM' | 'FINAL_EXAM';

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'content_url', length: 500, nullable: true })
  contentUrl: string;

  @Column({ name: 'audio_tts_url', length: 500, nullable: true })
  audioTtsUrl: string;

  @Column({ name: 'duration_minutes', default: 0 })
  durationMinutes: number;

  @Column({ name: 'pass_score', default: 0 })
  passScore: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => CourseEntity, (course) => course.steps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;
}
