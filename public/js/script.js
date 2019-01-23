const generateBtn = document.querySelector('.generate-colors')
generateBtn.addEventListener('click', fillAllColors)

const lockIcons = document.querySelectorAll('i')
lockIcons.forEach(icon => {
  icon.addEventListener('click', toggleLock)
})

const hexCodes = document.querySelectorAll('.hex-code')
hexCodes.forEach(hex => {
  hex.addEventListener('click', copyColor)
})

const projectsContainer = document.querySelector('.projects-grid')
projectsContainer.addEventListener('click', handlePaletteSelection)

function generateHexCode() {
  const digitKey = {
    0: '0',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: 'A',
    11: 'B',
    12: 'C',
    13: 'D',
    14: 'E',
    15: 'F'
  }

  let color = ''
  for(let i = 0; i < 6; i++) {
    let randNum = Math.floor(Math.random() * 16)
    color += digitKey[randNum]
  }
  return color
}

function fillAllColors() {
  const colorBoxes = document.querySelectorAll('.color-box')
  colorBoxes.forEach(color => {
    if (!color.classList.contains('locked')) {
      const randomColor = generateHexCode()
      color.lastElementChild.lastElementChild.innerText = randomColor
      color.style.background = `#${randomColor}`
    }
  })
}

function toggleLock(e) {
  if (e.target.parentElement.classList.contains('locked')) {
    e.target.parentElement.classList.remove('locked')
    e.target.classList.remove('fa-lock')
    e.target.classList.add('fa-unlock')
  } else {
    e.target.parentElement.classList.add('locked')
    e.target.classList.remove('fa-unlock')
    e.target.classList.add('fa-lock')
  }
}

function copyColor(e) {
  const tempArea = document.createElement('textarea')
  const tempText = document.createTextNode(`#${e.target.innerText}`)
  const title = document.querySelector('.title')

  tempArea.appendChild(tempText)
  document.body.insertBefore(tempArea, title)

  const color = document.querySelector('textarea')
  color.select()
  document.execCommand('copy')
  color.remove()
}

async function getProjects() {
  const response = await fetch('/api/v1/projects')
  const result = await response.json()
  result.forEach(project => {
    getPalettes(project)
  })
}

async function getPalettes(project) {
  const response = await fetch(`/api/v1/projects/${project.id}/palettes`)
  const result = await response.json()
  const html = `
    <article class="project" id="${project.id}">
      <h2 class="project-title">${project.name}</h2>
      <ul class="project-palettes">
        ${result.map(palette => {
          return buildPalette(palette)
        })}
      </ul>
    </article>
  `
  projectsContainer.insertAdjacentHTML('beforeend', html)
}

function buildPalette(palette) {
  return `
    <li class="project-palette" id="${palette.id}">
      <h3 class="project-palette-name">${palette.name}</h3>
      <div class="project-palette-color" style="background:${palette.color1}"></div>
      <div class="project-palette-color" style="background:${palette.color2}"></div>
      <div class="project-palette-color" style="background:${palette.color3}"></div>
      <div class="project-palette-color" style="background:${palette.color4}"></div>
      <div class="project-palette-color" style="background:${palette.color5}"></div>
      <button class="delete-btn">X</button>
    </li>
  `
}

async function handlePaletteSelection(e) {
  if (e.target.classList.contains('project-palette-name')) {
    const paletteID = e.target.parentElement.id
    const projectID = e.target.parentElement.parentElement.parentElement.id

    const response = await fetch(`/api/v1/projects/${projectID}/palettes/${paletteID}`)
    const result = await response.json()

    const colorBoxes = document.querySelectorAll('.color-box')
    colorBoxes.forEach((color, i) => {
      color.lastElementChild.lastElementChild.innerText = result[`color${i+1}`]
      color.style.background = result[`color${i+1}`]
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

getProjects()
fillAllColors()
