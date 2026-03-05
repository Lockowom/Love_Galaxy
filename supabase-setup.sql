-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla de Configuración (para fecha de inicio, etc.)
CREATE TABLE IF NOT EXISTS app_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar valor por defecto para fecha de inicio
INSERT INTO app_config (key, value) VALUES ('relationshipStart', '2024-01-01') ON CONFLICT DO NOTHING;

-- 2. Tabla de Eventos del Timeline
CREATE TABLE IF NOT EXISTS timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    date_str TEXT NOT NULL, -- Guardamos como texto para flexibilidad "Enero 2024"
    description TEXT,
    icon TEXT DEFAULT '💕',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Recuerdos (Libro de Recuerdos)
CREATE TABLE IF NOT EXISTS memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    memory_date DATE NOT NULL,
    description TEXT NOT NULL,
    mood TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de Fotos de Galería
CREATE TABLE IF NOT EXISTS gallery_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    storage_path TEXT, -- Ruta en el bucket de storage
    category TEXT NOT NULL, -- 'juntos', 'especiales', 'viajes', 'celebraciones'
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabla de Respuestas a Preguntas
CREATE TABLE IF NOT EXISTS question_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabla de Puntuaciones de Juegos
CREATE TABLE IF NOT EXISTS game_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_name TEXT NOT NULL, -- 'galaxy', 'memory', etc.
    score INTEGER NOT NULL,
    details JSONB, -- Para guardar info extra como nivel, combo, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabla de Mensajes Personalizados
CREATE TABLE IF NOT EXISTS custom_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- POLÍTICAS DE SEGURIDAD (Row Level Security)
-- Por simplicidad para este proyecto "regalo", permitiremos lectura pública
-- y escritura pública (o restringida si se implementa auth).
-- Para empezar, habilitamos acceso anónimo/público completo para facilitar el uso sin login complejo.

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_messages ENABLE ROW LEVEL SECURITY;

-- Crear políticas para permitir todo (Cuidado: esto es inseguro en producción real, pero ok para demo/regalo personal)
-- Lo ideal sería restringir escritura, pero el usuario pidió "expandir" y probablemente quiera que funcione directo.
-- Recomendación: Usar autenticación anónima en el cliente.

CREATE POLICY "Public Access Config" ON app_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Timeline" ON timeline_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Memories" ON memories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Photos" ON gallery_photos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Questions" ON question_answers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Scores" ON game_scores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Messages" ON custom_messages FOR ALL USING (true) WITH CHECK (true);

-- STORAGE BUCKET
-- Nota: La creación de buckets suele hacerse desde el dashboard, pero si tienes permisos de admin SQL:
insert into storage.buckets (id, name, public)
values ('love_gallery', 'love_gallery', true)
on conflict (id) do nothing;

-- Políticas de Storage
create policy "Public Access Bucket"
  on storage.objects for all
  using ( bucket_id = 'love_gallery' )
  with check ( bucket_id = 'love_gallery' );
