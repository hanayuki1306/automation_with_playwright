import { test as base } from '@playwright/test';
import { HomePage } from '../../pageObjects/ae/HomePage';
import { LoginPage } from '../../pageObjects/ae/LoginPage';

type Fixtures = {
  loginIfNeeded: () => Promise<void>;
};

export const test = base.extend<Fixtures>({
  loginIfNeeded: async ({ page }, use) => {
    await use(async () => {
      if (await page.getByText(/Logged in as/i).isVisible().catch(() => false)) return;
      const email = process.env.AE_EMAIL;
      const password = process.env.AE_PASSWORD;
      if (!email || !password) return; // skip if not provided
      const home = new HomePage(page);
      const login = new LoginPage(page);
      await home.goto();
      await home.navigateToSignupLogin();
      await login.login(email, password);
      await login.assertLoggedIn();
    });
  },
});

export const expect = test.expect;


