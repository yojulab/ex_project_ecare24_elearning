import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser } from '../../common/decorators';
import {
  UserEntity,
  CourseEntity,
  CourseEnrollmentEntity,
  PaymentEntity,
  CertificateEntity,
  CertApplicationEntity,
  InquiryEntity,
} from '../../database/entities';

@Controller('me')
export class MeController {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectRepository(CourseEntity)
    private courseRepo: Repository<CourseEntity>,
    @InjectRepository(CourseEnrollmentEntity)
    private enrollmentRepo: Repository<CourseEnrollmentEntity>,
    @InjectRepository(PaymentEntity)
    private paymentRepo: Repository<PaymentEntity>,
    @InjectRepository(CertificateEntity)
    private certRepo: Repository<CertificateEntity>,
    @InjectRepository(CertApplicationEntity)
    private certAppRepo: Repository<CertApplicationEntity>,
    @InjectRepository(InquiryEntity)
    private inquiryRepo: Repository<InquiryEntity>,
  ) {}

  @Get()
  async getProfile(@CurrentUser() user: any) {
    const me = await this.userRepo.findOne({
      where: { id: user.id },
    });
    if (!me) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    return {
      id: me.id,
      loginId: me.loginId,
      fullName: me.fullName,
      phoneNumber: me.phoneNumber,
      email: me.email,
      userType: me.userType,
      accessibilityFontScale: me.accessibilityFontScale,
      isHighContrast: me.isHighContrast,
      createdAt: me.createdAt,
    };
  }

  @Patch('accessibility')
  async updateAccessibility(
    @CurrentUser() user: any,
    @Body() body: { fontScale?: string; isHighContrast?: boolean },
  ) {
    const updateData: any = {};
    if (body.fontScale) updateData.accessibilityFontScale = body.fontScale;
    if (body.isHighContrast !== undefined) updateData.isHighContrast = body.isHighContrast;

    await this.userRepo.update(user.id, updateData);
    return { success: true, ...updateData };
  }

  @Get('summary')
  async getSummary(@CurrentUser() user: any) {
    const enrollments = await this.enrollmentRepo.find({
      where: { userId: user.id },
      relations: ['course', 'course.videos'],
      order: { enrolledAt: 'DESC' },
    });

    const payments = await this.paymentRepo.find({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
    });

    const certificates = await this.certRepo.find({
      where: { userId: user.id },
    });

    const pendingPaymentCount = payments.filter((p) => p.status === 'PENDING').length;

    // 최근 학습 이어보기용 최신 등록 과정
    const activeEnrollment = enrollments.find((e) => e.status === 'ACTIVE') || enrollments[0];

    return {
      user: {
        fullName: user.fullName,
        loginId: user.loginId,
      },
      stats: {
        enrolledCount: enrollments.length,
        activeCourseTitle: activeEnrollment?.course?.title || '수강 중인 과정이 없습니다.',
        recentVideoId: activeEnrollment?.course?.videos?.[0]?.id || null,
        pendingPaymentCount,
        certificateCount: certificates.length,
      },
      recentEnrollment: activeEnrollment || null,
    };
  }

  @Get('courses')
  async getMyCourses(@CurrentUser() user: any) {
    return this.enrollmentRepo.find({
      where: { userId: user.id },
      relations: ['course', 'course.steps', 'course.videos', 'course.category'],
      order: { enrolledAt: 'DESC' },
    });
  }

  @Post('courses/apply')
  async applyCourse(
    @CurrentUser() user: any,
    @Body() body: { courseId: string; depositorName?: string },
  ) {
    const course = await this.courseRepo.findOne({ where: { id: body.courseId } });
    if (!course) {
      throw new NotFoundException('신청하려는 교육과정을 찾을 수 없습니다.');
    }

    const existing = await this.enrollmentRepo.findOne({
      where: { userId: user.id, courseId: course.id },
    });
    if (existing) {
      throw new BadRequestException('이미 등록되었거나 신청 중인 교육과정입니다.');
    }

    // 1. 수강 등록 생성
    const enrollment = await this.enrollmentRepo.save({
      userId: user.id,
      courseId: course.id,
      status: course.price > 0 ? 'ACTIVE' : 'ACTIVE', // 입금 확인 전이라도 수강생 대시보드에 청구 매핑
    });

    // 2. 무통장 입금 청구 생성 (PENDING)
    const orderNo = `EC24-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`;
    const dueAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7일 입금기한

    const payment = await this.paymentRepo.save({
      orderNo,
      userId: user.id,
      enrollmentId: enrollment.id,
      amount: course.price,
      method: course.price > 0 ? 'BANK_TRANSFER' : 'FREE',
      status: course.price > 0 ? 'PENDING' : 'PAID',
      depositorName: body.depositorName || user.fullName,
      dueAt,
      memo: `수강과정: ${course.title}`,
    });

    return {
      success: true,
      message: '수강신청이 정상 접수되었습니다. 안내된 계좌로 입금해 주시기 바랍니다.',
      enrollment,
      payment,
    };
  }

  @Get('payments')
  async getMyPayments(@CurrentUser() user: any) {
    return this.paymentRepo.find({
      where: { userId: user.id },
      relations: ['enrollment', 'enrollment.course'],
      order: { createdAt: 'DESC' },
    });
  }

  @Get('certificates')
  async getMyCertificates(@CurrentUser() user: any) {
    const certs = await this.certRepo.find({
      where: { userId: user.id },
      relations: ['course'],
      order: { issuedAt: 'DESC' },
    });

    const applications = await this.certAppRepo.find({
      where: { userId: user.id },
      relations: ['course'],
      order: { createdAt: 'DESC' },
    });

    return {
      certificates: certs,
      applications,
    };
  }

  @Get('inquiries')
  async getMyInquiries(@CurrentUser() user: any) {
    return this.inquiryRepo.find({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
    });
  }

  @Post('inquiries')
  async createInquiry(
    @CurrentUser() user: any,
    @Body() body: { category: string; title: string; content: string },
  ) {
    return this.inquiryRepo.save({
      userId: user.id,
      category: body.category || 'COURSE',
      title: body.title,
      content: body.content,
      status: 'OPEN',
    });
  }
}
