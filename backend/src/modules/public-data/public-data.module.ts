import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DiseaseCategoryEntity,
  GoldenRuleEntity,
  CaregiverTermEntity,
  CourseEntity,
  CourseVideoEntity,
  NoticeEntity,
  PopupNoticeEntity,
  SystemSettingEntity,
  ExamQuestionEntity,
} from '../../database/entities';
import { PublicDataController } from './public-data.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DiseaseCategoryEntity,
      GoldenRuleEntity,
      CaregiverTermEntity,
      CourseEntity,
      CourseVideoEntity,
      NoticeEntity,
      PopupNoticeEntity,
      SystemSettingEntity,
      ExamQuestionEntity,
    ]),
  ],
  controllers: [PublicDataController],
})
export class PublicDataModule {}
