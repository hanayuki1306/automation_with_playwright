import { Page, expect } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  private get productNames() {
    return this.page.locator('.cart_description .product_name');
  }
  private get checkoutButton() {
    return this.page.getByRole('button', { name: /Proceed To Checkout/i });
  }

  async assertProductInCart(productName: string) {
    console.log(`[CartPage] assertProductInCart: ${productName}`);
    await expect(this.productNames.filter({ hasText: productName })).toBeVisible();
    console.log('[CartPage] assertProductInCart success');
  }

  async proceedToCheckout() {
    console.log('[CartPage] proceedToCheckout');
    await this.checkoutButton.click();
    console.log('[CartPage] proceedToCheckout success');
  }
}


