import { geoEquirectangular, geoPath } from 'd3-geo'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import { PLAYABLE_IDS } from '../data/countries'

type CountryProps = {
  name?: string
  'ISO3166-1-Alpha-2'?: string
  'ISO3166-1-Alpha-3'?: string
}

export type CountryFeature = Feature<Geometry, CountryProps> & {
  id: string
}

const NAME_TO_ISO2: Record<string, string> = {
  France: 'FR',
  Norway: 'NO',
}

let cachedFeatures: CountryFeature[] | null = null


// Resolve ISO2 code
function resolveIso2(props: CountryProps | null | undefined): string | null {
  const raw = props?.['ISO3166-1-Alpha-2']
  if (raw && raw !== '-99' && PLAYABLE_IDS.has(raw)) return raw

  const name = props?.name
  if (name && NAME_TO_ISO2[name] && PLAYABLE_IDS.has(NAME_TO_ISO2[name])) {
    return NAME_TO_ISO2[name]
  }
  return null
}


// Load country features
export async function loadCountryFeatures(): Promise<CountryFeature[]> {
  if (cachedFeatures) return cachedFeatures

  const res = await fetch('/countries.geojson')
  if (!res.ok) throw new Error('Impossible de charger les contours des pays')

  const collection = (await res.json()) as FeatureCollection<Geometry, CountryProps>

  const list: CountryFeature[] = []
  for (const f of collection.features) {
    const iso2 = resolveIso2(f.properties)
    if (!iso2) continue
    list.push({
      type: 'Feature',
      id: iso2,
      geometry: f.geometry,
      properties: f.properties ?? {},
    })
  }

  cachedFeatures = list
  return list
}


// Get feature by ID
export function getFeatureById(
  features: CountryFeature[],
  id: string,
): CountryFeature | undefined {
  return features.find((f) => f.id === id)
}


// Build an SVG path fitted to the viewBox
export function silhouettePath(
  country: CountryFeature,
  width = 400,
  height = 350,
  padding = 28,
): string {
  const projection = geoEquirectangular().fitExtent(
    [
      [padding, padding],
      [width - padding, height - padding],
    ],
    country,
  )
  return geoPath(projection)(country) ?? ''
}

// Pick a random country ID
export function pickRandomCountryId(
  pool: string[],
  exclude: Set<string>,
): string | null {
  const available = pool.filter((id) => !exclude.has(id))
  if (available.length === 0) return null
  const idx = Math.floor(Math.random() * available.length)
  return available[idx]!
}
