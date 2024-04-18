// Tätä ohjelmaa käytetään esimerkeissä.

const config = require('./utils/config')
const express = require('express');
const app = express();
const cors = require('cors');
const notesRouter = require('./controllers/notes');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
  .then(res => {
    logger.info('connected to MongoDB');
  })
  .catch(err => {
    if (err) {
      logger.error('error connecting to MongoDB:', error.message);
    } else {
      logger.error('Failed to connect to database.');
    }
  });

app.use(cors());

/* tarkastaa Express GET-tyyppisten HTTP-pyyntöjen yhteydessä ensin löytyykö
  pyynnön polkua vastaavan nimistä tiedostoa hakemistosta dist. Jos löytyy,
  palauttaa Express tiedoston. */
app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/notes', notesRouter);

/*  virheidenkäsittelijämiddleware tulee rekisteröidä muiden middlewarejen sekä
routejen rekisteröinnin jälkeen. */
app.use(middleware.errorHandler);

// Pitää olla routeista ja middlewareista viimeisimpänä.
app.use(middleware.unknownEndpoint);

module.exports = app;