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
On remarque simplement que pour le front le point d'entrée est le fichier client/index.js.

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

Il faut ensuite configurer webpack pour qu'il génère également un fichier des sources pour le backend. Le point d'entrée est alors server/server.js. On notera que l'on peut exclure du bundle les différentes librairies utilisées, étant donnée qu'elles sont dans le répertoire /node_modules.
Le cleanWebpackPlugin permet de supprimer le répertoire dist avant chaque nouveau build.
Les sources sont transpilées de la même façon que pour le front, d'où l'extraction de certaines propriétés dans un objet 'common'.
(code webpack.config.js)

Pour tester l'application, il suffit de lancer 'npm run s' ou 'yarn s' et ouvrir un navigateur sur localhost:3000. En affichant la source de la page, on constate biem que le html genere cote serveur est bien present. \o/
Pour le mode client-side seulement, on peut lancer 'npm run start:dev' ou 'yarn start:dev'.
### Routing

Comme on a pu le voir, générer le rendu html des composants coté serveur est plutôt simple. La difficulté vient en fait de la gestion du routing (urls) et des chargements asynchrones des données. Dans ce paragraphe nous allons nous voir le routing.

Dans l'application nous allons donc ajouter un menu avec 3 liens, chacun des liens va charger un des composants. L'url doit refléter le composant actuellement afficher.
Bien sûr, quand on demandera le rendu coté serveur, il faudra que le bon composant soit généré en html afin que le navigateur l'affiche, le temps que l'application react soit chargée. 
Nous utilisons react-router de façon simpliste, avec 2 nouveaux composants ne faisant rien d'extraordinaire.
(code app.js)
Si le code source des composants restera le même pour le front et pour le back, il y a cependant une différence au niveau du router à utiliser.
Pour le front il faudra utiliser le BrowserRouter, et pour le back le StaticRouter.
Nous allons profiter que pour le front ce soit le fichier client/index.js qui charge l'application et pour le front le fichier server/server.js (voir la conf webpack) pour encapsuler dans chacun de ces fichiers notre <App> qui elle est universelle (front et back).
(code webpack.config.js)
(code index.js)
C'est donc surtout dans la génération de l'application coté back que nous allons avoir du travail. Tout d'abord il faut passer 2 paramètres au 'StaticRouter': l'url courante (location) et un objet qui permet de transporter des informations (context).
Dans un premier temps, nous n'utiliserons pas le contexte, un objet vide suffira. L'url courante est simplement récupérée dans la requête envoyée à express.
(code server.js)

On peut relancer l'application afin de controler que tout fonctionne.

### Redux

Beaucoup d'applications utilisent redux pour stocker les données de l'application.
Que ce soit coté back ou coté front, la meme méthode 'createStore' est appelée. Dans les 2 cas, il faudra passer l'objet qui constitue les données du store.
L'idée intéressante est de ne calculer cet état initial du store qu'une seule fois (coté back) et de passer cet état du back au front.

(code html.js)

Une fois l'état du store  calculé, il est très simple de le serialiser en json dans le fichier index.html servi au client. Celui ci n'aura plus qu'à relire le json pour le passer au 'createStore()';

(code client/index.js)

### Routing, Redux et asynchronisme

Dans une véritable application SPA, on fera du routing et du redux, comme on l'a vu. 
L'initialisation du store nécessite souvent des chargements asynchrones (appels REST, base de données, ...), alors que la méthode renderToString est synchrone.
Il va donc falloir attendre le retour des appels asynchrones avant d'appeler 'renderToString'.

C'est la que plusieurs stratégies sont possibles. 
Aucune n'est parfaite et il faudra surtout étudier sur quels parametres on veut etre le plus performant: premier affichage, utilisation de l'application, complexité du code, ...
Chaque application est unique et n'a pas à charger les memes volumes de données pour chaque page, il faut donc adapter la stratégie à mettre en place à chaque fois.
Par exemple faut il charger uniquement les données de la page, ou est-il préférable de charger l'ensemble du store quelle que soit la page demandée ?
La première solution semble évidente, mais elle est aussi plus complexe à mettre en place. La 2ème solution permet de n'écrire la méthode de chargement du store initial qu'une seule fois. On préfèrera cette méthode pour la simplicité du code.
 
Si l'on veut ne charger que les données nécessaires à la page (la route) demandée, il va falloir décrire pour chaque route une fonction de chargement des données.
Là où l'on avait avec react-router v3 une gestion centralisée des routes, ce n'est plus le cas avec la V4. Le projet react-router-config propose donc de décrire les routes dans un fichier, avec pour chacune d entre elles, une méthode spécifique à appeler, par exemple pour initialiser les données.

Je ne suis pas convaincu par cette façon de faire qui nécessite de maintenir la gestion des routes à 2 endroits différents, sans garantie (à part avec des nouveaux tests) que les 2 descriptions de route sont synchronisées.
Même si ce n'est pas non plus parfait, je préfère définir les routes dans le fichier server.js ...