import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(30013),
  API_PREFIX: Joi.string().default('/api/v1'),
  CORS_ORIGINS: Joi.string().default('*'),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_SSL: Joi.boolean().default(false),
  DB_SYNCHRONIZE: Joi.boolean().default(false),

  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('14d'),
  BCRYPT_COST: Joi.number().default(10),

  PII_ENCRYPTION_KEY: Joi.string().optional(),
  HMAC_SECRET: Joi.string().optional(),
  CERT_QR_BASE_URL: Joi.string().default('http://localhost:30010/verify'),

  SEED_SUPER_ADMIN_LOGIN_ID: Joi.string().default('admin'),
  SEED_SUPER_ADMIN_PASSWORD: Joi.string().default('admin1234!'),
  SEED_SUPER_ADMIN_NAME: Joi.string().default('시스템관리자'),
  SEED_SUPER_ADMIN_PHONE: Joi.string().default('010-0000-0000'),
  SEED_DEMO_DATA: Joi.boolean().default(false),

  SWAGGER_ENABLED: Joi.boolean().default(true),
});
