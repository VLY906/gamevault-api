
const API_URL = 'http://localhost:3000';

const gamesContainer = document.getElementById('gamesContainer');
const searchInput = document.getElementById('searchGame');
const filterButtons = document.querySelectorAll('.filter');

let games = [];
let selectedGenre = 'all';

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[character]);
}

// Cargar videojuegos desde la API
async function loadGames() {
    if (!gamesContainer) {
        console.error('No se encontró el elemento gamesContainer en HTML.');
        return;
    }

    gamesContainer.innerHTML =
        '<p class="loading-message">Cargando videojuegos...</p>';

    try {
        const response = await fetch(`${API_URL}/games`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
// Aceptar respuestas como:
// 1. [{ id: 4, name: "Elden Ring" }]
// 2. { games: [{ id: 4, name: "Elden Ring" }] }
// 3. { id: 4, name: "Elden Ring" }

if (Array.isArray(data)) {
    games = data;
} else if (Array.isArray(data.games)) {
    games = data.games;
} else if (data && data.id) {
    games = [data];
} else {
    games = [];
}

        if (games.length === 0) {
            gamesContainer.innerHTML =
                '<p class="empty-message">No hay videojuegos disponibles.</p>';
            return;
        }

        renderGames();

    } catch (error) {
        console.error('Error al cargar videojuegos:', error);

        gamesContainer.innerHTML = `
            <div class="error-message">
                <p>No fue posible cargar los videojuegos.</p>
                <p>Verifica la conexión con el servidor.</p>
                <button id="retryGames" class="filter active">
                    Reintentar
                </button>
            </div>
        `;

        document.getElementById('retryGames')
            ?.addEventListener('click', loadGames);
    }
}

// Mostrar videojuegos

function renderGames() {
    if (!gamesContainer || !searchInput) return;

    const search = searchInput.value.trim().toLowerCase();

    const filteredGames = games.filter(game => {
        const name = String(game.name ?? '').toLowerCase();
        const genre = String(game.genre ?? '').toLowerCase();

        const matchesSearch = name.includes(search);

        const matchesGenre =
            selectedGenre === 'all' ||
            genre === selectedGenre.toLowerCase();

        return matchesSearch && matchesGenre;
    });

    if (filteredGames.length === 0) {
        gamesContainer.innerHTML = `
            <p class="empty-message">
                No encontramos videojuegos con esos criterios.
            </p>
        `;
        return;
    }

    gamesContainer.innerHTML = filteredGames.map(game => `
        <article class="game-card">

            <div class="game-art">
                <span>${escapeHTML(game.name)}</span>
            </div>

            <div class="game-info">
                <h3>${escapeHTML(game.name)}</h3>

                <p>Género: ${escapeHTML(game.genre || 'No especificado')}</p>

                <p>
                    Clasificación:
                    ${escapeHTML(game.age_rating || 'No especificada')}
                </p>

                <p>
                    ${escapeHTML(game.description || 'Sin descripción disponible.')}
                </p>

                <span class="game-price">
                    $${Number(game.price || 0).toFixed(2)}
                </span>

                <a
                    class="game-detail-link"
                    href="game-detail.html?id=${encodeURIComponent(game.id)}"
                >
                    Ver detalles →
                </a>
            </div>

        </article>
    `).join('');
}

// Buscador
searchInput?.addEventListener('input', renderGames);

// Filtros
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(item => item.classList.remove('active'));

        button.classList.add('active');

        selectedGenre = button.dataset.genre || 'all';

        renderGames();
    });
});

// Iniciar catálogo
loadGames();
