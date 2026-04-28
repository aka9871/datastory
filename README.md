# Datastory — Portail Client BBDO Paris

Portail dashboard client premium développé pour BBDO Paris. Permet à chaque client d'accéder à ses dashboards Looker Studio dans un espace sécurisé et brandé.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| Backend | Express 5 + TypeScript |
| Base de données | PostgreSQL 16 + Drizzle ORM |
| Authentification | JWT (bcrypt) — email/mot de passe |
| Stockage fichiers | Google Cloud Storage |
| Déploiement | Nginx + pm2 |

---

## Architecture du projet

```
datastory/
├── artifacts/
│   ├── api-server/          # API Express (port 8080 dev / 3001 prod)
│   │   └── src/
│   │       ├── routes/      # auth, companies, users, dashboards, storage
│   │       └── app.ts
│   └── datastory/           # Frontend React+Vite (port 24723 dev)
│       └── src/
│           ├── pages/
│           │   ├── login.tsx
│           │   ├── admin/   # Companies, Users, Dashboards (admin only)
│           │   └── dashboards/  # Viewer dashboards
│           ├── hooks/       # useAuth.tsx
│           └── lib/         # api-url.ts, api-client
└── lib/
    ├── db/                  # Schéma Drizzle + seed
    │   └── src/
    │       ├── schema/      # User, Company, Franchise, Dashboard
    │       └── seed.ts      # Crée l'admin initial
    ├── api-client-react/    # Client API typesafe (React Query)
    └── api-zod/             # Schémas de validation partagés
```

---

## Modèle de données

```
Company (Annonceur)
  └── Franchise (filiale optionnelle)
  └── Dashboard (lien Looker Studio)
  └── User → rôle : admin | brand_admin | viewer
```

**3 rôles :**
- `admin` — accès total (gestion companies, users, dashboards)
- `brand_admin` — gestion de sa company uniquement
- `viewer` — accès en lecture aux dashboards de sa company

---

## Compte administrateur par défaut

```
Email    : ali.khedji@omc.com
Password : Datastory2026!
```

---

## Développement local (Replit)

Les serveurs démarrent automatiquement. L'application est accessible sur `/datastory/`.

```bash
# Installer les dépendances
pnpm install

# Appliquer le schéma en base
pnpm --filter @workspace/db run push

# Créer l'admin initial
pnpm --filter @workspace/db run seed
```

Variables d'environnement disponibles via les secrets Replit :
- `DATABASE_URL`
- `SESSION_SECRET`
- `DEFAULT_OBJECT_STORAGE_BUCKET_ID`

---

## Déploiement production

Voir [DEPLOY.md](./DEPLOY.md) pour le guide complet de déploiement sur `marketingscience.fr/datastory`.

---

## URLs de production

| Page | URL |
|---|---|
| Application | `https://marketingscience.fr/datastory/` |
| Connexion | `https://marketingscience.fr/datastory/login` |
| Administration | `https://marketingscience.fr/datastory/admin` |
| API santé | `https://marketingscience.fr/datastory/api/healthz` |
