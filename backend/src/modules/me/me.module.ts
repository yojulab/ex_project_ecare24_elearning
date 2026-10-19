import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  UserEntity,
  CourseEntity,
  CourseEnrollmentEntity,
  PaymentEntity,
  CertificateEntity,
  CertApplicationEntity,
  InquiryEntity,
} from '../../database/entities';
import { MeController } from './me.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CourseEntity,
      CourseEnrollmentEntity,
      PaymentEntity,
      CertificateEntity,
      CertApplicationEntity,
      InquiryEntity,
    ]),
  ],
  controllers: [MeController],
})
export class MeModule {}
