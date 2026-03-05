-- 1. Tabla de Playlist (Canciones)
CREATE TABLE IF NOT EXISTS playlist_songs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    artist TEXT,
    url TEXT NOT NULL,
    storage_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access Playlist" ON playlist_songs FOR ALL USING (true) WITH CHECK (true);

-- 2. Bucket para canciones
insert into storage.buckets (id, name, public)
values ('love_songs', 'love_songs', true)
on conflict (id) do nothing;

-- Políticas de Storage para canciones
create policy "Public Access Songs Bucket"
  on storage.objects for all
  using ( bucket_id = 'love_songs' )
  with check ( bucket_id = 'love_songs' );

-- 3. Actualizar tabla de mensajes (opcional, si queremos autor)
-- ALTER TABLE custom_messages ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'Anónimo';
