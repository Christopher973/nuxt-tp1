-- ============================================
-- Migration : Données initiales (Seed)
-- À exécuter dans Supabase > SQL Editor
-- ============================================
--
-- PRÉREQUIS : L'utilisateur DOIT DÉJÀ EXISTER dans Supabase Auth
--
-- Pour récupérer l'UUID de l'utilisateur :
--   1. Allez dans Supabase Dashboard > Authentication > Users
--   2. Cliquez sur l'utilisateur souhaité
--   3. Copiez son UUID (champ "id")
--   4. Collez-le dans la variable seed_user_id ci-dessous (ligne 20)
--
-- Ce script créera :
--   - 5 todos avec le statut "en_cours"
--   - 10 todos avec le statut "termine"
--
-- ============================================

DO $$
DECLARE
    -- ⚠️ MODIFIEZ CETTE VALEUR avec l'UUID de votre utilisateur ⚠️
    seed_user_id UUID := 'f7ba544f-0ce9-487d-830a-66d0d4a34569';
BEGIN
    -- Vérifier que l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = seed_user_id) THEN
        RAISE EXCEPTION 'Utilisateur avec l''UUID % non trouvé. Vérifiez que l''utilisateur existe dans Authentication > Users.', seed_user_id;
    END IF;

    -- ============================================
    -- Créer la table todos si elle n'existe pas
    -- ============================================
    CREATE TABLE IF NOT EXISTS todos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'en_cours' CHECK (status IN ('en_cours', 'termine')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Index pour optimiser les requêtes
    CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
    CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC);

    -- Activer RLS
    ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

    -- Supprimer les anciennes données de l'utilisateur
    DELETE FROM todos WHERE user_id = seed_user_id;

    -- ============================================
    -- 5 Todos EN COURS
    -- ============================================
    INSERT INTO todos (user_id, title, description, status, created_at) VALUES
    (seed_user_id, 'Apprendre Nuxt.js', 'Suivre la documentation officielle et créer des projets pratiques', 'en_cours', NOW() - INTERVAL '1 day'),
    (seed_user_id, 'Configurer Supabase', 'Mettre en place l''authentification et la base de données', 'en_cours', NOW() - INTERVAL '2 days'),
    (seed_user_id, 'Implémenter Tailwind CSS', 'Styliser tous les composants de l''application', 'en_cours', NOW() - INTERVAL '3 days'),
    (seed_user_id, 'Écrire les tests unitaires', 'Tester les composables et les composants critiques', 'en_cours', NOW() - INTERVAL '4 days'),
    (seed_user_id, 'Déployer l''application', 'Configurer Vercel et les variables d''environnement', 'en_cours', NOW() - INTERVAL '5 days');

    -- ============================================
    -- 10 Todos TERMINÉES
    -- ============================================
    INSERT INTO todos (user_id, title, description, status, created_at) VALUES
    (seed_user_id, 'Créer le projet Nuxt', 'Initialiser le projet avec npx nuxi init', 'termine', NOW() - INTERVAL '10 days'),
    (seed_user_id, 'Installer les dépendances', 'Ajouter Supabase, Tailwind CSS et Zod', 'termine', NOW() - INTERVAL '11 days'),
    (seed_user_id, 'Configurer TypeScript', 'Activer le mode strict et définir les types', 'termine', NOW() - INTERVAL '12 days'),
    (seed_user_id, 'Créer le composable useAuth', 'Gérer l''authentification avec Supabase', 'termine', NOW() - INTERVAL '13 days'),
    (seed_user_id, 'Créer le composable useTodos', 'Implémenter les opérations CRUD', 'termine', NOW() - INTERVAL '14 days'),
    (seed_user_id, 'Développer le formulaire de connexion', 'Interface avec validation Zod', 'termine', NOW() - INTERVAL '15 days'),
    (seed_user_id, 'Développer le formulaire d''inscription', 'Inscription avec nom complet et email', 'termine', NOW() - INTERVAL '16 days'),
    (seed_user_id, 'Créer la liste des todos', 'Affichage avec filtres et actions', 'termine', NOW() - INTERVAL '17 days'),
    (seed_user_id, 'Implémenter le profil utilisateur', 'Page de modification du profil et avatar', 'termine', NOW() - INTERVAL '18 days'),
    (seed_user_id, 'Configurer les politiques RLS', 'Sécuriser l''accès aux données par utilisateur', 'termine', NOW() - INTERVAL '19 days');

    RAISE NOTICE '✅ Seed terminé : 5 todos en cours + 10 todos terminées créées pour l''utilisateur %', seed_user_id;
END $$;

-- ============================================
-- Politiques RLS (exécutées en dehors du bloc DO)
-- ============================================
DROP POLICY IF EXISTS "Users can view their own todos" ON todos;
DROP POLICY IF EXISTS "Users can insert their own todos" ON todos;
DROP POLICY IF EXISTS "Users can update their own todos" ON todos;
DROP POLICY IF EXISTS "Users can delete their own todos" ON todos;

CREATE POLICY "Users can view their own todos" ON todos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own todos" ON todos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own todos" ON todos FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own todos" ON todos FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- Vérification (décommentez pour tester)
-- ============================================
-- SELECT status, COUNT(*) as nombre FROM todos GROUP BY status;
