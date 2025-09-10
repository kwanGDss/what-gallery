import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads and displays posts', async ({ page }) => {
    await page.goto('/')
    
    // Check navigation is present
    await expect(page.locator('[data-testid="navigation"]')).toBeVisible()
    
    // Check Plot branding is visible
    await expect(page.locator('text=Plot')).toBeVisible()
    
    // Check category tabs are present
    await expect(page.locator('[data-testid="category-tabs"]')).toBeVisible()
    
    // Check search bar is present
    await expect(page.locator('[data-testid="search-bar"]')).toBeVisible()
    
    // Check posts are loaded
    await expect(page.locator('[data-testid="post-grid"]')).toBeVisible()
    await expect(page.locator('[data-testid="post-card"]')).toHaveCount(12) // Initial load
  })

  test('displays correct page title and meta', async ({ page }) => {
    await page.goto('/')
    
    // Check page title
    await expect(page).toHaveTitle(/Plot.*AI.*Gallery/)
    
    // Check meta description exists
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /AI.*generated.*content.*gallery/)
  })

  test('shows loading state while fetching posts', async ({ page }) => {
    // Intercept API call to delay it
    await page.route('/api/posts*', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await route.continue()
    })
    
    await page.goto('/')
    
    // Check loading state is shown
    await expect(page.locator('[data-testid="posts-loading"]')).toBeVisible()
    
    // Wait for posts to load
    await expect(page.locator('[data-testid="post-card"]')).toHaveCount(12, { timeout: 5000 })
    
    // Loading state should disappear
    await expect(page.locator('[data-testid="posts-loading"]')).not.toBeVisible()
  })

  test('displays featured posts section', async ({ page }) => {
    await page.goto('/')
    
    // Check featured posts section exists
    await expect(page.locator('[data-testid="featured-posts"]')).toBeVisible()
    
    // Should have at least 3 featured posts
    await expect(page.locator('[data-testid="featured-posts"] [data-testid="post-card"]')).toHaveCount(6, { timeout: 3000 })
  })

  test('is responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check mobile navigation (hamburger menu)
    await expect(page.locator('[data-testid="hamburger-menu-trigger"]')).toBeVisible()
    
    // Check responsive post grid (should show fewer columns)
    const postCards = page.locator('[data-testid="post-card"]')
    await expect(postCards.first()).toBeVisible()
    
    // Check category tabs are horizontally scrollable on mobile
    await expect(page.locator('[data-testid="category-tabs"]')).toBeVisible()
  })
})