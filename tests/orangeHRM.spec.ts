import { test, expect } from '@playwright/test';

test('Login OrangeHRM berhasil', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/dashboard/);

  //Go to Admin menu
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page).toHaveURL(/admin/);
  const adminHeader = page.getByText('Admin').first();
  await expect(adminHeader).toBeVisible();
  const userHeader = page.getByText('User Management').first();
  await expect(userHeader).toBeVisible()
 // await expect(page.getByText('User Management')).toBeVisible();

  
  //input Username
  // const usernameInput = page.locator('input.oxd-input').last();
  // await expect(usernameInput).toBeVisible();
  // await usernameInput.fill('FMLName');

  const usernameInput = page
  .locator('.oxd-input-group')
  .filter({ hasText: 'Username'})
  .locator('input')

  await expect(usernameInput).toBeVisible();
  await usernameInput.fill('Admin');


  //Pick Role
  await page.getByText('-- Select --').first().click();
  await page
  .getByRole('listbox')
  .getByText('Admin', { exact: true })
  .click();


  //Autocomplete search Employee Name
  const inputEmployeeName = page.getByPlaceholder('Type for Hints...');

  await expect(inputEmployeeName).toBeVisible();
  await expect(inputEmployeeName).toBeEditable();

  await inputEmployeeName.fill('Sasha');

  const suggestion = page
    .locator('div.oxd-autocomplete-option')
    .filter({ hasText: 'SASHA Avirmed Updated'});

  await expect(suggestion).toBeVisible({ timeout: 5000 })

  await suggestion.click()

  await expect(inputEmployeeName).toHaveValue('SASHA Avirmed Updated')


  //Klik button search
  await page.getByRole('button', { name: 'Search' }).click();

  await expect(page.getByText('Record Found')).toBeVisible();

});