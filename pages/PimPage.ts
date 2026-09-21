import { Page, Locator, expect } from '@playwright/test'

export class PimPage {
    readonly page: Page;

    //Definisi Locator
    readonly addEmployeeLink: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly employeeIdInput: Locator;
    readonly saveButton: Locator;

    //Personal Detail Locator
    readonly driverLicenseInput: Locator;
    readonly licenseExpiryDateInput: Locator;
    readonly nationalityDropdown: Locator;
    readonly maritalStatusDropdown: Locator;
    readonly genderMaleRadio: Locator;
    readonly personalDetailsSaveButton: Locator;
    readonly employeeListLink: Locator;

    //Toast Notification
    readonly toastTitle: Locator;
    readonly toastMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        //Inisialisasi Locator
        this.addEmployeeLink = page.getByRole('link', {name: 'Add Employee'});
        this.firstNameInput = page.getByRole('textbox', {name: 'First name'});
        this.lastNameInput = page.getByRole('textbox', {name: 'Last Name'});

        //Locator untuk employee ID
        this.employeeIdInput = page.locator('.oxd-grid-item')
        .filter({ hasText: 'Employee Id'})
        .locator('input');

        this.saveButton = page.getByRole('button', {name: 'Save'});

        //Personal Details
        this.driverLicenseInput = page
        .locator('.oxd-input-group')
        .filter({has: page.locator('label', {hasText: "Driver's License Number" })})
        .locator('.oxd-input--active');

        this.licenseExpiryDateInput = page
        .locator('.oxd-input-group')
        .filter({has: page.locator('label', {hasText:'License Expiry Date' })})
        .locator('.oxd-input');

        this.nationalityDropdown = page
        .locator('.oxd-input-group')
        .filter({has: page.locator('label', {hasText: 'Nationality' })})
        .locator('.oxd-select-text');

        this.maritalStatusDropdown = page
        .locator('.oxd-input-group')
        .filter({ has: page.locator('label', {hasText: 'Marital Status'})})
        .locator('.oxd-select-wrapper');

        this.genderMaleRadio = page
        .locator('.oxd-input-group')
        .filter({ has: page.locator('label', {hasText: 'Gender'})})
        .locator('label')
        .filter({ hasText: /^Male$/ })

        this.personalDetailsSaveButton = page
        .locator('form').filter({ hasText: 'Employee Full Name'})
        .getByRole('button');

        this.employeeListLink = page
        .getByRole('link', { name: 'Employee List' })

        //Toast
        this.toastTitle = page
        .locator('.oxd-text--toast-title');

        this.toastMessage = page
        .locator('.oxd-text--toast-message');
    }
        //** Method Action */
        async gotoAddEmployee() {
            await this.page.goto('/web/index.php/pim/viewEmployeeList', { waitUntil: 'commit' })
            await expect(this.addEmployeeLink).toBeVisible();
            await this.addEmployeeLink.click();
            await expect(this.page).toHaveURL(/addEmployee/)
        }

        async fillBasicInfo(firstName: string, lastName: string, employeeId: string) {
            await this.firstNameInput.fill(firstName);
            await this.lastNameInput.fill(lastName);
            await this.employeeIdInput.fill(employeeId);
        }

        async clickSave() {
            await this.saveButton.click()
        }

        async fillPersonalDetails(driverLicense: string, expiryDate: string) {
            await this.driverLicenseInput.fill(driverLicense);
            await this.licenseExpiryDateInput.fill(expiryDate);
        }

        async selectNationality(nationality: string) {
            await this.nationalityDropdown.click();
            await this.page.getByRole('listbox').getByText(nationality, {exact: true}).click();
        }

        async selectMaritalStatus(status: string){
            await this.maritalStatusDropdown.click();
            await this.page.getByRole('listbox').getByText(status, {exact: true}).click();
        }

        async selectGenderMale() {
            await this.genderMaleRadio.click()
        }

        async savePersonalDetails() {
            await this.personalDetailsSaveButton.click()
        }

        async gotoEmployeeList() {
            await this.employeeListLink.click()
            await expect(this.page).toHaveURL(/viewEmployeeList/)
        }

        //** Method Assertions */
        async expectToastSuccess() {
            await expect(this.toastTitle).toBeVisible();
            await expect(this.toastTitle).toContainText('Success')
            await expect(this.toastMessage).toBeVisible();
            await expect(this.toastMessage).toContainText('Successfully Saved')
        }
}