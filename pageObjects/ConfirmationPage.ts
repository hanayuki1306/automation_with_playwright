import { Page, expect } from '@playwright/test';

export class ConfirmationPage {
  constructor(private page: Page) {}

  async verifyOrderSuccess() {
    console.log('[ConfirmationPage] verifyOrderSuccess');
    await expect(this.page.locator('.complete-header')).toHaveText('Thank you for your order!');
    console.log('[ConfirmationPage] verifyOrderSuccess success');
  }
}
