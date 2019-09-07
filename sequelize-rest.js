const Sequelize = require('sequelize')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = new Sequelize('postgres://postgres:secret@localhost:5432/postgres')

app.use(bodyParser.json())


const Movie = db.define('movie', {
  title: {
    type: Sequelize.STRING
  },
  yearOfRelease: {
    type: Sequelize.INTEGER
  },
  synopsis: {
    type: Sequelize.STRING
  }
})

db.sync()
  .then(console.log('Tables created succesfully'))
  .catch(err => {
    console.error('Unable to create tables, shutting down...', err);
    process.exit(1);
})

Movie.create({ title: 'Fear and Loathing in Las Vegas', 
        yearOfRelease: 1998, 
        synopsis: 'one big trip through Las Vegas'})
Movie.create({ title: 'Requiem for a dream', 
        yearOfRelease: 2000, 
        synopsis: 'a compilation of bad things happening to people'})
Movie.create({ title: 'Eraserhead', 
        yearOfRelease: 1977, 
        synopsis: 'about a guy whose hair looks like an eraserhead of a pencil'})

app.post('/movies', (req, res, next) => {
  Movie.create(req.body)
    .then(movie => res.json(movie))
    .catch(err => next(err))
})

app.get('/movies', (req, res, next) => {
  const limit = req.query.limit || 10
  const offset = req.query.offset || 0
  Movie
    .count()
      .then(total => Movie
        .findAll({ limit, offset })
        .then(movies => res.json({ movies, total }))
      )  
    .catch(err => next(err))
})

app.get('/movies/:id', (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => {
      if (movie) {
        res.json(movie)
      } else {
        res.status(404).send('File not Found')
      }
    })
    .catch(err => next(err))
})

app.put('/movies/:id', (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => {
      if (movie) {
        return movie.update(req.body)
          .then(movie => res.json(movie))
      } else {
        res.status(404).send('File not Found')
      }
    })
    .catch(err => next(err))
})

app.delete('/movies/:id', (req, res, next) => {
  Movie.destroy({ where: { id: req.params.id}})
    .then(res.status(204).send('Movie deleted from database'))
    .catch(err => next(err))
})

app.listen(port, () => console.log('App listens on port:', 3000))