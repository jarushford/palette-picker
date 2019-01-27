const generateBtn = document.querySelector('.generate-colors')
const lockIcons = document.querySelectorAll('i')
const hexCodes = document.querySelectorAll('.hex-code')
const projectsContainer = document.querySelector('.projects-grid')
const createProjectBtn = document.querySelector('.create-project')
const savePaletteBtn = document.querySelector('.save-palette')
const paletteInput = document.querySelector('.palette-name')
const projectInput = document.querySelector('.project-name')

generateBtn.addEventListener('click', fillAllColors)
projectsContainer.addEventListener('click', handlePaletteSelection)
savePaletteBtn.addEventListener('click', addPalette)
createProjectBtn.addEventListener('click', addProject)
paletteInput.addEventListener('keyup', () => clearError('palette'))
projectInput.addEventListener('keyup', () => clearError('project'))
lockIcons.forEach(icon => icon.addEventListener('click', toggleLock))
hexCodes.forEach(hex => hex.addEventListener('click', copyColor))

getProjects()
fillAllColors()

function clearError(type) {
  const error = document.querySelector(`.${type}-error`)
  error.classList.remove('error-show')
}

function generateHexCode() {
  const digitKey = {
    0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5',
    6: '6', 7: '7', 8: '8', 9: '9', 10: 'A',
    11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F'
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

function addOption(project) {
  const selection = document.querySelector('.select-project')
  selection.insertAdjacentHTML('beforeend', `
    <option value=${project.id}>${project.name}</option>
  `)
}

function buildPalette(palette) {
  return `
    <li class="project-palette" data-id="${palette.id}">
      <h3 class="project-palette-name">${palette.name}</h3>
      <div class="project-palette-color" style="background:#${palette.color1}"></div>
      <div class="project-palette-color" style="background:#${palette.color2}"></div>
      <div class="project-palette-color" style="background:#${palette.color3}"></div>
      <div class="project-palette-color" style="background:#${palette.color4}"></div>
      <div class="project-palette-color" style="background:#${palette.color5}"></div>
      <button class="delete-btn">X</button>
    </li>
  `
}

function buildNewPalette(name, project_id) {
  const newPalette = { name, project_id }
  const colorBoxes = document.querySelectorAll('.color-box')
  colorBoxes.forEach((color, i) => {
    newPalette[`color${i+1}`] = color.lastElementChild.innerText.substring(1)
  })
  return newPalette
}


  /////////////////
 /// API CALLS ///
/////////////////


async function getProjects() {
  const response = await fetch('/api/v1/projects')
  const result = await response.json()
  result.forEach(project => {
    getPalettes(project)
    addOption(project)
  })
}

async function getPalettes(project) {
  const response = await fetch(`/api/v1/projects/${project.id}/palettes`)
  const result = await response.json()
  const html = `
    <article class="project" data-id="${project.id}">
      <button class="delete-btn project-delete">X</button>
      <h2 class="project-title">${project.name}</h2>
      <ul class="project-palettes">
        ${result.reduce((acc, palette) => {
          acc += buildPalette(palette)
          return acc
        }, '')}
      </ul>
    </article>
  `
  projectsContainer.insertAdjacentHTML('beforeend', html)
}

async function handlePaletteSelection(e) {
  if (e.target.classList.contains('project-palette-name')) {
    const paletteID = e.target.parentElement.getAttribute('data-id')
    const projectID = e.target.parentElement.parentElement.parentElement.getAttribute('data-id')

    const response = await fetch(`/api/v1/projects/${projectID}/palettes/${paletteID}`)
    const result = await response.json()

    const colorBoxes = document.querySelectorAll('.color-box')
    colorBoxes.forEach((color, i) => {
      color.lastElementChild.lastElementChild.innerText = result[`color${i+1}`]
      color.style.background = '#' + result[`color${i+1}`]
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else if (e.target.classList.contains('project-delete')) {
    handleProjectDelete(e)
  } else if (e.target.classList.contains('delete-btn')) {
    handlePaletteDelete(e)
  }
}

async function handlePaletteDelete(e) {
  const paletteID = e.target.parentElement.getAttribute('data-id')
  const projectID = e.target.parentElement.parentElement.parentElement.getAttribute('data-id')

  const response = await fetch(`/api/v1/projects/${projectID}/palettes/${paletteID}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })

  if (response.ok) {
    e.target.parentElement.remove()
  }
}

async function handleProjectDelete(e) {
  const projectID = e.target.parentElement.getAttribute('data-id')

  const response = await fetch(`/api/v1/projects/${projectID}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })

  if (response.ok) {
    e.target.parentElement.remove()
  }
}

async function addProject() {
  const nameInput = document.querySelector('.project-name')
  const isRepeat = await checkProjectName(nameInput.value)
  if (nameInput.value && !isRepeat) {
    const response = await fetch('/api/v1/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nameInput.value })
    })
    const result = await response.json()
    getPalettes(result)
    addOption(result)
    nameInput.value = ''
  } else {
    const projectError = document.querySelector('.project-error')
    projectError.classList.add('error-show')
  }
}

async function checkProjectName(name) {
  const response = await fetch('/api/v1/projects')
  const result = await response.json()
  const repeat = result.find(project => {
    return project.name === name
  })
  if (repeat) {
    return true
  }
  return false
}

async function addPalette(e) {
  clearError('palette')
  const nameInput = document.querySelector('.palette-name')
  const selectInput = document.querySelector('.select-project')
  if (!nameInput.value || !selectInput.value) {
    const paletteError = document.querySelector('.palette-error')
    paletteError.classList.add('error-show')
  } else {
    const newPalette = buildNewPalette(nameInput.value, parseInt(selectInput.value))
    const response = await fetch(`/api/v1/projects/${selectInput.value}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPalette)
    })
    const result = await response.json()
    nameInput.value = ''
    const newDOMPalette = buildPalette(result)
    const currentProject = document.querySelector(`[data-id="${selectInput.value}"]`)
    currentProject.lastElementChild.insertAdjacentHTML('beforeend', newDOMPalette)
  } 
}
