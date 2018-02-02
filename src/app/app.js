import React from 'react';
import {Link, Route} from 'react-router-dom';
import Counter from './counter';

class App extends React.Component {
    render() {
        return <div>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/counter">Counter</Link></li>
                <li><Link to="/about">About</Link></li>
            </ul>

            <hr/>

            <Route exact path="/" component={Home}/>
            <Route path="/counter" component={Counter}/>
            <Route path="/about" component={About}/>
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