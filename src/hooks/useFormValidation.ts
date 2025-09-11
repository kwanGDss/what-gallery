"use client"

import { useState, useCallback, useMemo } from 'react'

type ValidationRule<T> = {
  test: (value: T) => boolean
  message: string
}

type FieldValidation<T> = ValidationRule<T>[]

type FormValidation<T extends Record<string, any>> = {
  [K in keyof T]?: FieldValidation<T[K]>
}

type ValidationErrors<T extends Record<string, any>> = {
  [K in keyof T]?: string
}

type ValidationState<T extends Record<string, any>> = {
  [K in keyof T]?: {
    isValid: boolean
    error?: string
    touched: boolean
  }
}

interface UseFormValidationOptions {
  validateOnChange?: boolean
  validateOnBlur?: boolean
  debounceMs?: number
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validation: FormValidation<T>,
  options: UseFormValidationOptions = {}
) {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    debounceMs = 300
  } = options

  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<ValidationErrors<T>>({})
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validate a single field
  const validateField = useCallback((name: keyof T, value: T[keyof T]): string | undefined => {
    const fieldValidation = validation[name]
    if (!fieldValidation) return undefined

    for (const rule of fieldValidation) {
      if (!rule.test(value)) {
        return rule.message
      }
    }
    return undefined
  }, [validation])

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors: ValidationErrors<T> = {}
    let isValid = true

    for (const field in validation) {
      const error = validateField(field, values[field])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }, [values, validation, validateField])

  // Update a field value
  const setValue = useCallback((name: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [name]: value }))

    if (validateOnChange) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }, [validateField, validateOnChange])

  // Handle field blur
  const markAsTouched = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }))

    if (validateOnBlur) {
      const error = validateField(name, values[name])
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }, [validateField, validateOnBlur, values])

  // Handle form submission
  const handleSubmit = useCallback(async (onSubmit: (values: T) => Promise<void> | void) => {
    setIsSubmitting(true)
    
    try {
      const isValid = validateForm()
      
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key as keyof T] = true
        return acc
      }, {} as Record<keyof T, boolean>)
      setTouched(allTouched)

      if (isValid) {
        await onSubmit(values)
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validateForm])

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({} as Record<keyof T, boolean>)
    setIsSubmitting(false)
  }, [initialValues])

  // Get field props for easy integration with form components
  const getFieldProps = useCallback((name: keyof T) => {
    return {
      value: values[name],
      onChange: (value: T[keyof T]) => setValue(name, value),
      onBlur: () => markAsTouched(name),
      error: touched[name] ? errors[name] : undefined,
      isValid: touched[name] && !errors[name],
      required: validation[name] !== undefined
    }
  }, [values, touched, errors, validation, setValue, markAsTouched])

  // Computed state
  const isValid = useMemo(() => {
    return Object.keys(errors).every(key => !errors[key as keyof T])
  }, [errors])

  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues)
  }, [values, initialValues])

  const hasErrors = useMemo(() => {
    return Object.values(errors).some(error => error !== undefined)
  }, [errors])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    hasErrors,
    setValue,
    markAsTouched,
    validateField,
    validateForm,
    handleSubmit,
    resetForm,
    getFieldProps
  }
}

// Common validation rules
export const validationRules = {
  required: <T>(message = 'This field is required'): ValidationRule<T> => ({
    test: (value) => {
      if (typeof value === 'string') return value.trim().length > 0
      if (Array.isArray(value)) return value.length > 0
      return value !== null && value !== undefined
    },
    message
  }),

  email: (message = 'Invalid email address'): ValidationRule<string> => ({
    test: (value) => {
      if (!value) return true // Optional field
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    },
    message
  }),

  minLength: (min: number, message?: string): ValidationRule<string> => ({
    test: (value) => !value || value.length >= min,
    message: message || `Must be at least ${min} characters`
  }),

  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    test: (value) => !value || value.length <= max,
    message: message || `Must be no more than ${max} characters`
  }),

  min: (min: number, message?: string): ValidationRule<number> => ({
    test: (value) => value >= min,
    message: message || `Must be at least ${min}`
  }),

  max: (max: number, message?: string): ValidationRule<number> => ({
    test: (value) => value <= max,
    message: message || `Must be no more than ${max}`
  }),

  pattern: (regex: RegExp, message: string): ValidationRule<string> => ({
    test: (value) => !value || regex.test(value),
    message
  }),

  custom: <T>(test: (value: T) => boolean, message: string): ValidationRule<T> => ({
    test,
    message
  }),

  password: {
    strength: (message = 'Password must be at least 8 characters with uppercase, lowercase, number and special character'): ValidationRule<string> => ({
      test: (value) => {
        if (!value) return true
        return value.length >= 8 &&
               /[A-Z]/.test(value) &&
               /[a-z]/.test(value) &&
               /\d/.test(value) &&
               /[!@#$%^&*(),.?":{}|<>]/.test(value)
      },
      message
    }),

    match: (confirmPassword: string, message = 'Passwords do not match'): ValidationRule<string> => ({
      test: (value) => value === confirmPassword,
      message
    })
  },

  url: (message = 'Invalid URL'): ValidationRule<string> => ({
    test: (value) => {
      if (!value) return true
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    },
    message
  }),

  file: {
    maxSize: (maxSizeBytes: number, message?: string): ValidationRule<File> => ({
      test: (file) => !file || file.size <= maxSizeBytes,
      message: message || `File size must be less than ${Math.round(maxSizeBytes / 1024 / 1024)}MB`
    }),

    allowedTypes: (types: string[], message?: string): ValidationRule<File> => ({
      test: (file) => !file || types.includes(file.type),
      message: message || `Allowed file types: ${types.join(', ')}`
    })
  }
}

// Hook for async validation
export function useAsyncValidation<T>(
  validator: (value: T) => Promise<string | undefined>,
  debounceMs = 500
) {
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const validate = useCallback(async (value: T) => {
    setIsValidating(true)
    setError(undefined)

    try {
      const result = await validator(value)
      setError(result)
      return !result
    } catch (err) {
      setError('Validation failed')
      return false
    } finally {
      setIsValidating(false)
    }
  }, [validator])

  // Debounced validation
  const debouncedValidate = useMemo(() => {
    let timeout: NodeJS.Timeout
    return (value: T) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => validate(value), debounceMs)
    }
  }, [validate, debounceMs])

  return {
    isValidating,
    error,
    validate: debouncedValidate,
    validateSync: validate
  }
}