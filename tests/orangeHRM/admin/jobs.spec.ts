import { test, expect } from '@playwright/test'
import { loginOrangeHRM } from '../helper/auth.helper'
import path from 'path'

test.describe('Navigate to Admin Menu', () => {
    test.beforeEach(async ({ page }) => {
        await loginOrangeHRM(page);

        await page.getByRole('link', { name: 'Admin' }).click();
        await expect(page).toHaveURL(/admin/)

        await page.getByText('Job', { exact: true }).click();
        await page.getByRole('menuitem', { name: 'Job Titles'}).click();
    })

    test('Test-001: Go to Job List', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Job Titles'})).toBeVisible();
    })

    test('Test-002: Add Job Titles', async ({ page }) => {

        await page.getByRole('button', { name: 'Add' }).click();
        await expect(page).toHaveURL(/saveJobTitle/);

        //fill Job Title
        const jobTitleInput = page
        .locator('.oxd-input-group')
        .filter({ hasText: 'Job Title'})
        .locator('input');

        await expect(jobTitleInput).toBeVisible();
        await expect(jobTitleInput).toBeEditable();
        await jobTitleInput.fill('QA tapi BA');

        //fill Job Description
        const jobDescriptionInput = page
        .locator('.oxd-input-group')
        .filter({ hasText: 'Job Description'})
        .locator('textarea')

        await expect(jobDescriptionInput).toBeVisible();
        await expect(jobDescriptionInput).toBeEditable();
        await jobDescriptionInput.fill('Bekerja sepenuh hati')

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
        const assertJobTitles = page.getByRole('row').filter({ hasText: 'QA tapi BA'})
        
        await expect(assertJobTitles).toBeVisible();
        await expect(assertJobTitles).toContainText('Bekerja sepenuh hati');

    })
})