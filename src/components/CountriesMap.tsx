type Props = {
    path: string
    flash?: 'success' | 'error' | null
    animateKey: string
  }
  
  const WIDTH = 400
  const HEIGHT = 350
  
  export default function CountryMap({ path, flash, animateKey }: Props) {
    const flashClass =
      flash === 'success' ? 'map--success' : flash === 'error' ? 'map--error' : ''
  
    return (
      <div className={`map-wrap ${flashClass}`}>
        <svg
          key={animateKey}
          className="map-svg"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="Contours du pays à deviner"
        >
          <path className="map-path" d={path} />
        </svg>
      </div>
    )
  }
  
  export { WIDTH as MAP_WIDTH, HEIGHT as MAP_HEIGHT }
  