import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import * as path from 'path';
import configuration from './config/configuration';
import { envValidationSchema } from './config/env.validation';
import * as entities from './database/entities';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { PublicDataModule } from './modules/public-data/public-data.module';
import { MeModule } from './modules/me/me.module';
import { AdminModule } from './modules/admin/admin.module';

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
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        database: configService.get<string>('database.database'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        ssl: configService.get<boolean>('database.ssl'),
        entities: Object.values(entities),
        synchronize: false, // DDL 스크립트/마이그레이션 우선
        logging: configService.get<string>('nodeEnv') === 'development' ? ['error', 'warn'] : false,
      }),
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
