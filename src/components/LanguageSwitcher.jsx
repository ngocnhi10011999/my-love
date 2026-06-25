import { useI18n } from '../i18n/I18nContext.jsx';

const LABELS = { vi: 'VI', en: 'EN' };

export default function LanguageSwitcher({ className = '' }) {
  const { locale, setLocale, locales } = useI18n();
  return (
    <div className={`inline-flex rounded-full bg-white border border-rose-200 p-0.5 text-xs font-semibold ${className}`}>
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className={`px-2.5 py-1 rounded-full transition ${
            locale === code
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm'
              : 'text-rose-500 hover:text-rose-700'
          }`}
        >
          {LABELS[code] || code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
