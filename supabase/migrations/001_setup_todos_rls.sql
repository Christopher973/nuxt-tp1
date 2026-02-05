-- ============================================
-- Migration : Création de la table todos et configuration RLS
-- À exécuter dans Supabase > SQL Editor
-- ============================================

-- 1. Créer la table todos (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS todos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'en_cours' CHECK (status IN ('en_cours', 'termine')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. Créer un index sur user_id pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);

-- 3. Créer un index sur created_at pour optimiser le tri
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
-- SELECT * FROM pg_policies WHERE tablename = 'todos';
