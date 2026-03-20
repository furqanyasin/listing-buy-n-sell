import { test, expect } from '@playwright/test'

test.describe('Listings', () => {
  test('shows listings page with search', async ({ page }) => {
    await page.goto('/cars')
    await expect(page.getByPlaceholder(/search/i)).toBeVisible()
  })

  test('filters work with URL sync', async ({ page }) => {
    await page.goto('/cars')
    // URL should update when typing in search
    await page.getByPlaceholder(/search/i).fill('Toyota')
    await page.getByPlaceholder(/search/i).press('Enter')
    await expect(page).toHaveURL(/q=Toyota/)
  })

  test('clicking a listing card navigates to detail', async ({ page }) => {
    await page.goto('/cars')
    const firstCard = page.locator('a[href^="/cars/"]').first()
    const href = await firstCard.getAttribute('href')
    if (href) {
      await firstCard.click()
      await expect(page).toHaveURL(href)
    }
  })
})
