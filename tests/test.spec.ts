import { Page } from "@playwright/test";

// @ts-check
const { test, expect } = require('@playwright/test');

test('login', async ({ page }: { page: Page }) => {
  await page.goto('http://localhost:3000/');
  await page.click('button.btn-signin')
  await page.click('button.ant-btn-default')
  await page.click('button.ant-btn-primary')
});
test('create workspace', async ({ page }: { page: Page }) => {
  await page.goto('http://localhost:3000/w/home');
  await page.click('button.ant-btn-primary')
});

// test('get started link', async ({ page }: { page: Page }) => {
//   await page.goto('http://localhost:3000/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects the URL to contain intro.
//   await expect(page).toHaveURL(/.*intro/);
// });
