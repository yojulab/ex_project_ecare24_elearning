import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('system_settings')
export class SystemSettingEntity {
  @PrimaryColumn({ length: 80 })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ name: 'is_public', default: false })
  isPublic: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
