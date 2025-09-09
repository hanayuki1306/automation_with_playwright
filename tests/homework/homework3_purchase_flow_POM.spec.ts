import { test } from '@playwright/test';
import { LoginPage } from '../../pageObjects/LoginPage';
import { InventoryPage } from '../../pageObjects/InventoryPage';
import { CartPage } from '../../pageObjects/CartPage';
import { CheckoutPage } from '../../pageObjects/CheckoutPage';
import { ConfirmationPage } from '../../pageObjects/ConfirmationPage';

// https://www.saucedemo.com/
// Goal:
// Use the Page Object Model (POM) design pattern to automate the end-to-end purchase flow on SauceDemo.

// Tasks:
// 1. Create Page Objects for the following pages:
//    - Login Page
//    - Inventory Page
//    - Cart Page
//    - Checkout Page
//    - Confirmation Page

// 2. Define Actions for each page:
//    - Login with valid credentials
//    - Add a specific product to the cart
//    - Navigate to the cart and proceed to checkout
//    - Fill in checkout information and complete the purchase
//    - Verify the confirmation message

// 3. Write a Test Case that:
//    - Logs in as a standard user
//    - Adds “Sauce Labs Backpack” to the cart
//    - Completes the checkout process
//    - Asserts that the order was successfully placed


test('SauceDemo E2E: Purchase flow with POM', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const confirmationPage = new ConfirmationPage(page);

  await loginPage.goto();
  await loginPage.login();
  await inventoryPage.addToCart('Sauce Labs Backpack');
  await inventoryPage.goToCart();
  await cartPage.verifyProductInCart('Sauce Labs Backpack');
  await cartPage.proceedToCheckout();
  await checkoutPage.fillCheckoutInfo('Son', 'NguyenPhi', '12345');
  await checkoutPage.finishCheckout();
  await confirmationPage.verifyOrderSuccess();
});
