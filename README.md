# VehicleGuard - Systeme de Gestion des Vols de Vehicules

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?style=for-the-badge&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-6.19.0-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql)
![BetterAuth](https://img.shields.io/badge/BetterAuth-1.4.6-6366F1?style=for-the-badge)

**Application web complete pour la gestion et le suivi des cas de vol de vehicules**

</div>

---

## Table des Matieres

- [A Propos](#a-propos)
- [Technologies Utilisees](#technologies-utilisees)
- [Pourquoi Ces Technologies](#pourquoi-ces-technologies)
- [Fonctionnalites](#fonctionnalites)
- [Credentials de Connexion](#credentials-de-connexion)
- [Installation](#installation)
- [Structure du Projet](#structure-du-projet)

---

## A Propos

VehicleGuard est une application web moderne concue pour faciliter la gestion des cas de vol de vehicules. Elle permet aux utilisateurs d'enregistrer leurs vehicules, de signaler des vols et de suivre l'evolution des enquetes. Les administrateurs peuvent gerer les cas, valider les utilisateurs et superviser l'ensemble du systeme.

> **Note Importante** : Cette application a ete developpee avec l'assistance de l'intelligence artificielle (IA). Les donnees de demonstration et les identifiants de connexion ont ete generes par IA a des fins de test.

---

## Technologies Utilisees

| Technologie | Version | Role |
|-------------|---------|------|
| **Next.js** | 16.0.7 | Framework React full-stack |
| **Prisma** | 6.19.0 | ORM pour la base de donnees |
| **Neon** | - | Base de donnees PostgreSQL serverless |
| **BetterAuth** | 1.4.6 | Systeme d'authentification |
| **TailwindCSS** | 4.1.9 | Framework CSS utilitaire |
| **React** | 19.2.0 | Bibliotheque UI |

---

## Pourquoi Ces Technologies

### Next.js 16

**Raisons du choix :**

1. **Rendu Hybride** : Next.js offre le Server-Side Rendering (SSR), le Static Site Generation (SSG) et le rendu cote client, permettant d'optimiser les performances selon les besoins de chaque page.

2. **App Router** : La nouvelle architecture App Router simplifie la gestion des routes et permet une meilleure organisation du code avec les Server Components.

3. **API Routes Integrees** : Pas besoin d'un serveur backend separe - les API routes permettent de creer des endpoints directement dans l'application.

4. **Performance Optimisee** : Optimisation automatique des images, lazy loading, et code splitting pour des temps de chargement ultra-rapides.

5. **Ecosysteme React** : Acces a l'immense ecosysteme de composants et bibliotheques React.

---

### Prisma ORM

**Raisons du choix :**

1. **Type Safety** : Prisma genere automatiquement des types TypeScript a partir du schema de base de donnees, eliminant les erreurs de typage.

2. **Migrations Automatiques** : Gestion simple et securisee des migrations de base de donnees avec `prisma migrate`.

3. **Prisma Studio** : Interface visuelle pour explorer et modifier les donnees directement.

4. **Requetes Intuitives** : API de requetes fluide et intuitive qui rend le code plus lisible et maintenable.

5. **Relations Simplifiees** : Gestion automatique des relations entre tables avec une syntaxe declarative.

```typescript
// Exemple de requete Prisma
const vehicleWithTheftCases = await prisma.vehicle.findUnique({
  where: { id: vehicleId },
  include: { theftCases: true }
})
```

---

### Neon (PostgreSQL Serverless)

**Raisons du choix :**

1. **Serverless** : Pas de serveur a gerer - Neon s'occupe de toute l'infrastructure. Parfait pour les projets modernes.

2. **Scalabilite Automatique** : La base de donnees s'adapte automatiquement a la charge, avec mise en veille automatique pour reduire les couts.

3. **Branching** : Possibilite de creer des branches de base de donnees pour les environnements de developpement et de test.

4. **PostgreSQL Complet** : Acces a toutes les fonctionnalites avancees de PostgreSQL (JSON, full-text search, etc.).

5. **Integration Parfaite** : S'integre parfaitement avec Prisma et les plateformes de deploiement comme Vercel.

6. **Tier Gratuit Genereux** : Le plan gratuit offre suffisamment de ressources pour le developpement et les petits projets.

---

### BetterAuth

**Raisons du choix :**

1. **Securite Moderne** : Implementation des meilleures pratiques de securite pour l'authentification (hachage bcrypt, tokens securises).

2. **Session Management** : Gestion robuste des sessions avec expiration configurable (24 heures dans notre cas).

3. **Flexibilite** : Support de multiples strategies d'authentification (email/password, OAuth, etc.).

4. **Integration Prisma** : Adaptateur Prisma natif pour une integration transparente avec notre base de donnees.

5. **TypeScript First** : Entierement type pour une meilleure experience developpeur.

6. **Leger et Performant** : Plus leger que NextAuth tout en offrant les fonctionnalites essentielles.

---

## Fonctionnalites

### Pour les Utilisateurs
- Inscription et connexion securisees
- Enregistrement de vehicules
- Declaration de vol avec details complets
- Suivi en temps reel des cas
- Gestion du profil personnel

### Pour les Administrateurs
- Tableau de bord avec statistiques
- Gestion des utilisateurs (CRUD)
- Validation des comptes utilisateurs
- Gestion des cas de vol
- Historique des activites

---

## Credentials de Connexion

> **IMPORTANT** : Ces identifiants ont ete generes par intelligence artificielle (IA) a des fins de demonstration et de test uniquement. Ils ne doivent pas etre utilises en production.

### Compte Administrateur

| Champ | Valeur |
|-------|--------|
| **Email** | `admin@vehicleguard.cm` |
| **Mot de passe** | `admin123456` |
| **Role** | ADMIN |

### Comptes Utilisateurs de Test

Tous les utilisateurs ont le mot de passe : `user123456`

| Email |
|-------|
| `pierre.essomba@company.cm` |
| `grace.mbarga@company.cm` |
| `emmanuel.tchouta@company.cm` |
| `jean.fotso@company.cm` |
| `beatrice.kamga@company.cm` |
| `amina.manga@company.cm` |
| `samuel.onana@company.cm` |
| `rachel.nkengue@company.cm` |
| `marie.ndongo@company.cm` |

> **Note** : Tous les comptes utilisateurs necessitent l'approbation d'un administrateur avant de pouvoir acceder a l'application.

---

## Installation

### Prerequis

- Node.js 18+ 
- pnpm (recommande) ou npm
- Compte Neon (pour la base de donnees)

### Etapes d'Installation

1. **Cloner le depot**
```bash
git clone https://github.com/Silent-bat/vehicleguard.git
cd vehicleguard
```

2. **Installer les dependances**
```bash
pnpm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Remplir le fichier `.env` :
```env
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="votre-secret-securise"
BETTER_AUTH_URL="http://localhost:3000"
```

4. **Initialiser la base de donnees**
```bash
pnpm prisma generate
pnpm prisma db push
```

5. **Peupler la base de donnees (optionnel)**
```bash
pnpm prisma db seed
```

6. **Lancer l'application**
```bash
pnpm dev
```

L'application sera accessible sur `http://localhost:3000`

---

## Structure du Projet

```
vehicleguard/
|-- app/                    # Routes et pages Next.js (App Router)
|   |-- api/               # API Routes
|   |-- dashboard/         # Pages du tableau de bord
|   |-- login/            # Page de connexion
|   |-- register/         # Page d'inscription
|-- components/            # Composants React reutilisables
|   |-- ui/               # Composants UI (shadcn/ui)
|-- lib/                   # Utilitaires et configurations
|   |-- auth.ts           # Configuration BetterAuth
|   |-- prisma.ts         # Client Prisma
|   |-- utils.ts          # Fonctions utilitaires
|-- prisma/               # Schema et migrations Prisma
|   |-- schema.prisma     # Definition du modele de donnees
|-- public/               # Fichiers statiques
|-- styles/               # Styles globaux
```

---

## Note sur le Developpement IA

Cette application a ete developpee avec l'assistance d'outils d'intelligence artificielle. Cela inclut :

- **Donnees de test** : Generation des donnees de demonstration
- **Identifiants** : Creation des comptes de test

L'IA a ete utilisee comme outil d'assistance pour accelerer le developpement tout en maintenant les bonnes pratiques de programmation.

---

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de details.
