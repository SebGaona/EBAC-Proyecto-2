const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
    // No termine usando estos colores pero los dejo por si acaso los necesito
};

const typeEffectiveness = {
    normal: { weak: ['fighting'], strong: [] },
    fire: { weak: ['water', 'rock', 'fire'], strong: ['grass', 'ice', 'bug', 'steel'] },
    water: { weak: ['electric', 'grass'], strong: ['fire', 'ground', 'rock'] },
    electric: { weak: ['ground'], strong: ['water', 'flying'] },
    grass: { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], strong: ['water', 'ground', 'rock'] },
    ice: { weak: ['fire', 'fighting', 'rock', 'steel'], strong: ['grass', 'ground', 'flying', 'dragon'] },
    fighting: { weak: ['flying', 'psychic', 'fairy'], strong: ['normal', 'ice', 'rock', 'dark', 'steel'] },
    poison: { weak: ['ground', 'psychic'], strong: ['grass', 'fairy'] },
    ground: { weak: ['water', 'grass', 'ice'], strong: ['fire', 'electric', 'poison', 'rock', 'steel'] },
    flying: { weak: ['electric', 'ice', 'rock'], strong: ['grass', 'fighting', 'bug'] },
    psychic: { weak: ['bug', 'ghost', 'dark'], strong: ['fighting', 'poison'] },
    bug: { weak: ['fire', 'flying', 'rock'], strong: ['grass', 'psychic', 'dark'] },
    rock: { weak: ['water', 'grass', 'fighting', 'ground', 'steel'], strong: ['fire', 'ice', 'flying', 'bug'] },
    ghost: { weak: ['ghost', 'dark'], strong: ['psychic', 'ghost'] },
    dragon: { weak: ['ice', 'dragon', 'fairy'], strong: ['dragon'] },
    dark: { weak: ['fighting', 'bug', 'fairy'], strong: ['psychic', 'ghost'] },
    steel: { weak: ['fire', 'fighting', 'ground'], strong: ['ice', 'rock', 'fairy'] },
    fairy: { weak: ['poison', 'steel'], strong: ['fighting', 'dragon', 'dark'] }
};

