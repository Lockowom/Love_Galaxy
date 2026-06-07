// ================================================
// PLAYLIST-MANAGER — Música y playlist (HTML5 + YouTube)
// Módulo ES. Expone window.PlaylistManager = { init, loadPlaylist } y las
// funciones usadas por onclick inline. Extraído de main.js.
// Depende de globales: db, showNotification, escapeHtml, window.achievements,
// window.galaxyVisualizer (opcional), YT (YouTube IFrame API).
// ================================================

// Estado de la música (antes global en main.js)
let playlist = [];
let isPlaying = false;
let currentSongIndex = 0;
let audioPlayer = null;   // Reproductor HTML5
let youtubePlayer = null; // Reproductor YouTube
let isYouTubeReady = false;
let ytProgressInterval;

// La API de YouTube llama a este callback global cuando está lista. Se define a
// nivel de módulo para que esté disponible lo antes posible.
window.onYouTubeIframeAPIReady = function () {
    youtubePlayer = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'disablekb': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
};

function onPlayerReady(event) {
    isYouTubeReady = true;
    console.log("✅ YouTube Player Ready");
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        updatePlayerUI(currentSongIndex);
        startYouTubeProgressLoop();

        if (window.galaxyVisualizer) {
            window.galaxyVisualizer.simulate(true);
        }
    } else if (event.data === YT.PlayerState.PAUSED) {
        isPlaying = false;
        updatePlayerUI(currentSongIndex);
        stopYouTubeProgressLoop();

        if (window.galaxyVisualizer) {
            window.galaxyVisualizer.simulate(false);
        }
    } else if (event.data === YT.PlayerState.ENDED) {
        stopYouTubeProgressLoop();
        nextSong();
    }
}

function onPlayerError(event) {
    console.error("Error YouTube:", event.data);
    showNotification("❌ Error al reproducir video de YouTube (posible restricción)");
    nextSong();
}

function startYouTubeProgressLoop() {
    stopYouTubeProgressLoop();
    ytProgressInterval = setInterval(() => {
        if (youtubePlayer && youtubePlayer.getCurrentTime) {
            const currentTime = youtubePlayer.getCurrentTime();
            const duration = youtubePlayer.getDuration();
            updateProgressBarUI(currentTime, duration);
        }
    }, 1000);
}

function stopYouTubeProgressLoop() {
    if (ytProgressInterval) clearInterval(ytProgressInterval);
}

async function loadPlaylist() {
    try {
        const songs = await db.getPlaylist();

        const defaultSongs = [
            {
                title: "Love Story",
                artist: "Musica Romántica",
                url: "https://cdn.pixabay.com/download/audio/2022/02/10/audio_fc06222727.mp3?filename=piano-moment-11938.mp3"
            },
            {
                title: "Sweet Memories",
                artist: "Piano Suave",
                url: "https://cdn.pixabay.com/download/audio/2022/05/05/audio_13b632669e.mp3?filename=soft-piano-109677.mp3"
            }
        ];

        playlist = songs.length > 0 ? songs : defaultSongs;

        if (songs.length === 0 && !window.supabaseClient) {
            playlist = defaultSongs;
        }

        renderPlaylist();
        if (!audioPlayer) initAudioPlayer();
        if (playlist.length > 0) updatePlayerUI(currentSongIndex, false);

    } catch (e) {
        console.error("Error cargando playlist:", e);
    }
}

