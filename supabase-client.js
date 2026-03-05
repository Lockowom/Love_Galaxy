/**
 * Cliente de Supabase para Love Galaxy
 * 
 * INSTRUCCIONES PARA EL USUARIO:
 * 1. Crea una cuenta en https://supabase.com
 * 2. Crea un nuevo proyecto.
 * 3. Ve a Project Settings > API.
 * 4. Copia la "Project URL" y pégala abajo en SUPABASE_URL.
 * 5. Copia la "anon" / "public" key y pégala abajo en SUPABASE_ANON_KEY.
 */

// REEMPLAZA ESTOS VALORES CON LOS DE TU PROYECTO SUPABASE
// Nota: Solo necesitamos la URL y la key "publishable" (pública).
// La key "secret" NO debe ir aquí por seguridad.
const SUPABASE_URL = 'https://izlshsczbknqebsqastu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_IsOz-ZVHu5Q36eygWcI5IA_mNRuv3qt';

// Inicialización del cliente
let supabaseClient = null;

if (typeof supabase !== 'undefined' && SUPABASE_URL !== 'TU_SUPABASE_URL_AQUI') {
    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase conectado correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar Supabase:', error);
    }
} else {
    console.warn('⚠️ Supabase no está configurado. La aplicación usará localStorage temporalmente.');
    console.warn('   Por favor, configura SUPABASE_URL y SUPABASE_ANON_KEY en js/supabase-client.js');
}

// Hacer disponible globalmente
window.supabaseClient = supabaseClient;
