import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import { getPassword, getRandomUser } from '../commonFunc/common_helper';

// Confirm that the user can log in successfully using valid credentials.

// Confirm that the product list contains exactly six items.

// Confirm that each product in the list displays its price.

// Confirm that the product is successfully added to the cart.

test.describe('SauceDemo - Basic E2E tests', () => {
    test.beforeEach(async ({ page }) => {
        // Mở trang login
        await page.goto(process.env.SAUCE_URL || 'https://www.saucedemo.com/');

        const username = getRandomUser();
        const password = getPassword();

        // Login với account hợp lệ
        await page.fill('[data-test="username"]', username);
        await page.fill('[data-test="password"]', password);
        await page.click('[data-test="login-button"]');

        // Xác nhận login thành công
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await page.waitForTimeout(2000); 
        console.log(`Logged in as: ${username} with password: ${password}`);

    });

    test('1. User can log in successfully', async ({ page }) => {
        await expect(page.locator('.app_logo')).toHaveText('Swag Labs');
        await expect(page.locator('.title')).toHaveText('Products');
        console.log('Step 1: User can log in successfully - passed');
    });

    test('2. Product list contains exactly six items', async ({ page }) => {
        const products = page.locator('.inventory_item');
        const count = await products.count();
        const expectedCount = 6;
        await expect(count).toBe(expectedCount);
        // expect(products).toHaveCount(expectedCount);
        console.log(`Step 2: Product list contains exactly ${expectedCount} items - passed`);
    });

    test('3. Each product displays its price', async ({ page }) => {
        const products = page.locator('.inventory_item');
        const count = await products.count();
        for (let i = 0; i < count; i++) {
            const priceLocator = products.nth(i).locator('.inventory_item_price');
            await expect(priceLocator).toHaveCount(1);
        }
        console.log('Step 3: Each product displays its price - passed');
    });

    test('4. Product can be successfully added to cart', async ({ page }) => {
        // Check if the cart badge is present before adding a product
        const cartBadge = page.locator('.shopping_cart_badge');
        await expect(cartBadge).toHaveCount(0); // Ensure cart is empty before adding

        await page.click('.inventory_item button');

        //check cart badge displays quantity = 1
        await expect(cartBadge).toHaveCount(1);
        // await expect(cartBadge).toHaveText('1');

        // Open the cart
        await page.click('.shopping_cart_link');

        // Confirm that the cart contains the added product
        // await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
        const cartItem = page.locator('.cart_item');
        await expect(cartItem).toHaveCount(1);
        console.log('Step 4: Product can be successfully added to cart - passed');
        await page.waitForTimeout(20000); // wait for 2 seconds to ensure the cart is updated
    });

    test.afterEach(async ({ page }) => {
        // Logout after each test
        await page.click('.bm-burger-button');
        await page.click('#logout_sidebar_link');
        await expect(page).toHaveURL('https://www.saucedemo.com/');
        // await page.pause(); 
    });
});
