# Vitrail & compagnie

Site vitrine Next.js de Valérie Le Bihan avec administration intégrée.

## Accès à l’administration

En local, ouvrir [http://localhost:3000/admin](http://localhost:3000/admin). Une fois le site mis en ligne, ouvrir `https://votre-domaine/admin`. Deux mots de passe distincts sont prévus : `ADMIN_PASSWORD` pour le propriétaire du site et `ADMIN_CLIENT_PASSWORD` pour Valérie. Ils donnent accès aux mêmes rubriques. Ne publiez pas ces valeurs dans le code ni dans un document partagé.

Dans l’espace atelier, « Profil » regroupe la présentation, les coordonnées, les réseaux sociaux et les mentions légales. « Textes des pages » permet de modifier les titres, descriptions et métadonnées de recherche. « Images du site » permet de remplacer les visuels de présentation. Les réalisations, prestations, événements, questions fréquentes et avis se gèrent dans leurs propres onglets. Les nouvelles fiches commencent en brouillon : il faut les compléter, cocher « Publier », puis choisir « Enregistrer les modifications ». L’ordre des fiches se change avec les flèches. Les photos importées acceptent JPEG, PNG ou WebP jusqu’à 8 Mo.

Les avis clients doivent être réels et publiés avec l’accord de leur auteur. Le lien Google se change dans « Profil » ; le QR code se met à jour automatiquement si ce lien change. Les demandes du formulaire de contact se consultent dans « Messages ». Les demandes de commande se consultent dans « Commandes » : Valérie les confirme manuellement, puis contacte le client pour le paiement. Le site n’envoie pas de notification par e-mail ; l’atelier doit consulter l’administration régulièrement tant qu’une notification n’est pas mise en place.

## Démarrage local

Installer les dépendances avec `npm install`, puis lancer `npm run dev`. Copier `.env.example` vers `.env.local` et définir les trois secrets d’accès. Le fichier `.env.local` du poste de travail contient déjà les accès locaux et est ignoré par Git. Ouvrir [http://localhost:3000](http://localhost:3000).

## Mise en ligne et conservation des données

Utiliser un hébergement Next.js avec **serveur Node.js et disque persistant**. Configurer `SITE_DATA_DIR` vers un dossier inscriptible, persistant et sauvegardé : il contient `content.json`, `messages.json`, `orders.json` et les photos envoyées depuis l’administration. Configurer également `ADMIN_PASSWORD`, `ADMIN_CLIENT_PASSWORD`, `ADMIN_SESSION_SECRET` et `NEXT_PUBLIC_SITE_URL` sur l’hébergement, puis activer HTTPS. Le fichier `data/content.json` inclus dans le projet fournit le contenu initial. Un hébergement à système de fichiers éphémère ne convient pas à cette administration sans adaptation du stockage.

Avant l’ouverture publique, confirmer l’adresse professionnelle et renseigner l’hébergeur dans « Profil ». Les événements restent masqués jusqu’à leur publication.
