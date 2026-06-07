#!/usr/bin/env bash
# ============================================================================
#  Compila el motor del juego (C++) a WebAssembly usando clang (sin Emscripten).
#  El .wasm resultante se versiona en git y Render lo sirve tal cual: NO se
#  necesita ninguna toolchain de C++ en el despliegue.
#
#  Requisitos locales: clang/clang++ con soporte de target wasm32 y wasm-ld.
#  Uso:  npm run build:wasm   (o)   bash scripts/build-wasm.sh
# ============================================================================
set -euo pipefail

cd "$(dirname "$0")/.."

SRC="wasm/galaxy.cpp"
OUT="galaxy.wasm"

echo "🛠️  Compilando $SRC → $OUT con clang (target wasm32)…"

clang++ --target=wasm32 -std=c++17 -O2 -flto \
    -nostdlib -ffreestanding -fno-exceptions -fno-rtti \
    -Wall -Wextra \
    -Wl,--no-entry \
    -Wl,--export-dynamic \
    -Wl,--allow-undefined \
    -Wl,--export-memory \
    -Wl,-z,stack-size=131072 \
    -o "$OUT" "$SRC"

SIZE=$(wc -c < "$OUT")
echo "✅ Generado $OUT (${SIZE} bytes)"
