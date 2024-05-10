const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({});
  res.json(notes);
});

notesRouter.get('/:id', async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (note) {
      res.json(note)
    } else {
      res.status(404).end();
    }
  } catch(error) {
    next (error)
  }
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

notesRouter.delete('/:id', async (req, res, next) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
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

notesRouter.post('/', async (req, res, next) => {
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

  try {
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (expection) {
    next(exception);
  }

});

module.exports = notesRouter;