import { test, expect } from '@playwright/test';
import { generateUniqueString } from '../../../utils/testData';

let createdUsername: string;

test.describe('Navigate to Admin Menu', () => {
    test.describe.configure({ mode: 'serial' })
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

    test('Test-002: Add User Management', async ({ page }) => {
        await page.getByRole('button', { name: 'Add' }).click();
        await expect(page.getByText('Add User')).toBeVisible();

        //Pick User Role
        const userRole = page
        .locator('.oxd-input-group')
        .filter({ 
        has: page.locator('label', { hasText: 'User Role'})})
        
        const userRoleDropdown = userRole.locator('.oxd-select-wrapper');
        await userRoleDropdown.click();
        await page
        .getByRole('listbox')
        .getByText('Admin', { exact: true })
        .click();

        //Autocomplete search Employee Name
        const inputEmployeeName = page
        .getByPlaceholder('Type for hints...')
        await expect(inputEmployeeName).toBeVisible();
        await expect(inputEmployeeName).toBeEditable();
        await inputEmployeeName.fill('manda')

        const suggestionName = page
        .locator('div.oxd-autocomplete-option')
        .filter({ hasText: 'manda akhil user'});
        await expect(suggestionName).toBeVisible({ timeout: 3000 });
        await suggestionName.click();
        await expect(inputEmployeeName).toHaveValue('manda akhil user');

        //Pick Status
        const statusFilterContainer = page
        .locator('.oxd-input-group')
        .filter({ has: page.locator('label',
            { hasText: 'Status'}
        )})

        const statusDropdown = statusFilterContainer.locator('.oxd-select-wrapper');
        await statusDropdown.click();
        await page
        .getByRole('listbox')
        .getByText('Enabled', { exact: true })
        .click();

        //Fill Username
        const usernameInput = page
        .locator('.oxd-input-group')
        .filter({ hasText: /^Username$/ })
        .locator('input');

        createdUsername = generateUniqueString('Batman');
        await expect(usernameInput).toBeVisible();
        await expect(usernameInput).toBeEditable();
        await usernameInput.fill(createdUsername);

        //Fill Password
        const passwordInput = page
        .locator('.oxd-input-group')
        .filter({ hasText: /^Password$/ })
        .locator('input[type="password"]');

        await expect(passwordInput).toBeVisible();
        await expect(passwordInput).toBeEditable();
        await passwordInput.fill('Admin123!@');

        //Fill Confirm Password
        const confirmPasswordInput = page
        .locator('.oxd-input-group')
        .filter({ hasText: /^Confirm Password$/ })
        .locator('input[type="password"]');

        await expect(confirmPasswordInput).toBeVisible();
        await expect(confirmPasswordInput).toBeEditable();
        await confirmPasswordInput.fill('Admin123!@');

        //Click button Save
        await page.getByRole('button', {name: 'Save'}).click();

        //Assertions
        const tableUser = page
        .getByRole('row')
        .filter({ hasText: createdUsername })
        await expect(tableUser).toBeVisible();
        await expect(tableUser).toContainText(createdUsername);
        
    })

    test('Test-003: Search User on User Management', async ({ page }) => {
        const usernameInput = page
        .locator('.oxd-input-group')
        .filter({ hasText: /^Username$/ })
        .locator('input');

        await expect(usernameInput).toBeVisible();
        await expect(usernameInput).toBeEditable();
        await usernameInput.fill(createdUsername)
    

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
        await inputEmployeeName.fill('manda')

        const suggestion = page
        .locator('div.oxd-autocomplete-option')
        .filter({ hasText: 'manda akhil user'})

        await expect(suggestion).toBeVisible({ timeout: 5000 });
        await suggestion.click();
        await expect(inputEmployeeName).toHaveValue('manda akhil user');

        //Pick Status
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
        .filter({ hasText: createdUsername })

        await expect(tableRowEmployeeName).toBeVisible();
        await expect(tableRowEmployeeName).toContainText(createdUsername);

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

    test('Test-004: Try Job Filter', async ({ page }) => {
        await page.getByText('Job', { exact: true }).click();
        await page.getByRole('menuitem', { name: 'Job Titles '}).click();

        await expect(page).toHaveURL(/viewJobTitleList/);
        await expect(page.getByRole('heading', ({ name: 'Job Titles'}))).toBeVisible();
    })
})