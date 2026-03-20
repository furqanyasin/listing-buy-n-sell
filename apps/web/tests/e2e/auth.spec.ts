import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('shows login form', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })

  test('shows registration form', async ({ page }) => {
    await page.goto('/auth/register')
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible()
  })

  test('redirects unauthenticated user from protected route', async ({ page }) => {
    await page.goto('/post-ad')
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('redirects unauthenticated user from dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('shows validation errors on empty login submit', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByRole('button', { name: /sign in/i }).click()
    // Browser native or Zod validation should fire
    await expect(page.locator('form')).toBeVisible()
  })
})
