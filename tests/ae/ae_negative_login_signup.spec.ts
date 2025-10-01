import { test, expect } from '@playwright/test';
import { HomePage } from '../../pageObjects/ae/HomePage';
import { SignupPage } from '../../pageObjects/ae/SignupPage';
import { LoginPage } from '../../pageObjects/ae/LoginPage';

// Testcase 1 - Negative login and signup scenarios
// - Login with invalid credentials should show error
// - Signup with existing email should show error

test.describe('Testcase 1 - Negative login and signup scenarios', () => {
  test('Testcase 1.1 - Login with invalid credentials shows error', async ({ page }) => {
    const home = new HomePage(page);
    const login = new LoginPage(page);

    await home.goto();
    await home.navigateToSignupLogin();
    await login.login('invalid@gmail.com', 'wrongpass');
    await login.assertLoginError();
  });

  test('Testcase 1.2 - Signup with existing email shows error', async ({ page }) => {
    const home = new HomePage(page);
    const signup = new SignupPage(page);

    const existingEmail = process.env.AE_EMAIL || 'user@example.com';

    await home.goto();
    await home.navigateToSignupLogin();
    await signup.startSignup('Existing User', existingEmail);
    // Expect error message
    await expect(page.getByText(/Email Address already exist!/i)).toBeVisible();
  });
});


