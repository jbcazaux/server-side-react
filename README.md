# Server side react

### Du client au serveur

L'idée est de partir d'une application classique et simple, qui ne fait le rendu que cote front, pour l'améliorer au fur et à mesure.
Les différentes étapes d'amélioration sont:
- faire un rendu coté serveur
- mettre en place du routing avec react-router
- ajouter redux a la stack et transférer le store du back au front
- initialiser le store de facon asynchrone coté serveur
- créer une redirection

### Application de base

Dans la version client-side only, l'application est un simple composant, qui affiche le nombre de fois que l'on clique sur le bouton.
```javascript
import React from 'react';

export default class Counter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {count: 0};
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(prevState => ({count: prevState.count + 1}));
    }

    render() {
        return <div>
            <button onClick={this.handleClick}>Press me</button>
            <div>compteur: {this.state.count}</div>
        </div>;
    }
}
```
C'est un composant classique qui gère son compteur de clics dans son state.

```javacript
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
        entry: {
            client: './src/client/index.js'
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js', // => client.js
            publicPath: '/'
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: `'development'` // pour l'article on restera en mode dev
                }
            }),
            new HtmlWebPackPlugin({ // Génération du fichier index.html
                template: './src/client/index.html',
                filename: './index.html'
            })
        ],
        resolve: {extensions: ['.js']},
        module: {
            loaders: [
            {
                test: /\.js$/, // transpilation de tous les fichiers *.js
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ],
        },
        devtool: 'source-map', // utile pour le debugging
        devServer: { // permet d'avoir un serveur web local de test
            contentBase: path.resolve(__dirname, 'dist'),
            publicPath: '/',
            open: true,
            historyApiFallback: true
        },
    };
```
Rien d'extraordinaire non plus dans le fichier de conf webpack, 
on retrouve simplement la génération du fichier index.html, l'appel à babel pour transpiler l'es6 et le jsx en es5. Le dev-server est utilisé pour le rechargement à chaud de l'appli lors de modification du code dans l'IDE.
On remarquera que pour le front le point d'entrée est le fichier *client/index.js*.

### Server side rendering

Afin de produire un rendu coté back il faut configurer et lancer un serveur web dans un process node.
La première étape est donc de créer un fichier pour lancer *express*, afin qu'il écoute les requêtes http, et serve le rendu html del'application.

