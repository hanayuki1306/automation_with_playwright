import { test, expect } from '@playwright/test';
import { HomePage } from '../../pageObjects/ae/HomePage';
import { SignupPage } from '../../pageObjects/ae/SignupPage';
import { LoginPage } from '../../pageObjects/ae/LoginPage';

test.describe('AutomationExercise - Negative cases', () => {
  test('Login with invalid credentials shows error', async ({ page }) => {
    const home = new HomePage(page);
    const login = new LoginPage(page);

    await home.goto();
    await home.navigateToSignupLogin();
    await login.login('invalid@gmail.com', 'wrongpass');
    await login.assertLoginError();
  });

  test('Signup with existing email shows error', async ({ page }) => {
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


