import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import App from '../app/app';
import Html from './html';
import {reducer} from '../reducers/index';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import axios from 'axios';

const port = 3000;
const server = express();

// Add headers
server.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
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

server.get('/users', (req, res) => {
    console.log('users !!');
    axios.get('http://localhost:3000/public/users.json')
        .then(response => response.data)
        .catch((e) => {
            console.error('erreur server: ', e.response.status, e.response.statusText);
            return [];
        })
        .then(users => {
            const context = {users};
            const app = renderWithReduxState({counter: 1, users}, req.url, context);

            if (context.url) {
                res.redirect(context.url);
                return;
            }
            res.status(200).send(app);
        })
        .catch(e => res.status(500).send(e));
});

server.get('*', (req, res) => {
    const context = {};
    const app = renderWithReduxState({counter: 1}, req.url, context);
    if (context.url) {
        res.redirect(context.url);
        return;
    }
    res.status(200).send(app);
});

server.listen(port);
console.log(`Serving at http://localhost:${port}`);