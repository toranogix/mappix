// Store results

const PLAYER_KEY = 'mappix-player-name'

export function getStoredPlayerName(): string {
  return localStorage.getItem(PLAYER_KEY) ?? ''
}

export function setStoredPlayerName(name: string) {
  localStorage.setItem(PLAYER_KEY, name.trim().slice(0, 20))
}

export type ResultDetail = {
  countryName: string
  guess: string | null
  correct: boolean
  points: number
}

export type GameResult = {
  score: number
  countriesFound: number
  answered: number
  skipped: number
  playerName: string
  playedAt: number
  details: ResultDetail[]
}

const RESULT_KEY = 'mappix-last-result'

export function saveGameResult(result: Omit<GameResult, 'playedAt'>) {
  const full: GameResult = { ...result, playedAt: Date.now() }
  sessionStorage.setItem(RESULT_KEY, JSON.stringify(full))
}

export function loadGameResult(): GameResult | null {
  const raw = sessionStorage.getItem(RESULT_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as GameResult
  } catch {
    return null
  }
}
