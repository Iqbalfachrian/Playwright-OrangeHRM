import { Page, Locator, expect } from '@playwright/test'

export class ReportPage {
    readonly page: Page;

    //** Definisi Locator */
    readonly reportsLink: Locator;
    readonly addButton: Locator;
    readonly searchButton: Locator;
    readonly reportNameSearchInput: Locator;
    readonly reportNameAddInput: Locator;
    readonly selectionCriteriaDropdown: Locator;
    readonly displayFieldGroupDropdown: Locator;
    readonly displayFieldDropdown: Locator;

    constructor(page: Page) {
        this.page = page;
    

    //** Insialisasi Locator */
    this.reportsLink = page.getByRole('link', {name: 'Reports'});
    this.addButton = page.getByRole('button', {name: 'Add'});
    this.searchButton = page.getByRole('button', {name: 'Search'});
    this.reportNameSearchInput = page.getByPlaceholder('Type for hints...');
    this.reportNameAddInput = page.getByRole('textbox', {name: 'Type here ...'});

    //** Scoped Locator */
    this.selectionCriteriaDropdown = page
    .locator('.oxd-input-group')
    .filter({ has: page.locator('label', {hasText: 'Selection Criteria'})})
    .locator('.oxd-select-wrapper');

    this.displayFieldGroupDropdown = page
    .locator('.oxd-input-group')
    .filter({ hasText: 'Select Display Field Group'})
    .locator('.oxd-select-wrapper')

    this.displayFieldDropdown = page
    .locator('.oxd-input-group')
    .filter({ hasText: 'Select Display Field'})
    .locator('.oxd-select-wrapper')
    .last();
    }

    //** Method Actions */
    async gotoReports() {
        await this.page.goto('/web/index.php/pim/viewEmployeeList', { waitUntil: 'commit' });
        // App OrangeHRM baru ter-render setelah bundle JS (~3MB) selesai dimuat
        // (bisa ~30s di demo publik), jadi timeout-nya dibuat longgar.
        await expect(this.reportsLink).toBeVisible({ timeout: 45_000 });
        await this.reportsLink.click();
        await expect(this.page).toHaveURL(/viewDefinedPredefinedReports/, { timeout: 30_000 })
    }

    async gotoReportsMenu() {
        await this.page.goto('/web/index.php/pim/viewDefinedPredefinedReports', { waitUntil: 'commit' });
        await expect(this.page.getByText('Employee Reports')).toBeVisible({ timeout: 45_000 });
    }

    async clickAddReport() {
        await this.addButton.click();
        await expect(this.page).toHaveURL(/definePredefinedReport/)
        await expect(this.page.getByText('Add Report')).toBeVisible();
    }

    async fillReportName(name: string) {
        await this.reportNameAddInput.fill(name)
    }

    async addSelectionCriteria(criteria: string) {
        await this.selectionCriteriaDropdown.click()
        await this.page
        .getByRole('listbox')
        .getByText(criteria, {exact: true}).click();
        //klik button plus pertama
        await this.page.locator('button:has(i.bi-plus)').first().click()
    }

    async fillAutocompleteEmployee(employeeName: string) {
        const input = this.page.getByPlaceholder('Type for hints...');
        await input.fill(employeeName);
        const option = this.page.getByRole('option', {name: employeeName})
        await expect(option).toBeVisible({ timeout: 5000 })
        await option.click();
    }

    async addDisplayFieldGroup(group: string) {
        await this.displayFieldGroupDropdown.click();
        await this.page
        .getByRole('listbox')
        .getByText(group, {exact: true})
        .click();
    }

    async addDisplayField(field: string) {
        await this.displayFieldDropdown.click();
        await this.page
        .getByRole('listbox')
        .getByText(field, {exact: true})
        .click();
        //Klik button plus terakhir
        await this.page.locator('button:has(i.bi-plus)').last().click();
    }

    async clickSave() {
        await this.page.getByRole('button', {name: 'Save'}).click();
        await expect(this.page.locator('.oxd-text--toast-title')).toContainText('Success');
    }

    async gotoEmployeeReports() {
        await this.gotoReports();
    }

    async deleteReport(name: string) {
        await this.gotoReportsMenu();

        // Wajib lewat helper ini: kolom search-nya autocomplete, kalau diisi manual
        // tanpa memilih saran maka OrangeHRM menandainya "Invalid" dan search gagal.
        await this.searchReportByName(name);

        const row = this.page.getByRole('row').filter({ hasText: name });
        await expect(row).toBeVisible({ timeout: 15_000 });

        // Klik icon trash pada baris tersebut
        await row.locator('button:has(i.bi-trash)').click();
        await this.page.getByRole('button', { name: 'Yes, Delete' }).click();

        await expect(this.page.locator('.oxd-text--toast-title')).toContainText('Success', { timeout: 15_000 });
    }

    async searchReportByName(name: string) {
        await this.reportNameSearchInput.fill(name);
        //Handle autocomplete suggestion jika perlu
        const suggestion = this.page.locator('div.oxd-autocomplete-wrapper').filter({ hasText: name})
        if (await suggestion.isVisible()) {
            await suggestion.click()
        }
        await this.searchButton.click()
    }

    //** Method Assertions */
    async expectReportExists(reportName: string) {
        const row = this.page.getByRole('row').filter({ hasText: reportName})
        await expect(row).toBeVisible({ timeout: 5000})
    }
}