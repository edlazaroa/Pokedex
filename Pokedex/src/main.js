// ==========================================================
// EXERCICI 1: Llistar els 151 Pokémon
// ==========================================================
// TODO: Implementa la lògica de l'exercici 1 seguint els requisits
import * as Models from "./models.js";
import * as Utils from "./utils.js";
const mapaPokemon = new Map();
const cachePokemon = new Map();
const botoCarregarPokemon = document.getElementById("btn-show-all");
botoCarregarPokemon.addEventListener("click", carregarLlistaPokemon);
async function carregarLlistaPokemon() {
    Utils.mostrarEstat("Carregant llista de Pokémon...", "loading");
    try {
        const resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        if (!resposta.ok) {
            throw new Error("Error en carregar els Pokémon.");
        }
        const dades = await resposta.json();
        mapaPokemon.clear();
        dades.results.forEach((item) => {
            const pokemon = new Models.BasePokemon(item);
            mapaPokemon.set(pokemon.id, pokemon);
        });
        Utils.renderitzarLlistaNoms(Array.from(mapaPokemon.values()));
        Utils.amagarEstat();
    }
    catch (error) {
        Utils.mostrarEstat("Hi ha hagut un error.", "error");
    }
}
// ==========================================================
// EXERCICI 2: Cercador en temps real
// ==========================================================
// TODO: Implementa la lògica de l'exercici 2 seguint els requisits
const cercador = document.getElementById("search-input");
cercador.addEventListener("input", () => {
    const text = cercador.value.trim().toLowerCase();
    if (text === "") {
        Utils.renderitzarLlistaNoms(Array.from(mapaPokemon.values()));
    }
    else if (!isNaN(Number(text))) {
        const id = Number(text);
        const pokemon = mapaPokemon.get(id);
        if (pokemon) {
            Utils.renderitzarLlistaNoms([pokemon]);
        }
        else {
            Utils.renderitzarLlistaNoms([]);
        }
    }
    else {
        const resultado = Array.from(mapaPokemon.values()).filter((pokemon) => pokemon.name.toLowerCase().includes(text));
        Utils.renderitzarLlistaNoms(resultado);
    }
});
// ==========================================================
// EXERCICI 3: Detall del Pokémon, cache i crit
// ==========================================================
// TODO: Implementa la lògica de l'exercici 3 seguint els requisits
const listaPokemon = document.getElementById("pokemon-list");
listaPokemon.addEventListener("click", (event) => {
    const elemento = event.target;
    const item = elemento.closest("li");
    if (!item) {
        return;
    }
    const id = Number(item.dataset.id);
    const pokemon = mapaPokemon.get(id);
    if (!pokemon) {
        return;
    }
    Utils.marcarItemActiu(item);
    carregarDetallPokemon(pokemon.id, pokemon.url);
});
async function carregarDetallPokemon(id, url) {
    try {
        const pokemonGuardat = cachePokemon.get(id);
        if (pokemonGuardat) {
            Utils.renderitzarDetallCard(pokemonGuardat);
            Utils.amagarEstat();
            return;
        }
        Utils.mostrarEstat("Carregant detall del Pokémon...", "loading");
        const resposta = await fetch(url);
        if (!resposta.ok) {
            throw new Error("Error en carregar el detall del Pokémon.");
        }
        const dades = await resposta.json();
        const pokemon = new Models.DetailedPokemon(dades, url);
        cachePokemon.set(id, pokemon);
        Utils.renderitzarDetallCard(pokemon);
        Utils.amagarEstat();
    }
    catch (error) {
        Utils.mostrarEstat("Hi ha hagut un error en carregar el Pokémon.", "error");
    }
}
Utils.generarBotonsTipus();
// ==========================================================
// EXERCICI 5: Filtrar la llista per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 5 seguint els requisits
//# sourceMappingURL=main.js.map