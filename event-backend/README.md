# GestionEvent — Backend (alpha)

API REST Node.js / Express / MySQL pour l'application GestionEvent.

## Installation

```bash
npm install
cp .env.example .env   # puis renseigne DB_USER / DB_PASSWORD
mysql -u root -p < schema.sql
npm run dev
```

Le serveur démarre sur `http://localhost:4000`.

## Endpoints

| Méthode | Route | Description |
|---|---|---|
| POST | /api/auth/register | Créer un compte (pas d'écran dédié côté frontend pour l'instant) |
| POST | /api/auth/login | Vérifie email/mot de passe |
| GET | /api/events | Liste des événements |
| GET | /api/events/:id | Détail d'un événement + intervenants |
| POST | /api/events | Créer un événement (+ intervenants) |
| PUT | /api/events/:id | Modifier un événement |
| DELETE | /api/events/:id | Supprimer un événement |
| GET | /api/participants | Liste des participants |
| POST | /api/participants | Inscrire un participant |
| DELETE | /api/participants | Suppression multiple `{ ids: [...] }` |
| GET | /api/speakers | Annuaire des intervenants |
| POST | /api/speakers | Ajouter un intervenant |
| PUT | /api/speakers/:id | Modifier un intervenant |
| DELETE | /api/speakers/:id | Supprimer un intervenant |

## Ce qui a été repris tel quel du frontend, et ce qui ne l'a pas été

Le frontend actuel (`GestionEvent/src`) ne parle à aucun backend : `store.js`
lit/écrit dans `localStorage`, et `Login.jsx` accepte n'importe quel
email/mot de passe valides après un `setTimeout` de 800ms. Ce n'est pas un
détail — ça veut dire qu'il n'y a aujourd'hui aucune notion réelle
d'utilisateur, d'événement partagé entre deux personnes, ni de persistance
hors du navigateur. L'API ci-dessus remplace ça, mais **le frontend doit être
branché dessus** (remplacer les appels à `store.js` par des `fetch()` vers
`/api/...`) — ce n'est pas fait ici, seul le backend est livré.

Trois points de conception à connaître avant de brancher le frontend :

1. **`registered` n'est plus un champ stocké mais calculé** (`COUNT` sur la
   table `participants`). Dans le frontend actuel c'est un champ qu'on
   pourrait modifier à la main sur l'événement — mauvaise idée, ça peut
   diverger du nombre réel d'inscrits. Le backend renvoie toujours le vrai
   compte ; ne réintroduis pas un champ `registered` éditable côté client.

2. **`Participants.jsx` envoie `event` comme texte libre** (nom de
   l'événement), pas comme identifiant. L'API attend `eventId` (l'id
   numérique). Il faudra soit changer le formulaire pour proposer un
   `<select>` d'événements existants, soit résoudre le nom vers un id côté
   frontend avant l'envoi — sinon les inscriptions ne pourront pas être
   rattachées correctement à un événement.

3. **Les intervenants existent en double dans le modèle actuel** : ceux
   saisis à la création d'un événement (`event_speakers`, propres à
   l'événement) et l'annuaire indépendant de la page Speakers
   (`speakers`). Le frontend ne les relie déjà pas entre eux — j'ai gardé
   cette séparation plutôt que de la corriger silencieusement, mais c'est
   une incohérence de modèle de données à trancher avant d'aller plus loin
   (soit on fusionne, soit on assume que ce sont deux choses différentes et
   on le documente).

## Sur l'authentification "minimale"

Tu as choisi de ne pas faire de session/JWT pour l'instant, ce qui est
raisonnable pour un alpha. En revanche, stocker les mots de passe en clair
n'a jamais de justification, même temporaire — `bcryptjs` ne coûte rien à
utiliser (une ligne à l'inscription, une ligne à la connexion) donc je l'ai
gardé. Ce que tu n'as pas est la persistance de la connexion (pas de
cookie/token) : chaque appel à une route protégée devra, pour l'instant,
être fait "en confiance" côté frontend — ce sera la première chose à revoir
avant une vraie mise en production.
