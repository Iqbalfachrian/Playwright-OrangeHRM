import { test as setup } from '@playwright/test';
import dotenv from 'dotenv';
import { LoginPage } from '../../pages/LoginPage';

dotenv.config();
//Tentukan path file storage state
const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
    
    const username = process.env.ORANGEHRM_USER!;
    const password = process.env.ORANGEHRM_PASSWORD!;

    //Before POM
    // await page.goto('/web/index.php/auth/login');
    // await page.getByRole('textbox', {name: 'Username'}).fill(username);
    // await page.getByRole('textbox', {name: 'Password'}).fill(password)
    // await page.getByRole('button', {name:'Login'}).click();
    // await expect(page).toHaveURL(/dashboard/);

    //After POM
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(username, password);
    await loginPage.expectOnDashboard();

//Save ke storage state
await page.context().storageState({ path: authFile });
})