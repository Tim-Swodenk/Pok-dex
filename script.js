let limit = 100;

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

let allPokemonDetails = [];
let displayedPokemonCount = 0; //Aktuelle angezeigte Anzahl
let initialLoadCount = 20; // Wieviele am Anfang angeziegt werden sollen
let incrementCount = 20; // Anzahl der weiter zu ladenen

function chooseGen(event) {
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

async function loadData(NEW_URL) {
  document.getElementById("loadingSpinner").style.display = "block";
  try {
    let data = await getPokemons(NEW_URL);
    let pokemons = data.results;

    // Paralleles Laden der Pokemon-Details
    let pokemonDetailsPromises = pokemons.map((pokemon) =>
      fetchPokemonDetails(pokemon.url)
    );
    allPokemonDetails = await Promise.all(pokemonDetailsPromises);

    // Zeigt die ersten 20 POkemon an
    renderPokemonBatch(initialLoadCount);
  } catch (error) {
    console.error("Fehler beim Laden der Pokemon-Daten:", error);
  } finally {
    document.getElementById("loadingSpinner").style.display = "none";
  }
}

async function getPokemons(NEW_URL) {
  try {
    // Versuche fetch von NEW_URL
    let response = await fetch(NEW_URL);

    if (!response.ok) {
      throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Fehler beim Laden von NEW_URL: ${error.message}`);

    // wenn error, dann die BASE_URL nutzen
    try {
      let fallbackResponse = await fetch(BASE_URL);
      if (!fallbackResponse.ok) {
        throw new Error(`HTTP-Fehler! Status: ${fallbackResponse.status}`);
      }
      return await fallbackResponse.json();
    } catch (fallbackError) {
      console.error(`Fehler beim Laden von BASE_URL: ${fallbackError.message}`);
      throw fallbackError;
    }
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
  pokemonsToRender.forEach(renderPokemon);
  displayedPokemonCount += count;
}

function renderPokemon(pokemon) {
  let pokemonName = pokemon.forms[0].name;
  let pokemonImage = pokemon.sprites.front_default;
  let pokemonId = pokemon.id;
  let formattedId = String(pokemonId).padStart(3, "0");
  let bgColor = colours[pokemon.types[0].type.name] || "#FFF";
  let imgPokemonType1 = types[pokemon.types[0].type.name];
  let pokemonType1 = pokemon.types[0].type.name;
  let hasTwoTypes = false;
  let imgPokemonType2 = null;
  let pokemonType2 = null;

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
    hasTwoTypes,
    formattedId
  );
}

function loadMorePokemon() {
  renderPokemonBatch(incrementCount);

  // Button verstecken wenn alle geladen
  if (displayedPokemonCount >= allPokemonDetails.length) {
    document.getElementById("load-more-btn").style.display = "none";
  }
}

function firstLetterCap(pokemonName) {
  let capitalized = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

  return capitalized;
}

function searchPokemon(query) {
  document.getElementById("loadingSpinner").style.display = "block"; // Ladesymbol einblenden
  document.getElementById("load-more-btn").style.display = "none"; // Button mehr Pokemon ausblenden

  setTimeout(() => {
    if (typeof query !== "string") {
      document.getElementById("loadingSpinner").style.display = "none"; // Ladesymbol ausblenden
      return;
    }

    query = query.toLowerCase();
    document.getElementById("layout").innerHTML = "";

    if (query === "") {
      resetDisplay();
      document.getElementById("loadingSpinner").style.display = "none"; // Ladesymbol ausblenden

      return;
    }

    if (query.length >= 3) {
      let filteredPokemons = allPokemonDetails.filter((pokemon) => {
        let pokemonId = pokemon.id;
        let formattedId = String(pokemonId).padStart(3, "0");
        return (
          pokemon.forms[0].name.toLowerCase().startsWith(query) ||
          `#${formattedId}`.startsWith(query)
        );
      });
      filteredPokemons.forEach(renderPokemon);

      document.getElementById("loadingSpinner").style.display = "none"; // Ladesymbol ausblenden
    }
  }, 100); // Verzögerung von 100 ms
}

