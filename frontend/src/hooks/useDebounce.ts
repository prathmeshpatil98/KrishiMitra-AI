/**
 * KrishiMitra AI — useDebounce Hook
 * ====================================
 * Delays updating the returned value until after the specified delay has elapsed.
 * Used for search inputs to prevent firing API calls on every keystroke.
 */

import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      window.clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
