import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CourseEnrollmentEntity } from './course-enrollment.entity';

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_no', length: 40, unique: true })
  orderNo: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'enrollment_id', type: 'uuid' })
  enrollmentId: string;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: ['BANK_TRANSFER', 'CARD', 'VIRTUAL_ACCOUNT', 'FREE'],
    default: 'BANK_TRANSFER',
  })
  method: 'BANK_TRANSFER' | 'CARD' | 'VIRTUAL_ACCOUNT' | 'FREE';

  @Column({
    type: 'enum',
    enum: ['PENDING', 'PAID', 'CANCELED', 'REFUND_REQUESTED', 'REFUNDED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'PAID' | 'CANCELED' | 'REFUND_REQUESTED' | 'REFUNDED';

  @Column({ name: 'depositor_name', length: 100, nullable: true })
  depositorName: string;

  @Column({ name: 'due_at', type: 'timestamptz', nullable: true })
  dueAt: Date;

  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt: Date;

  @Column({ name: 'confirmed_by', type: 'uuid', nullable: true })
  confirmedBy: string;

  @Column({ type: 'text', nullable: true })
  memo: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.payments)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CourseEnrollmentEntity, (enrollment) => enrollment.payments)
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: CourseEnrollmentEntity;
}
