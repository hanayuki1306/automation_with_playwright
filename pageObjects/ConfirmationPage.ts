import { Page, expect } from '@playwright/test';

export class ConfirmationPage {
  constructor(private page: Page) {}

  async verifyOrderSuccess() {
    await expect(this.page.locator('.complete-header')).toHaveText('Thank you for your order!');
    await this.page.waitForTimeout(2000);
  }
}
