import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthForm } from '@/components/auth/AuthForm'
import '@testing-library/jest-dom'

const mockProps = {
  mode: 'signin' as const,
  onSubmit: jest.fn(),
  onGoogleAuth: jest.fn(),
  onToggleMode: jest.fn(),
  loading: false
}

describe('AuthForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Sign In Mode', () => {
    it('renders sign in form correctly', () => {
      render(<AuthForm {...mockProps} mode="signin" />)
      
      expect(screen.getByText('Welcome Back')).toBeInTheDocument()
      expect(screen.getByText('Sign in to your Plot account')).toBeInTheDocument()
      expect(screen.getByTestId('signin-form')).toBeInTheDocument()
      expect(screen.getByTestId('email-input')).toBeInTheDocument()
      expect(screen.getByTestId('password-input')).toBeInTheDocument()
      expect(screen.getByText('Sign In')).toBeInTheDocument()
    })

    it('does not show name and confirm password fields in signin mode', () => {
      render(<AuthForm {...mockProps} mode="signin" />)
      
      expect(screen.queryByTestId('name-input')).not.toBeInTheDocument()
      expect(screen.queryByTestId('confirm-password-input')).not.toBeInTheDocument()
    })

    it('submits form with email and password', async () => {
      const user = userEvent.setup()
      render(<AuthForm {...mockProps} mode="signin" />)
      
      await user.type(screen.getByTestId('email-input'), 'test@example.com')
      await user.type(screen.getByTestId('password-input'), 'password123')
      
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)
      
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        name: '',
        confirmPassword: ''
      })
    })
  })

  describe('Sign Up Mode', () => {
    it('renders sign up form correctly', () => {
      render(<AuthForm {...mockProps} mode="signup" />)
      
      expect(screen.getByText('Create Account')).toBeInTheDocument()
      expect(screen.getByText('Join Plot to discover amazing AI content')).toBeInTheDocument()
      expect(screen.getByTestId('signup-form')).toBeInTheDocument()
      expect(screen.getByTestId('name-input')).toBeInTheDocument()
      expect(screen.getByTestId('email-input')).toBeInTheDocument()
      expect(screen.getByTestId('password-input')).toBeInTheDocument()
      expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument()
      expect(screen.getByText('Create Account')).toBeInTheDocument()
    })

    it('submits form with all required fields', async () => {
      const user = userEvent.setup()
      render(<AuthForm {...mockProps} mode="signup" />)
      
      await user.type(screen.getByTestId('name-input'), 'John Doe')
      await user.type(screen.getByTestId('email-input'), 'john@example.com')
      await user.type(screen.getByTestId('password-input'), 'password123')
      await user.type(screen.getByTestId('confirm-password-input'), 'password123')
      
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)
      
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      })
    })
  })

  describe('Form Validation', () => {
    it('validates email format', async () => {
      const user = userEvent.setup()
      render(<AuthForm {...mockProps} mode="signin" />)
      
      await user.type(screen.getByTestId('email-input'), 'invalid-email')
      await user.type(screen.getByTestId('password-input'), 'password123')
      
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)
      
      expect(screen.getByText('Email is invalid')).toBeInTheDocument()
      expect(mockProps.onSubmit).not.toHaveBeenCalled()
    })

    it('validates required email', async () => {
      const user = userEvent.setup()
      render(<AuthForm {...mockProps} mode="signin" />)
      
      await user.type(screen.getByTestId('password-input'), 'password123')
      
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)
      
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(mockProps.onSubmit).not.toHaveBeenCalled()
    })

    it('validates required password', async () => {
      const user = userEvent.setup()
      render(<AuthForm {...mockProps} mode="signin" />)
      
      await user.type(screen.getByTestId('email-input'), 'test@example.com')
      
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)
      
      expect(screen.getByText('Password is required')).toBeInTheDocument()
      expect(mockProps.onSubmit).not.toHaveBeenCalled()
    })

    it('validates password length', async () => {
      const user = userEvent.setup()
      render(<AuthForm {...mockProps} mode="signin" />)
      
      await user.type(screen.getByTestId('email-input'), 'test@example.com')
      await user.type(screen.getByTestId('password-input'), 'short')
      
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)
      
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()
      expect(mockProps.onSubmit).not.toHaveBeenCalled()
    })

    it('validates required name in signup mode', async () => {
      const user = userEvent.setup()
      render(<AuthForm {...mockProps} mode="signup" />)
      
      await user.type(screen.getByTestId('email-input'), 'test@example.com')
      await user.type(screen.getByTestId('password-input'), 'password123')
      await user.type(screen.getByTestId('confirm-password-input'), 'password123')
      
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)
      
      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(mockProps.onSubmit).not.toHaveBeenCalled()
    })

    it('validates password confirmation in signup mode', async () => {
      const user = userEvent.setup()
      render(<AuthForm {...mockProps} mode="signup" />)
      
      await user.type(screen.getByTestId('name-input'), 'John Doe')
      await user.type(screen.getByTestId('email-input'), 'test@example.com')
      await user.type(screen.getByTestId('password-input'), 'password123')
      await user.type(screen.getByTestId('confirm-password-input'), 'different')
      
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)
      
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
      expect(mockProps.onSubmit).not.toHaveBeenCalled()
    })

    it('clears field errors when user starts typing', async () => {
      const user = userEvent.setup()
      render(<AuthForm {...mockProps} mode="signin" />)
      
      // Trigger validation error
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)
      
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      
      // Start typing in email field
      await user.type(screen.getByTestId('email-input'), 'test')
      
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument()
    })
  })

  describe('Password Visibility', () => {
    it('toggles password visibility', async () => {
      const user = userEvent.setup()
      render(<AuthForm {...mockProps} mode="signin" />)
      
      const passwordInput = screen.getByTestId('password-input')
      expect(passwordInput).toHaveAttribute('type', 'password')
      
      const toggleButton = screen.getByRole('button', { name: /show password/i })
      await user.click(toggleButton)
      
      expect(passwordInput).toHaveAttribute('type', 'text')
      
      await user.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('toggles confirm password visibility in signup mode', async () => {
      const user = userEvent.setup()
      render(<AuthForm {...mockProps} mode="signup" />)
      
      const confirmPasswordInput = screen.getByTestId('confirm-password-input')
      expect(confirmPasswordInput).toHaveAttribute('type', 'password')
      
      const toggleButtons = screen.getAllByRole('button', { name: /show password/i })
      const confirmToggleButton = toggleButtons[1] // Second toggle button
      
      await user.click(confirmToggleButton)
      expect(confirmPasswordInput).toHaveAttribute('type', 'text')
    })
  })

  describe('Loading State', () => {
    it('shows loading state when loading prop is true', () => {
      render(<AuthForm {...mockProps} loading={true} />)
      
      expect(screen.getByText('Signing In...')).toBeInTheDocument()
      expect(screen.getByTestId('submit-button')).toBeDisabled()
    })

    it('disables form inputs when loading', () => {
      render(<AuthForm {...mockProps} loading={true} />)
      
      expect(screen.getByTestId('email-input')).toBeDisabled()
      expect(screen.getByTestId('password-input')).toBeDisabled()
      expect(screen.getByTestId('google-signin-button')).toBeDisabled()
    })

    it('shows correct loading text for signup mode', () => {
      render(<AuthForm {...mockProps} mode="signup" loading={true} />)
      
      expect(screen.getByText('Creating Account...')).toBeInTheDocument()
    })
  })

  describe('Error Display', () => {
    it('displays error message when provided', () => {
      render(<AuthForm {...mockProps} error="Invalid credentials" />)
      
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })

    it('does not display error container when no error', () => {
      render(<AuthForm {...mockProps} />)
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('Google Authentication', () => {
    it('calls onGoogleAuth when Google button is clicked', async () => {
      const user = userEvent.setup()
      render(<AuthForm {...mockProps} />)
      
      const googleButton = screen.getByTestId('google-signin-button')
      await user.click(googleButton)
      
      expect(mockProps.onGoogleAuth).toHaveBeenCalled()
    })

    it('shows Google button with correct text', () => {
      render(<AuthForm {...mockProps} />)
      
      expect(screen.getByText('Continue with Google')).toBeInTheDocument()
    })
  })

  describe('Mode Toggle', () => {
    it('calls onToggleMode when toggle link is clicked', async () => {
      const user = userEvent.setup()
      render(<AuthForm {...mockProps} mode="signin" />)
      
      const toggleLink = screen.getByTestId('toggle-auth-mode')
      await user.click(toggleLink)
      
      expect(mockProps.onToggleMode).toHaveBeenCalled()
    })

    it('shows correct toggle text for signin mode', () => {
      render(<AuthForm {...mockProps} mode="signin" />)
      
      expect(screen.getByText("Don't have an account? Sign Up")).toBeInTheDocument()
    })

    it('shows correct toggle text for signup mode', () => {
      render(<AuthForm {...mockProps} mode="signup" />)
      
      expect(screen.getByText('Already have an account? Sign In')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper form structure and labels', () => {
      render(<AuthForm {...mockProps} />)
      
      expect(screen.getByRole('form')).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    })

    it('associates error messages with form fields', async () => {
      const user = userEvent.setup()
      render(<AuthForm {...mockProps} mode="signin" />)
      
      const submitButton = screen.getByTestId('submit-button')
      await user.click(submitButton)
      
      const emailInput = screen.getByTestId('email-input')
      const errorMessage = screen.getByText('Email is required')
      
      expect(emailInput).toHaveAttribute('aria-describedby')
      expect(errorMessage).toHaveAttribute('id')
    })

    it('applies custom className', () => {
      render(<AuthForm {...mockProps} className="custom-auth-form" />)
      
      const form = screen.getByTestId('auth-form')
      expect(form).toHaveClass('custom-auth-form')
    })
  })
})