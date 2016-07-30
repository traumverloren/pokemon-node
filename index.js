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
const spotter = Pokespotter();

function getPokemonByAddress(address) {
  return spotter.getNearby(address, { steps: 2, requestDelay: 75 }).then(pokemon => {
    return pokemon;
  });
}

app.get('/:address', (req, res) => {
  getPokemonByAddress(req.params.address).then(pokemon => {
    res.type('text/plain').send(pokemon.map(function (p) { return JSON.stringify(p); }).toString());
  }).catch(err => {
    res.type('text/plain').status(500).send('An error occurred. Check your console.');
    console.error(err);
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
