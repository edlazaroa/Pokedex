// ==========================================================
// EXERCICI 1: Llistar els 151 Pokémon
// ==========================================================
// TODO: Implementa la lògica de l'exercici 1 seguint els requisits
import * as Models from "./models.js";
import * as Utils from "./utils.js";

const mapaPokemon = new Map<number, Models.BasePokemon>();
const cachePokemon = new Map<number, Models.DetailedPokemon>();

const botoCarregarPokemon = document.getElementById("btn-show-all") as HTMLButtonElement;

botoCarregarPokemon.addEventListener("click", carregarLlistaPokemon);

async function carregarLlistaPokemon(): Promise<void> {
    Utils.mostrarEstat("Carregant llista de Pokémon...", "loading");
    try{
        const resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");

        if (!resposta.ok){
            throw new Error("Error en carregar els Pokémon.");
        }

        const dades = await resposta.json() as Models.IPokeApiListResponse;

        mapaPokemon.clear();

        dades.results.forEach((item) => {
            const pokemon = new Models.BasePokemon(item);
            mapaPokemon.set(pokemon.id, pokemon);
        });

        Utils.renderitzarLlistaNoms(Array.from(mapaPokemon.values()));

        Utils.amagarEstat();

    } catch (error: unknown){
        Utils.mostrarEstat("Hi ha hagut un error.", "error");
    }
}

// ==========================================================
// EXERCICI 2: Cercador en temps real
// ==========================================================
// TODO: Implementa la lògica de l'exercici 2 seguint els requisits

const cercador = document.getElementById("search-input") as HTMLInputElement;

cercador.addEventListener("input", () => {
    const text = cercador.value.trim().toLowerCase();

    if (text === "") {
        Utils.renderitzarLlistaNoms(Array.from(mapaPokemon.values()));

    } else if (!isNaN(Number(text))) {
        const id = Number(text);
        const pokemon = mapaPokemon.get(id);

        if (pokemon) {
            Utils.renderitzarLlistaNoms([pokemon]);
        } else {
            Utils.renderitzarLlistaNoms([]);
        }
    } else {
        const resultado = Array.from(mapaPokemon.values()).filter(
            (pokemon) => pokemon.name.toLowerCase().includes(text)
        );
        Utils.renderitzarLlistaNoms(resultado);
    }
});


// ==========================================================
// EXERCICI 3: Detall del Pokémon, cache i crit
// ==========================================================
// TODO: Implementa la lògica de l'exercici 3 seguint els requisits

const listaPokemon = document.getElementById("pokemon-list") as HTMLUListElement;

listaPokemon.addEventListener("click", (event: MouseEvent) => {
    const elemento = event.target as HTMLElement;
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

async function carregarDetallPokemon(id: number, url: string): Promise<void> {
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

        const dades = await resposta.json() as Models.IPokeApiDetail;

        const pokemon = new Models.DetailedPokemon(dades, url);

        cachePokemon.set(id, pokemon);

        Utils.renderitzarDetallCard(pokemon);
        Utils.amagarEstat();

    } catch (error: unknown) {
        Utils.mostrarEstat("Hi ha hagut un error en carregar el Pokémon.", "error");
    }
}

Utils.generarBotonsTipus();
// ==========================================================
// EXERCICI 5: Filtrar la llista per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 5 seguint els requisits
const contenidorFiltres = document.getElementById("type-filter-container");

if (contenidorFiltres) {
    contenidorFiltres.addEventListener("click", (event: MouseEvent) => {
        const boto = (event.target as HTMLElement).closest("button");

        if (!boto || !contenidorFiltres.contains(boto)) {
            return;
        }

        const tipus = boto.dataset.type;

        if (!tipus) {
            return;
        }

        // Marquem només el botó seleccionat com a actiu
        contenidorFiltres.querySelectorAll("button").forEach((element) => {
            element.classList.remove("active");
        });

        boto.classList.add("active");

        carregarPokemonPerTipus(tipus);
    });
}
async function carregarPokemonPerTipus(tipus: string): Promise<void> {
    Utils.mostrarEstat("Carregant Pokémon...", "loading");

    try {
        const resposta = await fetch(
            `https://pokeapi.co/api/v2/type/${tipus}`
        );

        if (!resposta.ok) {
            throw new Error("Error en carregar els Pokémon del tipus.");
        }

        const dades = await resposta.json() as Models.IPokeApiTypeResponse;

        mapaPokemon.clear();

        dades.pokemon.forEach((element) => {
            const pokemon = new Models.BasePokemon(element.pokemon);

            // Només Pokémon de la primera generació
            if (pokemon.id <= 151) {
                mapaPokemon.set(pokemon.id, pokemon);
            }
        });

        Utils.renderitzarLlistaNoms(
            Array.from(mapaPokemon.values())
        );

        Utils.netejarCercador();
        Utils.netejarDetallCard();
        Utils.amagarEstat();

    } catch (error: unknown) {
        console.error("Error carregant Pokémon per tipus:", error);

        const missatge = error instanceof Error
            ? error.message
            : "Error desconegut en carregar els Pokémon.";

        Utils.mostrarEstat(missatge, "error");
    }
}