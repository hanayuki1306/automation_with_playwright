import { Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {}

  async fillCheckoutInfo(firstName: string, lastName: string, zip: string) {
    await this.page.fill('[data-test="firstName"]', firstName);
    await this.page.fill('[data-test="lastName"]', lastName);
    await this.page.fill('[data-test="postalCode"]', zip);
    await this.page.click('[data-test="continue"]');
    await this.page.waitForTimeout(2000);
  }

  async finishCheckout() {
    await this.page.click('[data-test="finish"]');
    await this.page.waitForTimeout(2000);
  }
}
