/**
 * Capa de Abstracción de Datos (Data Service)
 * Gestiona la persistencia de datos usando Supabase (si está configurado) o localStorage.
 */

const db = {
    // ================================================
    // CONFIGURACIÓN
    // ================================================
    async getConfig(key) {
        if (window.supabaseClient) {
            const { data, error } = await supabaseClient
                .from('app_config')
                .select('value')
                .eq('key', key)
                .single();
            
            if (!error && data) return data.value;
        }
        return localStorage.getItem(key);
    },

    async setConfig(key, value) {
        if (window.supabaseClient) {
            const { error } = await supabaseClient
                .from('app_config')
                .upsert({ key, value });
            
            if (error) console.error('Error guardando config en Supabase:', error);
        }
        localStorage.setItem(key, value);
    },

    // ================================================
    // TIMELINE (HISTORIA)
    // ================================================
    async getTimelineEvents() {
        if (window.supabaseClient) {
            const { data, error } = await supabaseClient
                .from('timeline_events')
                .select('*')
                .order('created_at', { ascending: true });
            
            if (!error) return data;
            console.error('Error obteniendo timeline:', error);
        }
        return JSON.parse(localStorage.getItem('timelineEvents') || '[]');
    },

    async saveTimelineEvent(event) {
        if (window.supabaseClient) {
            const { data, error } = await supabaseClient
                .from('timeline_events')
                .insert([event])
                .select();
            
            if (!error) return data[0];
            console.error('Error guardando evento:', error);
        }
        
        // Fallback LocalStorage
        const events = JSON.parse(localStorage.getItem('timelineEvents') || '[]');
        events.push(event);
        localStorage.setItem('timelineEvents', JSON.stringify(events));
        return event;
    },

    async updateTimelineEvent(id, event) {
        if (window.supabaseClient) {
            const { error } = await supabaseClient
                .from('timeline_events')
                .update(event)
                .eq('id', id);
            
            if (error) console.error('Error actualizando evento:', error);
        } else {
            // LocalStorage usa índices numéricos como ID en la versión actual
            const events = JSON.parse(localStorage.getItem('timelineEvents') || '[]');
            if (events[id]) {
                events[id] = { ...events[id], ...event };
                localStorage.setItem('timelineEvents', JSON.stringify(events));
            }
        }
    },

    async deleteTimelineEvent(id) {
        if (window.supabaseClient) {
            const { error } = await supabaseClient
                .from('timeline_events')
                .delete()
                .eq('id', id);
            
            if (error) console.error('Error eliminando evento:', error);
        } else {
            const events = JSON.parse(localStorage.getItem('timelineEvents') || '[]');
            events.splice(id, 1);
            localStorage.setItem('timelineEvents', JSON.stringify(events));
        }
    },

    // ================================================
    // GALERÍA DE FOTOS
    // ================================================
    async getPhotos() {
        if (window.supabaseClient) {
            const { data, error } = await supabaseClient
                .from('gallery_photos')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (!error) return data;
        }
        
        // Convertir objeto de localStorage a array
        const photosObj = JSON.parse(localStorage.getItem('galleryPhotos') || '{}');
        return Object.values(photosObj);
    },

    async savePhoto(photoData) {
        // photoData: { file (Blob), category, caption }
        if (window.supabaseClient && photoData.file) {
            try {
                // 1. Subir imagen al Storage
                const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
                const { data: uploadData, error: uploadError } = await supabaseClient
                    .storage
                    .from('love_gallery')
                    .upload(fileName, photoData.file);

                if (uploadError) throw uploadError;

                // 2. Obtener URL pública
                const { data: { publicUrl } } = supabaseClient
                    .storage
                    .from('love_gallery')
                    .getPublicUrl(fileName);

                // 3. Guardar metadatos en BD
                const { data: dbData, error: dbError } = await supabaseClient
                    .from('gallery_photos')
                    .insert([{
                        url: publicUrl,
                        storage_path: fileName,
                        category: photoData.category,
                        caption: photoData.caption
                    }])
                    .select();

                if (dbError) throw dbError;
                return dbData[0];

            } catch (error) {
                console.error('Error subiendo foto a Supabase:', error);
                alert('Error subiendo foto a la nube. Se intentará guardar localmente.');
            }
        }

        // Fallback LocalStorage (Base64)
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const id = Date.now().toString();
                const photo = {
                    id: id,
                    url: e.target.result, // DataURL
                    category: photoData.category,
                    caption: photoData.caption,
                    date: new Date().toISOString()
                };
                
                const photos = JSON.parse(localStorage.getItem('galleryPhotos') || '{}');
                photos[id] = photo;
                localStorage.setItem('galleryPhotos', JSON.stringify(photos));
                resolve(photo);
            };
            if (photoData.file) {
                reader.readAsDataURL(photoData.file);
            } else {
                resolve(null);
            }
        });
    },

    async deletePhoto(id) {
        if (window.supabaseClient) {
            // Primero obtener el path para borrar del storage
            const { data: photo } = await supabaseClient
                .from('gallery_photos')
                .select('storage_path')
                .eq('id', id)
                .single();

            if (photo && photo.storage_path) {
                await supabaseClient.storage.from('love_gallery').remove([photo.storage_path]);
            }

            const { error } = await supabaseClient
                .from('gallery_photos')
                .delete()
                .eq('id', id);
            
            if (error) console.error('Error eliminando foto:', error);
        }
        
        const photos = JSON.parse(localStorage.getItem('galleryPhotos') || '{}');
        delete photos[id];
        localStorage.setItem('galleryPhotos', JSON.stringify(photos));
    },

    // ================================================
    // LIBRO DE RECUERDOS
    // ================================================
    async getMemories() {
        if (window.supabaseClient) {
            const { data, error } = await supabaseClient
                .from('memories')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (!error) return data;
        }
        return JSON.parse(localStorage.getItem('memories') || '[]');
    },

    async saveMemory(memory) {
        if (window.supabaseClient) {
            const { data, error } = await supabaseClient
                .from('memories')
                .insert([{
                    title: memory.title,
                    memory_date: memory.date, // Mapeo de nombre
                    description: memory.description,
                    mood: memory.mood
                }])
                .select();
            
            if (!error) return data[0];
        }

        const memories = JSON.parse(localStorage.getItem('memories') || '[]');
        memories.unshift(memory);
        localStorage.setItem('memories', JSON.stringify(memories));
        return memory;
    },

    async deleteMemory(id) {
        if (window.supabaseClient) {
            await supabaseClient.from('memories').delete().eq('id', id);
        } else {
            const memories = JSON.parse(localStorage.getItem('memories') || '[]');
            memories.splice(id, 1); // Nota: id es índice en localStorage
            localStorage.setItem('memories', JSON.stringify(memories));
        }
    },

    // ================================================
    // PUNTUACIONES Y JUEGOS
    // ================================================
    async saveGameScore(gameName, score, details = {}) {
        if (window.supabaseClient) {
            const { error } = await supabaseClient
                .from('game_scores')
                .insert([{
                    game_name: gameName,
                    score: score,
                    details: details
                }]);
            
            if (error) console.error('Error guardando puntuación:', error);
        }
        
        // Guardar high score localmente también por rendimiento y fallback
        const key = `${gameName}HighScore`;
        const currentHigh = parseInt(localStorage.getItem(key) || '0');
        if (score > currentHigh) {
            localStorage.setItem(key, score.toString());
        }
        
        return score;
    },

    async getHighScore(gameName) {
        // Intentar obtener el máximo global de Supabase
        if (window.supabaseClient) {
            const { data, error } = await supabaseClient
                .from('game_scores')
                .select('score')
                .eq('game_name', gameName)
                .order('score', { ascending: false })
                .limit(1)
                .single();
            
            if (!error && data) {
                // Sincronizar con local si es mayor
                const localHigh = parseInt(localStorage.getItem(`${gameName}HighScore`) || '0');
                if (data.score > localHigh) {
                    localStorage.setItem(`${gameName}HighScore`, data.score.toString());
                }
                return data.score;
            }
        }
        
        // Fallback local
        return parseInt(localStorage.getItem(`${gameName}HighScore`) || '0');
    },

    async getHighScores(gameName) {
        if (window.supabaseClient) {
            const { data, error } = await supabaseClient
                .from('game_scores')
                .select('*')
                .eq('game_name', gameName)
                .order('score', { ascending: false })
                .limit(10);
            
            if (!error && data) return data;
        }
        return [];
    },

    // ================================================
    // PREGUNTAS Y RESPUESTAS
    // ================================================
    async saveQuestionAnswer(question, answer) {
        if (window.supabaseClient) {
            const { error } = await supabaseClient
                .from('question_answers')
                .insert([{
                    question: question,
                    answer: answer
                }]);
            
            if (error) console.error('Error guardando respuesta:', error);
        }

        // Guardar localmente también
        const answers = JSON.parse(localStorage.getItem('questionAnswers') || '[]');
        answers.push({
            question,
            answer,
            date: new Date().toISOString()
        });
        localStorage.setItem('questionAnswers', JSON.stringify(answers));
    },

    async getQuestionAnswers() {
        if (window.supabaseClient) {
            const { data, error } = await supabaseClient
                .from('question_answers')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (!error && data) return data;
        }
        return JSON.parse(localStorage.getItem('questionAnswers') || '[]');
    },

    // ================================================
    // MENSAJES PERSONALIZADOS
    // ================================================
    async saveCustomMessage(content) {
        if (window.supabaseClient) {
            const { data, error } = await supabaseClient
                .from('custom_messages')
                .insert([{ content }])
                .select();
            
            if (!error) return data[0];
            console.error('Error guardando mensaje:', error);
        }

        const messages = JSON.parse(localStorage.getItem('customMessages') || '[]');
        const newMessage = { id: Date.now(), content, created_at: new Date().toISOString() };
        messages.unshift(newMessage);
        localStorage.setItem('customMessages', JSON.stringify(messages));
        return newMessage;
    },

    async getCustomMessages() {
        if (window.supabaseClient) {
            const { data, error } = await supabaseClient
                .from('custom_messages')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (!error) return data;
        }
        return JSON.parse(localStorage.getItem('customMessages') || '[]');
    },

    // ================================================
    // PLAYLIST (CANCIONES)
    // ================================================
    async saveSong(songData) {
        // songData: { file, url, title, artist, type: 'file' | 'url' }
        
        if (window.supabaseClient && songData.type === 'file') {
            try {
                // 1. Subir audio al Storage
                const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp3`;
                const { error: uploadError } = await supabaseClient
                    .storage
                    .from('love_songs')
                    .upload(fileName, songData.file);

                if (uploadError) throw uploadError;

                // 2. Obtener URL pública
                const { data: { publicUrl } } = supabaseClient
                    .storage
                    .from('love_songs')
                    .getPublicUrl(fileName);

                // 3. Guardar en BD
                const { data, error: dbError } = await supabaseClient
                    .from('playlist_songs')
                    .insert([{
                        title: songData.title,
                        artist: songData.artist,
                        url: publicUrl,
                        storage_path: fileName
                    }])
                    .select();

                if (dbError) throw dbError;
                return data[0];

            } catch (error) {
                console.error('Error subiendo canción:', error);
                throw error;
            }
        } else if (window.supabaseClient && songData.type === 'url') {
            // Guardar solo URL en Supabase
            try {
                const { data, error } = await supabaseClient
                    .from('playlist_songs')
                    .insert([{
                        title: songData.title,
                        artist: songData.artist,
                        url: songData.url,
                        storage_path: null // Es externa
                    }])
                    .select();
                
                if (error) throw error;
                return data[0];
            } catch (error) {
                console.error('Error guardando link de canción:', error);
                throw error;
            }
        }
        
        // Fallback LocalStorage (Solo para URLs externas, no archivos blob por espacio)
        if (songData.type === 'url') {
            const songs = JSON.parse(localStorage.getItem('playlistSongs') || '[]');
            const newSong = {
                id: Date.now(),
                title: songData.title,
                artist: songData.artist,
                url: songData.url,
                created_at: new Date().toISOString()
            };
            songs.unshift(newSong);
            localStorage.setItem('playlistSongs', JSON.stringify(songs));
            return newSong;
        } else {
            console.warn('Intento de subir archivo sin cliente Supabase activo.');
            alert('⚠️ No se detectó conexión con la base de datos (Supabase).\n\nPara subir archivos de audio (MP3), necesitas conexión activa a la base de datos.\n\n💡 SOLUCIÓN: Usa la pestaña "Enlace Externo" para agregar canciones mediante URL, o recarga la página para reintentar la conexión.');
            return null;
        }
    },

    async getPlaylist() {
        let songs = [];
        
        // 1. Obtener de Supabase
        if (window.supabaseClient) {
            const { data, error } = await supabaseClient
                .from('playlist_songs')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (!error && data) songs = [...data];
        }
        
        // 2. Obtener de LocalStorage (mezclar)
        const localSongs = JSON.parse(localStorage.getItem('playlistSongs') || '[]');
        songs = [...songs, ...localSongs];
        
        // Eliminar duplicados por ID si los hubiera (raro pero posible)
        const uniqueSongs = Array.from(new Map(songs.map(item => [item.id, item])).values());
        
        return uniqueSongs;
    },

    async deleteSong(id) {
        // Verificar si es ID de Supabase (UUID) o LocalStorage (Timestamp numérico)
        const isSupabaseId = typeof id === 'string' && id.length > 20; // Simple check

        if (window.supabaseClient && isSupabaseId) {
            // 1. Obtener info para borrar archivo del storage si existe
            const { data: song } = await supabaseClient
                .from('playlist_songs')
                .select('storage_path')
                .eq('id', id)
                .single();

            if (song && song.storage_path) {
                await supabaseClient.storage.from('love_songs').remove([song.storage_path]);
            }

            // 2. Borrar de la tabla
            const { error } = await supabaseClient
                .from('playlist_songs')
                .delete()
                .eq('id', id);
            
            if (error) {
                console.error('Error eliminando canción de Supabase:', error);
                throw error;
            }
        } else {
            // Borrar de LocalStorage
            let songs = JSON.parse(localStorage.getItem('playlistSongs') || '[]');
            songs = songs.filter(s => s.id !== id);
            localStorage.setItem('playlistSongs', JSON.stringify(songs));
        }
    }
};

// Exportar globalmente
window.db = db;
