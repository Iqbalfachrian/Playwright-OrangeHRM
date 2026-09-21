import { test, expect } from '@playwright/test'
import path from 'path'
import { generateUniqueString } from '../../../utils/testData'
import { AdminPage } from '../../../pages/AdminPage';

let createdJobTitle: string;
let editedJobTitle: string;

test.describe('Navigate to Admin Menu', () => {
    test.describe.configure({ mode: 'serial' })
    let adminPage: AdminPage;


    test.beforeEach(async ({ page }) => {
        //Implement POM
        adminPage = new AdminPage(page);
        await adminPage.gotoJobTitles();
    })

    test('Test-001: Go to Job List', async ({}) => {
        await expect(adminPage.pageTitle).toBeVisible();
    })

    test('Test-002: Add Job Titles', async ({ page }) => {
        //generate unique data test
        createdJobTitle = generateUniqueString('QA Manual');
        const jobDescription = `Description for ${createdJobTitle}`;

        //Path File
        const filePath = path.resolve(__dirname, '../../../test-data/dummy.pdf');
        
        //Execute Flow with POM
        await adminPage.clickAdd();
        await adminPage.fillJobTitle(createdJobTitle);
        await adminPage.fillJobDescription(jobDescription);
        await adminPage.uploadJobSpecification(filePath);
        await adminPage.fillNote('Testing 123456')
        await adminPage.save();

       //Verification Result
       await adminPage.expectJobExists(createdJobTitle, jobDescription);
    })

    test('Test-003: Edit Job', async ({ page }) => {
        // Arrange: Judul baru
        editedJobTitle = generateUniqueString('QA Manual edited');

        //Act
        await adminPage.clickEdit(createdJobTitle);
        await adminPage.expectedJobTitleValue(createdJobTitle);
        await adminPage.fillJobTitle(editedJobTitle);
        await adminPage.save();
       
        //Assertions
        await adminPage.expectJobExists(editedJobTitle);

    })

    test('Test-004: Delete Job', async({ page }) => {
        //Act
        await adminPage.clickDelete(editedJobTitle);
        await adminPage.confirmDelete();

        //Assert
        await adminPage.expectToast('Successfully Deleted');
        await adminPage.expectJobNotExists(editedJobTitle);
        await adminPage.expectToastDismissed();
    })
})