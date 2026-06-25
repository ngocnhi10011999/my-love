import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LOCALE, LOCALES, translations } from './translations.js';

const STORAGE_KEY = 'secure-gallery:locale';
const I18nContext = createContext(null);

function resolvePath(dict, key) {
  return key.split('.').reduce((acc, part) => (acc == null ? undefined : acc[part]), dict);
}

function interpolate(template, vars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)(?:,\s*plural,\s*one\s*\{([^}]*)\}\s*other\s*\{([^}]*)\})?\}/g,
    (match, name, oneForm, otherForm) => {
      const value = vars[name];
      if (oneForm !== undefined) {
        return Number(value) === 1 ? oneForm : otherForm;
      }
      return value == null ? match : String(value);
    },
  );
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return LOCALES.includes(saved) ? saved : DEFAULT_LOCALE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next) => {
    if (LOCALES.includes(next)) setLocaleState(next);
  }, []);

  const t = useCallback(
    (key, vars) => {
      const dict = translations[locale] || translations[DEFAULT_LOCALE];
      const value = resolvePath(dict, key);
      if (typeof value !== 'string') {
        const fallback = resolvePath(translations[DEFAULT_LOCALE], key);
        if (typeof fallback === 'string') return interpolate(fallback, vars);
        return key;
      }
      return interpolate(value, vars);
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t, locales: LOCALES }), [locale, setLocale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
