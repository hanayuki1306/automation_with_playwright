import { test, expect } from '@playwright/test';

test.describe("Login realworld-app", () => {
    test ("Demo login", async({page}) =>{
        await page.setDefaultTimeout(10000); // set timeout to 10 seconds
        await page.setDefaultNavigationTimeout(10000); // set navigation timeout to 10 seconds
        await page.goto('localhost:3000/', { waitUntil: 'commit' }); // wait until the page is fully loaded

        // const username = page.locator('input[@name="username"]');
        // const password = page.locator('input[@name="password"]');

        const username = page.getByLabel('username');
        const password = page.getByLabel('password');
        await username.fill('Heath93');
        await password.fill('s3cret');

        const loginButton = page.getByRole('button', { name: 'Sign in' });  
        expect(loginButton).toBeVisible();
        await loginButton.click();

        await page.waitForTimeout(2000); // wait for 2 seconds to ensure the login process is complete
        await page.pause(); // pause the test to inspect the page after login
    
    } )
});