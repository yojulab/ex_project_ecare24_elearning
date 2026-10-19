import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { CourseEntity } from './course.entity';

@Entity('certificates')
export class CertificateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'certificate_no', length: 100, unique: true })
  certificateNo: string;

  @Column({ name: 'registry_no', length: 100 })
  registryNo: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'course_id', type: 'uuid', nullable: true })
  courseId: string;

  @Column({ name: 'category_id', type: 'int', nullable: true })
  categoryId: number;

  @Column({ name: 'qualification_name', length: 150 })
  qualificationName: string;

  @Column({ length: 50, default: '전문간병사 1급' })
  grade: string;

  @Column()
  score: number;

  @Column({ name: 'issued_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  issuedAt: Date;

  @Column({ name: 'expiry_date', type: 'timestamptz', nullable: true })
  expiryDate: Date;

  @Column({ name: 'qr_verify_token', length: 255, unique: true })
  qrVerifyToken: string;

  @Column({ name: 'pdf_file_url', length: 500, nullable: true })
  pdfFileUrl: string;

  @Column({
    type: 'enum',
    enum: ['VALID', 'RENEWAL_DUE', 'EXPIRED', 'REVOKED'],
    default: 'VALID',
  })
  status: 'VALID' | 'RENEWAL_DUE' | 'EXPIRED' | 'REVOKED';

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CourseEntity)
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;
}

@Entity('cert_applications')
export class CertApplicationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'course_id', type: 'uuid' })
  courseId: string;

  @Column({ name: 'eligibility_basis', length: 30 })
  eligibilityBasis: string;

  @Column({ name: 'caregiver_cert_file_url', length: 500, nullable: true })
  caregiverCertFileUrl: string;

  @Column({
    type: 'enum',
    enum: ['SUBMITTED', 'DOC_CHECK', 'NURSE_EVAL', 'REVIEW', 'ISSUED', 'REJECTED'],
    default: 'SUBMITTED',
  })
  status: 'SUBMITTED' | 'DOC_CHECK' | 'NURSE_EVAL' | 'REVIEW' | 'ISSUED' | 'REJECTED';

  @Column({ name: 'reviewer_id', type: 'uuid', nullable: true })
  reviewerId: string;

  @Column({ name: 'reject_reason', type: 'text', nullable: true })
  rejectReason: string;

  @Column({ name: 'certificate_id', type: 'uuid', nullable: true })
  certificateId: string;

  @Column({ name: 'status_history', type: 'jsonb', default: () => "'[]'" })
  statusHistory: any[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CourseEntity)
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity;
}
