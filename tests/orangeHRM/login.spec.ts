import { test, expect, Page } from'@playwright/test';

async function loginOrangeHRM(page: Page) {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
}

test.describe('Login Feature OrangeHRM with helper', () => {
    test ('Login with valid credentials', async ({ page }) => {

        await loginOrangeHRM(page);
        //Assertions
        await expect(page).toHaveURL(/dashboard/);
        await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    })

    test('Login with invalid Credentials', async ({ page }) => {
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
        await page.getByRole('textbox', { name: 'Password'}).fill('wrong123');
        await page.getByRole('button', { name: 'Login' }).click();
        
        //Assertions
        await expect(page.getByText('Invalid Credentials')).toBeVisible();
    })
    
})