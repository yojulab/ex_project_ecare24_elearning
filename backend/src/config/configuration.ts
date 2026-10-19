export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 30013,
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['*'],

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'ecare24',
    username: process.env.DB_USER || 'ecare24_app',
    password: process.env.DB_PASSWORD || 'ecare24_secret_2026',
    ssl: process.env.DB_SSL === 'true',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'default_jwt_access_secret_key_32_chars_min',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_jwt_refresh_secret_key_32_chars_min',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '14d',
    bcryptCost: parseInt(process.env.BCRYPT_COST, 10) || 10,
  },

  security: {
    piiKey: process.env.PII_ENCRYPTION_KEY,
    hmacSecret: process.env.HMAC_SECRET,
    certQrBaseUrl: process.env.CERT_QR_BASE_URL || 'http://localhost:30010/verify',
  },

  seed: {
    superAdminLoginId: process.env.SEED_SUPER_ADMIN_LOGIN_ID || 'admin',
    superAdminPassword: process.env.SEED_SUPER_ADMIN_PASSWORD || 'admin1234!',
    superAdminName: process.env.SEED_SUPER_ADMIN_NAME || '시스템관리자',
    superAdminPhone: process.env.SEED_SUPER_ADMIN_PHONE || '010-0000-0000',
    demoData: process.env.SEED_DEMO_DATA === 'true',
  },

  swaggerEnabled: process.env.SWAGGER_ENABLED !== 'false',
});
