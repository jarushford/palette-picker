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

fillAllColors()