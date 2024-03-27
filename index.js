// Tätä ohjelmaa käytetään esimerkeissä.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Note = require('./models/note');

const app = express();

/* tarkastaa Express GET-tyyppisten HTTP-pyyntöjen yhteydessä ensin löytyykö
  pyynnön polkua vastaavan nimistä tiedostoa hakemistosta dist. Jos löytyy, 
  palauttaa Express tiedoston. */
app.use(express.static('dist'));

app.use(express.json());


const requestLogger = (req, res, next) => {
  console.log('Method:' , req.method);
  console.log('Path:  ', req.path);
  console.log('Body:  ', req.body);
  console.log('---');
  next();
}

app.use(requestLogger);

/*
app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
});
*/

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes);
  })
});

app.get('/api/notes/:id', (req, res, next) => {
  Note.findById(req.params.id).then(note => {
    if (note) {
      res.json(note)
    } else {
      res.status(404).end();
    }
  }).catch(err => next(err));
});

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter(note => note.id !== id);
  res.status(204).end();
});

const generateID = () => {
  const maxID = notes.length > 0
  ? Math.max(...notes.map(n => n.id))
  : 0;    
  return maxID++;
}

app.post('/api/notes', (req, res) => {

  const body = req.body;
  if (body.content === undefined) {
    return res.status(400).json({
      error: 'content missing'
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false
  });

  // notes = notes.concat(note);
  note.save().then(savedNote => {
    res.json(savedNote);
  });
  
});

const errorHandler = (error, req, res, next) => {
  if (error.message) {
    console.error(error.message);
  }
  if (res.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id'});
  }

  // virheenkäsittely Expressin oletusarvoisen virheidenkäsittelijän hoidettavaksi.
  next(error);
}

/*  virheidenkäsittelijämiddleware tulee rekisteröidä muiden middlewarejen sekä
routejen rekisteröinnin jälkeen. */
app.use(errorHandler);

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
}

// Pitää olla routeista ja middlewareista viimeisimpänä.
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});