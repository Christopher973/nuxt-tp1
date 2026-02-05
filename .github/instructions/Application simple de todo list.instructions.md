---
applyTo: "**"
---

# Application simple de Todo list

## Contexte

Dans le cadre d'un cours de développement full stack pour apprendre à utiliser Supabase ainsi que Nuxt, nous allons créer une application simple de Todo list. Cette application permettra aux utilisateurs de créer, lire, mettre à jour et supprimer des tâches (CRUD) en utilisant Supabase comme backend et Nuxt comme frontend.

## Objectifs

- Application en une seul page avec Nuxt pour le frontend, supabase pour le backend, tailwindCSS pour le style
- Authentification des utilisateurs avec Supabase (nom complet, email sans confirmation et mot de passe)
- Les utilisateurs peuvent créer, lire, mettre à jour et supprimer des tâches (CRUD)
- Les tâches sont associées à l'utilisateur qui les a créées, de sorte que chaque utilisateur ne puisse voir que ses propres tâches
- Utilisation de Tailwind CSS pour le style de l'application
- les Todos sont composés d'un titre, d'une description, d'une date de création et d'un statut (en cours, terminé)

## Besoin

- Installer les dépendances nécessaires pour Nuxt, Supabase et Tailwind CSS
- Configurer Supabase pour gérer l'authentification et la base de données
- Créer les composants Nuxt pour l'interface utilisateur (formulaire d'inscription, formulaire de connexion, liste des tâches, formulaire de création/modification de tâche)
- Implémenter les fonctionnalités de CRUD pour les tâches en utilisant Supabase
- Styliser l'application avec Tailwind CSS

## Technologies utilisées

- Nuxt.js pour le frontend
- Supabase pour le backend (authentification et base de données)
- Tailwind CSS pour le style
- zod pour la validation des données
- TypeScript pour le typage statique

## Règles importantes

- Chaque utilisateur doit être authentifié pour accéder à l'application
- Les utilisateurs ne peuvent voir que leurs propres tâches
- Les tâches doivent être correctement associées à l'utilisateur qui les a créées
- L'application doit être responsive et facile à utiliser
- Le code doit être propre, bien structuré et commenté pour faciliter la maintenance et la compréhension
- Utiliser les meilleures pratiques de développement pour assurer la sécurité et la performance de l'application
- Ne faire que les fonctionnalités demandées, pas de fonctionnalités supplémentaires
- Ne pas utiliser de bibliothèques ou de frameworks supplémentaires sans l'approbation préalable
