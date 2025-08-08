import { useState, useEffect, useCallback } from 'react'

type SetValue<T> = T | ((prevValue: T) => T)

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: {
    serializer?: (value: T) => string
    deserializer?: (value: string) => T
    syncAcrossTabs?: boolean
  }
): [T, (value: SetValue<T>) => void, () => void] {
  const serializer = options?.serializer || JSON.stringify
  const deserializer = options?.deserializer || JSON.parse
  const syncAcrossTabs = options?.syncAcrossTabs ?? true

  // Get value from localStorage or use initial value
  const initialize = (key: string): T => {
    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) {
        return deserializer(item)
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    }
    return initialValue
  }

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    return initialize(key)
  })

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value

        // Save state
        setStoredValue(valueToStore)

        // Save to localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, serializer(valueToStore))
          
          // Dispatch custom event for cross-tab synchronization
          if (syncAcrossTabs) {
            window.dispatchEvent(
              new CustomEvent('local-storage', {
                detail: { key, value: valueToStore },
              })
            )
          }
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, serializer, storedValue, syncAcrossTabs]
  )

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
        setStoredValue(initialValue)
        
        // Dispatch custom event for cross-tab synchronization
        if (syncAcrossTabs) {
          window.dispatchEvent(
            new CustomEvent('local-storage', {
              detail: { key, value: null },
            })
          )
        }
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue, syncAcrossTabs])

  // Listen for changes in other tabs/windows
  useEffect(() => {
    if (!syncAcrossTabs || typeof window === 'undefined') return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(deserializer(e.newValue))
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error)
        }
      }
    }

    const handleCustomEvent = (e: CustomEvent) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value ?? initialValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('local-storage' as any, handleCustomEvent)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('local-storage' as any, handleCustomEvent)
    }
  }, [key, deserializer, initialValue, syncAcrossTabs])

  return [storedValue, setValue, removeValue]
}

// Specific hook for app preferences
export function useAppPreferences() {
  const [preferences, setPreferences] = useLocalStorage('app-preferences', {
    theme: 'system' as 'light' | 'dark' | 'system',
    fontSize: 'medium' as 'small' | 'medium' | 'large',
    soundEnabled: true,
    notificationsEnabled: true,
    autoSave: true,
  })

  const updatePreference = useCallback(
    <K extends keyof typeof preferences>(
      key: K,
      value: typeof preferences[K]
    ) => {
      setPreferences((prev) => ({ ...prev, [key]: value }))
    },
    [setPreferences]
  )

  return { preferences, updatePreference }
}