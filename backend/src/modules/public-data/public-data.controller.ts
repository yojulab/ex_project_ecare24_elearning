import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Public } from '../../common/decorators';
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

@Public()
@Controller()
export class PublicDataController {
  constructor(
    @InjectRepository(DiseaseCategoryEntity)
    private diseaseRepo: Repository<DiseaseCategoryEntity>,
    @InjectRepository(GoldenRuleEntity)
    private goldenRuleRepo: Repository<GoldenRuleEntity>,
    @InjectRepository(CaregiverTermEntity)
    private termRepo: Repository<CaregiverTermEntity>,
    @InjectRepository(CourseEntity)
    private courseRepo: Repository<CourseEntity>,
    @InjectRepository(CourseVideoEntity)
    private videoRepo: Repository<CourseVideoEntity>,
    @InjectRepository(NoticeEntity)
    private noticeRepo: Repository<NoticeEntity>,
    @InjectRepository(PopupNoticeEntity)
    private popupRepo: Repository<PopupNoticeEntity>,
    @InjectRepository(SystemSettingEntity)
    private settingRepo: Repository<SystemSettingEntity>,
    @InjectRepository(ExamQuestionEntity)
    private examQuestionRepo: Repository<ExamQuestionEntity>,
  ) {}

  @Get('disease-categories')
  async getDiseaseCategories() {
    return this.diseaseRepo.find({
      where: { isActive: true },
      order: { displayOrder: 'ASC' },
    });
  }

  @Get('golden-rules')
  async getGoldenRules() {
    return this.goldenRuleRepo.find({
      where: { isActive: true },
      order: { ruleNo: 'ASC' },
    });
  }

  @Get('caregiver-terms')
  async getCaregiverTerms(@Query('q') q?: string) {
    const qb = this.termRepo.createQueryBuilder('term');
    if (q) {
      qb.where('term.term LIKE :q OR term.standardTerm LIKE :q OR term.definition LIKE :q', {
        q: `%${q}%`,
      });
    }
    return qb.orderBy('term.id', 'ASC').getMany();
  }

  @Get('courses')
  async getCourses() {
    return this.courseRepo.find({
      where: { isPublished: true, isActive: true },
      relations: ['category', 'steps', 'videos'],
      order: { courseType: 'ASC', theoryHours: 'DESC' },
    });
  }

  @Get('courses/:id')
  async getCourseById(@Param('id') id: string) {
    return this.courseRepo.findOne({
      where: { id },
      relations: ['category', 'steps', 'videos'],
    });
  }

  @Get('courses/:id/videos')
  async getCourseVideos(@Param('id') id: string) {
    return this.videoRepo.find({
      where: { courseId: id, isActive: true },
      order: { displayOrder: 'ASC' },
    });
  }

  @Get('videos')
  async getAllVideos() {
    return this.videoRepo.find({
      where: { isActive: true },
      relations: ['course'],
      order: { displayOrder: 'ASC' },
    });
  }

  @Get('notices')
  async getNotices() {
    return this.noticeRepo.find({
      where: { isPublished: true },
      order: { isPinned: 'DESC', createdAt: 'DESC' },
    });
  }

  @Get('notices/:id')
  async getNoticeById(@Param('id') id: string) {
    await this.noticeRepo.increment({ id }, 'viewCount', 1);
    return this.noticeRepo.findOne({ where: { id } });
  }

  @Get('popups/active')
  async getActivePopups(@Query('channel') channel?: 'web' | 'mobile') {
    const now = new Date();
    const qb = this.popupRepo
      .createQueryBuilder('popup')
      .where('popup.isActive = TRUE')
      .andWhere('popup.startsAt <= :now', { now })
      .andWhere('popup.endsAt >= :now', { now });

    if (channel === 'mobile') {
      qb.andWhere('popup.showOnMobile = TRUE');
    } else {
      qb.andWhere('popup.showOnWeb = TRUE');
    }

    return qb.orderBy('popup.priority', 'DESC').getMany();
  }

  @Get('exam-questions')
  async getExamQuestions(@Query('categoryId') categoryId?: string) {
    const qb = this.examQuestionRepo.createQueryBuilder('q');
    if (categoryId) {
      qb.where('q.categoryId = :categoryId', { categoryId: Number(categoryId) });
    }
    const questions = await qb.orderBy('q.createdAt', 'ASC').getMany();
    // 프론트엔드 시험 응시 화면 전달용 (정답 필드 포함 또는 해설과 함께 제공)
    return questions;
  }

  @Post('exams/submit')
  async submitExam(
    @Body()
    body: {
      answers: Record<string, number>;
      applicantName?: string;
      courseId?: string;
      courseTitle?: string;
    },
  ) {
    const allQuestions = await this.examQuestionRepo.find();
    const answeredKeys = Object.keys(body.answers || {});
    // 제출된 문항 ID에 해당하는 문항들만 평가 대상으로 선정 (최소 1문항 이상)
    const targetQuestions = answeredKeys.length > 0
      ? allQuestions.filter((q) => answeredKeys.includes(q.id))
      : allQuestions.slice(0, 5);

    let correctCount = 0;
    const details = targetQuestions.map((q) => {
      const selected = body.answers?.[q.id];
      const isCorrect = selected !== undefined && String(selected) === String(q.correctAnswer);
      if (isCorrect) correctCount += 1;
      return {
        id: q.id,
        title: q.title,
        selectedAnswer: selected || null,
        correctAnswer: Number(q.correctAnswer),
        isCorrect,
        explanation: q.explanation,
        terminologyTags: q.terminologyTags,
      };
    });

    const totalQuestions = targetQuestions.length || 1;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const isPassed = score >= 60;

    const applicant = body.applicantName || '박순자';
    const courseTitle = body.courseTitle || '신경계 질환 전문간병사 1급';
    const now = new Date();
    const issueDateStr = now.toISOString().split('T')[0];
    const expiryDate = new Date(now);
    expiryDate.setFullYear(expiryDate.getFullYear() + 2);
    const expiryDateStr = expiryDate.toISOString().split('T')[0];

    const certNo = `EC24-${now.getFullYear()}-NEURO-${Math.floor(Math.random() * 90000 + 10000)}`;

    return {
      success: true,
      score,
      isPassed,
      correctCount,
      totalQuestions,
      grade: score >= 90 ? '최우수 (특급)' : score >= 80 ? '우수 (1급)' : score >= 60 ? '합격' : '과락 (재응시 필요)',
      details,
      certificate: isPassed
        ? {
            registryNo: certNo,
            qualificationName: courseTitle,
            applicantName: applicant,
            birthDate: '1965.04.12',
            score,
            issuedAt: issueDateStr,
            expiresAt: expiryDateStr,
            agency: '한국돌봄종사자양성교육원',
            pqiRegNo: '한국직업능력연구원(pqi.or.kr) 제2026-0814호',
            qrVerifyToken: `VERIFY-${certNo}`,
          }
        : null,
    };
  }

  @Get('settings/public')
  async getPublicSettings() {
    const settings = await this.settingRepo.find({ where: { isPublic: true } });
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return map;
  }
}
