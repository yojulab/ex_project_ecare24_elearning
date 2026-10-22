import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/entities';

export interface JwtPayload {
  sub: string;
  loginId: string;
  userType: 'STUDENT' | 'STAFF';
  tokenVersion: number;
  permissions: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessSecret'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('유효하지 않거나 비활성화된 계정입니다.');
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('세션이 만료되었습니다. 다시 로그인해 주세요.');
    }

    return {
      id: user.id,
      loginId: user.loginId,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      userType: user.userType,
      status: user.status,
      permissions: payload.permissions || [],
    };
  }
}
