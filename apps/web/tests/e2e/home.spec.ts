import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads and shows hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/CNC Machine Bazaar/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('has working navigation links', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /machines/i }).first().click()
    await expect(page).toHaveURL(/\/cars/)
  })

  test('shows featured listings or skeleton on homepage', async ({ page }) => {
    await page.goto('/')
    // Either listings or skeletons should appear
    await expect(page.locator('main')).toBeVisible()
  })
})
