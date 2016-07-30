'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const Pokespotter = require('pokespotter');
const moment = require('moment');
const app = express();

app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({
  extended: true
}));

const PORT = process.env.PORT || 3000;

const POKEDEX = Pokespotter.Pokedex;
const spotter = Pokespotter();

function enhancePokeInfo(pokemon) {
    pokemon.duration = moment.duration(pokemon.expirationTime - Date.now()).humanize();
    return pokemon;
}

function sortClosestPokemon(pokemonA, pokemonB) {
  return pokemonA.distance - pokemonB.distance;
}

function getPokemonByAddress(address) {
  return spotter.getNearby(address, { steps: 2, requestDelay: 75 }).then(pokemon => {
    return pokemon.map(enhancePokeInfo).sort(sortClosestPokemon)
  });
}

function formatPokeList(pokeList, address) {
  let formattedPokemon = pokeList.map(pokemon => {
    return `${pokemon.name}, ${pokemon.distance}m, ${pokemon.duration}`;
  }).join('\n')
  return `There are the following Pokemon around ${address}:
${formattedPokemon}`;
}

app.get('/:address', (req, res) => {
  let address = req.params.address;
  getPokemonByAddress(address).then(pokemon => {
    res.type('text/plain').send(formatPokeList(pokemon, address));
  }).catch(err => {
    res.type('text/plain').status(500).send('An error occurred. Check your console.');
    console.error(err);
  });
});

app.post('/incoming', (req, res) => {
  let message = req.body.Body;
  getPokemonByAddress(message).then(pokemon => {
    console.log(formatPokeList(pokemon, message));
    let response = formatPokeList(pokemon, message);
    res.send(`<Response><Message>${response}</Message></Response>`);
  }).catch(err => {
    res.type('text/plain').status(500).send('An error occurred. Check your console.');
    console.error(err);
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
