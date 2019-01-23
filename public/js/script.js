const generateBtn = document.querySelector('.generate-colors')
generateBtn.addEventListener('click', fillAllColors)

const lockIcons = document.querySelectorAll('i')
lockIcons.forEach(icon => {
  icon.addEventListener('click', toggleLock)
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
    10: 'a',
    11: 'b',
    12: 'c',
    13: 'd',
    14: 'e',
    15: 'f'
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



fillAllColors()