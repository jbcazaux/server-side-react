import React from 'react';
import {Link, Route} from 'react-router-dom';
import Counter from './counter';
import Users from './users';
import Redirection from './redirection';

class App extends React.Component {
    render() {
        return <div>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/counter">Counter</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/users">Users</Link></li>
                <li><Link to="/redirection">Redirection</Link></li>
            </ul>

            <hr/>

            <Route exact path="/" render={() => (
                <div>
                    <h2>Home</h2>
                    Welcome !
                </div>
            )}/>
            <Route path="/counter" component={Counter}/>
            <Route path="/about" component={About}/>
            <Route path="/users" component={Users}/>
            <Route path="/redirection" component={Redirection}/>
        </div>;
    }
}

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

export default App;