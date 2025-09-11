import { test, expect } from '@playwright/test'

test.describe('Post Interactions', () => {
  test('post hover effects work correctly', async ({ page }) => {
    await page.goto('/')
    
    // Wait for posts to load
    await expect(page.locator('[data-testid="post-card"]')).toHaveCount(12, { timeout: 5000 })
    
    // Hover over first post
    const firstPost = page.locator('[data-testid="post-card"]').first()
    await firstPost.hover()
    
    // Check hover overlay appears
    await expect(firstPost.locator('[data-testid="post-overlay"]')).toBeVisible()
    
    // Check creator info is shown
    await expect(firstPost.locator('[data-testid="creator-info"]')).toBeVisible()
    
    // Check action buttons appear
    await expect(firstPost.locator('[data-testid="download-btn"]')).toBeVisible()
    await expect(firstPost.locator('[data-testid="favorite-btn"]')).toBeVisible()
    
    // Move mouse away and overlay should disappear
    await page.mouse.move(0, 0)
    await expect(firstPost.locator('[data-testid="post-overlay"]')).not.toBeVisible()
  })

  test('post modal opens and displays correct content', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-testid="post-card"]')).toHaveCount(12, { timeout: 5000 })
    
    // Click on first post
    const firstPost = page.locator('[data-testid="post-card"]').first()
    await firstPost.click()
    
    // Check modal opens
    await expect(page.locator('[data-testid="post-modal"]')).toBeVisible()
    
    // Check modal content
    await expect(page.locator('[data-testid="modal-post-image"]')).toBeVisible()
    await expect(page.locator('[data-testid="modal-post-title"]')).toBeVisible()
    await expect(page.locator('[data-testid="modal-post-description"]')).toBeVisible()
    await expect(page.locator('[data-testid="modal-creator-profile"]')).toBeVisible()
    await expect(page.locator('[data-testid="modal-post-stats"]')).toBeVisible()
    await expect(page.locator('[data-testid="modal-post-tags"]')).toBeVisible()
    await expect(page.locator('[data-testid="modal-ai-tool"]')).toBeVisible()
    
    // Check action buttons in modal
    await expect(page.locator('[data-testid="modal-download-btn"]')).toBeVisible()
    await expect(page.locator('[data-testid="modal-favorite-btn"]')).toBeVisible()
    
    // Check similar posts section
    await expect(page.locator('[data-testid="similar-posts"]')).toBeVisible()
    await expect(page.locator('[data-testid="similar-posts"] [data-testid="post-card"]')).toHaveCountGreaterThan(0)
  })

  test('modal closes correctly', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-testid="post-card"]')).toHaveCount(12, { timeout: 5000 })
    
    // Open modal
    await page.locator('[data-testid="post-card"]').first().click()
    await expect(page.locator('[data-testid="post-modal"]')).toBeVisible()
    
    // Close with X button
    await page.locator('[data-testid="modal-close-btn"]').click()
    await expect(page.locator('[data-testid="post-modal"]')).not.toBeVisible()
    
    // Open modal again
    await page.locator('[data-testid="post-card"]').first().click()
    await expect(page.locator('[data-testid="post-modal"]')).toBeVisible()
    
    // Close with ESC key
    await page.keyboard.press('Escape')
    await expect(page.locator('[data-testid="post-modal"]')).not.toBeVisible()
    
    // Open modal again
    await page.locator('[data-testid="post-card"]').first().click()
    await expect(page.locator('[data-testid="post-modal"]')).toBeVisible()
    
    // Close by clicking backdrop
    await page.locator('[data-testid="modal-backdrop"]').click({ position: { x: 10, y: 10 } })
    await expect(page.locator('[data-testid="post-modal"]')).not.toBeVisible()
  })

  test('download functionality works', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-testid="post-card"]')).toHaveCount(12, { timeout: 5000 })
    
    // Test download from hover overlay
    const firstPost = page.locator('[data-testid="post-card"]').first()
    await firstPost.hover()
    
    // Mock download API
    await page.route('/api/posts/*/download', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ downloadUrl: '/images/posts/test.jpg', tracked: true })
      })
    })
    
    await page.locator('[data-testid="download-btn"]').first().click()
    
    // Should show download success indicator or start download
    await expect(page.locator('[data-testid="download-success"]')).toBeVisible({ timeout: 3000 })
  })

  test('favorite functionality works', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-testid="post-card"]')).toHaveCount(12, { timeout: 5000 })
    
    // Test favorite from hover overlay
    const firstPost = page.locator('[data-testid="post-card"]').first()
    await firstPost.hover()
    
    const favoriteBtn = page.locator('[data-testid="favorite-btn"]').first()
    
    // Mock favorite API
    await page.route('/api/posts/*/favorite', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, favorited: true })
      })
    })
    
    await favoriteBtn.click()
    
    // Button should change state to indicate favorited
    await expect(favoriteBtn).toHaveAttribute('data-favorited', 'true')
  })

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-testid="post-card"]')).toHaveCount(12, { timeout: 5000 })
    
    // Focus on first post card
    await page.locator('[data-testid="post-card"]').first().focus()
    
    // Press Enter to open modal
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-testid="post-modal"]')).toBeVisible()
    
    // Tab through modal elements
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="modal-download-btn"]')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="modal-favorite-btn"]')).toBeFocused()
    
    // ESC to close
    await page.keyboard.press('Escape')
    await expect(page.locator('[data-testid="post-modal"]')).not.toBeVisible()
  })
})