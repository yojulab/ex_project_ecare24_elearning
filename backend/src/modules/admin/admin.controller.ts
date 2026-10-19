import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
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
    // 기존 권한 삭제 후 신규 권한 등록
    await this.userPermRepo.delete({ userId });

    if (body.permissions && body.permissions.length > 0) {
      const permsToInsert = body.permissions.map((code) => ({
        userId,
        permissionCode: code,
        grantedBy: admin.id,
      }));
      await this.userPermRepo.save(permsToInsert);
    }

    // 사용자의 토큰 버전을 올려서 다음 요청 시 새 권한이 즉시 반영되도록 처리
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
}
