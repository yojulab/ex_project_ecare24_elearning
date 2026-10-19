import { IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: '아이디(또는 휴대폰번호)를 입력해 주세요.' })
  @IsString()
  loginId: string;

  @IsNotEmpty({ message: '비밀번호를 입력해 주세요.' })
  @IsString()
  password: string;
}

export class SignupDto {
  @IsNotEmpty({ message: '로그인 아이디(또는 휴대폰번호)를 입력해 주세요.' })
  @IsString()
  loginId: string;

  @IsNotEmpty({ message: '성명을 입력해 주세요.' })
  @IsString()
  fullName: string;

  @IsNotEmpty({ message: '휴대폰번호를 입력해 주세요.' })
  @IsString()
  phoneNumber: string;

  @IsNotEmpty({ message: '비밀번호를 입력해 주세요.' })
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
  password: string;

  @IsOptional()
  email?: string;
}

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'Refresh 토큰이 필요합니다.' })
  @IsString()
  refreshToken: string;
}
