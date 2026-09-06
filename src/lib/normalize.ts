/** Normalize guess text: lowercase, strip accents, punctuation, extra spaces ... */
export function normalizeGuess(input: string): string {
    return input
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[''`]/g, '')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  
  export function matchesCountry(
    guess: string,
    name: string,
    aliases: string[],
  ): boolean {
    const normalized = normalizeGuess(guess)
    if (!normalized) return false
  
    const candidates = [name, ...aliases].map(normalizeGuess)
    return candidates.includes(normalized)
  }
  