import { expect, test as setup } from '@playwright/test'

//Tentukan path file storage state
const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    
    await page.getByRole('textbox', {name: 'Username'}).fill('Admin');
    await page.getByRole('textbox', {name:'Password'}).fill('admin123');
    await page.getByRole('button', {name:'Login'}).click();

    await expect(page).toHaveURL(/dashboard/);

//Save ke storage state
await page.context().storageState({ path: authFile });

})