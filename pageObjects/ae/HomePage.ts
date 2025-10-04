import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) { }

  private get productsLink(): Locator {
    return this.page.getByRole('link', { name: 'Products' });
  }
  private get signupLoginLink(): Locator {
    return this.page.getByRole('link', { name: 'Signup / Login' });
  }
  private get loggedInAs(): Locator {
    return this.page.locator('#header').getByText(/Logged in as/i);
  }
  private get cartLink(): Locator {
    return this.page.getByRole('link', { name: 'View Cart' })
    // return this.page.locator('.shop-menu').getByRole('link', { name: 'Cart' });
    // return this.page.getByRole('link', { name: 'Cart' }).first();
  }
  private get addToCartPopup(): Locator {
    return this.page.locator('.modal-content:has-text("Your product has been added to cart")');
  }

  async goto(): Promise<void> {
    console.log('[HomePage] goto');
    await this.page.goto('/');
    await expect(this.page).toHaveTitle(/Automation Exercise/i);
    console.log('[HomePage] goto success');
  }

  async navigateToProducts(): Promise<void> {
    console.log('[HomePage] navigateToProducts');
    await this.productsLink.click();
    await expect(this.page).toHaveURL(/.*\/products/);
    console.log('[HomePage] navigateToProducts success');
  }

  async navigateToSignupLogin(): Promise<void> {
    console.log('[HomePage] navigateToSignupLogin');
    await this.signupLoginLink.click();
    await expect(this.page).toHaveURL(/.*\/login/);
    console.log('[HomePage] navigateToSignupLogin success');
  }

  async navigateToCart(): Promise<void> {
    console.log('[HomePage] navigateToCart');
    await expect(this.cartLink).toBeVisible();
    await this.cartLink.click();
    await expect(this.page).toHaveURL(/view_cart$/);
    console.log('[HomePage] navigateToCart success');
  }
}


