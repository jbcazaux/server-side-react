import React from 'react';
import {Link, Route} from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

import routes from './routes';

class App extends React.Component {
    render() {
        return <div>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/counter">Counter</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/users">Users</Link></li>
            </ul>

            <hr/>

          {renderRoutes(routes)}
        </div>;
    }
}

export default App;
