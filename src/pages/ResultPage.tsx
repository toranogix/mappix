import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useLocale } from '../lib/LocaleContext'
import { loadGameResult } from '../lib/storage'
import { isSupabaseConfigured, submitScore } from '../lib/supabase'

const SUBMITTED_KEY = 'mappix-result-submitted'

export default function ResultPage() {
  const navigate = useNavigate()
  const { locale, t } = useLocale()
  const copy = t.result
  const result = loadGameResult()
  const [submitState, setSubmitState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!result) return

    const fingerprint = String(result.playedAt)
    if (sessionStorage.getItem(SUBMITTED_KEY) === fingerprint) {
      setSubmitState('saved')
      return
    }

    let cancelled = false
    setSubmitState('saving')
    submitScore({
      playerName: result.playerName,
      score: result.score,
      countriesFound: result.countriesFound,
    })
      .then(({ ok, error }) => {
        if (cancelled) return
        if (ok) {
          sessionStorage.setItem(SUBMITTED_KEY, fingerprint)
          setSubmitState('saved')
        } else {
          setSubmitState('error')
          setErrorMsg(error ?? copy.unknownError)
        }
      })
      .catch((err: Error) => {
        if (cancelled) return
        setSubmitState('error')
        setErrorMsg(err.message)
      })

    return () => {
      cancelled = true
    }
  }, [result, copy.unknownError])

  if (!result) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="page result" lang={locale}>
      <p className="result-kicker">{copy.kicker}</p>
      <h1 className="result-title">{copy.title(result.playerName)}</h1>

      <div className="result-stats">
        <div className="result-stat">
          <span className="result-stat-label">{copy.score}</span>
          <span className="result-stat-value">{result.score}</span>
        </div>
        <div className="result-stat">
          <span className="result-stat-label">{copy.correct}</span>
          <span className="result-stat-value">{result.countriesFound}</span>
        </div>
        <div className="result-stat">
          <span className="result-stat-label">{copy.answeredSkipped}</span>
          <span className="result-stat-value">
            {result.answered}/{result.skipped}
          </span>
        </div>
      </div>

      {result.details.length > 0 && (
        <ol className="result-review">
          {result.details.map((d, i) => (
            <li
              key={`${d.countryName}-${i}`}
              className={`result-review-item ${d.correct ? 'is-correct' : 'is-wrong'}`}
            >
              <div className="result-review-main">
                <strong>{d.countryName}</strong>
                <span>
                  {d.guess == null ? copy.skipped : d.correct ? d.guess : `« ${d.guess} »`}
                </span>
              </div>
              <span className="result-review-pts">{d.correct ? `+${d.points}` : '0'}</span>
            </li>
          ))}
        </ol>
      )}

      <p className="result-submit">
        {submitState === 'saving' && copy.saving}
        {submitState === 'saved' &&
          (isSupabaseConfigured ? copy.savedRemote : copy.savedLocal)}
        {submitState === 'error' && copy.saveError(errorMsg)}
      </p>

      <div className="result-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            sessionStorage.removeItem(SUBMITTED_KEY)
            navigate('/play')
          }}
        >
          {copy.replay}
        </button>
        <Link className="btn btn-ghost" to="/classement">
          {copy.leaderboard}
        </Link>
        <Link className="btn btn-ghost" to="/">
          {copy.home}
        </Link>
      </div>
    </main>
  )
}
