# Todo List Application

Une application de gestion de tâches (Todo List) développée avec Nuxt.js et Supabase dans le cadre d'un cours de développement full stack.

## Contexte

Ce projet a été réalisé dans le cadre d'un cours de développement full stack pour apprendre à utiliser **Supabase** comme backend (authentification et base de données) et **Nuxt.js** comme framework frontend.

## Objectifs

- Créer une application monopage (SPA) avec Nuxt.js
- Implémenter l'authentification des utilisateurs avec Supabase Auth
- Réaliser les opérations CRUD (Create, Read, Update, Delete) sur les tâches
- Assurer l'isolation des données : chaque utilisateur ne voit que ses propres tâches
- Utiliser Tailwind CSS pour le style de l'application

## Fonctionnalités

- **Authentification** : Inscription et connexion avec email et mot de passe
- **Gestion des tâches** : Création, modification, suppression et changement de statut
- **Filtres** : Affichage par statut (toutes, en cours, terminées)
- **Interface responsive** : Compatible mobile, tablette et desktop

## Technologies utilisées

| Technologie                                   | Version | Description                              |
| --------------------------------------------- | ------- | ---------------------------------------- |
| [Nuxt.js](https://nuxt.com/)                  | 4.x     | Framework Vue.js pour le frontend        |
| [Supabase](https://supabase.com/)             | 2.x     | Backend as a Service (Auth + PostgreSQL) |
| [Tailwind CSS](https://tailwindcss.com/)      | 3.x     | Framework CSS utilitaire                 |
| [TypeScript](https://www.typescriptlang.org/) | 5.x     | Typage statique                          |
| [Zod](https://zod.dev/)                       | 3.x     | Validation des données                   |

## Prérequis

- Node.js 18.x ou supérieur
- npm ou yarn
- Un compte [Supabase](https://supabase.com/)

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/Christopher973/nuxt-tp1.git
cd nuxt-tp1
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer Supabase

#### a. Créer un projet Supabase

1. Connectez-vous sur [supabase.com](https://supabase.com/)
2. Créez un nouveau projet
3. Notez l'**URL** et la **clé anon** (Settings > API)

#### b. Créer la table todos

Exécutez le script SQL suivant dans **Supabase > SQL Editor** :

```sql
-- Créer la table todos
CREATE TABLE IF NOT EXISTS todos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'en_cours' CHECK (status IN ('en_cours', 'termine')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC);

-- Activer Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Users can view their own todos" ON todos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own todos" ON todos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own todos" ON todos FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own todos" ON todos FOR DELETE USING (auth.uid() = user_id);
```

#### c. Désactiver la confirmation email (optionnel)

1. Allez dans **Authentication > Providers > Email**
2. Désactivez **"Confirm email"**

### 4. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_KEY=votre-cle-anon-publique
```

### 5. Lancer l'application

```bash
# Mode développement
npm run dev

# Build production
npm run build

# Prévisualisation production
npm run preview
```

L'application sera accessible sur `http://localhost:3000`

## Structure du projet

```
nuxt-tp1/
├── app/
│   ├── app.vue                 # Composant principal de l'application
│   ├── components/
│   │   ├── AppHeader.vue       # En-tête avec navigation
│   │   ├── AppFooter.vue       # Pied de page
│   │   ├── auth/
│   │   │   ├── LoginForm.vue   # Formulaire de connexion
│   │   │   └── RegisterForm.vue # Formulaire d'inscription
│   │   └── todo/
│   │       ├── Form.vue        # Formulaire création/édition
│   │       ├── List.vue        # Liste des tâches avec filtres
│   │       ├── Item.vue        # Carte individuelle d'une tâche
│   │       └── DeleteModal.vue # Modal de confirmation de suppression
│   ├── composables/
│   │   ├── useAuth.ts          # Gestion de l'authentification
│   │   └── useTodos.ts         # Opérations CRUD sur les todos
│   ├── types/
│   │   ├── index.ts            # Types de l'application (User, Todo)
│   │   └── database.ts         # Types Supabase (Database)
│   └── utils/
│       └── supabase.ts         # Client Supabase configuré
├── supabase/
│   └── migrations/
│       └── 001_setup_todos_rls.sql  # Script SQL de création
├── public/                     # Assets statiques
├── nuxt.config.ts              # Configuration Nuxt
├── tailwind.config.js          # Configuration Tailwind CSS
├── tsconfig.json               # Configuration TypeScript
└── package.json                # Dépendances et scripts
```

## Architecture

### Composables

- **useAuth** : Gère l'authentification (signUp, signIn, signOut, getSession)
- **useTodos** : Gère le CRUD des todos (fetchTodos, createTodo, updateTodo, deleteTodo)

### Sécurité

- **Row Level Security (RLS)** : Chaque utilisateur ne peut accéder qu'à ses propres données
- **Validation côté client** : Zod pour valider les formulaires
- **Typage strict** : TypeScript pour éviter les erreurs

## Scripts disponibles

| Commande           | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Lance le serveur de développement        |
| `npm run build`    | Compile l'application pour la production |
| `npm run preview`  | Prévisualise la build de production      |
| `npm run generate` | Génère une version statique              |

## Bonnes pratiques appliquées

- **Separation of Concerns** : Composables pour la logique, composants pour l'UI
- **TypeScript strict** : Typage complet pour une meilleure maintenabilité
- **Validation des données** : Zod pour valider les entrées utilisateur
- **Sécurité** : RLS Supabase pour l'isolation des données
- **Code commenté** : Documentation inline pour faciliter la compréhension
- **Composants réutilisables** : Architecture modulaire

## Auteur

Christopher

## Licence

Ce projet est sous licence Apache 2.0. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

```
Copyright 2026 Christopher

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
