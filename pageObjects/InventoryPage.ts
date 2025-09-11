import { Page, expect } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  async addToCart(productName: string) {
    console.log(`[InventoryPage] addToCart: ${productName}`);
    await this.page.click(`.inventory_item:has-text("${productName}") button`);
  }

  async goToCart() {
    console.log('[InventoryPage] goToCart');
    await this.page.click('.shopping_cart_link');
  }
}
