import { Page, expect } from '@playwright/test';

export class SignupPage {
  constructor(private page: Page) { }

  private get nameInput() {
    return this.page.locator('//input[@data-qa="signup-name"]');
  }
  private get emailInput() {
    return this.page.locator('//input[@data-qa="signup-email"]');
  }
  private get signupButton() {
    return this.page.locator('//button[@data-qa="signup-button"]');
  }
  private get passwordInput() {
    return this.page.locator('//input[@data-qa="password"]');
  }
  private get firstNameInput() {
    return this.page.locator('//input[@data-qa="first_name"]');
  }
  private get lastNameInput() {
    return this.page.locator('//input[@data-qa="last_name"]');
  }
  private get addressInput() {
    return this.page.locator('//input[@data-qa="address"]');
  }
  private get stateInput() {
    return this.page.locator('//input[@data-qa="state"]');
  }
  private get cityInput() {
    return this.page.locator('//input[@data-qa="city"]');
  }
  private get zipCodeInput() {
    return this.page.locator('//input[@data-qa="zipcode"]');
  }
  private get mobileNumberInput() {
    return this.page.locator('//input[@data-qa="mobile_number"]');
  }
  private get createAccountButton() {
    return this.page.locator('//button[@data-qa="create-account"]');
  }

  async startSignup(name: string, email: string) {
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.signupButton.click();
  }

  async fillDetailsAndCreate(password: string) {
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    // Keep original API, but ensure required fields are filled with defaults
    await this.firstNameInput.fill('Dani');
    await this.lastNameInput.fill('Test');
    await this.addressInput.fill('123 Test Street');
    await this.stateInput.fill('CA');
    await this.cityInput.fill('San Jose');
    await this.zipCodeInput.fill('95050');
    await this.mobileNumberInput.fill('1234567890');
    await this.createAccountButton.click();
    console.log('[SignupPage] fillDetailsAndCreate success');
  }
}

