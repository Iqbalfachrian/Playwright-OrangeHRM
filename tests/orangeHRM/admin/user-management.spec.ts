import { test, expect } from '@playwright/test';


test.describe('Navigate to Admin Menu', () => {
    test.beforeEach(async ({ page }) => {

        await page.goto('/web/index.php/admin/viewSystemUsers')
        await expect(page).toHaveURL(/admin/)
    })

    test('Test-001: User open Admin Menu', async ({ page }) => {
        //Success Login with valid credentials

        const adminHeader = page.getByText('Admin').first();
        await expect(adminHeader).toBeVisible();

        const userManagementHeader = page.getByText('User Management').first();
        await expect(userManagementHeader).toBeVisible();

    })

    test('Test-002: Search User on User Management', async ({ page }) => {
        const usernameInput = page
        .locator('.oxd-input-group')
        .filter({ hasText: 'Username' })
        .locator('input');

        await expect(usernameInput).toBeVisible();
        await usernameInput.fill('John Connor')

        //Pick Role
        const statusFilterUser = page.locator('.oxd-input-group').filter({
            has: page.locator('label', { hasText: 'User Role'})
        })

        const userRoleDropdown = statusFilterUser.locator('.oxd-select-wrapper');

        await userRoleDropdown.click();
        await page
        .getByRole('listbox')
        .getByText('Admin', { exact: true})
        .click();

        //Autocomplete search Employee Name
        const inputEmployeeName = page.getByPlaceholder('Type for Hints..');

        await expect(inputEmployeeName).toBeVisible();
        await expect(inputEmployeeName).toBeEditable();
        await inputEmployeeName.fill('John')

        const suggestion = page
        .locator('div.oxd-autocomplete-option')
        .filter({ hasText: 'John Doe Admin'})

        await expect(suggestion).toBeVisible({ timeout: 5000 });
        await suggestion.click();
        await expect(inputEmployeeName).toHaveValue('John Doe Admin');

        const statusFilterContainer = page.locator('.oxd-input-group').filter({
            has: page.locator('label', { hasText: 'Status'})
        });

        const statusDropdown = statusFilterContainer.locator('.oxd-select-wrapper');

        await statusDropdown.click();
        await page
        .getByRole('listbox')
        .getByText('Enabled', { exact: true })
        .click();


        //button search
        await page.getByRole('button', { name: 'Search' }).click()
        
        //Assertions
        const tableRowEmployeeName = page
        .getByRole('row')
        .filter({ hasText: 'John Admin' })

        await expect(tableRowEmployeeName).toBeVisible();
        await expect(tableRowEmployeeName).toContainText('John Admin')

        // console.log(
        // 'ROW COUNT:',
        // await tableRowEmployeeName.count()
        // );

        // console.log(
        // 'ROW HTML:',
        // await tableRowEmployeeName.evaluate(
        //     el => el.outerHTML
        // )
        // );

        // const tableCells = tableRowEmployeeName.getByRole('cell');

        // console.log(
        // 'CELL COUNT:',
        // await tableCells.count()
        // );

        // console.log(
        // 'CELL TEXT:',
        // await tableCells.allInnerTexts()
        // );
    })

    test('Test-003: Try Job Filter', async ({ page }) => {
        await page.getByText('Job', { exact: true }).click();
        await page.getByRole('menuitem', { name: 'Job Titles '}).click();

        await expect(page).toHaveURL(/viewJobTitleList/);
        await expect(page.getByRole('heading', ({ name: 'Job Titles'}))).toBeVisible();
    })
})