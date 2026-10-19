import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  UserEntity,
  PermissionEntity,
  UserPermissionEntity,
  PaymentEntity,
  CourseEnrollmentEntity,
  PopupNoticeEntity,
  NoticeEntity,
  InquiryEntity,
} from '../../database/entities';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      PermissionEntity,
      UserPermissionEntity,
      PaymentEntity,
      CourseEnrollmentEntity,
      PopupNoticeEntity,
      NoticeEntity,
      InquiryEntity,
    ]),
  ],
  controllers: [AdminController],
})
export class AdminModule {}
