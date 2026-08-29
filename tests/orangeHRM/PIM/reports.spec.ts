import { test, expect } from '@playwright/test'
import { loginOrangeHRM } from '../helper/auth.helper'


test.describe('Navigate to PIM Menu', () => {
    test.beforeEach(async ({ page }) => {
        await loginOrangeHRM(page);

        await page.getByRole('link', { name: 'PIM'}).click();
        await expect(page).toHaveURL(/viewEmployeeList/);

        await page.getByRole('link', {name: 'Reports'}).click();
        await expect(page).toHaveURL(/viewDefinedPredefinedReports/)
    } )

    test('Test-001: Go to Reports and do search', async ({ page }) => {
        
        const reportName = page.getByPlaceholder('Type for Hints...');
        await expect(reportName).toBeVisible();
        await expect(reportName).toBeEditable();
        await reportName.fill('Employee Job Details');

        const suggestion = page
        .locator('div.oxd-autocomplete-wrapper')
        .filter({ hasText: 'Employee Job Details'});

        await expect(suggestion).toBeVisible({ timeout: 3000})
        await suggestion.click()
        await expect(reportName).toHaveValue('Employee Job Details');

        await page.getByRole('button', { name: 'Search'}).click();
        await expect(page.getByText('Employee Job Details')).toBeVisible();
    })

    test('Test-002: Add Employee Reports', async ({ page }) => {
        await page.getByRole('button', { name: 'Add'}).click();
        await expect(page).toHaveURL(/definePredefinedReport/);
        await expect(page.getByText('Add Report')).toBeVisible();

        //Add Report
        await page.getByRole('textbox', {name:'Type here ...'}).fill('Anang');

        const selectionCriteria = page
        .locator('.oxd-input-group')
        .filter({
            has: page.locator('label', {hasText: 'Selection Criteria'})
        })

        const pickCriteria = selectionCriteria.locator('.oxd-select-wrapper')
        await pickCriteria.click();
        await page
        .getByRole('listbox')
        .getByText('Employee Name', {exact: true})
        .click();

        const plusButton = page
        .locator('button:has(i.bi-plus)').first();
        await plusButton.click();

        //Fill autocomplete
        const employeeName = page.getByPlaceholder('Type for hints...')

        await expect(employeeName).toBeVisible();
        await expect(employeeName).toBeEditable();
        await employeeName.fill('Timothy')

        const targetOption = page.getByRole('option', { name: 'Timothy Lewis Amiano'})
        await expect(targetOption).toBeVisible({ timeout: 5000})
        await targetOption.click();
        await expect(employeeName).toHaveValue('Timothy Lewis Amiano');

        //Display Fields Group
        const groupDisplayFields = page
        .locator('.oxd-input-group')
        .filter({
            hasText: 'Select Display Field Group'
        })

        const pickDisplayFieldsbyGroup = groupDisplayFields.locator('.oxd-select-wrapper')
        await pickDisplayFieldsbyGroup.click()
        await page
        .getByRole('listbox')
        .getByText('Salary', {exact: true})
        .click();

        await expect(groupDisplayFields.locator('.oxd-select-text-input')).toContainText('Salary')



        //Select Display Field
        const labelSelectDisplayFields = page
        .locator('.oxd-input-group')
        .filter({
            hasText: 'Select Display Field'
        })

        const selectDisplayFields = labelSelectDisplayFields.locator('.oxd-select-wrapper')
        await selectDisplayFields.last().click();
        await page
        .getByRole('listbox')
        .getByText('Amount', {exact: true})
        .click();
        
        await expect(labelSelectDisplayFields.locator('.oxd-select-text-input').last()).toContainText('Amount');

        //Save reports
        await page.getByRole('button', {name: 'Save'}).click()
    })
})