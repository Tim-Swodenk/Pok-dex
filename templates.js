window.renderPokemon = renderPokemon;
window.loadMoreDetailsHTMLContent = loadMoreDetailsHTMLContent;

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

export function renderPokemon(pokemon, loadMoreDetails) {
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
            <img class="font-image" src="${
              pokemon.sprites.front_default
            }" alt="">
            <div>${firstLetterCap(pokemon.forms[0].name)}</div>
          </div>
        </div>
      `;
}

export function loadMoreDetailsHTMLContent(pokemon, moreDetails, categorie) {
  return /*html*/ `
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
        <td>${categorie}</td>
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

function firstLetterCap(pokemonName) {
  let capitalized = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);

  return capitalized;
}
