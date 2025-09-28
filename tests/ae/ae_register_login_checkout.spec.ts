import { test, expect } from './fixtures';
import { HomePage } from '../../pageObjects/ae/HomePage';
import { SignupPage } from '../../pageObjects/ae/SignupPage';
import { LoginPage } from '../../pageObjects/ae/LoginPage';
import { ProductsPage } from '../../pageObjects/ae/ProductsPage';
import { CartPage } from '../../pageObjects/ae/CartPage';

test.describe('AutomationExercise - E-commerce Workflow with POM', () => {
  test.beforeEach(async ({ loginIfNeeded }) => {
    await loginIfNeeded();
  });
  test('Register a new user', async ({ page }) => {
    const home = new HomePage(page);
    const signup = new SignupPage(page);

    await home.goto();
    await home.navigateToSignupLogin();

    const uniqueEmail = `user_${Date.now()}@example.com`;
    await signup.startSignup('Test User', uniqueEmail);
    await signup.fillDetailsAndCreate('Password123!');

    await expect(page.getByText(/Congratulations! Your new account has been successfully created!/i)).toBeVisible();
  });

  test('Login with valid credentials', async ({ page }) => {
    const home = new HomePage(page);
    const login = new LoginPage(page);

    await home.goto();
    await home.navigateToSignupLogin();

    // Use credentials if account exists; otherwise this will fail. Prefer creating once and reusing in CI via env.
    const email = process.env.AE_EMAIL || 'user@example.com';
    const password = process.env.AE_PASSWORD || 'Password123!';
    await login.login(email, password);
    await login.assertLoggedIn();
  });

  test('Search and add product to cart', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);

    await home.goto();
    await home.navigateToProducts();
    await products.assertOnPage();
    await products.search('dress');
    await products.addFirstResultToCart();

    await home.navigateToCart();
    await cart.assertProductInCart('dress');
  });

  test('Checkout process', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);
    const login = new LoginPage(page);

    await home.goto();

    // Ensure logged in - if env provided
    if (!(await page.getByText(/Logged in as/i).isVisible().catch(() => false))) {
      await home.navigateToSignupLogin();
      const email = process.env.AE_EMAIL || 'user@example.com';
      const password = process.env.AE_PASSWORD || 'Password123!';
      await login.login(email, password);
      await login.assertLoggedIn();
    }

    await home.navigateToProducts();
    await products.search('shirt');
    await products.addFirstResultToCart();
    await home.navigateToCart();
    await cart.proceedToCheckout();

    // On AutomationExercise, order placement requires payment info; the flow includes comment and place order
    const comment = page.locator("textarea[name='message']");
    if (await comment.isVisible()) {
      await comment.fill('Please deliver ASAP');
      await page.getByRole('link', { name: /Place Order/i }).click();
    }

    await page.locator('#name_on_card').fill('Test User');
    await page.locator('#card_number').fill('4242424242424242');
    await page.locator('#cvc').fill('123');
    await page.locator('#expiry_month').fill('12');
    await page.locator('#expiry_year').fill('2030');
    await page.getByRole('button', { name: /Pay and Confirm Order/i }).click();

    await expect(page.getByText(/Your order has been placed successfully!/i)).toBeVisible({ timeout: 15000 });
  });
});


