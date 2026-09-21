import { test, expect } from '@playwright/test'
import { generateUniqueString } from '../../../utils/testData'
import { ReportPage } from '../../../pages/ReportPage';


let createdReportName: string;

test.describe('Navigate to PIM Menu', () => {
    test.describe.configure({ mode: 'serial' });
    let reportPage: ReportPage;

    test.beforeEach(async ({ page }) => {
        reportPage = new ReportPage(page)   
    } )

    // Cleanup: hapus report yang dibuat, supaya slot nomor 2 digit (1-99)
    // tidak habis dan run berikutnya tidak kena "Already exists".
    test.afterAll(async ({ browser }) => {
        if (!createdReportName) return;
        const context = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
        const page = await context.newPage();
        await new ReportPage(page).deleteReport(createdReportName);
        await context.close();
    });

    test('Test-001: Go to Reports and do search', async ({ page }) => {
        await reportPage.gotoReports();
        
        //Search Existing Report
        await reportPage.searchReportByName('Employee Job Details');
        await expect(page.getByText('Employee Job Details')).toBeVisible();

    })

    test('Test-002: Add Employee Reports', async ({ page }) => {
        // 2 digit saja, contoh: 'QA Manual Report 42'.
        // Supaya tidak pernah kena "Already exists", report ini dihapus lagi di afterAll.
        createdReportName = generateUniqueString('QA Manual Report')

        await reportPage.gotoReportsMenu();
        await reportPage.clickAddReport();
        await reportPage.fillReportName(createdReportName);

        // Add Selection Criteria
        await reportPage.addSelectionCriteria('Employee Name')
        await reportPage.fillAutocompleteEmployee('Amelia Brown')

        // Add Display Fields
        await reportPage.addDisplayFieldGroup('Salary');
        await reportPage.addDisplayField('Amount');

        // Save
        await reportPage.clickSave();

    })

    test('Test-003: Check Employee Report', async ({ page }) => {
        await reportPage.gotoEmployeeReports();
        await reportPage.searchReportByName(createdReportName);
        await reportPage.expectReportExists(createdReportName);
    })
})