import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('exam_questions')
export class ExamQuestionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'category_id', type: 'int', nullable: true })
  categoryId: number;

  @Column({ name: 'subject_code', length: 50, nullable: true })
  subjectCode: string;

  @Column({
    name: 'question_type',
    type: 'enum',
    enum: ['MULTIPLE_CHOICE', 'SHORT_ANSWER', 'CASE_STUDY'],
    default: 'MULTIPLE_CHOICE',
  })
  questionType: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'CASE_STUDY';

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', nullable: true })
  scenario: string;

  @Column({ default: 10 })
  points: number;

  @Column({ type: 'jsonb' })
  options: { no: number; text: string }[];

  @Column({ name: 'correct_answer', length: 10 })
  correctAnswer: string;

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column({ name: 'terminology_tags', type: 'text', array: true, default: '{}' })
  terminologyTags: string[];

  @Column({ name: 'is_reviewed_by_clinician', default: true })
  isReviewedByClinician: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
