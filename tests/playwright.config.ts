import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './specs',
  timeout: 30 * 1000,
  fullyParallel: false,
  reporter: [['html', { outputFolder: 'reports' }], ['list']],
  use: {
    headless: process.env.PLAYWRIGHT_HEADLESS !== 'false',
    launchOptions: {
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    },
    trace: 'on-first-retry',
    screenshot: 'on',
  },
  projects: [
    {
      name: 'User Web (Desktop Chrome)',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        baseURL: process.env.PLAYWRIGHT_USER_BASE_URL || 'http://localhost:30010',
      },
    },
    {
      name: 'Admin Callcenter Web (Desktop Chrome)',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        baseURL: process.env.PLAYWRIGHT_ADMIN_BASE_URL || 'http://localhost:30011',
      },
    },
    {
      name: 'Mobile App View (Pixel 7)',
      use: {
        ...devices['Pixel 7'],
        baseURL: process.env.PLAYWRIGHT_MOBILE_BASE_URL || 'http://localhost:30012',
      },
    },
  ],
});