function initAudioPlayer() {
    audioPlayer = document.getElementById('bg-music');
    if (!audioPlayer) {
        audioPlayer = new Audio();
        audioPlayer.id = 'bg-music';
        document.body.appendChild(audioPlayer);
    }
    audioPlayer.crossOrigin = "anonymous";

    audioPlayer.addEventListener('play', () => {
        if (window.galaxyVisualizer) {
            window.galaxyVisualizer.resume();
            window.galaxyVisualizer.connect(audioPlayer);
            window.galaxyVisualizer.simulate(false);
        }
        isPlaying = true;
        updatePlayerUI(currentSongIndex);
    });

    audioPlayer.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayerUI(currentSongIndex);
    });

    audioPlayer.addEventListener('ended', nextSong);

    audioPlayer.addEventListener('waiting', () => {
        const playBtn = document.getElementById('play-btn');
        if (playBtn) playBtn.textContent = '⏳';
    });

    audioPlayer.addEventListener('canplay', () => {
        const playBtn = document.getElementById('play-btn');
        if (playBtn) playBtn.textContent = isPlaying ? '⏸️' : '▶️';
    });

    audioPlayer.addEventListener('timeupdate', () => {
        updateProgressBarUI(audioPlayer.currentTime, audioPlayer.duration);
    });

    audioPlayer.addEventListener('error', (e) => {
        console.error("Error audio HTML5:", e);
        const playBtn = document.getElementById('play-btn');
        if (playBtn) playBtn.textContent = '❌';

        if (isPlaying) {
            showNotification("❌ Error de audio. Saltando...");
            setTimeout(nextSong, 2000);
        }
    });

    // Input Range Event
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.addEventListener('input', function () {
            const currentSong = playlist[currentSongIndex];
            const isYT = isYouTubeUrl(currentSong.url);

            if (isYT && youtubePlayer) {
                const duration = youtubePlayer.getDuration();
                const seekTime = (duration / 100) * this.value;
                youtubePlayer.seekTo(seekTime, true);
            } else if (audioPlayer && audioPlayer.duration) {
                const seekTime = (audioPlayer.duration / 100) * this.value;
                audioPlayer.currentTime = seekTime;
            }
        });
    }
}

function isYouTubeUrl(url) {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
}

function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function setSong(index) {
    if (index < 0 || index >= playlist.length) return;

    if (audioPlayer) audioPlayer.pause();
    if (youtubePlayer && isYouTubeReady) youtubePlayer.stopVideo();

    currentSongIndex = index;
    const song = playlist[index];
    const isYT = isYouTubeUrl(song.url);

    console.log(`Reproduciendo: ${song.title} (${isYT ? 'YouTube' : 'Audio'})`);

    if (isYT) {
        const videoId = getYouTubeId(song.url);
        if (videoId && isYouTubeReady) {
            youtubePlayer.loadVideoById(videoId);
            isPlaying = true;
        } else {
            showNotification("⚠️ Reproductor de YouTube no listo o URL inválida");
        }
    } else {
        if (audioPlayer.error) {
            console.log("Recreando audio player por error previo");
            audioPlayer.load();
        }

        audioPlayer.src = song.url;

        const playPromise = audioPlayer.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                isPlaying = true;
                updatePlayerUI(index);

                if (window.galaxyVisualizer) {
                    try {
                        window.galaxyVisualizer.connect(audioPlayer);
                        window.galaxyVisualizer.simulate(false);
                    } catch (e) {
                        console.warn("No se pudo conectar visualizador (posible error CORS):", e);
                        window.galaxyVisualizer.simulate(true);
                    }
                }
            })
                .catch(error => {
                    console.error("Error al reproducir audio:", error);
                    if (error.name === 'NotAllowedError') {
                        showNotification("⚠️ Pulsa Play para escuchar la canción");
                        isPlaying = false;
                        updatePlayerUI(index);
                    } else {
                        showNotification("❌ Error cargando canción. Verifica el formato.");
                    }
                });
        }
    }

    updatePlayerUI(index);
}

function togglePlay() {
    const song = playlist[currentSongIndex];
    if (!song) return;

    const isYT = isYouTubeUrl(song.url);

    if (isPlaying) {
        if (isYT && youtubePlayer && isYouTubeReady) youtubePlayer.pauseVideo();
        else if (audioPlayer) audioPlayer.pause();
        isPlaying = false;
    } else {
        if (isYT && youtubePlayer && isYouTubeReady) youtubePlayer.playVideo();
        else if (audioPlayer) {
            if (!audioPlayer.src || audioPlayer.src === window.location.href || audioPlayer.src === '') {
                setSong(currentSongIndex);
            } else {
                audioPlayer.play().catch(e => {
                    console.error("Error al reanudar:", e);
                    setSong(currentSongIndex);
                });
            }
        }
        isPlaying = true;
    }
    updatePlayerUI(currentSongIndex);
}

