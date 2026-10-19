import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('permissions')
export class PermissionEntity {
  @PrimaryColumn({ length: 60 })
  code: string;

  @Column({ name: 'group_name', length: 40 })
  groupName: string;

  @Column({ name: 'name_ko', length: 100 })
  nameKo: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'display_order', default: 0 })
  displayOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
