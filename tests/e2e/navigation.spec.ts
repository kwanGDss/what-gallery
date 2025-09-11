import { test, expect } from '@playwright/test'

test.describe('Navigation & Filtering', () => {
  test('category tabs filtering works', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-testid="post-card"]')).toHaveCount(12, { timeout: 5000 })
    
    // Check all categories are visible
    await expect(page.locator('[data-testid="category-tab-photos"]')).toBeVisible()
    await expect(page.locator('[data-testid="category-tab-illustrations"]')).toBeVisible()
    await expect(page.locator('[data-testid="category-tab-3d"]')).toBeVisible()
    
    // Click on Photos category
    await page.locator('[data-testid="category-tab-photos"]').click()
    
    // Wait for URL to change
    await expect(page).toHaveURL(/category=photos|\/photos/)
    
    // Check active state
    await expect(page.locator('[data-testid="category-tab-photos"]')).toHaveAttribute('data-active', 'true')
    
    // Check filtered posts are shown
    await expect(page.locator('[data-testid="post-card"]')).toHaveCountGreaterThan(0)
    
    // All visible posts should be photos category
    const postCards = page.locator('[data-testid="post-card"]')
    const count = await postCards.count()
    for (let i = 0; i < count; i++) {
      await expect(postCards.nth(i)).toHaveAttribute('data-category', 'photos')
    }
  })

  test('search functionality works', async ({ page }) => {
    await page.goto('/')
    
    // Type in search bar
    const searchInput = page.locator('[data-testid="search-input"]')
    await searchInput.fill('cyberpunk')
    
    // Press Enter or wait for search
    await page.keyboard.press('Enter')
    
    // Check URL contains search query
    await expect(page).toHaveURL(/search.*cyberpunk/)
    
    // Check search results are shown
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible()
    await expect(page.locator('[data-testid="post-card"]')).toHaveCountGreaterThan(0)
    
    // Check search query is displayed
    await expect(page.locator('[data-testid="search-query"]')).toContainText('cyberpunk')
  })

  test('search suggestions work', async ({ page }) => {
    await page.goto('/')
    
    // Focus on search input
    const searchInput = page.locator('[data-testid="search-input"]')
    await searchInput.click()
    
    // Type partial query
    await searchInput.fill('cyber')
    
    // Check suggestions appear
    await expect(page.locator('[data-testid="search-suggestions"]')).toBeVisible()
    await expect(page.locator('[data-testid="suggestion-item"]')).toHaveCountGreaterThan(0)
    
    // Click on a suggestion
    await page.locator('[data-testid="suggestion-item"]').first().click()
    
    // Should perform search
    await expect(page).toHaveURL(/search/)
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible()
  })

  test('search filters work', async ({ page }) => {
    await page.goto('/search?q=cyberpunk')
    
    // Open filters
    await page.locator('[data-testid="search-filters-toggle"]').click()
    await expect(page.locator('[data-testid="search-filters"]')).toBeVisible()
    
    // Apply category filter
    await page.locator('[data-testid="filter-category-illustrations"]').click()
    
    // Apply AI tool filter
    await page.locator('[data-testid="filter-ai-tool"]').click()
    await page.locator('[data-testid="ai-tool-midjourney"]').click()
    
    // Apply filters
    await page.locator('[data-testid="apply-filters"]').click()
    
    // Check URL contains filters
    await expect(page).toHaveURL(/category=illustrations/)
    await expect(page).toHaveURL(/aiTool=Midjourney/)
    
    // Check filtered results
    await expect(page.locator('[data-testid="post-card"]')).toHaveCountGreaterThan(0)
  })

  test('navigation brand link works', async ({ page }) => {
    await page.goto('/search?q=test')
    
    // Click on Plot brand
    await page.locator('[data-testid="brand-link"]').click()
    
    // Should go back to homepage
    await expect(page).toHaveURL('/')
    await expect(page.locator('[data-testid="post-grid"]')).toBeVisible()
  })

  test('breadcrumb navigation works', async ({ page }) => {
    await page.goto('/search?q=cyberpunk&category=illustrations')
    
    // Check breadcrumbs are shown
    await expect(page.locator('[data-testid="breadcrumbs"]')).toBeVisible()
    await expect(page.locator('[data-testid="breadcrumb-home"]')).toBeVisible()
    await expect(page.locator('[data-testid="breadcrumb-search"]')).toBeVisible()
    
    // Click on home breadcrumb
    await page.locator('[data-testid="breadcrumb-home"]').click()
    
    // Should go to homepage
    await expect(page).toHaveURL('/')
  })

  test('pagination works', async ({ page }) => {
    await page.goto('/')
    
    // Scroll to bottom to trigger infinite scroll
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    
    // Check loading more posts
    await expect(page.locator('[data-testid="loading-more"]')).toBeVisible()
    
    // Wait for more posts to load
    await expect(page.locator('[data-testid="post-card"]')).toHaveCount(24, { timeout: 5000 })
    
    // Check load more is gone
    await expect(page.locator('[data-testid="loading-more"]')).not.toBeVisible()
  })

  test('sort options work', async ({ page }) => {
    await page.goto('/')
    
    // Open sort dropdown
    await page.locator('[data-testid="sort-dropdown"]').click()
    await expect(page.locator('[data-testid="sort-options"]')).toBeVisible()
    
    // Select "Most Popular"
    await page.locator('[data-testid="sort-popular"]').click()
    
    // Check URL contains sort parameter
    await expect(page).toHaveURL(/sortBy=popular/)
    
    // Check posts are reloaded
    await expect(page.locator('[data-testid="posts-loading"]')).toBeVisible()
    await expect(page.locator('[data-testid="post-card"]')).toHaveCount(12, { timeout: 5000 })
  })

  test('clear filters functionality', async ({ page }) => {
    await page.goto('/search?q=test&category=photos&aiTool=Midjourney')
    
    // Check filters are applied
    await expect(page.locator('[data-testid="active-filters"]')).toBeVisible()
    await expect(page.locator('[data-testid="filter-tag"]')).toHaveCount(3) // search + category + aiTool
    
    // Clear all filters
    await page.locator('[data-testid="clear-all-filters"]').click()
    
    // Should go back to homepage with no filters
    await expect(page).toHaveURL('/')
    await expect(page.locator('[data-testid="active-filters"]')).not.toBeVisible()
  })
})