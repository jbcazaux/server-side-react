import { renderRoutes } from 'react-router-config';
import React from 'react';

import Counter from './counter';
import Users from './users';
import {fetchUsers} from "../api/users";

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

const Root = ({ route }) => (
  <div>
    <h1>Root</h1>
    {/* child routes won't render without this */}
    {renderRoutes(route.routes)}
  </div>
);

const routes = [
  { component: Root,
    routes: [
      { path: '/',
        exact: true,
        component: Home
      },
      { path: '/about',
        component: About
      },
      { path: '/counter',
        component: Counter,
        loadData: {
          counter: ()=>Promise.resolve(10)
        }
      },
      { path: '/users',
        component: Users,
        loadData: {
          users: fetchUsers
        }
      },
      /*{ path: '/child/:id',
        component: Child,
        routes: [
          { path: '/child/:id/grand-child',
            component: GrandChild
          }
        ]
      }*/
    ]
  }
];

export default routes;
