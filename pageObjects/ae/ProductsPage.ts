import { Page, expect } from '@playwright/test';

export class ProductsPage {
  constructor(private page: Page) {}

  private get searchInput() {
    return this.page.getByPlaceholder('Search Product');
  }
  private get searchButton() {
    return this.page.getByRole('button', { name: /Search/i });
  }
  private get firstResultAddButton() {
    return this.page.locator('.product-overlay button').first();
  }

  async assertOnPage() {
    console.log('[ProductsPage] assertOnPage');
    await expect(this.page).toHaveURL(/.*\/products/);
    console.log('[ProductsPage] assertOnPage success');
  }

  async search(keyword: string) {
    console.log(`[ProductsPage] search: ${keyword}`);
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
    console.log('[ProductsPage] search success');
  }

  async addFirstResultToCart() {
    console.log('[ProductsPage] addFirstResultToCart');
    await this.firstResultAddButton.click();
    console.log('[ProductsPage] addFirstResultToCart success');
  }
}


