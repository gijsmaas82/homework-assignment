const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const port = 3000
app.use(bodyParser.json())

app.post('/messages', (req, res, next) => {
  console.log(req.body)
  res.json({ 'message': 'Message received loud and clear'})
  // if (!req.text) {
  //   res.status(400).send('Bad Request')
  // } else {
  //   res.send(req.body)
  // }
})
app.listen(port, () => console.log('App listens on port:', port))
