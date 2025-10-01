import { Page, expect } from '@playwright/test';
import { time } from 'console';

export class ProductsPage {
  constructor(private page: Page) {}

  private get searchInput() {
    return this.page.getByPlaceholder('Search Product');
  }
  private get searchButton() {
    return this.page.locator("//button[@id='submit_search']");
  }
  private get firstResultAddButton() {
    return this.page.locator("(//a[@class='btn btn-default add-to-cart'][normalize-space()='Add to cart'])[2]");
    // return this.page.locator("//a[@class='btn btn-default add-to-cart'][normalize-space()='Add to cart']").first();
    // return this.page.locator('//button[@class="btn btn-default cart"]')
  }

  async assertOnPage() {
    console.log('[ProductsPage] assertOnPage');
    await expect(this.page).toHaveURL(/.*\/products/);
    console.log('[ProductsPage] assertOnPage success');
  }

  async search(keyword: string) {
    console.log(`[ProductsPage] search: ${keyword}`);
    await this.searchInput.fill(keyword);
    await this.page.waitForTimeout(500)
    await this.searchButton.click();
    console.log('[ProductsPage] search success');
  }

  async addFirstResultToCart() {
    console.log('[ProductsPage] addFirstResultToCart');
    await this.firstResultAddButton.click();
    await this.page.waitForTimeout(1000);
    console.log('[ProductsPage] addFirstResultToCart success');
  }
}


