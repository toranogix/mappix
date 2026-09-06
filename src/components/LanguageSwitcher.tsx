import { useLocale } from '../lib/LocaleContext'
import type { Locale } from '../lib/i18n'

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale()

  return (
    <div className="lang-switch" role="group" aria-label={t.langLabel}>
      {(['fr', 'en'] as const).map((code: Locale) => (
        <button
          key={code}
          type="button"
          className={`lang-switch-btn${locale === code ? ' is-active' : ''}`}
          aria-pressed={locale === code}
          onClick={() => setLocale(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
