import { test, expect } from '@playwright/test'
import path from 'path'

test.describe('Navigate to Admin Menu', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/web/index.php/admin/viewSystemUsers')
        await expect(page).toHaveURL(/admin/)
    })

    test('Test-001: Go to Job List', async ({ page }) => {
        await page.getByText('Job', { exact: true }).click();
        await page.getByRole('menuitem', { name: 'Job Titles'}).click();

        await expect(page.getByRole('heading', { name: 'Job Titles'})).toBeVisible();
    })

    test('Test-002: Add Job Titles', async ({ page }) => {

        await page.getByText('Job', { exact: true }).click();
        await page.getByRole('menuitem', { name: 'Job Titles'}).click();

        await expect(page.getByRole('heading', { name: 'Job Titles'})).toBeVisible();

        await page.getByRole('button', { name: 'Add' }).click();
        await expect(page.getByText('Add Job Title')).toBeVisible();

        //fill Job Title
        const jobTitleInput = page
        .locator('.oxd-input-group')
        .filter({ hasText: 'Job Title'})
        .locator('input');

        await expect(jobTitleInput).toBeVisible();
        await expect(jobTitleInput).toBeEditable();
        await jobTitleInput.fill('Manual QA');

        //fill Job Description
        const jobDescriptionInput = page
        .locator('.oxd-input-group')
        .filter({ hasText: 'Job Description'})
        .locator('textarea')

        await expect(jobDescriptionInput).toBeVisible();
        await expect(jobDescriptionInput).toBeEditable();
        await jobDescriptionInput.fill('Bekerja setengah hati')

        //upload file
        const fileName = 'dummy.pdf'

        const filePath = path.resolve(__dirname, '../../../test-data', fileName);
        console.log('looking for a file:', filePath)

        const fileInput = page
        .locator('.oxd-input-group')
        .filter({ hasText: 'Job Specification'})
        .locator('input[type="file"]');
        
        await fileInput.setInputFiles(filePath)
        await expect(page.getByText(fileName)).toBeVisible();

        //fill notes
        const noteInput = page
        .locator('.oxd-input-group')
        .filter({ hasText: 'Note' })
        .locator('textarea');

        await expect(noteInput).toBeVisible();
        await expect(noteInput).toBeEditable();
        await noteInput.fill('Testing 12345');

        await(page.getByRole('button', { name: 'Save' })).click();

        //assert job titles & job description
        await expect(page).toHaveURL(/viewJobTitleList/);
        const assertJobTitles = page.getByRole('row').filter({ hasText: 'Manual QA'})
        
        await expect(assertJobTitles).toBeVisible();
        await expect(assertJobTitles).toContainText('Bekerja setengah hati');

    })

    test('Test-003: Edit Job', async ({ page }) => {

        await page.getByText('Job', { exact: true }).click();
        await page.getByRole('menuitem', { name: 'Job Titles'}).click();

        await expect(page.getByRole('heading', { name: 'Job Titles'})).toBeVisible();
        const targetRow = page.getByRole('row').filter({ hasText: 'Head of Support'})
        await expect(targetRow).toBeVisible();

        const clickCheckBox = targetRow.locator('.oxd-checkbox-input');
        await clickCheckBox.click();

        const editButton = targetRow.locator('button:has(i.bi-pencil-fill)');
        await editButton.click();

        await expect(page).toHaveURL(/saveJobTitle/);
        await page.waitForTimeout(1000);
        await expect(page.getByRole('heading', {name: 'Edit Job Title'})).toBeVisible();

        const jobTitleEdit = page
        .locator('.oxd-input-group')
        .filter({ hasText: 'Job Title'})
        .locator('input')

        await expect(jobTitleEdit).toBeVisible();
        await expect(jobTitleEdit).toBeEditable();
        await jobTitleEdit.fill('Lagi Testing Playwright');
        await page.getByRole('button', { name:'Save'}).click();

        await expect(jobTitleEdit).toHaveValue('Lagi Testing Playwright');

    })

    test('Test-004: Delete Job', async({ page }) => {
        await page.getByText('Job', { exact: true }).click();
        await page.getByRole('menuitem', { name: 'Job Titles'}).click();

        await expect(page.getByRole('heading', { name: 'Job Titles'})).toBeVisible();
        const targetRow = page.getByRole('row').filter({ hasText: 'rsjsrii' })
        await expect(targetRow).toBeVisible();

        const clickCheckbox = targetRow.locator('.oxd-checkbox-input');
        await expect(clickCheckbox).toBeVisible();

        const deleteButton = targetRow.locator('button:has(i.bi-trash)');
        await deleteButton.click();

        // const popUpTitle = page.getByText('Are you Sure?') 
        // await expect(popUpTitle).toBeVisible(); 
        // await expect(page.getByText('The selected record will be permanently deleted. Are you sure you want to continue?')).toBeVisible();

        const deletePopUp = page.locator('.oxd-dialog-sheet');
        await expect(deletePopUp).toContainText('Are you Sure?');
        await expect(deletePopUp).toContainText('The selected record will be permanently deleted. Are you sure you want to continue?')

        await page.getByRole('button', {name: 'Yes, Delete'}).click();

        //assert toast notif
        const assertNotif = page
        .locator('.oxd-text--toast-message')
        
        await expect(assertNotif).toBeVisible();
        await expect(assertNotif).toContainText('Successfully Deleted')
        await expect(assertNotif).toBeHidden({ timeout: 5000})

    })
})