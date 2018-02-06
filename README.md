# server side react
This is a WORK IN PROGRESS

### Du client au serveur

L'idee est de partir d'une application classique et simple, qui ne fait le rendu que cote front, pour l ameliorer au fur et a mesure.
Les differentes etapes d amelioration sont:
- faire un rendu cote serveur
- mettre en place du routing avec react-router
- ajouter redux a la stack et transferer le store du back au front
- initialiser le store de facon asynchrone cote serveur
- creer une redirection

### Application de base

Dans la version client-side only, l application est un simple composant, qui affiche le nombre de fois que l'on clique sur le bouton.

(gist counter)
C'est un composant classique qui gere son compteur de clics dans son state.
(gist webpack)
Rien d'extraordinaire non plus dans le fichier de conf webpack, on retrouve simplement la generation du fichier index.html, l appel a babel pour transpiler l es6 et le jsx en es5. Le dev-server est utilise pour le rechargement a chaud de l'appli lors de modification du code.

### Server side rendering

Afin de produire un rendu cote back il faut configurer et lancer un serveur web dans un process node.
La premiere etape est donc de creer un fichier pour lancer express, afin qu il ecoute les requetes http, et serve le rendu html de l application.
(code server.js)
Rien de particulier a part l'import de la librairie serve-favicon qui permet de servir le fichier public/fav.ico en tant que facvicon.

La partie importante est l'utilisation de la methode renderToString de react-dom qui permet de generer dans une string, le code html du composant passe en parametre, en general le composant racine de l application.
Une fois le code html de l'application genere, il faut l'inclure dans une page html, avec les traditionnelles balises <html>, <head>, <body>, etc... 
(code server.js)
Et bien sur une balise pour charger le code JS de notre application, afin qu'elle soit presente sur le navigateur pour assurer un rendu dynamique (revenir au cas classique du rendering cote navigateur.)
(code html.js)
Pour il suffit de lancer l application (npm run s ou yarn s) et lancer un navigateur sur localhost:3000 pour voir le resultat. En affichant la source de la page, on constate biem que le html genere cote serveur est bien present. \o/

