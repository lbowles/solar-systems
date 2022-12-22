import logo from './logo.svg'
import './App.css'

function App() {
  const svgWidth = 500 // width of the SVG element
  const svgHeight = 500 // height of the SVG element

  // generate a random number between min and max
  function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min
  }

  // generate a random color in hex format
  function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  function generatePlanet() {
    // generate a random size for the sun
    const sunSize = getRandomNumber(20, 70)

    // create the SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', svgWidth)
    svg.setAttribute('height', svgHeight)

    const background = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect',
    )
    background.setAttribute('width', svgWidth)
    background.setAttribute('height', svgHeight)

    background.setAttribute('fill', '#0D1F2F')

    svg.appendChild(background)

    // create the sun
    const sun = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    sun.setAttribute('cx', svgWidth / 2) // center the sun horizontally
    sun.setAttribute('cy', svgHeight / 2) // center the sun vertically
    sun.setAttribute('r', sunSize) // set the size of the sun
    sun.setAttribute('fill', '#FFDA17') // set the color of the sun

    // add the sun to the SVG element
    svg.appendChild(sun)

    // generate a random number of planets
    const numPlanets = Math.floor(Math.random() * 5) + 1

    // create the planets and their orbits
    for (let i = 0; i < numPlanets; i++) {
      // generate a random size and color for the planet
      const planetSize = getRandomNumber(2, 17)
      const planetColor = getRandomColor()

      // generate a random orbit radius
      const orbitRadius = getRandomNumber(sunSize + planetSize, svgWidth / 2)

      // create the orbit path
      const orbit = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path',
      )
      orbit.setAttribute(
        'd',
        `M ${svgWidth / 2} ${
          svgHeight / 2
        } m ${-orbitRadius}, 0 a ${orbitRadius},${orbitRadius} 0 1,0 ${
          orbitRadius * 2
        },0 a ${orbitRadius},${orbitRadius} 0 1,0 ${-orbitRadius * 2},0`,
      )
      orbit.setAttribute('stroke', planetColor)
      orbit.setAttribute('stroke-width', '1')
      orbit.setAttribute('fill', 'none')

      // add the orbit to the SVG element
      svg.appendChild(orbit)

      // create the planet
      const planet = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle',
      )
      planet.setAttribute('cx', svgWidth / 2 + orbitRadius) // start the planet at the top of its orbit
      planet.setAttribute('cy', svgHeight / 2)
      planet.setAttribute('r', planetSize)
      planet.setAttribute('fill', planetColor)

      // create the animation for the planet's orbit
      const animation = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'animateTransform',
      )
      animation.setAttribute('attributeName', 'transform')
      animation.setAttribute('type', 'rotate')
      animation.setAttribute('from', '0 250 250')
      animation.setAttribute('to', '360  250 250')
      animation.setAttribute('dur', `${getRandomNumber(7, 15)}s`)
      animation.setAttribute('repeatCount', 'indefinite')
      console.log('e')
      // add the animation to the planet
      planet.appendChild(animation)

      // add the planet to the SVG element
      svg.appendChild(planet)
    }
    document.body.appendChild(svg)
  }

  generatePlanet()

  return (
    <div className="App">
      <svg width="500" height="500">
        <rect width="500" height="500" fill="#0D1F2F"></rect>
        <circle cx="250" cy="250" r="69.22597718239118" fill="#FFDA17"></circle>
        <path
          d="M 250 250 m -91.48495601241126, 0 a 91.48495601241126,91.48495601241126 0 1,0 182.96991202482252,0 a 91.48495601241126,91.48495601241126 0 1,0 -182.96991202482252,0"
          stroke="#E501FE"
          stroke-width="1"
          fill="none"
        ></path>
        <circle
          cx="341.48495601241126"
          cy="250"
          r="6.578168184375332"
          fill="#E501FE"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 250 250"
            to="360  250 250"
            dur="13.553608098692827s"
            repeatCount="indefinite"
          ></animateTransform>
        </circle>
        <path
          d="M 250 250 m -173.73174501644374, 0 a 173.73174501644374,173.73174501644374 0 1,0 347.4634900328875,0 a 173.73174501644374,173.73174501644374 0 1,0 -347.4634900328875,0"
          stroke="#E6C8A9"
          stroke-width="1"
          fill="none"
        ></path>
        <circle
          cx="423.7317450164437"
          cy="250"
          r="15.77587409914356"
          fill="#E6C8A9"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 250 250"
            to="360  250 250"
            dur="12.398430556025854s"
            repeatCount="indefinite"
          ></animateTransform>
        </circle>
        <path
          d="M 250 250 m -248.38387610225251, 0 a 248.38387610225251,248.38387610225251 0 1,0 496.76775220450503,0 a 248.38387610225251,248.38387610225251 0 1,0 -496.76775220450503,0"
          stroke="#D297B2"
          stroke-width="1"
          fill="none"
        ></path>
        <circle
          cx="498.38387610225254"
          cy="250"
          r="6.495797895486479"
          fill="#D297B2"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 250 250"
            to="360  250 250"
            dur="7.582670972010417s"
            repeatCount="indefinite"
          ></animateTransform>
        </circle>
      </svg>
    </div>
  )
}

export default App
