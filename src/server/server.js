import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import App from '../app/app';
import Html from './html';
import {reducer} from '../reducers/index';
import {Provider} from 'react-redux';
import {createStore} from 'redux';

const server = express();
const favicon = require('serve-favicon');

server.use(favicon('./public/fav.ico'));
server.use('/public', express.static('dist'));

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

server.get('*', (req, res) => {
    const context = {};
    const app = renderWithReduxState({counter: 10}, req.url, context);
    res.status(200).send(app);
});

const port = 3000;
server.listen(port);
console.log(`Serving at http://localhost:${port}`);
