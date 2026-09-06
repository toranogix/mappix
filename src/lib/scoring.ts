// Scoring
export function scoreForAnswer(elapsedMs: number): number {
    const base = 100
    const bonus = Math.max(0, 50 - Math.floor(elapsedMs / 200))
    return base + bonus
  }

// Game duration => 60 s
export const GAME_DURATION_MS = 60_000
  