-- ============================================
-- Migration : Données initiales (Seed)
-- À exécuter dans Supabase > SQL Editor
-- IMPORTANT : Exécuter APRÈS avoir créé l'utilisateur via l'interface
-- ============================================

-- ============================================
-- ÉTAPE 1 : Créer l'utilisateur via l'API Auth
-- ============================================
-- L'utilisateur doit être créé via l'interface Supabase ou l'application :
-- - Email : user@yopmail.com
-- - Mot de passe : Azertyu.1
-- - Nom complet : Utilisateur
--
-- OU utiliser cette requête SQL qui crée directement l'utilisateur dans auth.users
-- (Nécessite les privilèges service_role)

-- Créer l'utilisateur dans auth.users
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    role,
    aud,
    confirmation_token
)
SELECT 
    '00000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user@yopmail.com',
    crypt('Azertyu.1', gen_salt('bf')),
    NOW(),
    '{"full_name": "Utilisateur"}'::jsonb,
    NOW(),
    NOW(),
    'authenticated',
    'authenticated',
    ''
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'user@yopmail.com'
);

-- Créer l'identité pour l'utilisateur (nécessaire pour la connexion)
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    '00000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    jsonb_build_object(
        'sub', '00000000-0000-0000-0000-000000000001',
        'email', 'user@yopmail.com',
        'email_verified', true,
        'full_name', 'Utilisateur'
    ),
    'email',
    'user@yopmail.com',
    NOW(),
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities WHERE provider_id = 'user@yopmail.com'
);

-- ============================================
-- ÉTAPE 2 : Créer la table todos si elle n'existe pas
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

-- ============================================
-- ÉTAPE 3 : Insérer les todos de l'utilisateur
-- ============================================

-- Variable pour l'ID de l'utilisateur
DO $$
DECLARE
    user_uuid UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
    -- Vérifier si l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_uuid) THEN
        RAISE NOTICE 'Utilisateur non trouvé. Veuillez d''abord créer l''utilisateur user@yopmail.com';
        RETURN;
    END IF;

    -- Supprimer les anciennes données de seed (optionnel)
    DELETE FROM todos WHERE user_id = user_uuid;

    -- ============================================
    -- 5 Todos EN COURS
    -- ============================================
    INSERT INTO todos (user_id, title, description, status, created_at) VALUES
    (user_uuid, 'Apprendre Nuxt.js', 'Suivre la documentation officielle et créer des projets pratiques', 'en_cours', NOW() - INTERVAL '1 day'),
    (user_uuid, 'Configurer Supabase', 'Mettre en place l''authentification et la base de données', 'en_cours', NOW() - INTERVAL '2 days'),
    (user_uuid, 'Implémenter Tailwind CSS', 'Styliser tous les composants de l''application', 'en_cours', NOW() - INTERVAL '3 days'),
    (user_uuid, 'Écrire les tests unitaires', 'Tester les composables et les composants critiques', 'en_cours', NOW() - INTERVAL '4 days'),
    (user_uuid, 'Déployer l''application', 'Configurer Vercel et les variables d''environnement', 'en_cours', NOW() - INTERVAL '5 days');

    -- ============================================
    -- 10 Todos TERMINÉES
    -- ============================================
    INSERT INTO todos (user_id, title, description, status, created_at) VALUES
    (user_uuid, 'Créer le projet Nuxt', 'Initialiser le projet avec npx nuxi init', 'termine', NOW() - INTERVAL '10 days'),
    (user_uuid, 'Installer les dépendances', 'Ajouter Supabase, Tailwind CSS et Zod', 'termine', NOW() - INTERVAL '11 days'),
    (user_uuid, 'Configurer TypeScript', 'Activer le mode strict et définir les types', 'termine', NOW() - INTERVAL '12 days'),
    (user_uuid, 'Créer le composable useAuth', 'Gérer l''authentification avec Supabase', 'termine', NOW() - INTERVAL '13 days'),
    (user_uuid, 'Créer le composable useTodos', 'Implémenter les opérations CRUD', 'termine', NOW() - INTERVAL '14 days'),
    (user_uuid, 'Développer le formulaire de connexion', 'Interface avec validation Zod', 'termine', NOW() - INTERVAL '15 days'),
    (user_uuid, 'Développer le formulaire d''inscription', 'Inscription avec nom complet et email', 'termine', NOW() - INTERVAL '16 days'),
    (user_uuid, 'Créer la liste des todos', 'Affichage avec filtres et actions', 'termine', NOW() - INTERVAL '17 days'),
    (user_uuid, 'Implémenter le profil utilisateur', 'Page de modification du profil et avatar', 'termine', NOW() - INTERVAL '18 days'),
    (user_uuid, 'Configurer les politiques RLS', 'Sécuriser l''accès aux données par utilisateur', 'termine', NOW() - INTERVAL '19 days');

    RAISE NOTICE 'Données initiales insérées avec succès : 5 todos en cours et 10 todos terminées';
END $$;

-- ============================================
-- Vérification
-- ============================================
-- SELECT status, COUNT(*) FROM todos WHERE user_id = '00000000-0000-0000-0000-000000000001' GROUP BY status;
