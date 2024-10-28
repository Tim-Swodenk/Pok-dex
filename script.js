let maxLoadedPokemon = 1;

const BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=${maxLoadedPokemon}&offset=0`;

let allPokemonDetails = [];
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

let types = {
  normal: "./assets/pokemon-type-svg-icons-master/icons/normal.svg",
  fire: "./assets/pokemon-type-svg-icons-master/icons/fire.svg",
  water: "./assets/pokemon-type-svg-icons-master/icons/water.svg",
  electric: "./assets/pokemon-type-svg-icons-master/icons/electric.svg",
  grass: "./assets/pokemon-type-svg-icons-master/icons/grass.svg",
  ice: "./assets/pokemon-type-svg-icons-master/icons/ice.svg",
  fighting: "./assets/pokemon-type-svg-icons-master/icons/fighting.svg",
  poison: "./assets/pokemon-type-svg-icons-master/icons/poison.svg",
  ground: "./assets/pokemon-type-svg-icons-master/icons/ground.svg",
  flying: "./assets/pokemon-type-svg-icons-master/icons/flying.svg",
  psychic: "./assets/pokemon-type-svg-icons-master/icons/psychic.svg",
  bug: "./assets/pokemon-type-svg-icons-master/icons/bug.svg",
  rock: "./assets/pokemon-type-svg-icons-master/icons/rock.svg",
  ghost: "./assets/pokemon-type-svg-icons-master/icons/ghost.svg",
  dragon: "./assets/pokemon-type-svg-icons-master/icons/dragon.svg",
  dark: "./assets/pokemon-type-svg-icons-master/icons/dark.svg",
  steel: "./assets/pokemon-type-svg-icons-master/icons/steel.svg",
  fairy: "./assets/pokemon-type-svg-icons-master/icons/fairy.svg",
};

async function loadData() {
  try {
    let data = await getPokemons();
    let pokemons = data.results;

    // Eizelne URL der Pokemon holen und laden
    for (let pokemon of pokemons) {
      try {
        let details = await fetchPokemonDetails(pokemon.url);
        allPokemonDetails.push(details);
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
  let pokemonName = pokemon.forms[0].name;
  let pokemonImage = pokemon.sprites.front_default;
  let pokemonId = pokemon.id;
  let bgColor = colours[pokemon.types[0].type.name] || "#FFF";
  let imgPokemonType1 = types[pokemon.types[0].type.name];
  let pokemonType1 = pokemon.types[0].type.name;
  let hasTwoTypes = false;
  let imgPokemonType2 = null;
  let pokemonType2 = null;

  console.log(pokemon);

  if (pokemon.types.length == 2) {
    imgPokemonType2 = types[pokemon.types[1].type.name];
    pokemonType2 = pokemon.types[1].type.name;
    hasTwoTypes = true;
  }

  renderHtml(
    pokemonName,
    pokemonImage,
    pokemonId,
    bgColor,
    imgPokemonType1,
    pokemonType1,
    imgPokemonType2,
    pokemonType2,
    hasTwoTypes
  );
}
function firstLetterCap(pokemonName) {
  let capitalized = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

  return capitalized;
}

function searchPokemon(query) {
  query = query.toLowerCase();
  document.getElementById("layout").innerHTML = "";

  let filteredPokemons = allPokemonDetails.filter((pokemon) => {
    return (
      pokemon.forms[0].name.toLowerCase().startsWith(query) ||
      `#${pokemon.id}`.startsWith(query)
    );
  });

  filteredPokemons.forEach((pokemon) => renderPokemon(pokemon));
}

function renderHtml(
  pokemonName,
  pokemonImage,
  pokemonId,
  bgColor,
  imgPokemonType1,
  pokemonType1,
  imgPokemonType2,
  pokemonType2,
  hasTwoTypes
) {
  let content = document.getElementById("layout");
  content.innerHTML += /*html*/ `
      <div class="col">
        <div class="p-3" style="background-color: ${bgColor}">
          <img src="./assets/logo/clipart2514739.png" class="background-image">
          <div>#${pokemonId}</div>
          <div class="type-wrapper">
            <div class="icon ${pokemonType1}">
              <img src="${imgPokemonType1}"/>
            </div>
            ${
              hasTwoTypes
                ? `
            <div class="icon ${pokemonType2}">
              <img src="${imgPokemonType2}"/>
            </div>
          `
                : ""
            }
          </div>
          <img class="font-image" src="${pokemonImage}" alt="">
          <div>${firstLetterCap(pokemonName)}</div>
        </div>
      </div>
    `;
}
