import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DiseaseCategoryEntity } from './disease-category.entity';
import { CurriculumStepEntity } from './curriculum-step.entity';
import { CourseVideoEntity } from './course-video.entity';

@Entity('courses')
export class CourseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'category_id', type: 'int', nullable: true })
  categoryId: number;

  @Column({
    name: 'course_type',
    type: 'enum',
    enum: ['MAIN', 'TRACK'],
    default: 'TRACK',
  })
  courseType: 'MAIN' | 'TRACK';

  @Column({ length: 200 })
  title: string;

  @Column({ name: 'target_disease', length: 100 })
  targetDisease: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ default: 0 })
  price: number;

  @Column({ name: 'theory_hours', default: 40 })
  theoryHours: number;

  @Column({ name: 'practical_hours', default: 20 })
  practicalHours: number;

  @Column({ name: 'practicum_hours', default: 20 })
  practicumHours: number;

  @Column({ name: 'required_hours', type: 'int', insert: false, update: false })
  requiredHours: number;

  @Column({ name: 'snubh_credit_cap_hours', type: 'decimal', precision: 4, scale: 1, default: 20.0 })
  snubhCreditCapHours: number;

  @Column({ name: 'qualification_name', length: 150 })
  qualificationName: string;

  @Column({ name: 'study_period_days', default: 90 })
  studyPeriodDays: number;

  @Column({ name: 'thumbnail_url', length: 500, nullable: true })
  thumbnailUrl: string;

  @Column({ name: 'is_published', default: false })
  isPublished: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => DiseaseCategoryEntity, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: DiseaseCategoryEntity;

  @OneToMany(() => CurriculumStepEntity, (step) => step.course)
  steps: CurriculumStepEntity[];

  @OneToMany(() => CourseVideoEntity, (video) => video.course)
  videos: CourseVideoEntity[];
}
