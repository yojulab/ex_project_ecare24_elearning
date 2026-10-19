import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('popup_notices')
export class PopupNoticeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ name: 'content_html', type: 'text', nullable: true })
  contentHtml: string;

  @Column({ name: 'image_url', length: 500, nullable: true })
  imageUrl: string;

  @Column({ name: 'link_url', length: 500, nullable: true })
  linkUrl: string;

  @Column({
    type: 'enum',
    enum: ['ALL', 'STUDENT', 'GUEST'],
    default: 'ALL',
  })
  target: 'ALL' | 'STUDENT' | 'GUEST';

  @Column({ name: 'show_on_web', default: true })
  showOnWeb: boolean;

  @Column({ name: 'show_on_mobile', default: true })
  showOnMobile: boolean;

  @Column({ name: 'position_x', default: 40 })
  positionX: number;

  @Column({ name: 'position_y', default: 120 })
  positionY: number;

  @Column({ default: 480 })
  width: number;

  @Column({ default: 0 })
  priority: number;

  @Column({ name: 'allow_hide_today', default: true })
  allowHideToday: boolean;

  @Column({ name: 'starts_at', type: 'timestamptz' })
  startsAt: Date;

  @Column({ name: 'ends_at', type: 'timestamptz' })
  endsAt: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'author_id', type: 'uuid', nullable: true })
  authorId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
