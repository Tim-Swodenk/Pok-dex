let limit = 1010;
let allPokemonDetails = [];
let displayedPokemonCount = 0;
let initialLoadCount = 20;
let incrementCount = 20;

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

async function loadData(NEW_URL) {
  toggleLoadingState(true);

  try {
    const data = await getPokemons(NEW_URL);
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
//hier entsteht der error aufgrund der möglichen gen URL
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

function loadMorePokemon() {
  renderPokemonBatch(incrementCount);

  if (displayedPokemonCount >= allPokemonDetails.length) {
    document.getElementById("load-more-btn").style.display = "none";
  }
}

function firstLetterCap(pokemonName) {
  let capitalized = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

  return capitalized;
}

function searchPokemon(query) {
  toggleLoadingState(true);

  setTimeout(() => {
    if (typeof query !== "string" || query.trim() === "") {
      resetDisplay();
      document.getElementById("loadingSpinner").style.display = "none";
      document.getElementById("footer").style.position = "relative";
      return;
    }
    query = query.toLowerCase();
    document.getElementById("layout").innerHTML = "";

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

      filteredPokemons.forEach(renderPokemon);
    }
  }, 100); // Verzögerung von 100 ms
}

function resetDisplay() {
  document.getElementById("layout").innerHTML = "";
  displayedPokemonCount = 0;
  renderPokemonBatch(20);
  document.getElementById("load-more-btn").style.display = "flex";
}
// zu lang (html)
function renderPokemon(pokemon) {
  let content = document.getElementById("layout");

  content.innerHTML += /*html*/ `
      <div class="col" data-bs-toggle="offcanvas" href="#offcanvasExample" onclick="loadMoreDetails(
      ${pokemon.id})">
        <div class="p-3 ${pokemon.types[0].type.name}-bg">
          <img src="./assets/img/pokeball-bg-card.png" class="background-image">
          <div>#${String(pokemon.id).padStart(3, "0")}</div>
          <div class="type-wrapper">
            <div class="icon ${pokemon.types[0].type.name}">
              <img src="${types[pokemon.types[0].type.name]}"/>
            </div>
            ${
              pokemon.types.length == 2
                ? `
            <div class="icon ${pokemon.types[1].type.name}">
              <img src="${types[pokemon.types[1].type.name]}"/>
            </div>
          `
                : ""
            }
          </div>
          <img class="font-image" src="${pokemon.sprites.front_default}" alt="">
          <div>${firstLetterCap(pokemon.forms[0].name)}</div>
        </div>
      </div>
    `;
}

async function loadMoreDetails(pokeId) {
  if (pokeId == 0) {
    pokeId++;
    return;
  }

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
// zu lang (html)
function loadMoreDetailsHTML(pokemon, moreDetails) {
  let content = document.getElementById("offcanvasExample");

  removeBG(content, pokemon);

  content.innerHTML = /*html*/ `
   <div class="offcanvas-header">
   <div class="d-flex justify-content-evenly w-100">
        <h5 class="offcanvas-title" id="offcanvasExampleLabel">${firstLetterCap(
          pokemon.name
        )}</h5>
         <h5 class="offcanvas-title" id="offcanvasExampleLabel">#${String(
           pokemon.id
         ).padStart(3, "0")}</h5>
         </div>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body">
        <div>
          <div class="offcanvas-navigation-arrows">
          <img onclick="loadMoreDetails(
          ${pokemon.id - 1})" class="img-left" src="./assets/img/arrow.png" />
<img onclick="loadMoreDetails(${
    pokemon.id + 1
  })" class="img-right" src="./assets/img/arrow.png" />

          </div>
          <div class="offcanvans-body-header">
            <div class="type ${pokemon.types[0].type.name}">${
    pokemon.types[0].type.name
  }</div>
            ${
              pokemon.types.length == 2
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
      <td>${moreDetails.genera[7].genus}</td>
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

function removeBG(content, pokemon) {
  content.classList.forEach((className) => {
    if (className.endsWith("-bg")) {
      content.classList.remove(className);
    }
  });
  content.classList.add(`${pokemon.types[0].type.name}-bg`);
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
