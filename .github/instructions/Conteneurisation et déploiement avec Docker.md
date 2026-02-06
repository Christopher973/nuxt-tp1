---
applyTo: "**"
---

# Conteneurisation et déploiement avec Docker

L'objectif est de conteneuriser et déployer une application sur un VPS en garantissant que le code source ne transite jamais sur le serveur. Le registre cible est GHCR prive, Apache sert de reverse proxy et Let’s Encrypt gere le SSL.

## Contexte

Le projet à conteneuriser et à déployer est une application de Todo list développée avec Nuxt pour le frontend et Supabase pour le backend. L'application permet aux utilisateurs de créer, lire, mettre à jour et supprimer des tâches (CRUD) en utilisant Supabase comme backend et Nuxt comme frontend.
L'application intégre également des fonctionnalités d'authentification et d'autorisation pour sécuriser l'accès aux données des utilisateurs à l'aide de Supabase Auth. Les utilisateurs peuvent s'inscrire, se connecter/déconnecter et gérer leurs tâches de manière sécurisée. Ils peuvent également modifier leur profil ainsi que modifier leur image de profil à l'aide de Supabase Storage.
L'application est déjà développée et fonctionelle.

## Objectifs

L'objectif de ce projet est d'intégrer Docker ainsi qu'un registre privé Github pour conteneuriser l'application, puis de déployer cette application conteneurisée sur un serveur VPS. L'application doit être accessible via une URL publique, et le code source ne doit pas être exposé sur le serveur VPS.

## Environnements technique

L'application utilise la stack suivante : Nuxt, Supabase, Git & Github, TailwindCSS.
Le serveur VPS de déploiement est un serveur Linux (Ubuntu) avec accès SSH. Il est composé de Docker, Apache, Certbot, et d'un domaine (vps.christopher-marie-angelique.fr) connecté à ce serveur il faut prévoir de lié un sous domaine à ce projet (todo.christopher-marie-angelique.fr).

## Synthese et plan de deploiement

### Synthese

- **Contexte** : application frontend conteneurisee, backend Supabase gere a distance.
- **Besoin** : deploiement manuel securise via GHCR prive, sans code source sur le VPS.
- **Objectif** : image Docker comme seule entite applicative sur le serveur, reverse proxy Apache + SSL.
- **Environnement** : Ubuntu, Docker, Apache, Certbot, sous-domaine `todo.christopher-marie-angelique.fr`.

### Plan d'implementation (procedural)

- **Partie 1 — Configuration locale (Build/Push)**
  - Analyser et construire un Dockerfile multi-stage pour exclure le code source en runtime.
  - Definir un nom d'image GHCR et pousser l'image dans le registre prive.
  - Gerer le PAT (scopes minimaux, stockage securise, pas de commit).
- **Partie 2 — Configuration VPS (Login/Pull/Run)**
  - Configurer l'acces GHCR via PAT en lecture seule.
  - Tirer l'image privee, demarrer le conteneur en exposant le port 3000 local.
  - Fournir les secrets d'execution via variables d'environnement.
- **Partie 3 — Configuration Apache (Reverse Proxy/SSL)**
  - Definir un VirtualHost pour le sous-domaine et proxy vers `localhost:3000`.
  - Activer HTTPS et forcer la redirection HTTP vers HTTPS.

## Partie 1 — Configuration locale (Build/Push)

### 1) Analyse du Dockerfile (multi-stage, sans code source en runtime)

Objectif : ne jamais embarquer le code source dans l'image finale. La strategie consiste a compiler dans un premier stage et ne copier que les artefacts dans le stage runtime.

**Points a verifier** :

- Le stage runtime ne copie pas le dossier source, uniquement le build output.
- Aucune dependance de dev n'est presente dans l'image finale.
- Un utilisateur non-root est utilise en runtime.
- Le conteneur expose uniquement le port applicatif (3000).

### 2) Dockerfile multi-stage (modele generique)

Ce modele est adaptable a Node.js ou Python. Pour Nuxt, le build output est `.output`.

