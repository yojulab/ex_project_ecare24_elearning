import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { CourseEntity } from './course.entity';

@Entity('disease_categories')
export class DiseaseCategoryEntity {
  @PrimaryColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ name: 'name_ko', length: 100 })
  nameKo: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'icon_url', length: 255, nullable: true })
  iconUrl: string;

  @Column({ name: 'display_order', default: 0 })
  displayOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => CourseEntity, (course) => course.category)
  courses: CourseEntity[];
}
