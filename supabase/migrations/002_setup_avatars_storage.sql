-- ============================================
-- Migration : Configuration du bucket Storage pour les avatars
-- À exécuter dans Supabase > SQL Editor
-- ============================================

-- Note: Le bucket "avatars" doit être créé manuellement via l'interface Supabase :
-- 1. Aller dans Storage > New bucket
-- 2. Name: avatars
-- 3. Public bucket: Activé

-- ============================================
-- Politiques RLS pour le bucket avatars
-- ============================================

-- Politique SELECT : Tout le monde peut voir les avatars (bucket public)
DROP POLICY IF EXISTS "Avatars are publicly accessible" ON storage.objects;
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Politique INSERT : Les utilisateurs peuvent uploader leur propre avatar
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique UPDATE : Les utilisateurs peuvent modifier leur propre avatar
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Politique DELETE : Les utilisateurs peuvent supprimer leur propre avatar
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- Vérification (optionnel)
-- ============================================
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
