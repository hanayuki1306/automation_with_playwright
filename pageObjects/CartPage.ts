import { Page, expect } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  async verifyProductInCart(productName: string) {
    await expect(this.page.locator('.cart_item:has-text("' + productName + '")')).toHaveCount(1);
    await this.page.waitForTimeout(2000);
  }

  async proceedToCheckout() {
    await this.page.click('[data-test="checkout"]');
    await this.page.waitForTimeout(2000);
  }
}
