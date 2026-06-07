#!/usr/bin/env node
/**
 * stamp-version.js — Cache-busting automático (sin frameworks).
 *
 * Reescribe en index.html el sufijo ?v=<buildId> de TODOS los assets locales
 * (.js, .css, .png) con un identificador de build único, de modo que cada
 * despliegue genere URLs nuevas y el navegador descargue los assets frescos
 * aunque estén cacheados como "immutable". El HTML se sirve con no-store.
 *
 * buildId: SHA corto de git si está disponible; si no, timestamp.
 *
 * Uso: node scripts/stamp-version.js
 * En Render se ejecuta como buildCommand antes de publicar el sitio.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const INDEX = path.join(ROOT, 'index.html');

function getBuildId() {
    try {
        const sha = execSync('git rev-parse --short HEAD', { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
            .toString().trim();
        if (sha) return sha;
    } catch (e) { /* git no disponible: usar timestamp */ }
    return Date.now().toString(36);
}

function main() {
    if (!fs.existsSync(INDEX)) {
        console.error('No se encontró index.html en', INDEX);
        process.exit(1);
    }
    const buildId = getBuildId();
    const html = fs.readFileSync(INDEX, 'utf8');

    // Reemplaza `archivo.(js|css|png)?v=CUALQUIERCOSA` por `...?v=<buildId>`
    // (idempotente: sirve tanto en local como en el build efímero de Render).
    const re = /(\.(?:js|css|png))\?v=[^"'\s]*/g;
    let count = 0;
    const out = html.replace(re, (m, ext) => { count++; return `${ext}?v=${buildId}`; });

    fs.writeFileSync(INDEX, out);
    console.log(`stamp-version: ${count} referencias selladas con ?v=${buildId}`);
}

main();
