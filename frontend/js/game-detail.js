
const API_URL = 'http://localhost:3000';

const detailContainer = document.getElementById('gameDetail');

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[character]);
}

function formatPrice(price) {
    const amount = Number(price);

    if (!Number.isFinite(amount)) {
        return 'Precio no disponible';
    }

    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

async function getGame(id) {
    // Primero intenta consultar un videojuego individual.
    try {
        const response = await fetch(
            `${API_URL}/games/${encodeURIComponent(id)}`
        );

        if (response.ok) {
            const data = await response.json();

            if (data && !Array.isArray(data)) {
                return data.game || data;
            }
        }
    } catch (error) {
        console.warn('No fue posible consultar el videojuego individual.');
    }

    // Alternativa: buscarlo en el catálogo completo.
    const response = await fetch(`${API_URL}/games`);

    if (!response.ok) {
        throw new Error('No fue posible consultar el catálogo.');
    }

    const data = await response.json();

    const games = Array.isArray(data)
        ? data
        : Array.isArray(data.games)
            ? data.games
            : [];

    return games.find(game => String(game.id) === String(id));
}

function renderGame(game) {
    if (!game) {
        detailContainer.innerHTML = `
            <div class="detail-message">
                <h2>Videojuego no encontrado</h2>
                <p>El videojuego que buscas no está disponible.</p>
                <a href="index.html#catalogo" class="detail-button">
                    Regresar al catálogo
                </a>
            </div>
        `;
        return;
    }

    detailContainer.innerHTML = `
        <article class="game-detail">

            <div class="detail-art">
                <span>${escapeHTML(game.name)}</span>
            </div>

            <div class="detail-information">

                <span class="detail-label">GAMEVAULT COLLECTION</span>

                <h1>${escapeHTML(game.name)}</h1>

                <p class="detail-genre">
                    ${escapeHTML(game.genre || 'Género no especificado')}
                </p>

                <div class="detail-divider"></div>

                <h3>Descripción</h3>

                <p class="detail-description">
                    ${escapeHTML(
                        game.description || 'No hay una descripción disponible.'
                    )}
                </p>

                <div class="detail-data">
                    <div>
                        <span>Clasificación</span>
                        <strong>
                            ${escapeHTML(game.age_rating || 'No especificada')}
                        </strong>
                    </div>

                    <div>
                        <span>Identificador</span>
                        <strong>${escapeHTML(game.id)}</strong>
                    </div>
                </div>

                <div class="detail-purchase">
                    <span class="detail-price">
                        ${formatPrice(game.price)}
                    </span>

                    <button
                        type="button"
                        class="detail-button"
                        id="buyGameButton"
                        disabled
                        title="La compra será habilitada cuando se conecte el módulo de compras."
                    >
                        Comprar próximamente
                    </button>
                </div>

                <p class="detail-note">
                    Las compras estarán disponibles cuando se integre
                    el módulo correspondiente.
                </p>

            </div>
        </article>
    `;
}

async function loadGameDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id || !/^\d+$/.test(id)) {
        detailContainer.innerHTML = `
            <div class="detail-message">
                <h2>Identificador inválido</h2>
                <p>No se indicó un videojuego válido.</p>
                <a href="index.html#catalogo" class="detail-button">
                    Regresar al catálogo
                </a>
            </div>
        `;
        return;
    }

    try {
        const game = await getGame(id);
        renderGame(game);
    } catch (error) {
        console.error('Error al cargar la ficha:', error);

        detailContainer.innerHTML = `
            <div class="detail-message">
                <h2>No fue posible cargar el videojuego</h2>
                <p>Verifica que el servidor de GameVault esté funcionando.</p>
                <button class="detail-button" onclick="loadGameDetail()">
                    Reintentar
                </button>
            </div>
        `;
    }
}

loadGameDetail();
