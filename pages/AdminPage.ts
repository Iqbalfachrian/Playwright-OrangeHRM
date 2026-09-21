/**
 * @module AdminPage
 * @description Page Object Model untuk modul Admin -> jobs
 * Mengenkapsulasi locator dan interaksi Job Titles, User Management dll
 * 
 * @architecture 
 * - menggunakan pola Centralized Locator Definiton
 * - Helper Private ('JobRow') digunakan untuk isolasi scope tabel
 * - Assertion defensif diterapkan pada setiap aksi kritis
 * 
 * @warning
 * File ini adalah shared resource, perubahan pada signatur method akan impact pada semua spec file di folder/admin
 * Harap execute full regresion setelah ada perubahan
 */


import { Page, Locator, expect } from '@playwright/test';

export class AdminPage {
    //Public, boleh dipanggil dari spec file
    readonly page: Page;

    //Locator navigasi
    readonly jobMenu: Locator;
    readonly jobTitlesMenuItem: Locator;
    readonly pageTitle: Locator;

    //Locator Form (Add page & edit page)
    readonly jobTitleInput: Locator;
    readonly jobDescriptionInput: Locator;
    readonly jobSpecificationInput: Locator;
    readonly noteInput: Locator;

    //Locator Action
    readonly addButton: Locator;
    readonly saveButton: Locator;
    readonly addHeading: Locator;
    readonly editHeading: Locator;

    //Locator Notification & Dialog
    readonly toast: Locator;
    readonly deleteDialog: Locator;

    constructor(page: Page) {
        this.page = page;

        //Navigation
        this.jobMenu = page.getByText('Job', {exact: true});
        this.jobTitlesMenuItem = page.getByRole('menuitem', {name: 'Job Titles'});
        this.pageTitle = page.getByRole('heading', {name: 'Job Titles'});
        
        //Form Job Title (Add & Edit)
        this.jobTitleInput = page
        .locator('.oxd-input-group')
        .filter({ hasText: 'Job Title'})
        .locator('input')

        this.jobDescriptionInput = page
        .locator('.oxd-input-group')
        .filter({ hasText: 'Job Description' })
        .locator('textarea');

        this.jobSpecificationInput = page
        .locator('.oxd-input-group')
        .filter({ hasText: 'Job Specification' })
        .locator('input[type="file"]')

        this.noteInput = page
        .locator('.oxd-input-group')
        .filter({ hasText: 'Note' })
        .locator('textarea');
        
        //Action
        this.addButton = page.getByRole('button', {name: 'Add'});
        this.saveButton = page.getByRole('button', {name: 'Save'});
        this.addHeading = page.getByRole('heading', {name: 'Add Job Title'});
        this.editHeading = page.getByRole('heading', {name: 'Edit Job Title'});

        //Notification & Dialog
        this.toast = page.locator('.oxd-toast');
        this.deleteDialog = page.locator('.oxd-dialog-sheet');
    }

    // ============================================================
    // NAVIGATION
    // ============================================================
    //Public methods 
    async gotoJobTitles() {
        await this.page.goto('/web/index.php/admin/viewSystemUsers');
        await expect(this.page).toHaveURL(/admin/);
        await this.jobMenu.click();
        await this.jobTitlesMenuItem.click();

        //make sure page ready
        await expect(this.pageTitle).toBeVisible();       
    }

    // ============================================================
    // HELPER PRIVATE
    // ============================================================

    /**
     * Mengembalikan baris tabel yang memuat judul job tertentu.
     * `private` = hanya boleh dipakai internal POM, spec tidak boleh tahu
     * bagaimana baris itu dicari.
     */
    private jobRow(jobTitle: string): Locator {
        return this.page.getByRole('row').filter({ hasText: jobTitle })
    }

    // ============================================================
    // Flow: Add
    // ============================================================
    async clickAdd() {
        await this.addButton.click();
        await expect(this.addHeading).toBeVisible();
    }

    async fillJobTitle(title: string) {
        await expect(this.jobTitleInput).toBeVisible();
        await expect(this.jobTitleInput).toBeEditable();
        await this.jobTitleInput.fill(title);
    }

    async fillJobDescription(description: string) {
        await this.jobDescriptionInput.fill(description)
    }

    async uploadJobSpecification(filePath: string) {
        await this.jobSpecificationInput.setInputFiles(filePath);
    }

    async fillNote(note: string) {
        await this.noteInput.fill(note);
    }

    async save() {
        await this.saveButton.click();
        await expect(this.page).toHaveURL(/viewJobTitleList/)
    }

    // ============================================================
    // Flow: Edit
    // ============================================================

    //** Click Pencil Icon pada baris Job, lalu make sure form edit bener terbuka */
    async clickEdit(jobTitle: string) {
        const row = this.jobRow(jobTitle);
        await expect(row).toBeVisible();

        await row.locator('button:has(i.bi-pencil-fill)').click();
        await expect(this.page).toHaveURL(/saveJobTitle/)
        await expect(this.editHeading).toBeVisible();
    }    

    //** Make sure field Job Title berisi nilai tertentu */
    async expectedJobTitleValue(expected: string) {
        await expect(this.jobTitleInput).toHaveValue(expected);
    }

    // ============================================================
    // Flow: Delete
    // ============================================================
    
    //Click icon tong sampah pada baris job
    async clickDelete(jobTitle: string) {
        const row = this.jobRow(jobTitle)
        await expect(row).toBeVisible();

        await row.locator('button:has(i.bi-trash)').click()
    }

    /** Validasi isi dialog konfirmasi, lalu klik "yes, delete" */
    async confirmDelete() {
        await expect(this.deleteDialog).toBeVisible();
        await expect(this.deleteDialog).toContainText('Are you Sure');
        await expect(this.deleteDialog).toContainText(
            'The selected record will be permanently deleted. Are you sure you want to continue?'
        );

        //Tombol di-scope ke dalam dialog,
        await this.deleteDialog.getByRole('button', {name: 'Yes, Delete'}).click();
    }


    // ============================================================
    // Assertion
    // ============================================================

    async expectJobExists(jobTitle: string, description?: string) {
        const row = this.jobRow(jobTitle);
        await expect(row).toBeVisible();

        //hanya untuk cek kalau deskripsi emang dikirim
        if (description) {
            await expect(row).toContainText(description)
        }
    }

    //** Make sure baris job yang dihapus sudah tidak ada lagi
    async expectJobNotExists(jobTitle: string) {
        await expect(this.jobRow(jobTitle)).toHaveCount(0);
    }

    //** Menunggu toast message muncul */
    async expectToast(message: string) {
        await expect(this.toast.filter({ hasText: message})).toBeVisible();
    }

    //** Menunggu toast hilang sendiri */
    async expectToastDismissed(timeout = 7000) {
        await expect(this.toast).toBeHidden({ timeout });
    }

}