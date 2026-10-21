import * as Models from "./models.js";

// ==========================================================
// PART A: FUNCIONS JA IMPLEMENTADES (no cal modificar-les)
// ==========================================================

/**
 * Mostra un missatge d'estat (carregant, error...) a la interfície.
 * Usa-la com a MODEL per escriure les teves pròpies funcions.
 */
export function mostrarEstat(missatge: string, tipus: Models.EstatTipus): void {
    const statusContainer = document.getElementById("status-message");
    if (!statusContainer) return;

    statusContainer.textContent = missatge;
    statusContainer.className = tipus; // el CSS defineix #status-message.loading / .error
}

/**
 * Amaga el missatge d'estat.
 */
export function amagarEstat(): void {
    const statusContainer = document.getElementById("status-message");
    if (!statusContainer) return;

    statusContainer.textContent = "";
    statusContainer.className = "hidden";
}

/**
 * Neteja l'input cercador i torna a mostrar tots els ítems de la llista.
 */
export function netejarCercador(): void {
    const searchInput = document.getElementById("search-input") as HTMLInputElement | null;
    if (searchInput) {
        searchInput.value = "";
    }

    const items = document.querySelectorAll<HTMLLIElement>("#pokemon-list li");
    items.forEach((li) => li.classList.remove("hidden"));
}

/**
 * Marca visualment l'element seleccionat a la llista.
 */
export function marcarItemActiu(target: HTMLElement): void {
    const listItem = target.closest("li");
    if (!listItem) return;

    document.querySelectorAll("#pokemon-list li").forEach((li) => {
        li.classList.remove("active");
    });

    listItem.classList.add("active");
}

/**
 * Torna el panell de detall al seu estat inicial (placeholder).
 */
export function netejarDetallCard(): void {
    const container = document.getElementById("pokemon-detail");
    if (!container) return;

    container.innerHTML = `
        <p class="placeholder">Selecciona un Pokémon de la llista per veure les seves dades.</p>
    `;
}

/**
 * Reprodueix el crit del Pokémon.
 */
export function reproduirCrit(soundUrl: string): void {
    const audio = new Audio(soundUrl);
    audio.play().catch(() => {
        mostrarEstat("No s'ha pogut reproduir el crit.", "error");
    });
}


// ==========================================================
// PART B: FUNCIONS QUE HAS D'IMPLEMENTAR TU
// ==========================================================

/**
 * EXERCICI 1
 * Renderitza la llista de Pokémon dins de <ul id="pokemon-list">.
 *
 * Requisits:
 *  - Obtenir una instància del contenidor on es mostra la llista de pokémons.
 *  - Buidar el contenidor abans de pintar.
 *  - Per a cada pokémon, crear un <li> amb createElement.
 *  - Desar id a dataset: li.dataset.id
 *  - El text del <li> ha de ser: <strong>#025</strong> - pikachu
 *    (usa els getters formattedId i name).
 *  - Afegir el <li> al contenidor amb appendChild.
 */
// TODO: Implementa la lògica de l'exercici 1 seguint els requisits

export function renderitzarLlistaNoms(llista: Models.BasePokemon[]): void {
    const llistaPokemon = document.getElementById("pokemon-list") as HTMLUListElement;

    if (!llistaPokemon) {
        console.error("No s'ha trobat la llista de Pokémon");
        return;
    }

    llistaPokemon.innerHTML = "";

    llista.forEach((pokemon) => {
        const element = document.createElement("li");

        element.dataset.id = String(pokemon.id);
        element.dataset.name = pokemon.name;
        element.dataset.url = pokemon.url;

        element.innerHTML = `<strong>${pokemon.formattedId}</strong> - ${pokemon.name}`;

        llistaPokemon.appendChild(element);
    });
}


