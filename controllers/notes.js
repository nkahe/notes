const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes);
  })
});

notesRouter.get('/:id', (req, res, next) => {
  Note.findById(req.params.id).then(note => {
    if (note) {
      res.json(note)
    } else {
      res.status(404).end();
    }
  }).catch(err => next(err));
});

notesRouter.put('/:id', (req, res, next) => {
  const { content, important } = req.body;
  /*  Oletuksena ei PUT:n yhteydessä tehdä validointia, joten se asetetaan
      päälle */
  Note.findByIdAndUpdate(
    req.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(error => next(error));
});

notesRouter.delete('/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then(res => {
      res.status(204).end();
    })
    .catch(error => next(error))
  /*
  const id = Number(req.params.id);
  notes = notes.filter(note => note.id !== id);
  res.status(204).end();
  */
});

const generateID = () => {
  const maxID = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0;
  return maxID++;
}

notesRouter.post('/', (req, res, next) => {
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
  })
    .catch(error => next(error))
});

module.exports = notesRouter;