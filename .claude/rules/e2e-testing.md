# E2E Testing Specification

> This file extends [common/testing.md](./testing.md) with Playwright-specific E2E testing patterns.

## Overview

E2E tests verify critical user journeys work correctly in a real browser environment. This project uses **Playwright** for end-to-end testing.

## Tech Stack

- **Framework**: Playwright (Node.js)
- **Browser**: Chromium, Firefox, WebKit
- **Language**: TypeScript
- **Test Runner**: @playwright/test

---

## Project Structure

```
frontend/
├── e2e/
│   ├── playwright.config.ts    # Playwright configuration
│   ├── tests/
│   │   ├── auth/               # Authentication flows
│   │   │   ├── login.spec.ts
│   │   │   └── logout.spec.ts
│   │   ├── critical/          # Critical user journeys (HIGH priority)
│   │   │   ├── checkout.spec.ts
│   │   │   └── payment.spec.ts
│   │   └── common/            # Shared utilities and page objects
│   │       ├── pages/
│   │       │   ├── BasePage.ts
│   │       │   ├── LoginPage.ts
│   │       │   └── DashboardPage.ts
│   │       └── components/
│   │           └── Navbar.ts
│   ├── reports/               # HTML reports output
│   └── videos/                # Video recordings (on failure)
│       └── traces/            # Trace files for debugging
```

---

## Installation

```bash
cd /Users/anthony/Desktop/Defo/frontend

# Initialize if needed
npm init -y

# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit

# Install dependencies for testing
npm install -D @types/node
```

---

## Configuration

### `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'e2e/reports' }],
    ['json', { outputFile: 'e2e/reports/results.json' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: process.env.CI
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
      },
});
```

---

## Test Organization

### Priority Levels

| Priority | Description | Flakiness Tolerance |
|----------|-------------|---------------------|
| **HIGH** | Auth, payments, checkout | 0% (must be stable) |
| **MEDIUM** | Search, navigation, forms | < 5% |
| **LOW** | UI polish, animations | < 10% |

### Critical User Journeys (HIGH Priority)

1. **Authentication Flow**
   - Login with email/password
   - Logout
   - Session persistence

2. **Core Business Flows**
   - User registration
   - Product search and filtering
   - Add to cart
   - Checkout process
   - Payment submission

---

## Page Object Model

### Base Page (`tests/common/pages/BasePage.ts`)

```typescript
import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;
  protected baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'http://localhost:5173';
  }

  async navigate(path: string = '') {
    await this.page.goto(`${this.baseURL}${path}`);
    await this.waitForLoadState('networkidle');
  }

  async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded') {
    await this.page.waitForLoadState(state);
  }

  async click(locator: Locator) {
    await locator.click();
  }

  async fill(locator: Locator, value: string) {
    await locator.fill(value);
  }

  async expectVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async expectText(locator: Locator, text: string) {
    await expect(locator).toHaveText(text);
  }

  async getAttribute(locator: Locator, attribute: string): Promise<string | null> {
    return locator.getAttribute(attribute);
  }
}
```

### Login Page Example (`tests/common/pages/LoginPage.ts`)

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('[data-testid="login-email"]');
    this.passwordInput = page.locator('[data-testid="login-password"]');
    this.submitButton = page.locator('[data-testid="login-submit"]');
    this.errorMessage = page.locator('[data-testid="login-error"]');
  }

  async goto() {
    await this.navigate('/login');
  }

  async login(email: string, password: string) {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.submitButton);
  }

  async expectErrorVisible() {
    await this.expectVisible(this.errorMessage);
  }
}
```

---

## Test Examples

### Authentication Test

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../common/pages/LoginPage';

test.describe('Authentication', () => {
  test('successful login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('test@example.com', 'password123');

    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-welcome"]')).toBeVisible();
  });

  test('failed login with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('invalid@example.com', 'wrongpassword');

    await loginPage.expectErrorVisible();
    await expect(page).toHaveURL('/login');
  });
});
```

### Checkout Flow Test

```typescript
import { test, expect } from '@playwright/test';
import { ProductPage } from '../../common/pages/ProductPage';
import { CartPage } from '../../common/pages/CartPage';
import { CheckoutPage } from '../../common/pages/CheckoutPage';

test.describe('Checkout Flow', () => {
  test('complete purchase flow', async ({ page }) => {
    // 1. Browse products
    const productPage = new ProductPage(page);
    await productPage.goto();
    await productPage.selectProduct('Test Product');

    // 2. Add to cart
    await productPage.addToCart();
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');

    // 3. Go to cart
    await productPage.goToCart();
    const cartPage = new CartPage(page);
    await expect(cartPage.cartTotal).toBeVisible();

    // 4. Proceed to checkout
    await cartPage.proceedToCheckout();
    const checkoutPage = new CheckoutPage(page);

    // 5. Fill checkout form
    await checkoutPage.fillShippingInfo({
      name: 'Test User',
      address: '123 Test St',
      city: 'Test City',
      zipCode: '12345',
    });
    await checkoutPage.fillPaymentInfo({
      cardNumber: '4242424242424242',
      expiry: '12/26',
      cvv: '123',
    });

    // 6. Submit order
    await checkoutPage.submitOrder();

    // 7. Verify success
    await expect(page.locator('[data-testid="order-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="order-id"]')).toBeVisible();
  });
});
```

---

## Test Commands

### Local Development

```bash
cd /Users/anthony/Desktop/Defo/frontend

