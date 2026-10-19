import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserPermissionEntity } from './user-permission.entity';
import { CourseEnrollmentEntity } from './course-enrollment.entity';
import { PaymentEntity } from './payment.entity';
import { CertificateEntity } from './certificate.entity';
import { InquiryEntity } from './inquiry.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'login_id', unique: true, length: 100 })
  loginId: string;

  @Column({ name: 'full_name', length: 100 })
  fullName: string;

  @Column({ name: 'phone_number', length: 50 })
  phoneNumber: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ name: 'password_hash', length: 255, select: false })
  passwordHash: string;

  @Column({
    name: 'user_type',
    type: 'enum',
    enum: ['STUDENT', 'STAFF'],
    default: 'STUDENT',
  })
  userType: 'STUDENT' | 'STAFF';

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'LOCKED', 'DORMANT', 'WITHDRAWN'],
    default: 'ACTIVE',
  })
  status: 'ACTIVE' | 'LOCKED' | 'DORMANT' | 'WITHDRAWN';

  @Column({ name: 'token_version', default: 0 })
  tokenVersion: number;

  @Column({ name: 'failed_login_count', default: 0 })
  failedLoginCount: number;

  @Column({ name: 'locked_until', type: 'timestamptz', nullable: true })
  lockedUntil: Date;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt: Date;

  @Column({
    name: 'accessibility_font_scale',
    length: 10,
    default: 'NORMAL',
  })
  accessibilityFontScale: string;

  @Column({ name: 'is_high_contrast', default: false })
  isHighContrast: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => UserPermissionEntity, (up) => up.user)
  userPermissions: UserPermissionEntity[];

  @OneToMany(() => CourseEnrollmentEntity, (ce) => ce.user)
  enrollments: CourseEnrollmentEntity[];

  @OneToMany(() => PaymentEntity, (p) => p.user)
  payments: PaymentEntity[];

  @OneToMany(() => CertificateEntity, (c) => c.user)
  certificates: CertificateEntity[];

  @OneToMany(() => InquiryEntity, (i) => i.user)
  inquiries: InquiryEntity[];
}
