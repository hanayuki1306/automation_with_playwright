import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) { }

  private get emailInput() {
    return this.page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address');
  }
  private get passwordInput() {
    return this.page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Password');
  }
  private get loginButton() {
    return this.page.getByRole('button', { name: /Login/i });
  }
  private get loggedInAs() {
    return this.page.locator('#header').getByText(/Logged in as/i);
  }
  private get loginError() {
    return this.page.getByText(/Your email or password is incorrect!/i);
  }

  async login(email: string, password: string) {
    console.log(`[LoginPage] login: ${email}`);
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await this.emailInput.fill(email);
    await this.page.waitForTimeout(500); // add small delay
    await this.passwordInput.fill(password);
    await this.page.waitForTimeout(500);
    await this.loginButton.click();
    console.log('[LoginPage] login success');
  }

  async assertLoggedIn() {
    console.log('[LoginPage] assertLoggedIn');
    await expect(this.loggedInAs).toBeVisible();
    console.log('[LoginPage] assertLoggedIn success');
  }

  async assertLoginError() {
    console.log('[LoginPage] assertLoginError');
    await expect(this.loginError).toBeVisible();
    console.log('[LoginPage] assertLoginError success');
  }
}


