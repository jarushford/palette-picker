const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.locals.title = 'Palette Picker'
app.set('port', process.env.PORT || 3000)

app.use((request, response, next) => {
  response.status(404).send('Page Not Found')
})

app.get('/api/v1/projects', (request, response) => {
  // Get all projects
})

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  // Get all palettes associated with a project
})

app.get('/api/v1/projects/:id/palettes/:palette', (request, response) => {
  // Get a specific palette when clicked on
})

app.post('/api/v1/projects/:id', (request, response) => {
  // Post a new palette associated with a project
})

app.delete('/api/v1/projects/:id/palettes/:palette', (request, response) => {
  // Delete a palette from a project
})


// (Delete a project?)

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})