import { test, expect } from '@playwright/test'
import { generateUniqueString } from '../../../utils/testData'
import { PimPage } from '../../../pages/PimPage';


let createdEmployeeName: string;
let createdEmployeeId: string;
let createdDriverLicense: string;


test.describe('Navigate to PIM Menu', () => {
    test.describe.configure({ mode: 'serial' })
    let pimPage: PimPage;

    test.beforeEach(async ({ page }) => {
       pimPage = new PimPage(page)
    })

    test('Test-001: Go to Add Employee', async ({ page }) => {
        await pimPage.gotoAddEmployee()
        await expect(page).toHaveURL(/addEmployee/)
    })

    test('Test-002: Add New Employee', async ({ page }) => {
        //Generate unique data
        createdEmployeeName = generateUniqueString('Yier Bubu');
        createdEmployeeId = generateUniqueString('ID');
        createdDriverLicense = generateUniqueString('DL');

        //Navigate
        await pimPage.gotoAddEmployee();

        //Fill basic info & save
        await pimPage.fillBasicInfo(createdEmployeeName,'Gemeshh', createdEmployeeId)
        await pimPage.clickSave();

        //Assert Success Toast
        await pimPage.expectToastSuccess();
        await expect(page).toHaveURL(/viewPersonalDetails/)

        //Fill Personal Details
        await pimPage.fillPersonalDetails(createdDriverLicense, '2028-10-10')
        await pimPage.selectNationality('Indonesian');
        await pimPage.selectMaritalStatus('Single');
        await pimPage.selectGenderMale();

        //Verify Gender Checked
        const genderGroup = page
        .locator('.oxd-input-group')
        .filter({ has: page.locator('label', {hasText: 'Gender'})})

        await expect(genderGroup.getByRole('radio', { name: /^Male$/ })).toBeChecked();

        //Save Personal Details
        await pimPage.savePersonalDetails();

        //Back to Employee List
        await pimPage.gotoEmployeeList();
    })
})