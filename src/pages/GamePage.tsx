import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import CountryMap, { MAP_HEIGHT, MAP_WIDTH } from '../components/CountriesMap'
import GuessInput from '../components/GuessInput'
import ScoreBoard from '../components/ScoreBoard'
import Timer from '../components/Timer'
import { COUNTRIES } from '../data/countries'
import {getFeatureById, loadCountryFeatures, pickRandomCountryId, mapPath, type CountryFeature} from '../lib/geo'
import { useLocale } from '../lib/LocaleContext'
import { GAME_DURATION_MS } from '../lib/scoring'
import { getStoredPlayerName, saveGameResult } from '../lib/storage'
import { gradeAnswers, type RoundAnswer } from '../lib/tally'

export default function GamePage() {
  const navigate = useNavigate()
  const { locale, t } = useLocale()
  const playerName = getStoredPlayerName()

  const [features, setFeatures] = useState<CountryFeature[] | null>(null)
  const [loadError, setLoadError] = useState<'empty' | string>('')
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [guess, setGuess] = useState('')
  const [answered, setAnswered] = useState(0)
  const [skipped, setSkipped] = useState(0)
  const [remainingMs, setRemainingMs] = useState(GAME_DURATION_MS)
  const [started, setStarted] = useState(false)

  const roundStartedAt = useRef(0)
  const endedRef = useRef(false)
  const currentIdRef = useRef<string | null>(null)
  const usedRef = useRef<Set<string>>(new Set())
  const answersRef = useRef<RoundAnswer[]>([])
  const guessRef = useRef('')
  const answeredRef = useRef(0)
  const skippedRef = useRef(0)

  const pool = useMemo(() => COUNTRIES.map((c) => c.id), [])

  const finishGame = useCallback(() => {
    if (endedRef.current) return
    endedRef.current = true

    const id = currentIdRef.current
    const pending = guessRef.current.trim()
    if (id) {
      const alreadyLogged = answersRef.current.some((a) => a.countryId === id)
      if (!alreadyLogged) {
        answersRef.current.push({
          countryId: id,
          guess: pending || null,
          elapsedMs: performance.now() - roundStartedAt.current,
        })
      }
    }

    const graded = gradeAnswers(answersRef.current)
    saveGameResult({
      playerName,
      score: graded.score,
      countriesFound: graded.countriesFound,
      answered: graded.answered,
      skipped: graded.skipped,
      details: graded.details.map((d) => ({
        countryName: d.countryName,
        guess: d.guess,
        correct: d.correct,
        points: d.points,
      })),
    })
    navigate('/result', { replace: true })
  }, [navigate, playerName])

  const goNext = useCallback(() => {
    const nextId = pickRandomCountryId(pool, usedRef.current)
    if (!nextId) {
      finishGame()
      return
    }
    usedRef.current.add(nextId)
    currentIdRef.current = nextId
    setCurrentId(nextId)
    setGuess('')
    guessRef.current = ''
    roundStartedAt.current = performance.now()
  }, [pool, finishGame])

  const recordAndAdvance = useCallback(
    (guessValue: string | null) => {
      if (endedRef.current) return
      const id = currentIdRef.current
      if (!id) return

      answersRef.current.push({
        countryId: id,
        guess: guessValue,
        elapsedMs: performance.now() - roundStartedAt.current,
      })

      if (guessValue) {
        answeredRef.current += 1
        setAnswered(answeredRef.current)
      } else {
        skippedRef.current += 1
        setSkipped(skippedRef.current)
      }

      goNext()
    },
    [goNext],
  )

  useEffect(() => {
    let cancelled = false
    loadCountryFeatures()
      .then((list) => {
        if (cancelled) return
        setFeatures(list)
        const first = pickRandomCountryId(pool, new Set())
        if (!first || !getFeatureById(list, first)) {
          setLoadError('empty')
          return
        }
        currentIdRef.current = first
        usedRef.current = new Set([first])
        setCurrentId(first)
        roundStartedAt.current = performance.now()
        setStarted(true)
      })
      .catch((err: Error) => {
        if (!cancelled) setLoadError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [pool])

  useEffect(() => {
    if (!started || endedRef.current) return

    const startedAt = performance.now()
    const id = window.setInterval(() => {
      const left = Math.max(0, GAME_DURATION_MS - (performance.now() - startedAt))
      setRemainingMs(left)
      if (left <= 0) {
        window.clearInterval(id)
        finishGame()
      }
    }, 100)

    return () => window.clearInterval(id)
  }, [started, finishGame])

  if (!playerName) {
    return <Navigate to="/" replace />
  }

  const feature = features && currentId ? getFeatureById(features, currentId) : undefined
  const path = feature ? mapPath(feature, MAP_WIDTH, MAP_HEIGHT) : ''

  return (
    <main className="page game" lang={locale}>
      <header className="game-header">
        <Timer remainingMs={remainingMs} totalMs={GAME_DURATION_MS} />
        <ScoreBoard answered={answered} skipped={skipped} />
      </header>

      {loadError === 'empty' && <p className="form-error">{t.game.noCountries}</p>}
      {loadError && loadError !== 'empty' && <p className="form-error">{loadError}</p>}

      {!features && !loadError && <p className="game-loading">{t.game.loading}</p>}

      {features && path && (
        <div className="game-stage">
          <CountryMap path={path} flash={null} animateKey={currentId ?? 'x'} />
          <GuessInput
            value={guess}
            onChange={(v) => {
              setGuess(v)
              guessRef.current = v
            }}
            onSubmit={() => recordAndAdvance(guess.trim())}
            onSkip={() => recordAndAdvance(null)}
            disabled={remainingMs <= 0}
          />
        </div>
      )}
    </main>
  )
}
