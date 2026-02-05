-- ============================================
-- Migration : Mise à jour de la table todos et configuration RLS
-- À exécuter dans Supabase > SQL Editor
-- ============================================

-- 1. Ajouter la colonne status si elle n'existe pas
ALTER TABLE todos 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'en_cours';

-- 2. Ajouter une contrainte CHECK sur status (supprimer d'abord si existe)
ALTER TABLE todos DROP CONSTRAINT IF EXISTS todos_status_check;
ALTER TABLE todos ADD CONSTRAINT todos_status_check CHECK (status IN ('en_cours', 'termine'));

-- 3. Créer les index (si pas déjà créés)
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC);

-- 4. Activer RLS sur la table todos
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 5. Supprimer les politiques existantes (pour éviter les doublons)
DROP POLICY IF EXISTS "Users can view their own todos" ON todos;
DROP POLICY IF EXISTS "Users can insert their own todos" ON todos;
DROP POLICY IF EXISTS "Users can update their own todos" ON todos;
DROP POLICY IF EXISTS "Users can delete their own todos" ON todos;

-- 6. Créer les politiques RLS

-- Politique SELECT : Les utilisateurs peuvent voir uniquement leurs propres todos
CREATE POLICY "Users can view their own todos"
ON todos
FOR SELECT
USING (auth.uid() = user_id);

-- Politique INSERT : Les utilisateurs peuvent créer des todos pour eux-mêmes
CREATE POLICY "Users can insert their own todos"
ON todos
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Politique UPDATE : Les utilisateurs peuvent modifier uniquement leurs propres todos
CREATE POLICY "Users can update their own todos"
ON todos
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Politique DELETE : Les utilisateurs peuvent supprimer uniquement leurs propres todos
CREATE POLICY "Users can delete their own todos"
ON todos
FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- Vérification (optionnel)
-- ============================================
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'todos';
