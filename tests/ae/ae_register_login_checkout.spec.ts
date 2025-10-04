import { test, expect } from './fixtures';
import { HomePage } from '../../pageObjects/ae/HomePage';
import { SignupPage } from '../../pageObjects/ae/SignupPage';
import { LoginPage } from '../../pageObjects/ae/LoginPage';
import { ProductsPage } from '../../pageObjects/ae/ProductsPage';
import { CartPage } from '../../pageObjects/ae/CartPage';

test.describe('AutomationExercise - Basic Shopping Workflow with POM', () => {
  /*
    Testcase 1.1 - Register a new user:
      - Navigate to signup page
      - Fill in user details and submit
      - Assert successful registration message

    Testcase 1.2 - Login with valid credentials:
      - Navigate to login page
      - Enter credentials and submit
      - Assert that user is logged in

    Testcase 1.3 - Search and add product to cart:
      - Search for a product
      - Add it to the cart
      - Assert that the cart contains the product

    Testcase 1.4 - Checkout process:
      - Proceed to checkout
      - Fill in address and payment details
      - Assert order confirmation message
  */

  test.beforeEach(async ({ loginIfNeeded }) => {
    await loginIfNeeded();
  });
  // Testcase 1.1 - Register a new user
  test('Testcase 1.1 - Register a new user', async ({ page }) => {
    const home = new HomePage(page);
    const signup = new SignupPage(page);

    await home.goto();
    await home.navigateToSignupLogin();

    const uniqueEmail = `user_${Date.now()}@example.com`;
    await signup.startSignup('Test User', uniqueEmail);
    await signup.fillDetailsAndCreate('Password123!');

    await expect(page.getByText(/Congratulations! Your new account has been successfully created!/i)).toBeVisible();
  });

  // Testcase 1.2 - Login with valid credentials
  test('Testcase 1.2 - Login with valid credentials', async ({ page }) => {
    const home = new HomePage(page);
    const login = new LoginPage(page);

    await home.goto();
    await home.navigateToSignupLogin();

    const email = process.env.AE_EMAIL || 'daninho@gmail.com';
    const password = process.env.AE_PASSWORD || '123123';
    await login.login(email, password);
    await login.assertLoggedIn();
  });

  // Testcase 1.3 - Search and add product to cart
  test('Testcase 1.3 - Search and add product to cart', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);

    await home.goto();
    await home.navigateToProducts();
    await products.assertOnPage();
    await products.search('dress');
    await page.waitForTimeout(1000);
    await products.addFirstResultToCart();

    await home.navigateToCart();
    await cart.assertProductInCart('dress');
  });

  // Testcase 1.4 - Checkout process
  test('Testcase 1.4 - Checkout process', async ({ page }) => {
    const home = new HomePage(page);
    const products = new ProductsPage(page);
    const cart = new CartPage(page);
    const login = new LoginPage(page);

    await home.goto();

    // Ensure logged in - if env provided
    if (!(await page.getByText(/Logged in as/i).isVisible().catch(() => false))) {
      await home.navigateToSignupLogin();
      const email = process.env.AE_EMAIL || 'daninho@gmail.com';
      const password = process.env.AE_PASSWORD || '123123';
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
      await page.getByRole('link', { name: 'Place Order' }).click();
    }

    await page.waitForTimeout(1000);
    await page.locator('input[name="name_on_card"]').fill('DANI TEST USER');
    await page.locator('input[name="card_number"]').fill('4242424242424242');
    await page.getByRole('textbox', { name: 'ex.' }).fill('123');
    await page.getByRole('textbox', { name: 'MM' }).fill('12');
    await page.getByRole('textbox', { name: 'YYYY' }).fill('2030');
    await page.getByRole('button', { name: 'Pay and Confirm Order' }).click();
    await page.waitForTimeout(1000);
    // await page.pause();
    await expect(page.getByText('Congratulations! Your order has been confirmed!')).toBeVisible({ timeout: 15000 });
  });
});


