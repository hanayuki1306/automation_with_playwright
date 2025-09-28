import { Page, expect } from '@playwright/test';

export class SignupPage {
  constructor(private page: Page) { }

  private get nameInput() {
    return this.page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Name');
  }
  private get emailInput() {
    return this.page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address');
  }
  private get signupButton() {
    return this.page.getByRole('button', { name: /Signup/i });
  }
  private get passwordInput() {
    return this.page.locator('//input[@data-qa="password"]');
  }
  private get createAccountButton() {
    return this.page.getByRole('button', { name: /Create Account/i });
  }

  async startSignup(name: string, email: string) {
    console.log(`[SignupPage] startSignup: ${name}, ${email}`);
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.signupButton.click();
    console.log('[SignupPage] startSignup success');
  }

  async fillDetailsAndCreate(password: string) {
    console.log(`[SignupPage] fillDetailsAndCreate: ${password}`);
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    await this.createAccountButton.click();
    console.log('[SignupPage] fillDetailsAndCreate success');
  }
}


