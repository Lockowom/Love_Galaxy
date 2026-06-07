// ================================================
// AUTH-UI — Gate de autenticación (email + contraseña)
// Módulo ES. Expone window.AuthUI = { init } y window.handleLogout.
// Extraído de main.js para reducir su tamaño y acoplar la auth en un solo sitio.
// Depende de helpers globales: loadUserData() (main.js) y window.authSign*()
// (supabase-client.js).
// ================================================

let authMode = 'login';      // 'login' | 'register'
let authDataLoaded = false;  // evita recargar datos varias veces

function initAuthGate() {
    const form = document.getElementById('auth-form');
    const toggleLink = document.getElementById('auth-toggle-link');

    if (form) form.addEventListener('submit', handleAuthSubmit);
    if (toggleLink) toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        setAuthMode(authMode === 'login' ? 'register' : 'login');
    });

    // Reaccionar a los cambios de sesión emitidos por supabase-client.js
    window.addEventListener('auth-change', (e) => {
        const session = e.detail && e.detail.session;
        applyAuthState(session);
    });

    // Si Supabase no se inicializa en un tiempo razonable, mostrar el login con aviso
    setTimeout(() => {
        if (!window.supabaseClient) {
            showAuthScreen();
            showAuthError('No se pudo conectar con la base de datos. Revisa tu conexión e inténtalo de nuevo.');
        }
    }, 4000);
}

function applyAuthState(session) {
    const logoutBtn = document.getElementById('logout-btn');
    if (session && session.user) {
        window.__authenticated = true;
        hideAuthScreen();
        if (logoutBtn) logoutBtn.style.display = '';
        if (!authDataLoaded) {
            authDataLoaded = true;
            loadUserData();
        }
    } else {
        window.__authenticated = false;
        authDataLoaded = false;
        if (logoutBtn) logoutBtn.style.display = 'none';
        showAuthScreen();
    }
}

function setAuthMode(mode) {
    authMode = mode;
    const subtitle = document.getElementById('auth-subtitle');
    const submitBtn = document.getElementById('auth-submit-btn');
    const toggleText = document.getElementById('auth-toggle-text');
    const toggleLink = document.getElementById('auth-toggle-link');
    const pwd = document.getElementById('auth-password');
    clearAuthMessages();
    if (mode === 'register') {
        if (subtitle) subtitle.textContent = 'Crea tu cuenta para guardar nuestros recuerdos';
        if (submitBtn) submitBtn.textContent = 'Crear cuenta';
        if (toggleText) toggleText.textContent = '¿Ya tienes cuenta?';
        if (toggleLink) toggleLink.textContent = 'Iniciar sesión';
        if (pwd) pwd.autocomplete = 'new-password';
    } else {
        if (subtitle) subtitle.textContent = 'Inicia sesión para entrar a nuestro universo';
        if (submitBtn) submitBtn.textContent = 'Entrar';
        if (toggleText) toggleText.textContent = '¿No tienes cuenta?';
        if (toggleLink) toggleLink.textContent = 'Crear cuenta';
        if (pwd) pwd.autocomplete = 'current-password';
    }
}

async function handleAuthSubmit(e) {
    e.preventDefault();
    clearAuthMessages();

    const emailEl = document.getElementById('auth-email');
    const pwdEl = document.getElementById('auth-password');
    const submitBtn = document.getElementById('auth-submit-btn');
    const email = (emailEl ? emailEl.value : '').trim();
    const password = pwdEl ? pwdEl.value : '';

    if (!email || password.length < 6) {
        showAuthError('Introduce un email válido y una contraseña de al menos 6 caracteres.');
        return;
    }

    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Procesando...'; }

    try {
        if (authMode === 'register') {
            const { data, error } = await window.authSignUp(email, password);
            if (error) { showAuthError(traducirAuthError(error.message)); return; }
            if (!(data && data.session)) {
                // Requiere confirmación de email antes de iniciar sesión
                setAuthMode('login');
                showAuthInfo('Cuenta creada. Revisa tu email para confirmarla y luego inicia sesión.');
            }
            // Si hay sesión inmediata, applyAuthState se dispara vía onAuthStateChange
        } else {
            const { error } = await window.authSignIn(email, password);
            if (error) { showAuthError(traducirAuthError(error.message)); return; }
            // applyAuthState se dispara vía onAuthStateChange
        }
    } catch (err) {
        console.error('Error de autenticación:', err);
        showAuthError('Ocurrió un error inesperado. Inténtalo de nuevo.');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = authMode === 'register' ? 'Crear cuenta' : 'Entrar';
        }
    }
}

async function handleLogout() {
    if (window.authSignOut) await window.authSignOut();
    // Recargar para limpiar todo el estado en memoria y la UI
    location.reload();
}

function showAuthScreen() {
    const s = document.getElementById('auth-screen');
    if (s) s.style.display = 'flex';
}

function hideAuthScreen() {
    const s = document.getElementById('auth-screen');
    if (s) s.style.display = 'none';
}

function showAuthError(msg) {
    const el = document.getElementById('auth-error');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
}

function showAuthInfo(msg) {
    const el = document.getElementById('auth-info');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
}

function clearAuthMessages() {
    const err = document.getElementById('auth-error');
    if (err) { err.style.display = 'none'; err.textContent = ''; }
    const info = document.getElementById('auth-info');
    if (info) { info.style.display = 'none'; info.textContent = ''; }
}

function traducirAuthError(msg) {
    if (!msg) return 'Error de autenticación.';
    const m = msg.toLowerCase();
    if (m.includes('invalid login')) return 'Email o contraseña incorrectos.';
    if (m.includes('already registered') || m.includes('already been registered')) return 'Ese email ya tiene una cuenta. Inicia sesión.';
    if (m.includes('email not confirmed')) return 'Debes confirmar tu email antes de iniciar sesión.';
    if (m.includes('rate limit')) return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.';
    if (m.includes('password')) return 'La contraseña no cumple los requisitos (mínimo 6 caracteres).';
    return msg;
}

// --- Exposición global (onclick inline) + inicializador para main.js ---
window.handleLogout = handleLogout;
window.AuthUI = { init: initAuthGate };

export { initAuthGate as init, handleLogout };
