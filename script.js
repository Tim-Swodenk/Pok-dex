let maxLoadedPokemon = 20;

const BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=${maxLoadedPokemon}&offset=0`;

let colours = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

async function loadData() {
  try {
    let data = await getPokemons();
    let pokemons = data.results;

    // Eizelne URL der Pokemon holen und laden
    for (let pokemon of pokemons) {
      try {
        let details = await fetchPokemonDetails(pokemon.url);
        renderPokemon(details);
      } catch (error) {
        console.error("Fehler beim Laden der Pokémon-Details:", error);
      }
    }
  } catch (error) {
    console.error("Fehler beim Laden der Pokemon-Daten:", error);
  }
}

async function getPokemons() {
  let response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error(`HTTP-Fehler! Status: ${response.status}`);
  }
  return await response.json();
}

async function fetchPokemonDetails(url) {
  let response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP-Fehler! Status: ${response.status}`);
  }
  return await response.json();
}

function renderPokemon(pokemon) {
  console.log(pokemon);

  let content = document.getElementById("layout");
  const pokemonName = pokemon.forms[0].name;
  const pokemonImage = pokemon.sprites.front_default;
  const pokemonId = pokemon.id;
  const bgColor = colours[pokemon.types[0].type.name] || "#FFF";

  content.innerHTML += /*html*/ `
      <div class="col">
        <div class="p-3" style="background-color: ${bgColor}">
            <div>#${pokemonId}</div>
          <img src="${pokemonImage}" alt="">
          <div>${pokemonName}</div>
        </div>
      </div>
    `;
}
