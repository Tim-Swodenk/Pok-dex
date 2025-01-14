window.loadData = loadData;
window.chooseGen = chooseGen;
window.searchPokemon = searchPokemon;
window.loadMorePokemon = loadMorePokemon;
window.scrollTopFunction = scrollTopFunction;
window.loadMoreDetails = loadMoreDetails;

import { renderPokemonHTML } from "./templates.js";
import { loadMoreDetailsHTMLContent } from "./templates.js";

let limit = 1010;
let allPokemonDetails = [];
let displayedPokemonCount = 0;
let initialLoadCount = 40;
let incrementCount = 40;

let BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`;

let gen = {
  All: { start: 0, end: 1010 },
  "Gen 1": { start: 0, end: 151 },
  "Gen 2": { start: 152, end: 251 },
  "Gen 3": { start: 252, end: 386 },
  "Gen 4": { start: 387, end: 493 },
  "Gen 5": { start: 494, end: 649 },
  "Gen 6": { start: 650, end: 721 },
  "Gen 7": { start: 722, end: 809 },
  "Gen 8": { start: 810, end: 898 },
  "Gen 9": { start: 899, end: 1010 },
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

export function chooseGen(event) {
  const selectedGen = event.target.textContent;

  let content = document.getElementById("layout");
  content.innerHTML = "";
  displayedPokemonCount = 0;

  if (gen.hasOwnProperty(selectedGen)) {
    const generationData = gen[selectedGen];

    let NEW_URL = `https://pokeapi.co/api/v2/pokemon?limit=${generationData.end}&offset=${generationData.start}`;

    loadData(NEW_URL);
  }
}

export async function loadData(URL) {
  let url = URL == undefined ? BASE_URL : URL;

  toggleLoadingState(true);

  try {
    const data = await getPokemons(url);
    const pokemonDetailsPromises = data.results.map((pokemon) =>
      fetchPokemonDetails(pokemon.url)
    );
    allPokemonDetails = await Promise.all(pokemonDetailsPromises);

    renderPokemonBatch(initialLoadCount);
  } catch (error) {
    console.error("Fehler beim Laden der Pokemon-Daten:", error);
  } finally {
    toggleLoadingState(false);
  }
}

export function searchPokemon(query) {
  toggleLoadingState(true);
  timeoutFunction(query);
}

function timeoutFunction(query) {
  setTimeout(() => {
    searchNoString(query);
    removeContent();
    searchforPokemon(lowerCase(query));
  }, 100);
}

function removeContent() {
  document.getElementById("layout").innerHTML = "";
}

function lowerCase(query) {
  return query.toLowerCase();
}

function searchNoString(query) {
  if (typeof query !== "string" || query.trim() === "") {
    resetDisplay();
    document.getElementById("loadingSpinner").style.display = "none";
    document.getElementById("footer").style.position = "relative";
    document.getElementById("load-more-btn").style.display = "none";
  }
}

function searchforPokemon(query) {
  if (query.length >= 3) {
    const filteredPokemons = allPokemonDetails.filter((pokemon) => {
      const pokemonId = String(pokemon.id).padStart(3, "0");
      document.getElementById("loadingSpinner").style.display = "none";
      document.getElementById("footer").style.position = "relative";
      return (
        pokemon.forms[0].name.toLowerCase().startsWith(query) ||
        `#${pokemonId}`.startsWith(query)
      );
    });

    filterPokemons(filteredPokemons);
  }
}

function filterPokemons(filteredPokemons) {
  filteredPokemons.forEach((pokemon) =>
    renderPokemon(pokemon, loadMoreDetails)
  );
}

export function scrollTopFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

async function getPokemons(url) {
  try {
    let fallbackResponse = await fetch(url);
    if (!fallbackResponse.ok) {
      throw new Error(`HTTP-Fehler! Status: ${fallbackResponse.status}`);
    }
    return await fallbackResponse.json();
  } catch (fallbackError) {
    console.error(`Fehler beim Laden von BASE_URL: ${fallbackError.message}`);
    throw fallbackError;
  }
}

async function fetchPokemonDetails(url) {
  let response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP-Fehler! Status: ${response.status}`);
  }
  return await response.json();
}

function renderPokemonBatch(count) {
  const pokemonsToRender = allPokemonDetails.slice(
    displayedPokemonCount,
    displayedPokemonCount + count
  );
  pokemonsToRender.forEach((pokemon) =>
    renderPokemon(pokemon, loadMoreDetails)
  );
  displayedPokemonCount += count;
}

function loadMorePokemon() {
  renderPokemonBatch(incrementCount);

  if (displayedPokemonCount >= allPokemonDetails.length) {
    document.getElementById("load-more-btn").style.display = "none";
  }
}

function renderPokemon(pokemon, loadMoreDetails) {
  let content = document.getElementById("layout");

  content.innerHTML += renderPokemonHTML(pokemon, loadMoreDetails, types);
}

export async function loadMoreDetails(pokeId) {
  let pokemon = allPokemonDetails.find((p) => p.id === pokeId);

  try {
    let data = await fetchMoreDetails(pokemon.species.url);

    loadMoreDetailsHTML(pokemon, data);
    toggleArrowsVisibility(pokeId);
  } catch (error) {
    console.error("Fehler beim Laden der Pokemon-Daten:", error);
  }
}

function toggleArrowsVisibility(pokeId) {
  if (pokeId === 1) {
    document.getElementById("arrow-left").style.display = "none";
    document.getElementById("arrows-wrapper").style.justifyContent = "flex-end";
  } else {
    document.getElementById("arrow-left").style.display = "block";
  }

  if (pokeId === 1010) {
    document.getElementById("arrow-right").style.display = "none";
  } else {
    document.getElementById("arrow-right").style.display = "block";
  }
}

async function fetchMoreDetails(url) {
  let response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP-Fehler! Status: ${response.status}`);
  }
  return await response.json();
}

function loadMoreDetailsHTML(pokemon, moreDetails) {
  let content = document.getElementById("offcanvasExample");
  let genreaData = moreDetails.genera;
  const filtered = genreaData.filter((item) => item.language.name == "en");
  let categorie = filtered.map((item) => item.genus);

  removeBG(content, pokemon);

  content.innerHTML = loadMoreDetailsHTMLContent(
    pokemon,
    moreDetails,
    categorie,
    types
  );
}

function resetDisplay() {
  document.getElementById("layout").innerHTML = "";
  displayedPokemonCount = 0;
  renderPokemonBatch(20);
  document.getElementById("load-more-btn").style.display = "flex";
}

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  let scrollUp = document.getElementById("scrollUp");

  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollUp.style.display = "block";
  } else {
    scrollUp.style.display = "none";
  }
}

function toggleLoadingState(isLoading) {
  document.getElementById("loadingSpinner").style.display = isLoading
    ? "block"
    : "none";
  document.getElementById("load-more-btn").style.display = isLoading
    ? "none"
    : "flex";
  document.getElementById("footer").style.position = isLoading
    ? "absolute"
    : "relative";
}

function removeBG(content, pokemon) {
  content.classList.forEach((className) => {
    if (className.endsWith("-bg")) {
      content.classList.remove(className);
    }
  });
  content.classList.add(`${pokemon.types[0].type.name}-bg`);
}
