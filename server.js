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

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})