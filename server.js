const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.locals.title = 'Palette Picker'
app.set('port', process.env.PORT || 3000)

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => {
      response.status(200).json(projects)
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.post('/api/v1/projects', (request, response) => {
  const project = request.body

  if(!project['name']) {
    return response.status(422).send(`Expected format: { name: <String> }. You're missing a name parameter.`)
  }

  database('projects').insert(project, 'id')
    .then(projectID => {
      response.status(200).json({ ...project, id: projectID[0] })
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  database('palettes').where('project_id', request.params.id).select()
    .then(palettes => {
      response.status(200).json(palettes)
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.get('/api/v1/projects/:id/palettes/:palette_id', (request, response) => {
  database('palettes').where('id', request.params.palette_id).select()
    .then(palette => {
      response.status(200).json(palette[0])
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.post('/api/v1/projects/:id', (request, response) => {
  const palette = request.body

  for (let requiredParam of ['name', 'color1', 'color2', 'color3', 'color4', 'color5', 'project_id']) {
    if (!palette[requiredParam]) {
      return response.status(422).send(`Expected format: { name: <String>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String>, project_id: <Integer> }. You're missing a ${requiredParam} parameter.`)
    }
  }

  database('palettes').insert(palette, 'id')
    .then(paletteID => {
      response.status(200).json({ ...palette, id: paletteID[0] })
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.delete('/api/v1/projects/:id/palettes/:palette_id', (request, response) => {
  database('palettes').where('id', request.params.palette_id).del()
    .then(paletteID => {
      response.status(200).json(`Successfully deleted Palette ${paletteID[0]}`)
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.delete('/api/v1/projects/:id', (request, response) => {
  database('palettes').where('project_id', request.params.id).del()
    .then(() => {
      database('projects').where('id', request.params.id).del()
        .then(project => {
          response.status(200).json(`Successfully deleted Project ${project[0]}`)
        })
        .catch(error => {
          response.status(500).json({ error })
        })
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})