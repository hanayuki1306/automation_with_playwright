import { Page, expect } from '@playwright/test';
import { getPassword, getRandomUser } from '../tests/commonFunc/common_helper';

export class LoginPage {
  constructor(private page: Page) { }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login() {
    const user = getRandomUser();
    console.log('[LoginPage] login with user:', user);
    await this.page.fill('[data-test="username"]', user);
    await this.page.fill('[data-test="password"]', getPassword());
    await this.page.click('[data-test="login-button"]');
  }
}
