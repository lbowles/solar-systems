// const solarSystems = SolarSystems__factory.connect(deployments.contracts.SolarSystems.address)
function getOrbitSVG(
  canvasWidth: number,
  planetRadius: number,
  orbitRadius: number,
  color: number[],
  duration: number,
  ringsRadius: number,
) {
  const halfCanvasWidth = canvasWidth / 2

  const x = orbitRadius
  const y = 0
  const angle = Math.random() * 360 // Angle in degrees

  const newX = x * Math.cos(angle * (Math.PI / 180)) - y * Math.sin(angle * (Math.PI / 180))
  const newY = x * Math.sin(angle * (Math.PI / 180)) + y * Math.cos(angle * (Math.PI / 180))

  return `
  <g>
    <circle 
      cx="${halfCanvasWidth + newX}" 
      cy="${halfCanvasWidth - newY}" 
      r="${planetRadius}" 
      fill="rgb(${color[0]},${color[1]},${color[2]})"
    />
    <circle 
      cx="${halfCanvasWidth + newX}" 
      cy="${halfCanvasWidth - newY}" 
      r="${ringsRadius}" 
      fill="none"
      stroke="rgb(${color[0]},${color[1]},${color[2]})"
      stroke-width="1"
    />
    <animateTransform 
        attributeName="transform" 
        type="rotate" 
        from="0 ${halfCanvasWidth} ${halfCanvasWidth}" 
        to="360 ${halfCanvasWidth} ${halfCanvasWidth}" 
        dur="${duration}" 
        repeatCount="indefinite"/>
  </g>
  <circle cx="${halfCanvasWidth}" cy="${halfCanvasWidth}" r="${orbitRadius}" fill="none" stroke="rgba(${color[0]},${
    color[1]
  },${color[2]},0.5)"/>
  `
}

export function getSVG(canvasWidth: number) {
  const planets = []
  const numPlanets = Math.floor(Math.random() * 8) + 1
  const radiusInterval = canvasWidth / 2 / (numPlanets + 3)
  const planetRadiusUpperBound = Math.min(radiusInterval / 2, canvasWidth / 4)
  const planetRadiusLowerBound = radiusInterval / 4

  // Generate random planets
  for (let i = 0; i < numPlanets; i++) {
    // Prevent dark colours
    const colorTuple = [Math.random() * 255, Math.random() * 255, Math.random() * 255].map((color) =>
      Math.max(color, 100),
    )
    const ringsOffset = Math.round(Math.random()) * 1
    const radius =
      Math.random() * (planetRadiusUpperBound - planetRadiusLowerBound - ringsOffset) + planetRadiusLowerBound
    const ringsRadius = ringsOffset + radius
    planets.push({
      color: colorTuple,
      radius: radius,
      orbitRadius: radiusInterval * (i + 3),
      duration: Math.random() * 10 + 5,
      ringsRadius: ringsRadius,
    })
  }

  // uint256 sunRadius = utils.randomRange(_tokenId, "sunRadius", radiusInterval, radiusInterval * 2 - 10);
  const sunRadius = Math.random() * (radiusInterval * 2 - 10 - radiusInterval) + radiusInterval

  return `
  <svg 
    width="${canvasWidth}" 
    height="${canvasWidth}" 
    viewBox="0 0 ${canvasWidth} ${canvasWidth}" 

    xmlns="http://www.w3.org/2000/svg"
  >
  <circle cx="${canvasWidth / 2}" cy="${canvasWidth / 2}" r="${canvasWidth / 2}" fill="#0D1F2F"></circle>
  <circle cx="${canvasWidth / 2}" cy="${canvasWidth / 2}" r="${sunRadius}" fill="#FFDA17"></circle>
    ${planets
      .map((planet) =>
        getOrbitSVG(canvasWidth, planet.radius, planet.orbitRadius, planet.color, planet.duration, planet.ringsRadius),
      )
      .join("")}
  </svg>
  `
}
