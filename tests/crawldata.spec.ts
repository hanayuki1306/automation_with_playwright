import { test, expect } from '@playwright/test';

test.describe("Crawl data GOV", () => {
    test("Crawl data", async ({ page }) => {
        await page.setDefaultTimeout(10000); // set timeout to 10 seconds
        await page.setDefaultNavigationTimeout(10000); // set navigation timeout to 10 seconds
        // await page.goto('https://danhmuchanhchinh.gso.gov.vn/', { waitUntil: 'commit' }) // wait until the page is fully loaded

        await page.goto('https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_alert', { waitUntil: 'commit' }); // wait until the page is fully loaded
        await page.waitForTimeout(2000); // wait for 2 seconds to ensure the page is fully loaded   


        const iframe = page.frameLocator('#iframeResult');
        const tryItBtn = iframe.getByRole('button', { name: 'Try it' });
        await expect(tryItBtn).toBeVisible();
        await page.waitForTimeout(2000); // wait for 2 seconds to ensure the alert is displayed
        
        await tryItBtn.click(); // click the "Try it" button inside the iframe
        await page.waitForTimeout(2000); // wait for 2 seconds to ensure the alert is displayed
        page.on('dialog', async dialog => {
            await page.waitForTimeout(5000);
            expect(dialog.message()).toBe('Hello! I am an alert box!'); // check the message of the alert
            await page.pause(); // pause to inspect the dialog before accepting
            await dialog.accept(); // accept the alert
        });

        await page.waitForTimeout(2000); // wait for 2 seconds to ensure the alert is accepted
        
    });
});