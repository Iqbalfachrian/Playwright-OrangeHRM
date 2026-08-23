import { test, expect } from '@playwright/test';

test('test Orange HRM', async ({ page }) => {
  // Recording...
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
  
  await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
  await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123')
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

  await page.getByRole('button', { name: 'Login' }).click()
  await expect(page).toHaveURL(/dashboard/);

  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page).toHaveURL(/admin/);
  await page.getByRole('heading', { name: 'System Users' }).click();
  await page.getByRole('textbox').nth(1)
  await expect(page.getByRole('textbox').nth(1)).toBeVisible();
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).fill('gotya');
  await expect(page.getByRole('textbox', { name: 'Type for hints...' })).toBeVisible();
  // await page.getByRole('textbox', { name: 'Type for hints...' }).click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).fill('Test API User');
  await page.getByText('Test API User').first().click();
  await page.getByRole('button', { name: 'Search' }).click();
  
});