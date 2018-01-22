import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import App from './client/app';
import Html from './client/html';

const port = 3000;
const server = express();

server.use('/public', express.static('dist'));

server.get('*', (req, res) => {
    const context = {};

    const appWithRouter = (
        <StaticRouter location={req.url} context={context}>
            <App/>
        </StaticRouter>
    );

    if (context.url) {
        res.redirect(context.url);
        return;
    }

    const body = renderToString(appWithRouter);
    const title = 'Server Side React';

    res.status(200).send(Html({
        body,
        title
    }));
});

server.listen(port);
console.log(`Serving at http://localhost:${port}`);