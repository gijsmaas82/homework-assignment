const express = require('express')
const bodyParser = require('body-parser')

const app = express()
let requestCounter = 0
const port = 3000
app.use(bodyParser.json())

const countRequests = (req, res, next) => {
  requestCounter++
  if (requestCounter > 5) {
    res.status(429).send('Too Many Requests')
  } else {
    next()
  }
}

app.post('/messages', countRequests, (req, res, next) => {
  if (Object.values(req.body)[0] === '' || Object.keys(req.body).length === 0) {
    res.status(400).send('Bad Request')
  } else {
    console.log(Object.values(req.body))
    res.json({ 'message': 'Message received loud and clear'})
  }

  
})
app.listen(port, () => console.log('App listens on port:', port))
