import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;

    //Definisi Locator (Properti)
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly dashboardHeading: Locator;

    constructor(page: Page) {
        this.page = page

    //inisiasi Locator
    this.usernameInput = page.getByRole('textbox', {name: 'Username'});
    this.passwordInput = page.getByRole('textbox', {name: 'Password'});
    this.loginButton = page.getByRole('button', {name: 'Login'});
    this.dashboardHeading = page.getByText('Dashboard')
}

    //Method action
    async goto() {
        for (let attempt = 0; attempt < 2; attempt++) {
            await this.page.goto('/web/index.php/auth/login', { waitUntil: 'commit' });

            try {
                // Demo publik bisa butuh ~30s untuk memuat bundle JS-nya (~3MB),
                // jadi jangan pakai timeout pendek di sini.
                await expect(this.usernameInput).toBeVisible({ timeout: 45_000 });
                return;
            } catch (error) {
                if (attempt === 1) {
                    throw error;
                }
            }
        }
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    //Method assertion
    async expectOnDashboard() {
        await expect(this.page).toHaveURL(/dashboard/);
        await expect(this.page.getByRole('heading', {name: 'Dashboard'})).toBeVisible();
    }


}