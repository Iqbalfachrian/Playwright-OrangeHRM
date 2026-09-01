import { expect, test as setup } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

//Tentukan path file storage state
const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
    
    const username = process.env.ORANGEHRM_USER!;
    const password = process.env.ORANGEHRM_PASSWORD!;

    await page.goto('/web/index.php/auth/login');
    await page.getByRole('textbox', {name: 'Username'}).fill(username);
    await page.getByRole('textbox', {name: 'Password'}).fill(password)
    await page.getByRole('button', {name:'Login'}).click();

    await expect(page).toHaveURL(/dashboard/);

//Save ke storage state
await page.context().storageState({ path: authFile });
})