```dockerfile
# Stage 1: build
FROM node:20-alpine AS build
WORKDIR /app

# Installer les dependances
COPY package.json package-lock.json ./
RUN npm ci

# Copier le code source et construire
COPY . .
RUN npm run build

# Stage 2: runtime minimal
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copier uniquement les artefacts du build (pas de source)
# Pour Nuxt: .output
COPY --from=build /app/.output /app/.output

# Optionnel: copier un package.json minimal si necessaire
COPY --from=build /app/package.json /app/package.json

# Utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

**Adaptation Python** : remplacer l'etape build par `pip install --no-cache-dir` et copier uniquement les fichiers de build (wheel, dist) ou l'app packaged.

### 3) Nommage de l'image GHCR

Modele recommande :

- `ghcr.io/<owner>/<repo>:<tag>`
- Exemple : `ghcr.io/christopher973/nuxt-tp1:1.0.0`

### 4) Gestion du PAT (GitHub Personal Access Token)

**Creation** :

- Type : Classic ou Fine-grained.
- Scopes minimaux :
  - Build/Push local : `write:packages`, `read:packages`.
  - VPS : `read:packages` uniquement.

**Bonnes pratiques** :

- Stocker le PAT dans un gestionnaire de secrets (1Password, Bitwarden, etc.).
- Ne jamais le commiter ni l'ecrire en clair dans un fichier versionne.
- Preferer un PAT distinct pour le VPS (lecture seule).

## Partie 2 — Configuration VPS (Login/Pull/Run)

### 1) Pre-requis de securite

- Utilisateur systeme dedie au deploiement (pas `root`).
- Acces SSH durci (cle SSH, pas d'auth par mot de passe).
- Ports exposes : 80/443 uniquement; 3000 reste local.

### 2) Authentification GHCR (PAT)

- Configurer Docker pour authentifier l'utilisateur GHCR avec le PAT lecture seule.
- Eviter le stockage en clair : utiliser le credential helper Docker si possible.

### 3) Execution du conteneur

- Le conteneur doit etre demarre en liant le port interne 3000 au localhost du VPS.
- Les variables d'environnement Supabase doivent etre fournies par un fichier non versionne (ex. `/opt/nuxt-tp1/.env`).

Exemple de fichier `.env` (serveur) :

```env
SUPABASE_URL=https://database.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_XXXXXXXXXX
```

### 4) Verification de l'absence de code source

- Verifier qu'aucun dossier source (ex. `/app/app`, `/app/src`) n'est present dans l'image finale.
- Seuls les artefacts de build doivent exister (ex. `.output`).

## Partie 3 — Configuration Apache (Reverse Proxy/SSL)

### 1) VirtualHost HTTP (redirection HTTPS)

```apache
<VirtualHost *:80>
	ServerName todo.christopher-marie-angelique.fr
	Redirect permanent / https://todo.christopher-marie-angelique.fr/
</VirtualHost>
```

### 2) VirtualHost HTTPS (reverse proxy vers Docker)

```apache
<IfModule mod_ssl.c>
<VirtualHost *:443>
	ServerName todo.christopher-marie-angelique.fr

	ProxyPreserveHost On
	ProxyRequests Off

	# Reverse proxy vers le conteneur local
	ProxyPass / http://127.0.0.1:3000/
	ProxyPassReverse / http://127.0.0.1:3000/

	# WebSocket (optionnel, si utilise)
	RewriteEngine On
	RewriteCond %{HTTP:Upgrade} =websocket [NC]
	RewriteRule /(.*) ws://127.0.0.1:3000/$1 [P,L]

	SSLEngine on
	SSLCertificateFile /etc/letsencrypt/live/todo.christopher-marie-angelique.fr/fullchain.pem
	SSLCertificateKeyFile /etc/letsencrypt/live/todo.christopher-marie-angelique.fr/privkey.pem

	# Headers de securite minimaux
	Header always set X-Content-Type-Options "nosniff"
	Header always set X-Frame-Options "DENY"
	Header always set Referrer-Policy "strict-origin-when-cross-origin"
</VirtualHost>
</IfModule>
```

### 3) Certbot

- Generer ou renouveler le certificat pour `todo.christopher-marie-angelique.fr`.
- Verifier la presence des fichiers dans `/etc/letsencrypt/live/`.

## Controle final

- L'image est uniquement tiree depuis GHCR prive.
- Le code source n'existe pas sur le VPS.
- Le site est accessible en HTTPS via Apache, proxy vers `localhost:3000`.

## Note sur les commandes

Ce guide decrit les actions sans lister de commandes shell. Si vous souhaitez une version avec les commandes precises (build, login GHCR, pull, run, certbot), indiquez-le et je fournis une procedure operationnelle complete.
