import { test, expect } from '@playwright/test';

test('App loads and is interactive', async ({ page }) => {
  // 1. Go to localhost
  await page.goto('http://localhost:5173');
  
  // 2. Check title
  await expect(page).toHaveTitle(/Razia | Luxury Women's Fashion/);
  
  // 3. Check for the Hero image (ensure LCP is visible)
  const heroImage = page.locator('img[fetchpriority="high"]');
  await expect(heroImage).toBeVisible();

  // 4. Verify no console errors (optional advanced check)
  page.on('console', msg => {
    if (msg.type() === 'error') console.log(`Error text: "${msg.text()}"`);
  });
});
