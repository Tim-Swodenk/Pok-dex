window.renderPokemonHTML = renderPokemonHTML;
window.loadMoreDetailsHTMLContent = loadMoreDetailsHTMLContent;

export function renderPokemonHTML(pokemon, loadMoreDetails, types) {
  return /*html*/ `
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
            <div class="offcanvas-navigation-arrows" id="arrows-wrapper">
            <img onclick="loadMoreDetails(
            ${
              pokemon.id - 1
            })" class="img-left" id="arrow-left" src="./assets/img/arrow.png" />
  <img onclick="loadMoreDetails(${
    pokemon.id + 1
  })" class="img-right" id="arrow-right" src="./assets/img/arrow.png" />
  
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
