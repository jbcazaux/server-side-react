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
server.use(function (req, res, next) {
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

server.get('*', (req, res) => {
    const context = {};
    const app = renderWithReduxState({counter: 1}, req.url, context);
    if (context.url) {
        console.log('will redirect to ', context.url);
        res.redirect(context.url);
        return;
    }
    res.status(200).send(app);
});

server.listen(port);
console.log(`Serving at http://${host}:${port}`);
