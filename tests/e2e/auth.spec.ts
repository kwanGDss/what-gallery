import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('signup page displays correctly', async ({ page }) => {
    await page.goto('/auth/signup')
    
    // Check split layout
    await expect(page.locator('[data-testid="auth-layout"]')).toBeVisible()
    await expect(page.locator('[data-testid="auth-form-section"]')).toBeVisible()
    await expect(page.locator('[data-testid="auth-image-section"]')).toBeVisible()
    
    // Check form elements
    await expect(page.locator('[data-testid="welcome-title"]')).toContainText('Welcome')
    await expect(page.locator('[data-testid="signup-form"]')).toBeVisible()
    await expect(page.locator('[data-testid="name-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="signup-button"]')).toBeVisible()
    
    // Check link to login
    await expect(page.locator('[data-testid="login-link"]')).toBeVisible()
    
    // Check Plot branding
    await expect(page.locator('[data-testid="brand-logo"]')).toBeVisible()
  })

  test('login page displays correctly', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Check split layout (same as signup)
    await expect(page.locator('[data-testid="auth-layout"]')).toBeVisible()
    await expect(page.locator('[data-testid="auth-form-section"]')).toBeVisible()
    await expect(page.locator('[data-testid="auth-image-section"]')).toBeVisible()
    
    // Check form elements
    await expect(page.locator('[data-testid="signin-form"]')).toBeVisible()
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="signin-button"]')).toBeVisible()
    
    // Check Google login button
    await expect(page.locator('[data-testid="google-signin-button"]')).toBeVisible()
    
    // Check link to signup
    await expect(page.locator('[data-testid="signup-link"]')).toBeVisible()
  })

  test('form validation works on signup', async ({ page }) => {
    await page.goto('/auth/signup')
    
    // Try to submit empty form
    await page.locator('[data-testid="signup-button"]').click()
    
    // Check validation errors appear
    await expect(page.locator('[data-testid="name-error"]')).toContainText('Name is required')
    await expect(page.locator('[data-testid="email-error"]')).toContainText('Email is required')
    await expect(page.locator('[data-testid="password-error"]')).toContainText('Password is required')
    
    // Fill invalid email
    await page.locator('[data-testid="email-input"]').fill('invalid-email')
    await page.locator('[data-testid="signup-button"]').click()
    
    await expect(page.locator('[data-testid="email-error"]')).toContainText('Invalid email')
    
    // Fill weak password
    await page.locator('[data-testid="password-input"]').fill('123')
    await page.locator('[data-testid="signup-button"]').click()
    
    await expect(page.locator('[data-testid="password-error"]')).toContainText('Password must be at least')
  })

  test('signup flow works', async ({ page }) => {
    // Mock successful signup API
    await page.route('/api/auth/signup', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 'user_new',
            name: 'John Doe',
            email: 'john@example.com',
            profilePicture: '/images/avatars/default.jpg'
          },
          token: 'mock-jwt-token',
          expiresAt: '2025-09-12T00:00:00Z'
        })
      })
    })
    
    await page.goto('/auth/signup')
    
    // Fill form
    await page.locator('[data-testid="name-input"]').fill('John Doe')
    await page.locator('[data-testid="email-input"]').fill('john@example.com')
    await page.locator('[data-testid="password-input"]').fill('securepassword123')
    
    // Submit form
    await page.locator('[data-testid="signup-button"]').click()
    
    // Should redirect to homepage
    await expect(page).toHaveURL('/')
    
    // Check user is logged in (user menu should be visible)
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
    await expect(page.locator('[data-testid="user-name"]')).toContainText('John Doe')
  })

  test('login flow works', async ({ page }) => {
    // Mock successful login API
    await page.route('/api/auth/signin', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 'user_001',
            name: 'AI_Artist_Pro',
            email: 'artist@example.com',
            profilePicture: '/images/avatars/ai-artist-pro.jpg'
          },
          token: 'mock-jwt-token',
          expiresAt: '2025-09-12T00:00:00Z'
        })
      })
    })
    
    await page.goto('/auth/signin')
    
    // Fill form
    await page.locator('[data-testid="email-input"]').fill('artist@example.com')
    await page.locator('[data-testid="password-input"]').fill('password123')
    
    // Submit form
    await page.locator('[data-testid="signin-button"]').click()
    
    // Should redirect to homepage
    await expect(page).toHaveURL('/')
    
    // Check user is logged in
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
    await expect(page.locator('[data-testid="user-name"]')).toContainText('AI_Artist_Pro')
  })

  test('Google OAuth works', async ({ page }) => {
    // Mock Google OAuth API
    await page.route('/api/auth/google', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 'user_google',
            name: 'Google User',
            email: 'google@example.com',
            profilePicture: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
          },
          token: 'mock-google-jwt',
          expiresAt: '2025-09-12T00:00:00Z'
        })
      })
    })
    
    await page.goto('/auth/signin')
    
    // Click Google login
    await page.locator('[data-testid="google-signin-button"]').click()
    
    // Should redirect to homepage (mocked OAuth flow)
    await expect(page).toHaveURL('/')
    
    // Check user is logged in
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
  })

  test('logout works', async ({ page }) => {
    // Set up logged in state
    await page.addInitScript(() => {
      localStorage.setItem('auth-token', 'mock-jwt-token')
      localStorage.setItem('user-data', JSON.stringify({
        id: 'user_001',
        name: 'Test User',
        email: 'test@example.com'
      }))
    })
    
    await page.goto('/')
    
    // Check user is logged in
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
    
    // Click user menu
    await page.locator('[data-testid="user-menu"]').click()
    await expect(page.locator('[data-testid="user-dropdown"]')).toBeVisible()
    
    // Mock logout API
    await page.route('/api/auth/signout', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Logged out successfully' })
      })
    })
    
    // Click logout
    await page.locator('[data-testid="logout-button"]').click()
    
    // Check user is logged out
    await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible()
    await expect(page.locator('[data-testid="signin-button"]')).toBeVisible()
  })

  test('protected actions require login', async ({ page }) => {
    await page.goto('/')
    
    // Try to favorite a post without login
    const firstPost = page.locator('[data-testid="post-card"]').first()
    await firstPost.hover()
    await page.locator('[data-testid="favorite-btn"]').first().click()
    
    // Should redirect to login page
    await expect(page).toHaveURL(/auth\/signin/)
    
    // Should show message about login requirement
    await expect(page.locator('[data-testid="login-required-message"]')).toContainText('Please log in to favorite posts')
  })

  test('auth forms are responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/auth/signin')
    
    // Check mobile layout
    await expect(page.locator('[data-testid="auth-layout"]')).toBeVisible()
    
    // Image section might be hidden on mobile
    const imageSection = page.locator('[data-testid="auth-image-section"]')
    const isVisible = await imageSection.isVisible()
    
    // Form section should be visible and take full width on mobile
    await expect(page.locator('[data-testid="auth-form-section"]')).toBeVisible()
    
    // Form should be functional on mobile
    await page.locator('[data-testid="email-input"]').fill('test@example.com')
    await page.locator('[data-testid="password-input"]').fill('password123')
    await expect(page.locator('[data-testid="signin-button"]')).toBeEnabled()
  })
})