function updatePlayerUI(index, updateAudio = true) {
    const playBtn = document.getElementById('play-btn');
    const vinyl = document.querySelector('.vinyl-record');
    const titleElement = document.getElementById('current-song');
    const artistElement = document.getElementById('current-artist');

    if (playlist[index]) {
        if (titleElement) titleElement.textContent = playlist[index].title;
        if (artistElement) artistElement.textContent = playlist[index].artist || 'Desconocido';
    }

    if (playBtn) playBtn.textContent = isPlaying ? '⏸️' : '▶️';

    if (vinyl) {
        if (isPlaying) vinyl.classList.add('playing');
        else vinyl.classList.remove('playing');
    }

    renderPlaylist();
}

function updateProgressBarUI(currentTime, duration) {
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');

    if (progressBar && duration > 0) {
        const value = (currentTime / duration) * 100;
        progressBar.value = value;
        if (currentTimeEl) currentTimeEl.textContent = formatTime(currentTime);
        if (totalTimeEl) totalTimeEl.textContent = formatTime(duration);
    }
}

function nextSong() {
    let nextIndex = (currentSongIndex + 1) % playlist.length;
    setSong(nextIndex);
}

function previousSong() {
    let prevIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    setSong(prevIndex);
}

// Borrar canción (antes referenciada por onclick pero nunca definida → bug).
async function deleteSong(index) {
    const song = playlist[index];
    if (!song) return;
    if (!confirm('¿Eliminar esta canción de la playlist?')) return;

    try {
        if (song.id) await db.deleteSong(song.id);
        // Ajustar índice actual si hace falta
        if (currentSongIndex >= index && currentSongIndex > 0) currentSongIndex--;
        await loadPlaylist();
        showNotification('🗑️ Canción eliminada');
    } catch (e) {
        console.error(e);
        showNotification('❌ Error al eliminar la canción');
    }
}

function renderPlaylist() {
    const container = document.getElementById('playlist-container');
    if (!container) return;

    container.innerHTML = '';

    playlist.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = `playlist-item ${index === currentSongIndex ? 'active' : ''}`;

        const isDefault = !song.id || (typeof song.id === 'number' && song.id < 1000);
        const isYT = isYouTubeUrl(song.url);

        item.innerHTML = `
            <span class="song-number">${index + 1}</span>
            <div class="song-info">
                <h4>${escapeHtml(song.title)} ${isYT ? '📺' : ''}</h4>
                <p>${escapeHtml(song.artist || 'Desconocido')}</p>
            </div>
            <div class="song-actions" style="display: flex; gap: 5px;">
                <button class="btn-small" onclick="setSong(${index})">
                    ${index === currentSongIndex && isPlaying ? '⏸️' : '▶️'}
                </button>
                ${!isDefault ? `<button class="btn-small btn-delete" onclick="deleteSong(${index})" title="Eliminar">🗑️</button>` : ''}
            </div>
        `;
        container.appendChild(item);
    });
}

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Modal de Subida y Tabs
function openSongUploadModal() {
    const modal = document.getElementById('song-upload-modal');
    if (modal) modal.classList.add('active');
}

function closeSongUploadModal() {
    const modal = document.getElementById('song-upload-modal');
    if (modal) modal.classList.remove('active');
}

function switchSongTab(tabName) {
    // Botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.id === `tab-btn-${tabName}`) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Contenido
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    const activeTab = document.getElementById(`tab-${tabName}`);
    if (activeTab) activeTab.classList.add('active');

    const form = document.getElementById('song-upload-form');
    if (form) form.dataset.type = tabName; // 'upload', 'youtube', 'url'
}

