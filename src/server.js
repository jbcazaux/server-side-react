import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './client/App';
import Html from './client/Html';

const port = 3000;
const server = express();

server.get('/', (req, res) => {
    const body = renderToString(<App />);
    const title = 'Server side Rendering with Styled Components';

    res.send(
        Html({
            body,
            title
        })
    );
});

server.listen(port);
console.log(`Serving at http://localhost:${port}`);