document.addEventListener('DOMContentLoaded', () => {
    const pokemonContainer = document.getElementById('pokemon-container');
    const searchInput = document.getElementById('search-input');

    fetch('https://pokeapi.co/api/v2/pokemon?limit=21')
        .then(response => response.json())
        .then(data => {
            const promises = data.results.map(pokemon => fetch(pokemon.url).then(response => response.json()));
            Promise.all(promises).then(pokemonDataArray => {
                pokemonDataArray.forEach(pokemonData => {
                    displayPokemon(pokemonData);
                });
            });
        });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        searchResults.innerHTML = '';

        if (query.length > 0) {
            fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
                .then(response => response.json())
                .then(data => {
                    const filteredPokemon = data.results.filter(pokemon => pokemon.name.includes(query));
                    filteredPokemon.forEach(pokemon => {
                        const resultItem = document.createElement('p');
                        resultItem.textContent = pokemon.name;
                        resultItem.classList.add('result-item');
                        resultItem.addEventListener('click', () => {
                            searchInput.value = pokemon.name;
                            searchResults.innerHTML = '';
                            fetchPokemon(pokemon.name);
                        });
                        searchResults.appendChild(resultItem);
                    });
                    searchResults.classList.add('show');
                });
        } else {
            searchResults.classList.remove('show');
        }
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value.toLowerCase();
            if (query.length > 0) {
                fetchPokemon(query);
            } else {
                pokemonContainer.innerHTML = '';
                fetch('https://pokeapi.co/api/v2/pokemon?limit=21')
                    .then(response => response.json())
                    .then(data => {
                        const promises = data.results.map(pokemon => fetch(pokemon.url).then(response => response.json()));
                        Promise.all(promises).then(pokemonDataArray => {
                            pokemonDataArray.forEach(pokemonData => {
                                displayPokemon(pokemonData);
                            });
                        });
                    });
            }
        }
    });

    function fetchPokemon(query) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Pokemon not found');
                }
                return response.json();
            })
            .then(pokemonData => {
                pokemonContainer.innerHTML = '';
                displayPokemon(pokemonData);
            })
            .catch(error => {
                pokemonContainer.innerHTML = `<p>${error.message}</p>`;
            });
    }

    function displayPokemon(pokemonData) {
        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card');
    
        const pokemonImage = document.createElement('img');
        pokemonImage.src = pokemonData.sprites.front_default;
        pokemonImage.classList.add('pokemon-image');
    
        const pokemonName = document.createElement('h2');
        pokemonName.textContent = pokemonData.name;
        pokemonName.classList.add('pokemon-name');
    
        const pokemonTypeContainer = document.createElement('div');
        pokemonTypeContainer.classList.add('pokemon-type');
    
        const types = pokemonData.types.map(type => type.type.name);
        types.forEach(type => {
            const typeImage = document.createElement('img');
            typeImage.src = `img/pokemon_type_icon_${type.toLowerCase()}.png`;
            typeImage.alt = `${type} type icon`;
            typeImage.classList.add('type-icon');
            pokemonTypeContainer.appendChild(typeImage);
        });
    
        const pokemonNumber = document.createElement('p');
        pokemonNumber.textContent = `Pokedex Number: ${pokemonData.id}`;
    
        const weaknesses = document.createElement('div');
        weaknesses.classList.add('weaknesses');
        weaknesses.innerHTML = `<strong>Weaknesses:</strong>`;
        const weaknessCounts = {};
        types.forEach(type => {
            typeEffectiveness[type].weak.forEach(weakType => {
                if (weaknessCounts[weakType]) {
                    weaknessCounts[weakType] += 1;
                } else {
                    weaknessCounts[weakType] = 1;
                }
            });
        });
        const weaknessContainer = document.createElement('div');
        for (const [weakType, count] of Object.entries(weaknessCounts)) {
            const weakTypeImage = document.createElement('img');
            weakTypeImage.src = `img/pokemon_type_icon_${weakType.toLowerCase()}.png`;
            weakTypeImage.alt = `${weakType} type icon`;
            weakTypeImage.classList.add('type-icon');
            const multiplier = document.createElement('span');
            multiplier.textContent = ` (x${2 * count})`;
            const weaknessItem = document.createElement('div');
            weaknessItem.classList.add('weakness-item');
            weaknessItem.appendChild(weakTypeImage);
            weaknessItem.appendChild(multiplier);
            weaknessContainer.appendChild(weaknessItem);
        }
        weaknesses.appendChild(weaknessContainer);
    
        const resistances = document.createElement('div');
        resistances.classList.add('resistances');
        resistances.innerHTML = `<strong>Resistances:</strong>`;
        const resistancesContainer = document.createElement('div');
        types.forEach(type => {
            typeEffectiveness[type].strong.forEach(strongType => {
                const strongTypeImage = document.createElement('img');
                strongTypeImage.src = `img/pokemon_type_icon_${strongType.toLowerCase()}.png`;
                strongTypeImage.alt = `${strongType} type icon`;
                strongTypeImage.classList.add('type-icon');
                const resistanceItem = document.createElement('div');
                resistanceItem.classList.add('resistance-item');
                resistanceItem.appendChild(strongTypeImage);
                resistancesContainer.appendChild(resistanceItem);
            });
        });
        resistances.appendChild(resistancesContainer);
    
        pokemonCard.appendChild(pokemonImage);
        pokemonCard.appendChild(pokemonName);
        pokemonCard.appendChild(pokemonTypeContainer);
        pokemonCard.appendChild(pokemonNumber);
        pokemonCard.appendChild(weaknesses);
        pokemonCard.appendChild(resistances);
    
        pokemonContainer.appendChild(pokemonCard);
    }
});