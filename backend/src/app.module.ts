import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import * as path from 'path';
import * as net from 'net';
import configuration from './config/configuration';
import { envValidationSchema } from './config/env.validation';
import * as entities from './database/entities';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { PublicDataModule } from './modules/public-data/public-data.module';
import { MeModule } from './modules/me/me.module';
import { AdminModule } from './modules/admin/admin.module';

function probeSocket(host: string, port: number, timeoutMs = 400): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function resolveDatabaseHost(
  configuredHost: string,
  port: number = 5432,
  isProd: boolean = false,
): Promise<string> {
  // 1순위: 설정된 호스트 빠른 연결 검증
  if (configuredHost && (await probeSocket(configuredHost, port))) {
    return configuredHost;
  }

  // 2순위: 환경별 후보군 탐색
  const candidates = isProd
    ? ['external_project_db_postgres', 'graphrag_agent_db_postgres', '127.0.0.1', 'localhost']
    : ['graphrag_agent_db_postgres', 'external_project_db_postgres', '127.0.0.1', 'localhost'];

  for (const host of candidates) {
    if (host !== configuredHost && (await probeSocket(host, port))) {
      console.log(`📡 [TypeORM] PostgreSQL 자동 감지 연결: ${host}:${port} (설정값: ${configuredHost})`);
      return host;
    }
  }

  return configuredHost || (isProd ? 'external_project_db_postgres' : 'graphrag_agent_db_postgres');
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.resolve(__dirname, '../.env'),
        path.resolve(process.cwd(), 'backend/.env'),
        path.resolve(process.cwd(), '.env'),
      ],
      load: [configuration],
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const configuredHost = configService.get<string>('database.host');
        const port = configService.get<number>('database.port') || 5432;
        const isProd = configService.get<string>('nodeEnv') === 'production';
        const host = await resolveDatabaseHost(configuredHost, port, isProd);

        return {
          type: 'postgres',
          host,
          port,
          database: configService.get<string>('database.database'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          ssl: configService.get<boolean>('database.ssl'),
          entities: Object.values(entities),
          synchronize: false, // DDL 스크립트/마이그레이션 우선
          logging: !isProd ? ['error', 'warn'] : false,
        };
      },
    }),
    AuthModule,
    PublicDataModule,
    MeModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
