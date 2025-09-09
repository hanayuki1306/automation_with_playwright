import { Page, expect } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  async addToCart(productName: string) {
    await this.page.click(`.inventory_item:has-text("${productName}") button`);
    await this.page.waitForTimeout(2000);
  }

  async goToCart() {
    await this.page.click('.shopping_cart_link');
    await this.page.waitForTimeout(2000);
  }
}
