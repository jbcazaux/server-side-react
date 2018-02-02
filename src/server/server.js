import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import Html from './html';
import Counter from '../app/counter';

const server = express();
const favicon = require('serve-favicon');

server.use(favicon('./public/fav.ico'));
server.use('/public', express.static('dist'));

server.get('/', (req, res) => {
    const body = renderToString(<Counter/>);
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
