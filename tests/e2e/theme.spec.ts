import { test, expect } from '@playwright/test'

test.describe('Theme Toggle', () => {
  test('theme toggle is accessible via hamburger menu', async ({ page }) => {
    await page.goto('/')
    
    // Open hamburger menu
    await page.locator('[data-testid="hamburger-menu-trigger"]').click()
    await expect(page.locator('[data-testid="hamburger-menu"]')).toBeVisible()
    
    // Check theme toggle is present
    await expect(page.locator('[data-testid="theme-toggle"]')).toBeVisible()
    
    // Check current theme indicator
    await expect(page.locator('[data-testid="current-theme"]')).toBeVisible()
  })

  test('theme switching works correctly', async ({ page }) => {
    await page.goto('/')
    
    // Check initial theme (should be system default)
    const htmlElement = page.locator('html')
    const initialTheme = await htmlElement.getAttribute('class')
    
    // Open hamburger menu
    await page.locator('[data-testid="hamburger-menu-trigger"]').click()
    
    // Switch to dark mode
    await page.locator('[data-testid="theme-dark"]').click()
    
    // Check dark class is applied
    await expect(htmlElement).toHaveClass(/dark/)
    
    // Check theme is persisted (localStorage)
    const savedTheme = await page.evaluate(() => localStorage.getItem('theme'))
    expect(savedTheme).toBe('dark')
    
    // Switch to light mode
    await page.locator('[data-testid="hamburger-menu-trigger"]').click()
    await page.locator('[data-testid="theme-light"]').click()
    
    // Check light class (dark class removed)
    await expect(htmlElement).not.toHaveClass(/dark/)
    
    // Check theme is persisted
    const lightTheme = await page.evaluate(() => localStorage.getItem('theme'))
    expect(lightTheme).toBe('light')
  })

  test('system theme detection works', async ({ page }) => {
    // Set system preference to dark
    await page.emulateMedia({ colorScheme: 'dark' })
    
    await page.goto('/')
    
    // Open hamburger menu
    await page.locator('[data-testid="hamburger-menu-trigger"]').click()
    
    // Select system theme
    await page.locator('[data-testid="theme-system"]').click()
    
    // Should apply dark theme based on system preference
    await expect(page.locator('html')).toHaveClass(/dark/)
    
    // Change system preference to light
    await page.emulateMedia({ colorScheme: 'light' })
    
    // Theme should update automatically
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })

  test('theme persists across page reloads', async ({ page }) => {
    await page.goto('/')
    
    // Set dark theme
    await page.locator('[data-testid="hamburger-menu-trigger"]').click()
    await page.locator('[data-testid="theme-dark"]').click()
    
    // Reload page
    await page.reload()
    
    // Theme should still be dark
    await expect(page.locator('html')).toHaveClass(/dark/)
    
    // Check theme toggle shows correct state
    await page.locator('[data-testid="hamburger-menu-trigger"]').click()
    await expect(page.locator('[data-testid="theme-dark"]')).toHaveAttribute('data-active', 'true')
  })

  test('theme toggle shows visual changes', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-testid="post-card"]')).toHaveCount(12, { timeout: 5000 })
    
    // Get background color in light theme
    const lightBg = await page.locator('body').evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    
    // Switch to dark theme
    await page.locator('[data-testid="hamburger-menu-trigger"]').click()
    await page.locator('[data-testid="theme-dark"]').click()
    
    // Wait for transition
    await page.waitForTimeout(300)
    
    // Get background color in dark theme
    const darkBg = await page.locator('body').evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    
    // Colors should be different
    expect(lightBg).not.toBe(darkBg)
    
    // Check that cards also change appearance
    const cardLightBg = await page.locator('[data-testid="post-card"]').first().evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    
    await page.locator('[data-testid="hamburger-menu-trigger"]').click()
    await page.locator('[data-testid="theme-light"]').click()
    await page.waitForTimeout(300)
    
    const cardDarkBg = await page.locator('[data-testid="post-card"]').first().evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    
    expect(cardLightBg).not.toBe(cardDarkBg)
  })

  test('theme toggle keyboard accessibility', async ({ page }) => {
    await page.goto('/')
    
    // Navigate to hamburger menu with keyboard
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab') // Focus might be on search first
    await page.keyboard.press('Tab') // Then hamburger menu
    
    // Open menu with Enter
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-testid="hamburger-menu"]')).toBeVisible()
    
    // Navigate to theme toggle
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab') // Navigate to theme section
    
    // Change theme with keyboard
    await page.keyboard.press('ArrowDown') // Navigate to dark theme
    await page.keyboard.press('Enter')
    
    // Check theme changed
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('theme toggle shows current selection', async ({ page }) => {
    await page.goto('/')
    
    // Open hamburger menu
    await page.locator('[data-testid="hamburger-menu-trigger"]').click()
    
    // Check default theme indicator
    const systemOption = page.locator('[data-testid="theme-system"]')
    await expect(systemOption).toHaveAttribute('data-active', 'true')
    
    // Switch to dark
    await page.locator('[data-testid="theme-dark"]').click()
    
    // Reopen menu
    await page.locator('[data-testid="hamburger-menu-trigger"]').click()
    
    // Check dark is selected
    await expect(page.locator('[data-testid="theme-dark"]')).toHaveAttribute('data-active', 'true')
    await expect(systemOption).toHaveAttribute('data-active', 'false')
  })

  test('theme works in modal dialogs', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-testid="post-card"]')).toHaveCount(12, { timeout: 5000 })
    
    // Set dark theme
    await page.locator('[data-testid="hamburger-menu-trigger"]').click()
    await page.locator('[data-testid="theme-dark"]').click()
    
    // Open post modal
    await page.locator('[data-testid="post-card"]').first().click()
    await expect(page.locator('[data-testid="post-modal"]')).toBeVisible()
    
    // Check modal has dark theme applied
    const modalBg = await page.locator('[data-testid="post-modal"]').evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    
    // Modal should have dark background
    expect(modalBg).not.toBe('rgb(255, 255, 255)') // Not white
    
    // Close modal
    await page.keyboard.press('Escape')
    
    // Switch to light theme
    await page.locator('[data-testid="hamburger-menu-trigger"]').click()
    await page.locator('[data-testid="theme-light"]').click()
    
    // Open modal again
    await page.locator('[data-testid="post-card"]').first().click()
    await expect(page.locator('[data-testid="post-modal"]')).toBeVisible()
    
    // Check modal has light theme
    const lightModalBg = await page.locator('[data-testid="post-modal"]').evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    
    // Should be different from dark theme
    expect(lightModalBg).not.toBe(modalBg)
  })

  test('theme icon changes based on selection', async ({ page }) => {
    await page.goto('/')
    
    await page.locator('[data-testid="hamburger-menu-trigger"]').click()
    
    // Check theme icons are present
    await expect(page.locator('[data-testid="theme-light"] svg')).toBeVisible()
    await expect(page.locator('[data-testid="theme-dark"] svg')).toBeVisible()
    await expect(page.locator('[data-testid="theme-system"] svg')).toBeVisible()
    
    // Icons should be different for each theme
    const lightIcon = await page.locator('[data-testid="theme-light"] svg').getAttribute('data-icon')
    const darkIcon = await page.locator('[data-testid="theme-dark"] svg').getAttribute('data-icon')
    const systemIcon = await page.locator('[data-testid="theme-system"] svg').getAttribute('data-icon')
    
    expect(lightIcon).not.toBe(darkIcon)
    expect(lightIcon).not.toBe(systemIcon)
    expect(darkIcon).not.toBe(systemIcon)
  })
})