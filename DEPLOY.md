# Déploiement Datastory — marketingscience.fr/datastory

## Architecture de production

```
Client Browser
      │
      ▼
nginx (port 80)
      │
      ├── /datastory/          →  fichiers statiques (dist/public/)
      ├── /datastory/api/      →  Express API (localhost:3001)
      └── /api/ + /audi/...    →  apps existantes (inchangées)
```

---

## 1. Prérequis serveur

```bash
# Node.js 22+
node -v

# pnpm
npm install -g pnpm@latest

# pm2 (gestionnaire de processus)
npm install -g pm2

# PostgreSQL 16 (déjà installé selon config)
psql --version
```

---

## 2. Clone & installation

```bash
# Cloner le projet
git clone https://github.com/TON_COMPTE/TON_REPO.git /var/www/sites/datastory
cd /var/www/sites/datastory

# Installer les dépendances
pnpm install --frozen-lockfile
```

---

## 3. Variables d'environnement

Créer le fichier `/var/www/sites/datastory/.env.production` :

```env
# Base de données PostgreSQL
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/datastory

# JWT — IMPORTANT : utiliser une clé longue et aléatoire en prod
JWT_SECRET=CHANGE_ME_LONG_RANDOM_STRING_64_CHARS

# Sessions Express
SESSION_SECRET=CHANGE_ME_ANOTHER_RANDOM_STRING

# Port de l'API (ne pas utiliser 8080 réservé à d'autres apps)
PORT=3001

# Object Storage (Google Cloud Storage)
DEFAULT_OBJECT_STORAGE_BUCKET_ID=ton-bucket-gcs
PRIVATE_OBJECT_DIR=private
PUBLIC_OBJECT_SEARCH_PATHS=public
```

---

## 4. Build de l'application

```bash
cd /var/www/sites/datastory

# Build du frontend React (output: artifacts/datastory/dist/public/)
BASE_PATH=/datastory/ pnpm --filter @workspace/datastory run build

# Build de l'API Express (output: artifacts/api-server/dist/)
pnpm --filter @workspace/api-server run build
```

---

## 5. Base de données

```bash
# Créer la base et appliquer le schéma
cd /var/www/sites/datastory
export $(cat .env.production | xargs)

# Appliquer le schéma Drizzle
pnpm --filter @workspace/api-server run db:push

# Seed initial (crée l'admin ali.khedji@omc.com / Datastory2026!)
pnpm --filter @workspace/api-server run db:seed
```

---

## 6. Démarrage de l'API avec pm2

```bash
cd /var/www/sites/datastory

# Démarrer l'API sur le port 3001
pm2 start artifacts/api-server/dist/index.mjs \
  --name "datastory-api" \
  --env-file .env.production

# Sauvegarder pour redémarrage automatique
pm2 save
pm2 startup
```

Vérifier que l'API répond :
```bash
curl http://localhost:3001/api/health
# Expected: { "status": "ok" }
```

---

## 7. Configuration Nginx

Ajouter dans le `server { server_name marketingscience.fr; }` existant :

```nginx
# ─────────────────────────────────────────────────────────────────
# DATASTORY — API (AVANT le bloc static pour éviter une collision)
# ─────────────────────────────────────────────────────────────────
location /datastory/api/ {
    rewrite ^/datastory(/api/.*)$ $1 break;
    proxy_pass         http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Real-IP         $remote_addr;
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_read_timeout 60s;
    client_max_body_size 50m;
}

# ─────────────────────────────────────────────────────────────────
# DATASTORY — Frontend statique
# ─────────────────────────────────────────────────────────────────
location = /datastory {
    return 301 /datastory/;
}

location /datastory/ {
    alias /var/www/sites/datastory/artifacts/datastory/dist/public/;
    index index.html;
    try_files $uri $uri/ /datastory/index.html;
}
```

Tester et recharger :
```bash
nginx -t && systemctl reload nginx
```

---

## 8. Pousser sur GitHub

```bash
cd /var/www/sites/datastory  # ou depuis votre machine locale

# Ajouter le remote GitHub
git remote add origin https://github.com/TON_COMPTE/TON_REPO.git

# Premier push
git push -u origin main
```

---

## 9. Mises à jour

```bash
cd /var/www/sites/datastory
git pull origin main
pnpm install --frozen-lockfile

# Rebuild
BASE_PATH=/datastory/ pnpm --filter @workspace/datastory run build
pnpm --filter @workspace/api-server run build

# Redémarrer l'API
pm2 restart datastory-api
```

---

## Résumé des URLs

| Ressource | URL |
|---|---|
| Application | `https://marketingscience.fr/datastory/` |
| Connexion | `https://marketingscience.fr/datastory/login` |
| Administration | `https://marketingscience.fr/datastory/admin` |
| API (santé) | `https://marketingscience.fr/datastory/api/health` |