# Run all tests (headed - see browser)
npx playwright test --headed

# Run all tests (headless - CI mode)
npx playwright test

# Run specific test file
npx playwright test e2e/tests/auth/login.spec.ts

# Run tests with UI
npx playwright test --ui

# Debug tests
npx playwright test --debug

# Run tests in specific browser
npx playwright test --project=chromium
```

### CI/CD

```bash
# Run all tests with trace on first retry
npx playwright test --trace on-first-retry

# Run with retry on failure
npx playwright test --retries=2

# Generate HTML report
npx playwright show-report

# Upload artifacts (CI)
npx playwright upload-artifact e2e/reports
npx playwright upload-artifact e2e/videos
npx playwright upload-artifact e2e/traces
```

### Flaky Test Detection

```bash
# Run same test multiple times
npx playwright test --repeat-each=10 e2e/tests/auth/login.spec.ts

# Run with sharding
npx playwright test --shard=1/3
npx playwright test --shard=2/3
npx playwright test --shard=3/3
```

---

## Locator Strategy (Priority Order)

1. **data-testid** (highest priority - most stable)
   ```html
   <button data-testid="login-submit">Submit</button>
   ```
   ```typescript
   page.locator('[data-testid="login-submit"]')
   ```

2. **Role + Text** (semantic)
   ```typescript
   page.getByRole('button', { name: 'Submit' })
   page.getByLabel('Email')
   page.getByPlaceholder('Enter email')
   ```

3. **CSS Selectors** (avoid when possible)
   ```typescript
   page.locator('.login-form .submit-btn')
   ```

4. **XPath** (last resort)
   ```typescript
   page.locator('//button[contains(@class, "submit")]')
   ```

---

## Flaky Test Handling

### Quarantine Pattern

```typescript
// Mark flaky test for investigation
test('flaky: market search', async ({ page }) => {
  test.fixme(true, 'Issue #123 - Flaky on WebKit');
});

// Conditional skip
test('only runs on chromium', async ({ page }) => {
  test.skip(browserName === 'webkit', 'Not supported on WebKit');
});
```

### Common Flaky Test Causes

| Cause | Solution |
|-------|----------|
| Race condition | Use auto-wait locators (`locator.click()` not `page.click()`) |
| Network timing | Wait for `networkidle` or specific response |
| Animation timing | Wait for element to be actionable |
| Test isolation | Each test manages its own state |

---

## Artifacts

### Report Location

- **HTML Report**: `frontend/e2e/reports/index.html`
- **JSON Results**: `frontend/e2e/reports/results.json`
- **Videos**: `frontend/e2e/videos/`
- **Traces**: `frontend/e2e/traces/`

### Artifact Retention (CI)

```yaml
# .github/workflows/e2e.yml
- name: Upload Playwright Report
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report
    path: frontend/e2e/reports/
    retention-days: 30

- name: Upload Playwright Videos
  uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: playwright-videos
    path: frontend/e2e/videos/
    retention-days: 7

- name: Upload Playwright Traces
  uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: playwright-traces
    path: frontend/e2e/traces/
    retention-days: 14
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Critical journeys pass rate | 100% |
| Overall pass rate | > 95% |
| Flaky rate | < 5% |
| Test duration | < 10 minutes |
| Coverage (critical paths) | 100% |

---

## CI Integration

### GitHub Actions Workflow

Create `.github/workflows/e2e.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  e2e:
    timeout-minutes: 30
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Install Playwright browsers
        run: |
          cd frontend
          npx playwright install --with-deps chromium

      - name: Run E2E tests
        run: |
          cd frontend
          npx playwright test
        env:
          BASE_URL: ${{ secrets.BASE_URL || 'http://localhost:5173' }}

      - name: Upload Playwright Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: frontend/e2e/reports/
          retention-days: 30

      - name: Upload Playwright Videos
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-videos-${{ github.run_id }}
          path: frontend/e2e/videos/
          retention-days: 7
```

---

## Adding New Tests

1. **Identify the user journey** - Map to priority level (HIGH/MEDIUM/LOW)
2. **Create page objects** - Add to `tests/common/pages/`
3. **Write test** - Follow POM pattern
4. **Run locally 3-5 times** - Check for flakiness
5. **Add to CI** - Include in GitHub Actions workflow

### Test Checklist

- [ ] Uses `data-testid` locators (preferred)
- [ ] Waits for networkidle or specific responses
- [ ] Has proper assertions at each step
- [ ] Cleans up state after test
- [ ] Is independent (no shared state)
- [ ] Runs successfully 3-5 times locally
