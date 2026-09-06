import { Page, expect } from '@playwright/test';
import dotenv from 'dotenv'; 
dotenv.config();

export async function login(page: Page, username?: string, password?: string) {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    const user = username || process.env.ORANGEHRM_USERNAME!;
    const pass = password || process.env.ORANGEHRM_PASSWORD!;

    await page.goto('/web/index.php/auth/login');

    await page.getByRole('textbox', { name: 'Username'}).fill(user);
    await page.getByRole('textbox', { name: 'Password'}).fill(pass);

    await page.getByRole('button', { name: 'Login' }).click();

    //assertions
    await expect(page).toHaveURL(/dashboard/);

}