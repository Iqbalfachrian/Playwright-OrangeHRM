import { test, expect } from '@playwright/test'
import { loginOrangeHRM } from '../helper/auth.helper'
import path from 'path'

test.describe('Navigate to PIM Menu', () => {
    test.beforeEach(async ({ page }) => {
        await loginOrangeHRM(page);

        await page.getByRole('link', { name: 'PIM'}).click();
        await expect(page).toHaveURL(/viewEmployeeList/);
    })

    test('Test-001: Go to Add Employee', async ({ page }) => {
        await page.getByRole('link', { name: 'Add Employee' }).click();
        await expect(page).toHaveURL(/addEmployee/)
    })

    test('Test-002: Add New Employee', async ({ page }) => {
        await page.getByRole('link', { name: 'Add Employee' }).click();
        await expect(page).toHaveURL(/addEmployee/)

        //Add Employee
        await page.getByRole('textbox', { name: 'First Name'}).fill('Yier');
        await page.getByRole('textbox', { name: 'Middle Name'}).fill('and');
        await page.getByRole('textbox', { name: 'Last Name'}).fill('Bubu');

        const employeeId = page
        .locator('.oxd-grid-item')
        .filter({ hasText: 'Employee Id'})
        .locator('input');

        await expect(employeeId).toBeVisible();
        await expect(employeeId).toBeEditable();
        await employeeId.fill('0001');

        await page.getByRole('button', { name: 'Save' }).click();

       // Assert successfully add new employee
        const toastTitleNotif = page
        .locator('.oxd-text--toast-title')
        await expect(toastTitleNotif).toBeVisible();
        await expect(toastTitleNotif).toContainText('Success');

        const toastTitleMessage = page
        .locator('.oxd-text--toast-message')
        await expect(toastTitleMessage).toBeVisible();
        await expect(toastTitleMessage).toContainText('Successfully Saved');
        await expect(toastTitleMessage).toBeVisible({ timeout: 3000});

        //next actions: fill personal details
        await expect(page).toHaveURL(/viewPersonalDetails/);

        //Driver License
        const driverLicense = page
        .locator('.oxd-input-group')
        .filter({
            has: page.locator('label', { hasText: "Driver's License Number" })
        });

        const fillDriverLicense = driverLicense.locator('.oxd-input--active')
        await fillDriverLicense.fill('123456789');

        const datePicker = page
        .locator('.oxd-input-group')
        .filter({ 
            has: page.locator('label', {hasText: 'License Expiry Date'})
        });

        const pickDate = datePicker.locator('.oxd-input');
        await expect(pickDate).toBeVisible();
        await expect(pickDate).toBeEditable();
        await pickDate.fill('2028-10-10')

        //Nationality
        const nationality = page
        .locator('.oxd-input-group')
        .filter({
            has: page.locator('label', {hasText: 'Nationality'})
        })

        const pickNationality = nationality.locator('.oxd-select-text');
        await pickNationality.click();
        await page
        .getByRole('listbox')
        .getByText('Indonesian', { exact: true})
        .click()    


        //Marital Status
        const maritalStatus = page
        .locator('.oxd-input-group')
        .filter({ 
            has: page.locator('label', {hasText: 'Marital Status'})
        })

        const pickMaritialStatus = maritalStatus.locator('.oxd-select-wrapper');
        await pickMaritialStatus.click();
        await page
        .getByRole('listbox')
        .getByText('Single', { exact: true})
        .click();

        //Pick Gender
        const gender = page
        .locator('.oxd-input-group')
        .filter({
            has: page.locator('label', {hasText: 'Gender'})
        })

        const pickGender = gender.locator('.oxd-radio-wrapper')
        .filter({
          has: page.locator('label', { hasText: /^Male$/})  
        })
        await pickGender.click();
        await expect(gender.getByRole('radio', { name: /^Male$/})).toBeChecked();

        //klik button save
        await page
        .locator('form').filter({ hasText: 'Employee Full NameEmployee'})
        .getByRole('button').click();

        // const toastPersonalDetails = page
        // .locator('.oxd-text--toast-message')
        // await expect(toastPersonalDetails).toBeVisible();
        // await expect(toastPersonalDetails).toContainText('Successfully Saved');
        // await expect(toastPersonalDetails).toBeVisible({ timeout: 3000});

        await page.getByRole('link', { name: 'Employee List'}).click();
        await expect(page).toHaveURL(/viewEmployeeList/);
        
    })
})