import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 1. 글로벌 Prefix: /api/v1
  const apiPrefix = configService.get<string>('apiPrefix') || '/api/v1';
  app.setGlobalPrefix(apiPrefix.replace(/^\//, ''));

  // 2. Cookie Parser
  app.use(cookieParser());

  // 3. CORS
  const corsOrigins = configService.get<string[]>('corsOrigins');
  app.enableCors({
    origin: corsOrigins && corsOrigins[0] !== '*' ? corsOrigins : true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // 4. Global ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // 5. Swagger API 문서
  if (configService.get<boolean>('swaggerEnabled')) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('eCare24 이러닝 플랫폼 REST API')
      .setDescription(
        '한국돌봄종사자양성교육원(30010), 관리자/CS(30011), 모바일스마트러닝(30012) 통합 엔터프라이즈 RESTful API',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Access Token 입력 (Bearer <token>)',
          in: 'header',
        },
        'access-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = configService.get<number>('port') || 30013;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 [BACKEND] eCare24 REST API 서버가 시작되었습니다.`);
  console.log(`🌐 Base URL: http://localhost:${port}${apiPrefix}`);
  console.log(`📚 Swagger Docs: http://localhost:${port}/api/docs`);
}

bootstrap();
