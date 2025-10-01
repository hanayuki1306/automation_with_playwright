import { Page, expect } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  private get productNames() {
    return this.page.locator('.cart_description h4 a');
  }
  private get checkoutButton() {
    return this.page.getByRole('button', { name: /Proceed To Checkout/i }).or(
      this.page.getByRole('link', { name: /Proceed To Checkout/i })
    );
  }
  private get addToCartPopup() {
    return this.page.locator('.modal-content, .alert-success');
  }

  async assertProductInCart(productName: string) {
    console.log(`[CartPage] assertProductInCart: ${productName}`);
    const productLocators = await this.productNames.all();
    const productTexts: string[] = [];
    for (const locator of productLocators) {
      const text = await locator.textContent();
      if (text) productTexts.push(text.trim());
    }
    console.log('Products in cart:', productTexts);
    await expect(this.productNames.filter({ hasText: productName })).toBeVisible();
    console.log('[CartPage] assertProductInCart success');
  }

  async proceedToCheckout() {
    console.log('[CartPage] proceedToCheckout');
    await this.checkoutButton.click();
    console.log('[CartPage] proceedToCheckout success');
  }

  async assertAddToCartPopupVisible() {
    console.log('[CartPage] assertAddToCartPopupVisible');
    await expect(this.addToCartPopup).toBeVisible();
    console.log('[CartPage] assertAddToCartPopupVisible success');
  }
}


