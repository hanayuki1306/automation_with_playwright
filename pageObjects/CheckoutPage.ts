import { Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {}

  async fillCheckoutInfo(firstName: string, lastName: string, zip: string) {
    console.log(`[CheckoutPage] fillCheckoutInfo: ${firstName} ${lastName}, zip: ${zip}`);
    await this.page.fill('[data-test="firstName"]', firstName);
    await this.page.fill('[data-test="lastName"]', lastName);
    await this.page.fill('[data-test="postalCode"]', zip);
    await this.page.click('[data-test="continue"]');
  }

  async finishCheckout() {
    console.log('[CheckoutPage] finishCheckout');
    await this.page.click('[data-test="finish"]');
  }
}
