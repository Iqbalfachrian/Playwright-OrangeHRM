import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testIgnore:[
    '**/iseng/**',
    '**/Sauce Demo/**',
    '**/node_modules/**'
  ],
  timeout: 120_000,
  expect: { timeout: 30_000 },
  use: {
    headless: true,
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    launchOptions: {
      //slowMo: 1000,
    },
    actionTimeout: 20_000,
    navigationTimeout: 60_000,
    trace: 'on-first-retry',
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: [/.*\.setup\.ts/, /.*login\.spec\.ts/],
    },
    // Login test : fresh browser tanpa storage state
    {
      name: 'login-tests',
      use: {
        ...devices['Desktop Chrome'],
      },
      testMatch: /.*login\.spec\.ts/, //hanya jalankan file yang namanya login.spec.ts
      dependencies: [], //tidak perlu tunggu setup karena dia mau test login dari nol
    }

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