// init(): cablea el formulario de subida, preview de YouTube y selector de archivo.
function init() {
    // Por si la API de YouTube ya estaba lista antes de cargar este módulo
    if (window.YT && window.YT.Player && !youtubePlayer) {
        try { window.onYouTubeIframeAPIReady(); } catch (e) { /* noop */ }
    }

    // YouTube Preview
    const ytUrlInput = document.getElementById('youtube-url');
    if (ytUrlInput) {
        ytUrlInput.addEventListener('input', function () {
            const url = this.value;
            const videoId = getYouTubeId(url);
            const previewDiv = document.getElementById('youtube-preview');
            const thumbImg = document.getElementById('youtube-thumbnail');
            const titlePreview = document.getElementById('youtube-title-preview');

            if (videoId) {
                previewDiv.style.display = 'block';
                thumbImg.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                titlePreview.textContent = "✅ Video detectado";
            } else {
                previewDiv.style.display = 'none';
            }
        });
    }

    const songForm = document.getElementById('song-upload-form');
    const fileInput = document.getElementById('song-file');
    const fileNameDisplay = document.getElementById('file-name-display');

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                const file = e.target.files[0];
                fileNameDisplay.textContent = `✅ ${file.name}`;
                const titleInput = document.getElementById('song-title');
                if (titleInput && !titleInput.value) {
                    titleInput.value = file.name.replace(/\.[^/.]+$/, "");
                }
            }
        });
    }

    if (songForm) {
        if (!songForm.dataset.type) songForm.dataset.type = 'upload';

        songForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const title = document.getElementById('song-title').value;
            const artist = document.getElementById('song-artist').value;
            let type = songForm.dataset.type || 'upload';

            let songData = { title, artist };

            if (type === 'upload') {
                songData.type = 'file';
                const fileInput = document.getElementById('song-file');
                if (!fileInput.files || !fileInput.files[0]) {
                    showNotification("Por favor selecciona un archivo de audio");
                    fileInput.click();
                    return;
                }
                songData.file = fileInput.files[0];
            } else if (type === 'youtube') {
                songData.type = 'url';
                const url = document.getElementById('youtube-url').value;
                if (!url || !getYouTubeId(url)) {
                    showNotification("Por favor ingresa un enlace de YouTube válido");
                    return;
                }
                songData.url = url;
            } else {
                songData.type = 'url';
                const url = document.getElementById('song-url').value;
                if (!url) {
                    showNotification("Por favor ingresa una URL válida");
                    return;
                }
                if (url.includes('spotify.com')) {
                    alert("⚠️ Los enlaces de Spotify no son compatibles. Usa enlaces de YouTube o archivos directos.");
                    return;
                }
                songData.url = url;
            }

            const submitBtn = songForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "⏳ Guardando...";
            submitBtn.disabled = true;

            try {
                await db.saveSong(songData);
                showNotification("¡Canción agregada exitosamente! 🎵");

                if (window.achievements) window.achievements.unlock('dj_love');

                songForm.reset();
                if (fileNameDisplay) fileNameDisplay.textContent = "Ningún archivo seleccionado";
                if (document.getElementById('youtube-preview')) document.getElementById('youtube-preview').style.display = 'none';

                closeSongUploadModal();
                await loadPlaylist();
            } catch (error) {
                console.error("Detalle del error:", error);

                let errorMsg = "Error al guardar la canción ❌";
                if (error.message) {
                    if (error.message.includes("violates row-level security")) {
                        errorMsg = "❌ Error de Permisos: Ejecuta el script SQL en Supabase.";
                    } else if (error.message.includes("The resource was not found")) {
                        errorMsg = "❌ Error: No se encontró el Bucket 'love_songs' en Supabase.";
                    } else {
                        errorMsg = `❌ Error: ${error.message}`;
                    }
                }

                showNotification(errorMsg);
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    // La carga inicial de la playlist se realiza en loadUserData() tras iniciar sesión.
}

// --- Exposición global (onclick inline) + inicializador para main.js ---
window.togglePlay = togglePlay;
window.nextSong = nextSong;
window.previousSong = previousSong;
window.setSong = setSong;
window.deleteSong = deleteSong;
window.openSongUploadModal = openSongUploadModal;
window.closeSongUploadModal = closeSongUploadModal;
window.switchSongTab = switchSongTab;
window.PlaylistManager = { init, loadPlaylist };

export { init, loadPlaylist };
