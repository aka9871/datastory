# Guide de déploiement — marketingscience.fr/datastory

## Architecture de production

```
Navigateur client
       │
       ▼
  Nginx (HTTPS/443)
       │
       ├── /datastory/api/  ──►  Express API  (localhost:3001)
       │                              │
       │                         PostgreSQL  (localhost:5432)
       │                         Google Cloud Storage
       │
       └── /datastory/      ──►  Fichiers statiques
                                 (artifacts/datastory/dist/public/)
```

> Les autres applications sur `marketingscience.fr` ne sont pas affectées.

---

## Prérequis serveur

```bash
node -v       # 20+ requis (22 recommandé)
psql --version  # PostgreSQL 16 (déjà installé)
nginx -v

# Installer pnpm globalement
npm install -g pnpm

# Installer pm2 (gestionnaire de processus Node.js)
npm install -g pm2
```

---

## Étape 1 — Base de données PostgreSQL

```bash
sudo -u postgres psql

CREATE DATABASE datastorydb;
CREATE USER datastory_user WITH PASSWORD 'MotDePasseForte2026!';
GRANT ALL PRIVILEGES ON DATABASE datastorydb TO datastory_user;
\q
```

Vérifier la connexion :
```bash
psql postgresql://datastory_user:MotDePasseForte2026!@localhost:5432/datastorydb -c "SELECT 1;"
```

---

## Étape 2 — Cloner le projet

```bash
git clone https://github.com/VOTRE_COMPTE/VOTRE_REPO.git /var/www/sites/datastory
cd /var/www/sites/datastory

pnpm install --frozen-lockfile
```

---

## Étape 3 — Variables d'environnement

Créer `/var/www/sites/datastory/.env.production` :

```env
# ── Base de données ─────────────────────────────────────────────
DATABASE_URL=postgresql://datastory_user:MotDePasseForte2026!@localhost:5432/datastorydb

# ── Sécurité ────────────────────────────────────────────────────
# Générer avec : openssl rand -base64 64
JWT_SECRET=REMPLACER_PAR_UNE_CLE_ALEATOIRE_64_CARACTERES
SESSION_SECRET=REMPLACER_PAR_UNE_AUTRE_CLE_ALEATOIRE

# ── API ─────────────────────────────────────────────────────────
PORT=3001
NODE_ENV=production

# ── Google Cloud Storage ─────────────────────────────────────────
# Laisser vide si pas de stockage logo configuré
DEFAULT_OBJECT_STORAGE_BUCKET_ID=nom-de-votre-bucket-gcs
PRIVATE_OBJECT_DIR=private
PUBLIC_OBJECT_SEARCH_PATHS=public
```

Générer des clés aléatoires sécurisées :
```bash
openssl rand -base64 64  # pour JWT_SECRET
openssl rand -base64 64  # pour SESSION_SECRET
```

---

## Étape 4 — Initialiser la base de données

```bash
cd /var/www/sites/datastory

# Charger les variables d'environnement
export $(grep -v '^#' .env.production | xargs)

# Créer toutes les tables (schéma Drizzle)
pnpm --filter @workspace/db run push

# Créer le compte administrateur (ali.khedji@omc.com / Datastory2026!)
pnpm --filter @workspace/db run seed
```

---

## Étape 5 — Build de l'application

```bash
cd /var/www/sites/datastory

# ① Frontend React — doit absolument avoir BASE_PATH=/datastory/
BASE_PATH=/datastory/ pnpm --filter @workspace/datastory run build
# Output : artifacts/datastory/dist/public/

# ② API Express
pnpm --filter @workspace/api-server run build
# Output : artifacts/api-server/dist/index.mjs
```

Vérifier que les fichiers ont bien été générés :
```bash
ls artifacts/datastory/dist/public/index.html
ls artifacts/api-server/dist/index.mjs
```

---

## Étape 6 — Démarrer l'API avec pm2

```bash
cd /var/www/sites/datastory

pm2 start artifacts/api-server/dist/index.mjs \
  --name "datastory-api" \
  --env-file .env.production \
  --interpreter node

# Sauvegarder pour redémarrage automatique au reboot
pm2 save
pm2 startup   # copier-coller la commande affichée
```

