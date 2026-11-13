
const API_URL = 'http://localhost:3000';

function showAuthMessage(element, message, type) {
    if (!element) return;

    element.textContent = message;
    element.className = `form-message show ${type}`;
}

function setLoading(button, loading, originalText) {
    button.disabled = loading;
    button.textContent = loading ? 'Procesando...' : originalText;
}

// REGISTRO
const registerForm = document.getElementById('registerForm');

registerForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const message = document.getElementById('registerMessage');
    const button = registerForm.querySelector('button[type="submit"]');

    if (password !== confirmPassword) {
        showAuthMessage(message, 'Las contraseñas no coinciden.', 'error');
        return;
    }

    if (password.length < 8) {
        showAuthMessage(message, 'La contraseña debe tener al menos 8 caracteres.', 'error');
        return;
    }

    setLoading(button, true, 'Crear cuenta');

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'No fue posible crear la cuenta.');
        }

        showAuthMessage(
            message,
            '¡Cuenta creada correctamente! Ahora puedes iniciar sesión.',
            'success'
        );

        registerForm.reset();

    } catch (error) {
        showAuthMessage(message, error.message, 'error');
    } finally {
        setLoading(button, false, 'Crear cuenta');
    }
});

// INICIO DE SESIÓN
const loginForm = document.getElementById('loginForm');

loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const message = document.getElementById('loginMessage');
    const button = loginForm.querySelector('button[type="submit"]');

    setLoading(button, true, 'Iniciar sesión');

    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Credenciales incorrectas.');
        }

        if (!data.token) {
            throw new Error('El servidor no devolvió el token de autenticación.');
        }

        sessionStorage.setItem('gamevault_token', data.token);
        sessionStorage.setItem('gamevault_user', JSON.stringify(data.user));

        showAuthMessage(
            message,
            '¡Inicio de sesión exitoso! Bienvenido a GameVault.',
            'success'
        );

        loginForm.reset();

    } catch (error) {
        showAuthMessage(message, error.message, 'error');
    } finally {
        setLoading(button, false, 'Iniciar sesión');
    }
});
