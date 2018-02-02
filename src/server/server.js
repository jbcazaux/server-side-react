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
    const appWithRouter = (
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

server.get('*', (req, res) => {
    const context = {};
    const app = renderToHtml(req.url, context);
    res.status(200).send(app);
});

const port = 3000;
server.listen(port);
console.log(`Serving at http://localhost:${port}`);
