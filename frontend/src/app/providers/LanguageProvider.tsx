import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { translations } from '@/constants/translations'

type Language = 'en' | 'hi' | 'mr'

interface LanguageContextProps {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof typeof translations['en']) => string
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('km_lang') as Language) || 'en'
  })

  // Watch storage changes
  const setLanguage = useCallback((lang: Language) => {
    localStorage.setItem('km_lang', lang)
    setLangState(lang)
    // Dispatch a storage event so other tabs/listeners update
    window.dispatchEvent(new Event('storage'))
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('km_lang') as Language | null
      if (stored && stored !== language) {
        setLangState(stored)
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [language])

  const t = useCallback(
    (key: keyof typeof translations['en']): string => {
      const dictionary = translations[language] || translations['en']
      return dictionary[key] || translations['en'][key] || String(key)
    },
    [language]
  )

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