```javacript
import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import Html from './html';
import Counter from '../app/counter';

const server = express();
const favicon = require('serve-favicon');

server.use(favicon('./public/fav.ico')); // une magnifique favicon :)
server.use('/public', express.static('dist')); // les resources statiques seront chargées depuis ce répertoire

server.get('/', (req, res) => { // on matche uniquement l'url racine
    const body = renderToString(<Counter/>); // la méthode renderToString est la clé du SSR
    const title = 'Server Side React';

    const app = Html({
        body,
        title
    });
    res.status(200).send(app);
});

const port = 3000;
server.listen(port);
console.log(`Serving at http://localhost:${port}`);
```
L'import de la librairie serve-favicon permet de servir le fichier public/fav.ico en tant que favicon.

La partie importante est l'utilisation de la methode **renderToString** de react-dom qui permet de générer dans une string, le code html du composant passé en paramètre. En général, c'est le composant racine de l'application.
Une fois le code html de l'application généré, il faut l'inclure dans une page html, avec les traditionnelles balises &lt;html&gt;, &lt;head&gt;, &lt;body&gt;, etc... Et bien sûr une balise pour charger le code JS de notre application, afin qu'elle soit présente sur le navigateur pour assurer un rendu dynamique (revenir au cas classique du rendering coté navigateur.)
```javascript
const Html = ({ body, title }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>${title}</title>
    </head>
    <body>
      <div id="root">${body}</div>
      <script src="/public/client.js"></script>
    </body>
  </html>
`;

export default Html;
```

Il faut ensuite configurer webpack pour qu'il génère également un fichier des sources pour le backend. Le point d'entrée est alors server/server.js. On notera que l'on peut exclure du bundle les différentes librairies utilisées, étant donné qu'elles sont dans le répertoire /node_modules.

Le cleanWebpackPlugin permet de supprimer le répertoire dist avant chaque nouveau build.
Les sources sont transpilées de la même façon que pour le front, d'où l'extraction de certaines propriétés dans un objet 'common'.
```javascript
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

const common = { // la configurqtion commune entre le back et le front
    nodeEnv: new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: `'development'`
        }
    }),
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    loaders: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }
    ],
    resolve: {extensions: ['.js']}
};

module.exports = [
    {
        // client side rendering
        target: 'web',
        entry: {
            client: './src/client/index.js'
        },
        output: {
            path: common.path,
            filename: '[name].js',
            publicPath: common.publicPath
        },
        plugins: [
            common.nodeEnv,
            new HtmlWebPackPlugin({
                template: './src/client/index.html',
                filename: './index.html'
            })
        ],
        resolve: common.resolve,
        module: {
            loaders: common.loaders
        },
        devtool: 'source-map',
        devServer: {
            contentBase: common.path,
            publicPath: common.publicPath,
            open: true,
            historyApiFallback: true
        },
    },
    {
        // server side rendering
        target: 'node',
        entry: {
            server: './src/server/server.js' // => server.js
        },
        output: {
            path: common.path,
            filename: '[name].js',
            publicPath: common.publicPath,
            libraryTarget: 'commonjs2',
        },
        externals: [nodeExternals()],
        plugins: [
            common.nodeEnv,
            new CleanWebpackPlugin(['dist'], {verbose: true}), // on supprime le répertoire de destination avant de regénérer les bundles
        ],
        resolve: common.resolve,
        module: {
            loaders: common.loaders
        }
    }
];
```
Pour tester l'application, il suffit de lancer 'npm run s' ou 'yarn s' et ouvrir un navigateur sur localhost:3000. En affichant la source de la page, on constate que le html généré cote serveur est bien présent. \o/
Pour le mode client-side seulement, on peut lancer 'npm run start:dev' ou 'yarn start:dev'.

### Routing

Comme on a pu le voir, générer le rendu html des composants coté serveur est plutôt simple. La difficulté vient en fait de la gestion du routing (urls) et des chargements asynchrones des données. Dans ce paragraphe nous allons voir le routing.

Dans l'application nous allons donc ajouter un menu avec 3 liens, chacun des liens va charger un des composants. L'url doit refléter le composant actuellement affiché.
Bien sûr, quand on demandera le rendu coté serveur, il faudra que le bon composant soit généré en html afin que le navigateur l'affiche, le temps que l'application react soit chargée dans le navigateur.
Nous utilisons react-router de façon classique, avec 2 nouveaux composants simples.

```javascript
import React from 'react';
import {Link, Route} from 'react-router-dom';
import Counter from './counter';

class App extends React.Component {
    render() {
        return <div>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/counter">Counter</Link></li>
                <li><Link to="/about">About</Link></li>
            </ul>

            <hr/>

            <Route exact path="/" component={Home}/>
            <Route path="/counter" component={Counter}/>
            <Route path="/about" component={About}/>
        </div>;
    }
}

const Home = () => (
    <div>
        <h2>Home</h2>
        Welcome !
    </div>
);

const About = () => (
    <div>
        <h2>About</h2>
        About this application...
    </div>
);

export default App;
```

Si le code source des composants restera le même pour le front et pour le back, il y a cependant une différence au niveau du router à utiliser.
Pour le front il faudra utiliser le **BrowserRouter**, et pour le back le **StaticRouter**.

Nous allons profiter que les points d'entrée soient différents pour le front et le back: client/index.js et server/server.js (voir la conf webpack).
Ces différents fichier encapsuleront notre &lt;App&gt;, qui elle est universelle (front et back), avec le router adequat.

```javascript
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

const common = {
    nodeEnv: new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: `'development'`
        }
    }),
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    loaders: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }
    ],
    resolve: {extensions: ['.js']}
};

module.exports = [
    {
        // client side rendering
        target: 'web',
        entry: {
            client: './src/client/index.js' // point d'entrée de l'app 'front'
        },
        output: {
            path: common.path,
            filename: '[name].js',
            publicPath: common.publicPath
        },
        plugins: [
            common.nodeEnv,
            new HtmlWebPackPlugin({
                template: './src/client/index.html',
                filename: './index.html'
            })
        ],
        resolve: common.resolve,
        module: {
            loaders: common.loaders
        },
        devtool: 'source-map',
        devServer: {
            contentBase: common.path,
            publicPath: common.publicPath,
            open: true,
            historyApiFallback: true
        },
    },
    {
        // server side rendering
        target: 'node',
        entry: {
            server: './src/server/server.js' // point d'entrée de l'app 'back'
        },
        output: {
            path: common.path,
            filename: '[name].js',
            publicPath: common.publicPath,
            libraryTarget: 'commonjs2',
        },
        externals: [nodeExternals()],
        plugins: [
            common.nodeEnv,
            new CleanWebpackPlugin(['dist'], {verbose: true}),
        ],
        resolve: common.resolve,
        module: {
            loaders: common.loaders
        }
    }
];
```
Pour le front, on encapsule avec le **BrowerRouter**.
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import App from '../app/app';

ReactDOM.hydrate((
    <Router>
        <App/>
    </Router>
), document.getElementById('root'));
```

C'est donc surtout dans la génération de l'application coté back que nous allons avoir du travail. Tout d'abord il faut passer 2 paramètres au **StaticRouter**: l'url courante (*location*) et un objet qui permet de transporter des informations (*context*).

Dans un premier temps, nous n'utiliserons pas le *context*, un objet vide suffira. L'url courante est simplement récupérée dans la requête envoyée à *express*.

```javascript
import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import App from '../app/app';
import Html from './html';

const server = express();
const favicon = require('serve-favicon');

server.use(favicon('./public/fav.ico'));
server.use('/public', express.static('dist'));

const renderToHtml = (location, context) => {
    const appWithRouter = ( // encapsulation de l'App avec le StaticRouter
        <StaticRouter location={location} context={context}>
            <App/>
        </StaticRouter>
    );

    const body = renderToString(appWithRouter);
    const title = 'Server Side React';

    return Html({
        body,
        title
    });
};

server.get('*', (req, res) => { // Quelle que soit l'url, on répondra !
    const context = {};
    const app = renderToHtml(req.url, context);
    res.status(200).send(app);
});

const port = 3000;
server.listen(port);
console.log(`Serving at http://localhost:${port}`);
```

On peut relancer l'application afin de contrôler que tout fonctionne.

### Redux

Beaucoup d'applications utilisent redux pour stocker les données de l'application.
Que ce soit coté back ou coté front, la même méthode **createStore** est appelée. Dans les deux cas, il faudra passer l'objet qui constitue les données du store.

L'idée intéressante est de ne calculer cet état initial du store qu'une seule fois (coté back) et de passer cet état du back au front.

```javascript
const Html = ({ body, title, reduxState }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>${title}</title>
    </head>
    <body>
      <div id="root">${body}</div>
      <script>window.__REDUX_STATE__ = ${JSON.stringify(reduxState).replace(/</g, '\\u003c')}</script>
      <script src="/public/client.js"></script>
    </body>
  </html>
`;

export default Html;
```

Une fois l'état du store calculé, il est très simple de le sérialiser en json dans le fichier index.html servi au client. Celui ci n'aura plus qu'à relire le json pour le passer au **createStore**;

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import App from '../app/app';
import {reducer} from '../reducers/index';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

const preloadedState = window.__REDUX_STATE__ || {counter: 0};
delete window.__REDUX_STATE__;

const store = createStore(reducer, preloadedState);

ReactDOM.hydrate((
    <Provider store={store}>
        <Router>
            <App/>
        </Router>
    </Provider>
), document.getElementById('root'));
```

### Routing, Redux et asynchronisme

Dans une véritable application SPA, on fera du routing et du redux.
L'initialisation du store nécessite souvent des chargements asynchrones (appels REST, requètes à une base de données, ...), alors que la méthode **renderToString** est synchrone.

Il va donc falloir attendre le retour des appels asynchrones avant d'appeler **renderToString**.

C'est la que plusieurs stratégies sont possibles. 
Aucune n'est parfaite et il faudra surtout étudier sur quels paramètres on veut être le plus performant: premier affichage, utilisation de l'application, complexité du code, ...
Chaque application est unique et n'a pas à charger les mêmes volumes de données pour chaque page, il faut donc adapter la stratégie à mettre en place à chaque fois.

Par exemple faut-il charger uniquement les données de la page, ou est-il préférable de charger l'ensemble du store quelle que soit la page demandée ?

La première solution semble évidente, mais elle est aussi plus complexe à mettre en place. La 2ème solution permet de n'écrire la méthode de chargement du store initial qu'une seule fois. On préfèrera cette méthode pour la simplicité du code.

Si l'on veut ne charger que les données nécessaires à la page (la route) demandée, il va falloir décrire pour chaque route une fonction de chargement des données.
Là où l'on avait avec react-router v3 une gestion centralisée des routes, ce n'est plus le cas avec la v4. Le projet react-router-config propose donc de décrire les routes dans un fichier, avec pour chacune d'entre elles, une méthode spécifique d'initialisation, par exemple pour charger des données.

Je ne suis pas convaincu par cette façon de faire qui nécessite de maintenir la gestion des routes à deux endroits différents, sans garantie (à part avec des nouveaux tests) que les deux descriptions de route sont synchronisées.
Même si ce n'est pas non plus parfait, je préfère définir les routes dans le fichier server.js.

```javascript
import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import App from '../app/app';
import Html from './html';
import {reducer} from '../reducers/index';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {host, port} from '../api/axios';
import {fetchUsers} from '../api/users';

const server = express();
const favicon = require('serve-favicon');

server.use(favicon('./public/fav.ico'));
server.use(function (req, res, next) { // configuration du CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    next();
});
server.use('/public', express.static('dist'), express.static('public'));

const renderWithReduxState = (reduxState, location, context) => {
    const store = createStore(reducer, reduxState);
    const appWithRouter = (
        <Provider store={store}>
            <StaticRouter location={location} context={context}>
                <App/>
            </StaticRouter>
        </Provider>
    );

    const body = renderToString(appWithRouter);
    const title = 'Server Side React';

    return Html({
        body,
        title,
        reduxState
    });
};

/* Gestion de la route /users, qui nécessite un chargement asynchrone préalable
pour afficher la page.
*/
server.get('/users', (req, res) => {
    fetchUsers()
        .catch((e) => {
            console.error('error while fetching /users: ', e);
            return [];
        })
        .then(users => {
            const context = {users};
            const app = renderWithReduxState({counter: 1, users}, req.url, context);
            res.status(200).send(app);
        })
        .catch(e => res.status(500).send(e));
});

// gestion des autres routes, qui ne nécessitent pas d'initialisation spécifiques
server.get('*', (req, res) => {
    const context = {};
    const app = renderWithReduxState({counter: 1}, req.url, context);

    res.status(200).send(app);
});

server.listen(port);
console.log(`Serving at http://${host}:${port}`);
```

On remarque bien que l'appel à la méthode renderWithReduxState et donc renderToString (qui est synchrone) n'est fait que lorsque les données ont fini d'être chargées.

Est-ce que cette méthode est efficace avec un grand nombre de routes à gérer ? Avec plusieurs appels à faire pour récupérer l'ensemble des données ? C'est à regarder suivant votre application. De toute façon utiliser react-router-config ne permettra pas de s'affranchir de la difficulté à récupérer des données.


### Redirection

La redirection coté front