Vérifier que l'API répond :
```bash
curl -s http://localhost:3001/api/healthz | python3 -m json.tool
# Attendu : { "status": "ok" }
```

Vérifier les logs pm2 en cas de problème :
```bash
pm2 logs datastory-api --lines 50
```

---

## Étape 7 — Configuration Nginx

Éditer votre fichier de configuration nginx (ex: `/etc/nginx/sites-available/marketingscience.fr`) et ajouter dans le bloc `server { server_name marketingscience.fr; ... }` :

```nginx
# ──────────────────────────────────────────────────────────────────────────
# DATASTORY — API
# IMPORTANT : ce bloc DOIT être AVANT le bloc location /datastory/
# ──────────────────────────────────────────────────────────────────────────
location /datastory/api/ {
    rewrite ^/datastory(/api/.*)$ $1 break;
    proxy_pass         http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Real-IP         $remote_addr;
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_read_timeout 60s;
    client_max_body_size 50m;
}

# ──────────────────────────────────────────────────────────────────────────
# DATASTORY — Frontend statique (React SPA)
# ──────────────────────────────────────────────────────────────────────────
location = /datastory {
    return 301 /datastory/;
}

location /datastory/ {
    alias /var/www/sites/datastory/artifacts/datastory/dist/public/;
    index index.html;
    try_files $uri $uri/ /datastory/index.html;

    # Cache long pour les assets hachés (JS/CSS/images)
    location ~* \.(js|css|png|jpg|svg|woff2|ico)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

Tester la configuration et recharger :
```bash
nginx -t && systemctl reload nginx
```

---

## Étape 8 — Vérification finale

```bash
# API accessible depuis l'extérieur
curl -s https://marketingscience.fr/datastory/api/healthz

# Page de connexion (doit retourner du HTML)
curl -s https://marketingscience.fr/datastory/ | grep "<title>"
```

Ouvrir dans le navigateur : `https://marketingscience.fr/datastory/`
Se connecter avec `ali.khedji@omc.com` / `Datastory2026!`

---

## Mises à jour (déploiement continu)

```bash
cd /var/www/sites/datastory

# 1. Récupérer les changements
git pull origin main

# 2. Mettre à jour les dépendances (si package.json a changé)
pnpm install --frozen-lockfile

# 3. Appliquer les éventuelles nouvelles migrations
export $(grep -v '^#' .env.production | xargs)
pnpm --filter @workspace/db run push

# 4. Rebuild
BASE_PATH=/datastory/ pnpm --filter @workspace/datastory run build
pnpm --filter @workspace/api-server run build

# 5. Redémarrer l'API
pm2 restart datastory-api
```

---

## Commandes utiles pm2

```bash
pm2 status                    # état de tous les processus
pm2 logs datastory-api        # logs en temps réel
pm2 logs datastory-api --lines 100  # dernières 100 lignes
pm2 restart datastory-api     # redémarrer l'API
pm2 stop datastory-api        # arrêter l'API
pm2 monit                     # monitoring interactif
```

---

## Résolution de problèmes courants

| Symptôme | Vérification |
|---|---|
| Page blanche | `BASE_PATH=/datastory/` oublié au build |
| Erreur 502 Bad Gateway | API pm2 non démarrée — `pm2 status` |
| Erreur de connexion (401) | `JWT_SECRET` différent entre build et runtime |
| Upload logo échoue | Variables `DEFAULT_OBJECT_STORAGE_BUCKET_ID` manquantes |
| Tables inexistantes | `pnpm --filter @workspace/db run push` non exécuté |

---

## Résumé des URLs

| Ressource | URL |
|---|---|
| Application | `https://marketingscience.fr/datastory/` |
| Connexion | `https://marketingscience.fr/datastory/login` |
| Administration | `https://marketingscience.fr/datastory/admin` |
| API (santé) | `https://marketingscience.fr/datastory/api/healthz` |
| API (auth) | `https://marketingscience.fr/datastory/api/auth/me` |
