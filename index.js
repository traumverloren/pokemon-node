'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Pokespotter = require('pokespotter');

const app = express();

app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({
  extended: true
}));

const PORT = process.env.PORT || 3000;


const POKEDEX = Pokespotter.Pokedex;
const spotter = Pokespotter(process.env.PGO_USERNAME, process.env.PGO_PASSWORD, process.env.PGO_PROVIDER);

app.get('/:address', (req, res) => {
  res.type('text/plain').send(`Ahoy! ${req.params.address}`);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
