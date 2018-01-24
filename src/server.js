import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import App from './client/app';
import Html from './client/html';
import {reducer} from './reducers';
import { Provider } from 'react-redux'
import { createStore } from 'redux'

const port = 3000;
const server = express();

server.use('/public', express.static('dist'));

server.get('*', (req, res) => {
    const context = {};
    const store = createStore(reducer, {counter: 1});

    const appWithRouter = (
        <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
                <App/>
            </StaticRouter>
        </Provider>
    );

    if (context.url) {
        res.redirect(context.url);
        return;
    }

    const body = renderToString(appWithRouter);
    const title = 'Server Side React';

    res.status(200).send(Html({
        body,
        title,
        reduxState: {counter: 100}
    }));
});

server.listen(port);
console.log(`Serving at http://localhost:${port}`);