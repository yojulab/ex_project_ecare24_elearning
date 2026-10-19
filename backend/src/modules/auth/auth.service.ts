import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserEntity, UserPermissionEntity, RefreshTokenEntity } from '../../database/entities';
import { LoginDto, SignupDto } from './dto/auth.dto';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserPermissionEntity)
    private userPermissionRepository: Repository<UserPermissionEntity>,
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.loginId = :loginId', { loginId: loginDto.loginId })
      .orWhere('user.phoneNumber = :phone', { phone: loginDto.loginId })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 일치하지 않습니다.');
    }

    if (user.status === 'LOCKED') {
      throw new UnauthorizedException('계정이 잠겨있습니다. 고객센터(1588-2424)로 문의하세요.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      await this.userRepository.increment({ id: user.id }, 'failedLoginCount', 1);
      throw new UnauthorizedException('아이디 또는 비밀번호가 일치하지 않습니다.');
    }

    // 로그인 성공: 실패 카운트 리셋 및 로그인 일시 갱신
    await this.userRepository.update(user.id, {
      failedLoginCount: 0,
      lastLoginAt: new Date(),
    });

    // 사용자의 행 단위 권한 목록 로드
    const userPerms = await this.userPermissionRepository.find({
      where: { userId: user.id },
    });
    const permissionCodes = userPerms.map((up) => up.permissionCode);

    // Access Token 생성
    const payload: JwtPayload = {
      sub: user.id,
      loginId: user.loginId,
      userType: user.userType,
      tokenVersion: user.tokenVersion,
      permissions: permissionCodes,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.accessSecret'),
      expiresIn: this.configService.get<string>('jwt.accessExpiresIn') || '15m',
    });

    // Refresh Token 생성 (랜덤 바이트)
    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const tokenHash = this.hashToken(rawRefreshToken);
    const refreshExpiresDays = 14;
    const expiresAt = new Date(Date.now() + refreshExpiresDays * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepository.save({
      userId: user.id,
      tokenHash,
      tokenVersion: user.tokenVersion,
      expiresAt,
      ipAddress,
      userAgent,
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      user: {
        id: user.id,
        loginId: user.loginId,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
        status: user.status,
        permissions: permissionCodes,
      },
    };
  }

  async refresh(rawRefreshToken: string) {
    if (!rawRefreshToken) {
      throw new BadRequestException('Refresh 토큰이 필요합니다.');
    }

    const tokenHash = this.hashToken(rawRefreshToken);
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { tokenHash },
      relations: ['user'],
    });

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('유효하지 않거나 만료된 세션입니다. 다시 로그인하세요.');
    }

    const user = storedToken.user;
    if (!user || user.status !== 'ACTIVE' || user.tokenVersion !== storedToken.tokenVersion) {
      throw new UnauthorizedException('세션이 유효하지 않습니다.');
    }

    // 기존 토큰 폐기 (회전)
    await this.refreshTokenRepository.update(storedToken.id, {
      revokedAt: new Date(),
    });

    // 권한 목록 다시 조회
    const userPerms = await this.userPermissionRepository.find({
      where: { userId: user.id },
    });
    const permissionCodes = userPerms.map((up) => up.permissionCode);

    const payload: JwtPayload = {
      sub: user.id,
      loginId: user.loginId,
      userType: user.userType,
      tokenVersion: user.tokenVersion,
      permissions: permissionCodes,
    };

    const newAccessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.accessSecret'),
      expiresIn: this.configService.get<string>('jwt.accessExpiresIn') || '15m',
    });

    const newRawRefreshToken = crypto.randomBytes(40).toString('hex');
    const newTokenHash = this.hashToken(newRawRefreshToken);
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepository.save({
      userId: user.id,
      tokenHash: newTokenHash,
      tokenVersion: user.tokenVersion,
      expiresAt,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRawRefreshToken,
      user: {
        id: user.id,
        loginId: user.loginId,
        fullName: user.fullName,
        userType: user.userType,
        permissions: permissionCodes,
      },
    };
  }

  async signup(dto: SignupDto) {
    const existing = await this.userRepository.findOne({
      where: [{ loginId: dto.loginId }, { phoneNumber: dto.phoneNumber }],
    });

    if (existing) {
      throw new ConflictException('이미 사용 중인 아이디 또는 휴대폰번호입니다.');
    }

    const cost = this.configService.get<number>('jwt.bcryptCost') || 10;
    const passwordHash = await bcrypt.hash(dto.password, cost);

    const user = await this.userRepository.save({
      loginId: dto.loginId,
      fullName: dto.fullName,
      phoneNumber: dto.phoneNumber,
      email: dto.email || null,
      passwordHash,
      userType: 'STUDENT',
      status: 'ACTIVE',
    });

    return {
      message: '회원가입이 완료되었습니다. 로그인해 주세요.',
      user: {
        id: user.id,
        loginId: user.loginId,
        fullName: user.fullName,
      },
    };
  }

  async logout(userId: string) {
    // 사용자의 토큰 버전을 올려서 기존 발급된 모든 세션을 일괄 무효화
    await this.userRepository.increment({ id: userId }, 'tokenVersion', 1);
    return { success: true, message: '로그아웃되었습니다.' };
  }
}
