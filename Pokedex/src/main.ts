// ==========================================================
// EXERCICI 1: Llistar els 151 Pokémon
// ==========================================================
// TODO: Implementa la lògica de l'exercici 1 seguint els requisits
import * as Models from "./models";
import * as Utils from "./utils";

const mapaPokemon = new Map<number, Models.BasePokemon>();

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

        Utils.renderitzarLlistaNoms(
            Array.from(mapaPokemon.values())
        );

        Utils.amagarEstat();

    } catch (error: unknown){
        Utils.mostrarEstat("Hi ha hagut un error.", "error");
    }
}

// ==========================================================
// EXERCICI 2: Cercador en temps real
// ==========================================================
// TODO: Implementa la lògica de l'exercici 2 seguint els requisits



// ==========================================================
// EXERCICI 3: Detall del Pokémon, cache i crit
// ==========================================================
// TODO: Implementa la lògica de l'exercici 3 seguint els requisits



// ==========================================================
// EXERCICI 4: Botons de filtre per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 4 seguint els requisits



// ==========================================================
// EXERCICI 5: Filtrar la llista per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 5 seguint els requisits