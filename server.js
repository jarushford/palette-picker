const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.locals.title = 'Palette Picker'
app.set('port', process.env.PORT || 3000)

app.locals.projects = [
  {
    id: 1,
    name: 'Project 1'
  },
  {
    id: 2,
    name: 'Project 2'
  }
]

app.locals.palettes = [
  {
    id: 1,
    name: 'Colors!',
    project_id: 1,
    color1: 'D5D9CF',
    color2: 'B19B75',
    color3: 'B14120',
    color4: '187685',
    color5: '7962B8'
  },
  {
    id: 2,
    name: 'Other Colors!',
    project_id: 2,
    color1: 'D5D9CF',
    color2: 'B19B75',
    color3: 'B14120',
    color4: '187685',
    color5: '7962B8'
  }
]

app.get('/api/v1/projects', (request, response) => {
  const projects = app.locals.projects

  response.status(200).json(projects)
})

app.post('/api/v1/projects', (request, response) => {
  const newProject = { name: request.body.project_name, id: Date.now() }
  app.locals.projects.push(newProject)

  response.status(200).json(newProject)
})

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  const palettes = app.locals.palettes
  const id = parseInt(request.params.id)

  const currentPalettes = palettes.filter(palette => {
    return palette.project_id === id
  })
  
  response.status(200).json(currentPalettes)
})

app.get('/api/v1/projects/:id/palettes/:palette_id', (request, response) => {
  const palettes = app.locals.palettes
  const palette_id = parseInt(request.params.palette_id)

  const currentPalette = palettes.find(palette => {
    return palette.id === palette_id
  })

  response.status(200).json(currentPalette)
})

app.post('/api/v1/projects/:id', (request, response) => {
  const newPalette = {...request.body.palette, id: Date.now() }
  app.locals.palettes.push(newPalette)

  response.status(200).json(newPalette)
})

app.delete('/api/v1/projects/:id/palettes/:palette_id', (request, response) => {
  const id = request.params.palette_id
  const newPalettes = app.locals.filter(palette => {
    return palette.id !== id
  })

  app.locals.palettes = newPalettes
  response.status(200).json('Success')
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})