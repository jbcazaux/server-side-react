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

import routes from '../app/routes';
import { matchRoutes } from 'react-router-config'
import '../global/promise';

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

/*const addRoutesToExpress = (routeList, parents=[])=>{
  routeList.forEach((route)=>{
    console.log('------');
    console.log(route);
    console.log(parents);
      if(route.routes) {
        addRoutesToExpress(route.routes, [...parents, route]);
      } else {
          let routePath = ``;
          parents.forEach((parentRoute)=>{
            if(parentRoute.path) {
              routePath += parentRoute.path
            }
          });

          if(route.path) {
            routePath += route.path
          }

          console.log('add route to Xprs: ', routePath);

          server.get(routePath, (req, res) => {
              res.send(req.url)
          });
      }
  })
};

addRoutesToExpress(routes);*/

const loadBranchData = (location) => {
  const branch = matchRoutes(routes, location);

  const promises = branch.map(({ route, match }) => {
    return route.loadData
      ? Promise.allValues(route.loadData)
      : undefined
  }).filter((element) => !!element);

  console.log('promises', promises);

  return Promise.all(promises).then((promisesResults)=>{

    console.log('promisesResults', promisesResults);
    let toReturn = {};

    promisesResults.forEach((childResult) => {
      toReturn = {...toReturn, ...childResult}
    });
    return toReturn;
  })
};

server.get('*', (req, res) => {
  // useful on the server for preloading data
  loadBranchData(req.url).then(data => {
    console.log('DATA:', data);

    const context = {};
    const app = renderWithReduxState(data, req.url, context);

    res.status(200).send(app);
  });
});

server.listen(port);
console.log(`Serving at http://${host}:${port}`);
