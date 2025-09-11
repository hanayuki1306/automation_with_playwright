import { Page, expect } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  async verifyProductInCart(productName: string) {
    console.log(`[CartPage] verifyProductInCart: ${productName}`);
    await expect(this.page.locator('.cart_item:has-text("' + productName + '")')).toHaveCount(1);
    console.log('[CartPage] verifyProductInCart success');
  }

  async proceedToCheckout() {
    console.log('[CartPage] proceedToCheckout');
    await this.page.click('[data-test="checkout"]');
  }
}
