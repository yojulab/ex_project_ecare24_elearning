import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequirePermissions, CurrentUser } from '../../common/decorators';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import {
  UserEntity,
  PermissionEntity,
  UserPermissionEntity,
  PaymentEntity,
  CourseEnrollmentEntity,
  PopupNoticeEntity,
  NoticeEntity,
  InquiryEntity,
  CertificateEntity,
  CertApplicationEntity,
  CourseEntity,
  ExamQuestionEntity,
} from '../../database/entities';

@Controller('admin')
@UseGuards(PermissionsGuard)
export class AdminController {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectRepository(PermissionEntity)
    private permissionRepo: Repository<PermissionEntity>,
    @InjectRepository(UserPermissionEntity)
    private userPermRepo: Repository<UserPermissionEntity>,
    @InjectRepository(PaymentEntity)
    private paymentRepo: Repository<PaymentEntity>,
    @InjectRepository(CourseEnrollmentEntity)
    private enrollmentRepo: Repository<CourseEnrollmentEntity>,
    @InjectRepository(PopupNoticeEntity)
    private popupRepo: Repository<PopupNoticeEntity>,
    @InjectRepository(NoticeEntity)
    private noticeRepo: Repository<NoticeEntity>,
    @InjectRepository(InquiryEntity)
    private inquiryRepo: Repository<InquiryEntity>,
    @InjectRepository(CertificateEntity)
    private certRepo: Repository<CertificateEntity>,
    @InjectRepository(CertApplicationEntity)
    private certAppRepo: Repository<CertApplicationEntity>,
    @InjectRepository(CourseEntity)
    private courseRepo: Repository<CourseEntity>,
    @InjectRepository(ExamQuestionEntity)
    private examQuestionRepo: Repository<ExamQuestionEntity>,
  ) {}

  // 1. 대시보드 KPI 및 대기 큐
  @Get('dashboard/kpis')
  @RequirePermissions('DASHBOARD_VIEW')
  async getDashboardKpis() {
    const totalStudents = await this.userRepo.count({ where: { userType: 'STUDENT' } });
    const pendingPayments = await this.paymentRepo.find({ where: { status: 'PENDING' } });
    const pendingPaymentCount = pendingPayments.length;
    const pendingPaymentAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

    const activeEnrollments = await this.enrollmentRepo.count({ where: { status: 'ACTIVE' } });
    const openInquiries = await this.inquiryRepo.count({ where: { status: 'OPEN' } });

    return {
      kpis: {
        totalStudents,
        activeEnrollments,
        pendingPaymentCount,
        pendingPaymentAmount,
        openInquiries,
      },
      queues: {
        pendingPayments: pendingPayments.slice(0, 5),
      },
    };
  }

  // 2. 수강생 목록
  @Get('students')
  @RequirePermissions('STUDENT_READ')
  async getStudents() {
    return this.userRepo.find({
      where: { userType: 'STUDENT' },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  // 3. 납부/결제 목록
  @Get('payments')
  @RequirePermissions('PAYMENT_READ')
  async getPayments() {
    return this.paymentRepo.find({
      relations: ['user', 'enrollment', 'enrollment.course'],
      order: { createdAt: 'DESC' },
    });
  }

  // 4. 무통장 입금확인 처리
  @Post('payments/:id/confirm')
  @RequirePermissions('PAYMENT_CONFIRM')
  async confirmPayment(@Param('id') paymentId: string, @CurrentUser() admin: any) {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: ['enrollment'],
    });

    if (!payment) {
      throw new NotFoundException('결제 정보를 찾을 수 없습니다.');
    }

    if (payment.status === 'PAID') {
      throw new BadRequestException('이미 입금확인이 완료된 결제 건입니다.');
    }

    // 결제 상태 PAID로 전이 및 확인자 기록
    payment.status = 'PAID';
    payment.paidAt = new Date();
    payment.confirmedBy = admin.id;
    await this.paymentRepo.save(payment);

    // 수강 등록 활성화
    if (payment.enrollment) {
      await this.enrollmentRepo.update(payment.enrollment.id, {
        status: 'ACTIVE',
      });
    }

    return {
      success: true,
      message: '입금확인이 정상 승인되었습니다. 수강이 활성화되었습니다.',
      payment,
    };
  }

  // 5. 전체 권한 마스터 목록
  @Get('permissions')
  @RequirePermissions('PERMISSION_MANAGE')
  async getAllPermissions() {
    return this.permissionRepo.find({
      order: { displayOrder: 'ASC' },
    });
  }

  // 6. 특정 관리자의 권한 코드 목록
  @Get('users/:id/permissions')
  @RequirePermissions('PERMISSION_MANAGE')
  async getUserPermissions(@Param('id') userId: string) {
    const userPerms = await this.userPermRepo.find({
      where: { userId },
    });
    return userPerms.map((up) => up.permissionCode);
  }

  // 7. 관리자 권한 매트릭스 일괄 저장
  @Put('users/:id/permissions')
  @RequirePermissions('PERMISSION_MANAGE')
  async updateUserPermissions(
    @Param('id') userId: string,
    @Body() body: { permissions: string[] },
    @CurrentUser() admin: any,
  ) {
    await this.userPermRepo.delete({ userId });

    if (body.permissions && body.permissions.length > 0) {
      const permsToInsert = body.permissions.map((code) => ({
        userId,
        permissionCode: code,
        grantedBy: admin.id,
      }));
      await this.userPermRepo.save(permsToInsert);
    }

    await this.userRepo.increment({ id: userId }, 'tokenVersion', 1);

    return {
      success: true,
      message: '권한 목록이 성공적으로 업데이트되었습니다.',
      permissions: body.permissions,
    };
  }

  // 8. 팝업 공지 목록
  @Get('popups')
  @RequirePermissions('POPUP_MANAGE')
  async getPopups() {
    return this.popupRepo.find({
      order: { priority: 'DESC', createdAt: 'DESC' },
    });
  }

  // 9. 팝업 공지 등록
  @Post('popups')
  @RequirePermissions('POPUP_MANAGE')
  async createPopup(
    @Body()
    body: {
      title: string;
      contentHtml?: string;
      imageUrl?: string;
      linkUrl?: string;
      startsAt: string;
      endsAt: string;
      showOnWeb?: boolean;
      showOnMobile?: boolean;
      priority?: number;
    },
    @CurrentUser() admin: any,
  ) {
    return this.popupRepo.save({
      ...body,
      startsAt: new Date(body.startsAt),
      endsAt: new Date(body.endsAt),
      authorId: admin.id,
    });
  }

  // 9-1. 팝업 공지 수정
  @Put('popups/:id')
  @RequirePermissions('POPUP_MANAGE')
  async updatePopup(
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      contentHtml?: string;
      imageUrl?: string;
      linkUrl?: string;
      startsAt?: string;
      endsAt?: string;
      showOnWeb?: boolean;
      showOnMobile?: boolean;
      priority?: number;
      isActive?: boolean;
    },
  ) {
    const popup = await this.popupRepo.findOne({ where: { id } });
    if (!popup) {
      throw new NotFoundException('해당 팝업을 찾을 수 없습니다.');
    }

    if (body.title !== undefined) popup.title = body.title;
    if (body.contentHtml !== undefined) popup.contentHtml = body.contentHtml;
    if (body.imageUrl !== undefined) popup.imageUrl = body.imageUrl;
    if (body.linkUrl !== undefined) popup.linkUrl = body.linkUrl;
    if (body.startsAt) popup.startsAt = new Date(body.startsAt);
    if (body.endsAt) popup.endsAt = new Date(body.endsAt);
    if (body.showOnWeb !== undefined) popup.showOnWeb = body.showOnWeb;
    if (body.showOnMobile !== undefined) popup.showOnMobile = body.showOnMobile;
    if (body.priority !== undefined) popup.priority = body.priority;
    if (body.isActive !== undefined) popup.isActive = body.isActive;

    const saved = await this.popupRepo.save(popup);
    return { success: true, message: '팝업 공지가 수정되었습니다.', popup: saved };
  }

  // 9-2. 팝업 활성/비활성 토글
  @Put('popups/:id/toggle')
  @RequirePermissions('POPUP_MANAGE')
  async togglePopupActive(@Param('id') id: string) {
    const popup = await this.popupRepo.findOne({ where: { id } });
    if (!popup) {
      throw new NotFoundException('해당 팝업을 찾을 수 없습니다.');
    }
    popup.isActive = !popup.isActive;
    await this.popupRepo.save(popup);
    return {
      success: true,
      id: popup.id,
      isActive: popup.isActive,
      message: `팝업이 [${popup.isActive ? '활성화(노출)' : '비활성화(미노출)'}]되었습니다.`,
    };
  }

  // 9-3. 팝업 공지 삭제
  @Delete('popups/:id')
  @RequirePermissions('POPUP_MANAGE')
  async deletePopup(@Param('id') id: string) {
    const popup = await this.popupRepo.findOne({ where: { id } });
    if (!popup) {
      throw new NotFoundException('해당 팝업을 찾을 수 없습니다.');
    }
    await this.popupRepo.delete(id);
    return { success: true, id, message: '팝업 공지가 성공적으로 삭제되었습니다.' };
  }

  // 10. 직능원(pqi.or.kr) 자격증 발급 대장 조회
  @Get('certificates')
  @RequirePermissions('CERT_REVIEW')
  async getCertificates(@Query('q') q?: string) {
    const qb = this.certRepo
      .createQueryBuilder('cert')
      .leftJoinAndSelect('cert.user', 'user')
      .leftJoinAndSelect('cert.course', 'course')
      .leftJoinAndSelect('cert.category', 'category');

    if (q) {
      qb.where(
        'cert.certificateNo LIKE :q OR cert.qualificationName LIKE :q OR user.fullName LIKE :q',
        { q: `%${q}%` }
      );
    }

    return qb.orderBy('cert.issuedAt', 'DESC').getMany();
  }

  // 11. 1:1 상담 문의 목록 조회
  @Get('inquiries')
  @RequirePermissions('COUNSEL_HANDLE')
  async getInquiries() {
    return this.inquiryRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  // 12. 1:1 상담 문의 답변 등록
  @Post('inquiries/:id/answer')
  @RequirePermissions('COUNSEL_HANDLE')
  async answerInquiry(
    @Param('id') id: string,
    @Body() body: { answer: string },
    @CurrentUser() admin: any,
  ) {
    const inq = await this.inquiryRepo.findOne({ where: { id } });
    if (!inq) {
      throw new NotFoundException('문의를 찾을 수 없습니다.');
    }
    inq.answer = body.answer;
    inq.status = 'ANSWERED';
    inq.answeredBy = admin.id;
    inq.answeredAt = new Date();
    await this.inquiryRepo.save(inq);
    return { success: true, inquiry: inq };
  }

  // 13. 공지사항 목록 관리
  @Get('notices')
  @RequirePermissions('NOTICE_MANAGE')
  async getNotices() {
    return this.noticeRepo.find({
      order: { isPinned: 'DESC', createdAt: 'DESC' },
    });
  }

  // 14. 공지사항 등록
  @Post('notices')
  @RequirePermissions('NOTICE_MANAGE')
  async createNotice(
    @Body()
    body: {
      title: string;
      content: string;
      category?: string;
      isPinned?: boolean;
      isPublished?: boolean;
    },
    @CurrentUser() admin: any,
  ) {
    return this.noticeRepo.save({
      ...body,
      authorId: admin.id,
    });
  }

  // 15. 관리자 교육과정/챕터 목록 조회
  @Get('courses')
  @RequirePermissions('COURSE_READ')
  async getCourses() {
    return this.courseRepo.find({
      relations: ['category', 'steps', 'videos'],
      order: { courseType: 'ASC', createdAt: 'ASC' },
    });
  }

  // 16. 교육과정 공개/비공개 토글 (관리자 등록 챕터 노출 제어)
  @Put('courses/:id/publish')
  @RequirePermissions('COURSE_WRITE')
  async toggleCoursePublish(@Param('id') id: string) {
    const course = await this.courseRepo.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException('교육과정을 찾을 수 없습니다.');
    }
    course.isPublished = !course.isPublished;
    await this.courseRepo.save(course);
    return {
      success: true,
      id: course.id,
      title: course.title,
      isPublished: course.isPublished,
      message: `교육과정 [${course.title}]이(가) ${course.isPublished ? '공개(수강생 포털 노출)' : '비공개(수강생 포털 미노출)'}로 전환되었습니다.`,
    };
  }

  // 17. 특정 트랙의 시험 문제 목록 (모의고사 30문항 + 최종평가 30문항)
  @Get('courses/:id/questions')
  @RequirePermissions('COURSE_READ')
  async getCourseQuestions(@Param('id') id: string) {
    const course = await this.courseRepo.findOne({ where: { id }, relations: ['category'] });
    if (!course) {
      throw new NotFoundException('교육과정을 찾을 수 없습니다.');
    }

    const trackCodeMap: Record<string, string> = {
      'a0000000-0000-0000-0000-000000000001': 'TRK-01',
      'a0000000-0000-0000-0000-000000000002': 'TRK-02',
      'a0000000-0000-0000-0000-000000000003': 'TRK-03',
    };
    const trackCode = trackCodeMap[id] || 'TRK-01';

    const mockQuestions = await this.examQuestionRepo.find({
      where: { subjectCode: `${trackCode}-MOCK` },
      order: { id: 'ASC' },
    });

    const finalQuestions = await this.examQuestionRepo.find({
      where: { subjectCode: `${trackCode}-FINAL` },
      order: { id: 'ASC' },
    });

    return {
      courseId: course.id,
      courseTitle: course.title,
      trackCode,
      mockCount: mockQuestions.length,
      finalCount: finalQuestions.length,
      totalCount: mockQuestions.length + finalQuestions.length,
      mockQuestions,
      finalQuestions,
    };
  }

  // 18. 전체 문제은행 조회 (관리자 인스펙션용)
  @Get('exam-questions')
  @RequirePermissions('COURSE_READ')
  async getAllAdminQuestions(@Query('trackCode') trackCode?: string) {
    const qb = this.examQuestionRepo.createQueryBuilder('q');
    if (trackCode) {
      qb.where('q.subjectCode LIKE :pattern', { pattern: `${trackCode}%` });
    }
    return qb.orderBy('q.subjectCode', 'ASC').addOrderBy('q.id', 'ASC').getMany();
  }

  // 19. 교육과정 정보 수정 (수강료, 시간, 질환명, 요약 등)
  @Put('courses/:id')
  @RequirePermissions('COURSE_WRITE')
  async updateCourse(
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      summary?: string;
      price?: number;
      theoryHours?: number;
      practicalHours?: number;
      targetDisease?: string;
      qualificationName?: string;
    },
  ) {
    const course = await this.courseRepo.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException('교육과정을 찾을 수 없습니다.');
    }

    if (body.title !== undefined) course.title = body.title;
    if (body.summary !== undefined) course.summary = body.summary;
    if (body.price !== undefined) course.price = body.price;
    if (body.theoryHours !== undefined) course.theoryHours = body.theoryHours;
    if (body.practicalHours !== undefined) course.practicalHours = body.practicalHours;
    if (body.targetDisease !== undefined) course.targetDisease = body.targetDisease;
    if (body.qualificationName !== undefined) course.qualificationName = body.qualificationName;

    const saved = await this.courseRepo.save(course);
    return { success: true, message: '교육과정 정보가 수정되었습니다.', course: saved };
  }

  // 20. 신규 시험 문제 등록
  @Post('exam-questions')
  @RequirePermissions('COURSE_WRITE')
  async createExamQuestion(
    @Body()
    body: {
      subjectCode: string;
      title: string;
      scenario?: string;
      points?: number;
      options: { no: number; text: string }[];
      correctAnswer: string;
      explanation: string;
      terminologyTags?: string[];
      categoryId?: number;
    },
  ) {
    const question = this.examQuestionRepo.create({
      ...body,
      points: body.points || 10,
      terminologyTags: body.terminologyTags || [],
      isReviewedByClinician: true,
    });
    const saved = await this.examQuestionRepo.save(question);
    return { success: true, message: '신규 문제가 문제은행에 등록되었습니다.', question: saved };
  }

  // 21. 시험 문제 수정
  @Put('exam-questions/:id')
  @RequirePermissions('COURSE_WRITE')
  async updateExamQuestion(
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      scenario?: string;
      points?: number;
      options?: { no: number; text: string }[];
      correctAnswer?: string;
      explanation?: string;
      terminologyTags?: string[];
    },
  ) {
    const question = await this.examQuestionRepo.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException('문제를 찾을 수 없습니다.');
    }

    if (body.title !== undefined) question.title = body.title;
    if (body.scenario !== undefined) question.scenario = body.scenario;
    if (body.points !== undefined) question.points = body.points;
    if (body.options !== undefined) question.options = body.options;
    if (body.correctAnswer !== undefined) question.correctAnswer = body.correctAnswer;
    if (body.explanation !== undefined) question.explanation = body.explanation;
    if (body.terminologyTags !== undefined) question.terminologyTags = body.terminologyTags;

    const saved = await this.examQuestionRepo.save(question);
    return { success: true, message: '문제 정보가 수정되었습니다.', question: saved };
  }

  // 22. 시험 문제 삭제
  @Delete('exam-questions/:id')
  @RequirePermissions('COURSE_WRITE')
  async deleteExamQuestion(@Param('id') id: string) {
    const question = await this.examQuestionRepo.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException('문제를 찾을 수 없습니다.');
    }
    await this.examQuestionRepo.delete(id);
    return { success: true, id, message: '문제가 문제은행에서 성공적으로 삭제되었습니다.' };
  }

  // 23. 상담 문의 삭제
  @Delete('inquiries/:id')
  @RequirePermissions('COUNSEL_HANDLE')
  async deleteInquiry(@Param('id') id: string) {
    const inq = await this.inquiryRepo.findOne({ where: { id } });
    if (!inq) {
      throw new NotFoundException('문의를 찾을 수 없습니다.');
    }
    await this.inquiryRepo.delete(id);
    return { success: true, id, message: '문의 내역이 삭제되었습니다.' };
  }

  // 24. 결제 취소 및 수강 취소 처리
  @Post('payments/:id/cancel')
  @RequirePermissions('PAYMENT_CONFIRM')
  async cancelPayment(@Param('id') paymentId: string) {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: ['enrollment'],
    });

    if (!payment) {
      throw new NotFoundException('결제 정보를 찾을 수 없습니다.');
    }

    payment.status = 'CANCELED';
    await this.paymentRepo.save(payment);

    if (payment.enrollment) {
      await this.enrollmentRepo.update(payment.enrollment.id, {
        status: 'CANCELED',
      });
    }

    return {
      success: true,
      message: '결제 및 수강 신청이 취소 처리되었습니다.',
      payment,
    };
  }
}
