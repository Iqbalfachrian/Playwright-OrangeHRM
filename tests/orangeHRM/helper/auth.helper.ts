import { Page, expect } from '@playwright/test';

export async function loginOrangeHRM(page: Page) {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Username'}).fill('Admin');
    await page.getByRole('textbox', { name: 'Password'}).fill('admin123');

    await page.getByRole('button', { name: 'Login' }).click();

    //assertions
    await expect(page).toHaveURL(/dashboard/);

}