/**
 * EXERCICI 3
 * Renderitza la targeta de detall dins de <div id="pokemon-detail">.
 * Pots crear el HTML com vulguis, però hi ha d'apareixer tota la informació i botons necessaris.
 *
 * Estructura HTML esperada (classes CSS ja definides a style.css):
 *
 *   <div class="detail-card">
 *       <h3>#025 pikachu</h3>
 *       <img src="..." alt="pikachu">
 *       <button id="btn-play-cry" class="btn-cry">🔊 Escolta el crit</button>   <- només si hi ha crit
 *       <p><strong>Pes:</strong> 6 kg</p>
 *       <p><strong>Tipus:</strong> ⚡ Elèctric, ...</p>
 *       <div class="stats-grid">
 *           <div class="stat-box"><span>HP</span><strong>35</strong></div>   <- un per estadística
 *       </div>
 *   </div>
 *
 * Pistes:
 *  - El botó del crit només s'ha de pintar si pokemon.cryUrl no és null.
 *  - Un cop pintat l'HTML, afegeix el listener de clic al botó i crida reproduirCrit().
 */

export function renderitzarDetallCard(pokemon: Models.DetailedPokemon): void {
    const pokemonDetall = document.getElementById("pokemon-detail") as HTMLDivElement;

    pokemonDetall.innerHTML = "";

    const elementDiv = document.createElement("div");
    elementDiv.className = "detail-card";

    const elementH3 = document.createElement("h3");
    elementH3.textContent = `#${String(pokemon.id).padStart(3, "0")} ${pokemon.name}`;
    elementDiv.appendChild(elementH3);

    if (pokemon.imageUrl) {
        const imatge = document.createElement("img");
        imatge.src = pokemon.imageUrl;
        imatge.alt = pokemon.name;
        elementDiv.appendChild(imatge);
    }

    if (pokemon.cryurl) {
        const botoCrit = document.createElement("button");
        botoCrit.id = "btn-play-cry";
        botoCrit.className = "btn-cry";
        botoCrit.textContent = "🔊 Escolta el crit";

        botoCrit.addEventListener("click", () => {
            reproduirCrit(pokemon.cryurl!);
        });

        elementDiv.appendChild(botoCrit);
    }

    const parragrafPes = document.createElement("p");
    parragrafPes.innerHTML = `<strong>Pes:</strong> ${pokemon.weightKg} kg`;
    elementDiv.appendChild(parragrafPes);

    const parragrafTipus = document.createElement("p");
    const nomsTipus = pokemon.types.map((tipus) => `${tipus.icon} ${tipus.name}`).join(", ");
    parragrafTipus.innerHTML = `<strong>Tipus:</strong> ${nomsTipus}`;
    elementDiv.appendChild(parragrafTipus);

    const estadistiques = document.createElement("div");
    estadistiques.className = "stats-grid";

    pokemon.stats.forEach(([nom, valor]) => {
        const caixa = document.createElement("div");
        caixa.className = "stat-box";

        const nomEstadistica = document.createElement("span");
        nomEstadistica.textContent = nom.toUpperCase();

        const valorEstadistica = document.createElement("strong");
        valorEstadistica.textContent = String(valor);

        caixa.appendChild(nomEstadistica);
        caixa.appendChild(valorEstadistica);

        estadistiques.appendChild(caixa);
    });

    elementDiv.appendChild(estadistiques);
    pokemonDetall.appendChild(elementDiv);
}

    function reproduirCrit();
// TODO: Implementa la lògica de l'exercici 3 seguint els requisits


/**
 * EXERCICI 4
 * Genera un botó per a cada tipus dins de <div id="type-filter-container">.
 *
 * Requisits:
 *  - Recupera una instància del contenidor "type-filter-container"
 *  - Recorre el diccionari Models.POKEMON_TYPES (pista: Object.values).
 *  - Per a cada botó afegeix:
 *       btn.className = "btn-type";
 *       btn.dataset.type = el id del tipus
 *       btn.style.backgroundColor = el color del tipus
 *       btn.textContent = el label del tipus
 *  - Recorda afegir el botó correctament al contenidor
 */

// TODO: Implementa la lògica de l'exercici 4 seguint els requisits


