import { test, expect } from '@playwright/test';

test('Berhasil Login saucelabs', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user'); 
    await page.getByRole('textbox', { name: 'Password'}).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();


    await expect(page.getByText('Products')).toBeVisible();

    await page.getByRole('combobox').selectOption('lohi');
    await expect(page.getByText('$7.99')).toBeVisible();

    //lihat detail products
    // await page.getByRole('link', { name: 'Sauce Labs Onesie'}).first().click();
    //await expect(page.getByText('Sauce Labs Onesie')).toBeVisible();
    const firstProductName = page.locator('.inventory_item_name').first();
    await expect(firstProductName).toHaveText('Sauce Labs Onesie');
    await firstProductName.click();
    

    //kembali ke all products
    await page.getByRole('button', {name: 'Back to products'}).click();
    await expect(page.getByText('Swag Labs')).toBeVisible();

    await page.getByRole('button', { name: 'Open Menu'}).click();
    await page.getByRole('link', { name: 'Logout'}).click();
})