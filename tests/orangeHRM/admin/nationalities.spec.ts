import { test, expect } from '@playwright/test';

test.describe('Navigate to Admin Menu', () => {
    test.beforeEach(async ({ page }) => {
          await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers')
        await expect(page).toHaveURL(/admin/) 
    })

    test('Test-001: Select Nationalities Sub Menu', async ({ page }) => {
        await page.getByRole('link', { name: 'Nationalities '}).click();

        await expect(page).toHaveURL(/nationality/);
        await expect(page.getByRole('heading', { name: 'Nationalities' })).toBeVisible();
        
    //     // const mainTitle = page.locator('.oxd-text--h6')
    //     // await expect(mainTitle).toContainText('Nationalities')
    })

    test('Test-002: Add Nationalities Positive', async ({ page }) => {
        await page.getByRole('link', { name: 'Nationalities '}).click();
        await expect(page).toHaveURL(/nationality/);

        await page.getByRole('button', { name: 'Add '}).click();

        await expect(page.getByText('Add Nationality')).toBeVisible();
        await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/admin/saveNationality');

        const nameInput = page
        .locator('.oxd-input-group')
        .filter({ hasText: 'Name'})
        .locator('input');

        await expect(nameInput).toBeVisible();
        await nameInput.fill('Meikarta')

        await page.getByRole('button', { name: 'Save'}).click();

        //Assertions
        await expect(page).toHaveURL(/nationality/);
        await expect(page.getByRole('heading', { name: 'Nationalities' })).toBeVisible();
    })

    test('Test-003: Add Nationalities Negative', async ({ page }) => {
        await page.getByRole('link', { name: 'Nationalities '}).click()
        await expect(page).toHaveURL(/nationality/);

        await page.getByRole('button', { name: 'Add' }).click()
        await expect(page).toHaveURL(/saveNationality/)
        await expect(page.getByText('Add Nationality')).toBeVisible();

        const nameInput = page.locator('.oxd-input-group').filter({ hasText: 'Name' }).locator('input');

        await expect(nameInput).toBeVisible();
        await nameInput.fill('American');
        await expect(page.getByText('Already exists')).toBeVisible({ timeout: 5000 });

        //await page.waitForTimeout(3000)
        //console.log('Count Error message:', await page.getByText('Already exists').count());

        
    })
})