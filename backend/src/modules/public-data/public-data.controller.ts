import { Controller, Get, Param, Query } from '@nestjs/common';
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