function resetDisplay() {
  document.getElementById("layout").innerHTML = "";
  displayedPokemonCount = 0;
  renderPokemonBatch(20);
  document.getElementById("load-more-btn").style.display = "flex"; // Button mehr Pokemon einblenden
}

function renderHtml(
  name,
  image,
  id,
  bgColor,
  imgType1,
  type1,
  imgType2,
  type2,
  hasTwoTypes,
  formattedId
) {
  let content = document.getElementById("layout");
  content.innerHTML += /*html*/ `
      <div class="col" data-bs-toggle="offcanvas" href="#offcanvasExample" onclick="loadMoreDetails(${id}, ${hasTwoTypes})">
        <div class="p-3" style="background-color: ${bgColor}">
          <img src="./assets/logo/clipart2514739.png" class="background-image">
          <div>#${formattedId}</div>
          <div class="type-wrapper">
            <div class="icon ${type1}">
              <img src="${imgType1}"/>
            </div>
            ${
              hasTwoTypes
                ? `
            <div class="icon ${type2}">
              <img src="${imgType2}"/>
            </div>
          `
                : ""
            }
          </div>
          <img class="font-image" src="${image}" alt="">
          <div>${firstLetterCap(name)}</div>
        </div>
      </div>
    `;
}

async function loadMoreDetails(pokeId) {
  let pokemon = allPokemonDetails.find((p) => p.id === pokeId);

  try {
    let data = await fetchMoreDetails(pokemon.species.url);

    loadMoreDetailsHTML(pokemon, data);
  } catch (error) {
    console.error("Fehler beim Laden der Pokemon-Daten:", error);
  }
}

async function fetchMoreDetails(url) {
  let response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP-Fehler! Status: ${response.status}`);
  }
  return await response.json();
}

function loadMoreDetailsHTML(pokemon, moreDetails, hasTwoTypes) {
  let content = document.getElementById("offcanvasExample");

  let pokemonId = pokemon.id;
  let formattedId = String(pokemonId).padStart(3, "0");

  content.style.backgroundColor = colours[pokemon.types[0].type.name];

  content.innerHTML = /*html*/ `
   <div class="offcanvas-header">
   <div class="d-flex justify-content-evenly w-100">
        <h5 class="offcanvas-title" id="offcanvasExampleLabel">${firstLetterCap(
          pokemon.name
        )}</h5>
         <h5 class="offcanvas-title" id="offcanvasExampleLabel">#${formattedId}</h5>
         </div>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body">
        <div class="dropdown mt-3">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            Choose Details
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">About</a></li>
            <li><a class="dropdown-item" href="#">Base Stats</a></li>
            <li><a class="dropdown-item" href="#">Gender</a></li>
            <li><a class="dropdown-item" href="#">Shiny</a></li>

          </ul>
        </div>
        <div>
          <div class="offcanvans-body-header">
            <div class="type ${pokemon.types[0].type.name}">${
    pokemon.types[0].type.name
  }</div>
            ${
              hasTwoTypes
                ? `
            <div class="type ${pokemon.types[1].type.name}">${pokemon.types[1].type.name}
            </div>
          `
                : ""
            }
  
          

          </div>
          <div class="offcanvans-body-img">
          <img src="${pokemon.sprites.front_default}">
          <div>
            <div>
            <table class="table">

  <tbody>
    <tr>
      <td>Categorie</td>
      <td>${moreDetails.genera[4].genus}</td>
    </tr>
    <tr>
      <td>Height</td>
      <td>${pokemon.height / 10}m</td>
    </tr>
    <tr>
      <td>Weight</td>
      <td>${pokemon.weight / 10}kg</td>
    </tr>
    <tr>
      <td>Color</td>
      <td>${moreDetails.color.name}</td>
    </tr>
  
  </tbody>
</table>
          </div>
        </div>
      </div>
 `;
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

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function findRightId(params) {}
