// This sets the environment that our application is running in. If none is found it will default to development
const environment = process.env.NODE_ENV || 'development'
// This pulls the correct configuration data from the knexfile based on the current environment
const configuration = require('./knexfile')[environment]
// This passes the configuration data into knex to set up the knex database
const database = require('knex')(configuration)
// This gives us access to express
const express = require('express')
// This allows us to parse data from the body of post requests
const bodyParser = require('body-parser')
// This set up an instance of an express app so we can set up our endpoints
const app = express()

// This tells our app to use bodyParser's json method when we need to access the body data from a post request
app.use(bodyParser.json())
// This tells our app to serve up the public directory as static assets
app.use(express.static('public'))
// This creates a title property local to our express app, for use in confirming that the app is running locally
app.locals.title = 'Palette Picker'
// This sets the port on which the app is running, if none is found it will default to port 3000
app.set('port', process.env.PORT || 3000)

// This sets up a get endpoint at the given url (all projects)
app.get('/api/v1/projects', (request, response) => {
  // This will select all rows from the projects table of our database
  database('projects').select()
  // This will use the above returned project rows if successful and send them back in the response
    .then(projects => {
      response.status(200).json(projects)
    })
    // This will catch any errors in getting projects from the database and respond with the error
    .catch(error => {
      response.status(500).json({ error })
    })
})

// This sets up a post endpoint at the given url (add a new project)
app.post('/api/v1/projects', (request, response) => {
  // This stores the request body in a variable, project
  const project = request.body

  // This checks if the incoming data contains all of the proper parameters before it is added to the database
  if(!project['name']) {
    return response.status(422).send(`Expected format: { name: <String> }. You're missing a name parameter.`)
  }

  // This inserts the incoming data into the projects table and tells it to create and id
  database('projects').insert(project, 'id')
  // This takes the retured id and responds with a full project object with the new id
    .then(projectID => {
      response.status(200).json({ ...project, id: projectID[0] })
    })
    // This will catch any errors in adding a new project and respond with the error
    .catch(error => {
      response.status(500).json({ error })
    })
})

// This sets up a get endpoint at the given url (all palettes for a given project)
app.get('/api/v1/projects/:id/palettes', (request, response) => {
  // This gets all rows from the palettes table if the project id matches the id from the request parameters
  database('palettes').where('project_id', request.params.id).select()
  // This takes the palettes that were found in the database and sends them back in the response
    .then(palettes => {
      response.status(200).json(palettes)
    })
    // This will catch any errors in getting palettes and respond with the error
    .catch(error => {
      response.status(500).json({ error })
    })
})

// This sets up a get endpoint at the given url (gets a specific palette)
app.get('/api/v1/projects/:id/palettes/:palette_id', (request, response) => {
  // This will find a palette in the palettes table where the id matches the palette_id from the request parameters
  database('palettes').where('id', request.params.palette_id).select()
  // This will take the palette that was found and send it in the response
    .then(palette => {
      response.status(200).json(palette[0])
    })
    // This will catch any errors in finding a palette and respond with the error
    .catch(error => {
      response.status(500).json({ error })
    })
})

// This sets up a post endpoint at the given url (add a palette to a specific project)
app.post('/api/v1/projects/:id', (request, response) => {
  // This stores the request body in a variable, palette
  const palette = request.body

  // This checks that the incoming palette has all of the proper parameters before being added to the database
  for (let requiredParam of ['name', 'color1', 'color2', 'color3', 'color4', 'color5', 'project_id']) {
    if (!palette[requiredParam]) {
      return response.status(422).send(`Expected format: { name: <String>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String>, project_id: <Integer> }. You're missing a ${requiredParam} parameter.`)
    }
  }

  // This adds the new palette to the palettes table and tells it to generate an id
  database('palettes').insert(palette, 'id')
    // This responds with a new palette with the returned paletteID
    .then(paletteID => {
      response.status(200).json({ ...palette, id: paletteID[0] })
    })
    // This will catch any errors in adding the new palette and respond with the error
    .catch(error => {
      response.status(500).json({ error })
    })
})

// This sets up a delete endpoint at the given url (delete a specific palette)
app.delete('/api/v1/projects/:id/palettes/:palette_id', (request, response) => {
  // This will find a given palette where the id matches the id from the request parameters and delete it
  database('palettes').where('id', request.params.palette_id).del()
  // This will takes the found paletteID and respond to confirm that it was deleted
    .then(paletteID => {
      response.status(200).json(`Successfully deleted Palette ${paletteID[0]}`)
    })
    // This will catch any errors in deleting the palette and respond with the error
    .catch(error => {
      response.status(500).json({ error })
    })
})

// This sets up a delete endpoint at the given url (deletes a project)
app.delete('/api/v1/projects/:id', (request, response) => {
  // This will find any palettes where the project_id matches the id from the request parameters and delete them
  database('palettes').where('project_id', request.params.id).del()
    .then(() => {
      // This will find the project whose id matches the id from the request parameters and delete it
      database('projects').where('id', request.params.id).del()
      // This will confirm that the project was successfully deleted
        .then(project => {
          response.status(200).json(`Successfully deleted Project ${project[0]}`)
        })
        // This will catch any errors in deleting a project and respond with the error
        .catch(error => {
          response.status(500).json({ error })
        })
    })
    // This will catch any errors in deleting palettes and respond with the error
    .catch(error => {
      response.status(500).json({ error })
    })
})

// This will respond with a 404 Page Not Found error if any url besides one defined is given
app.use((request, response) => {
  response.status(404).send('Page Not Found')
})

// This tells the app to listen at the port that was set and console log a message confirming that the app is listening
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})