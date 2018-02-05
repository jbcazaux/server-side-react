import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import App from '../app/app';
import {reducer} from '../reducers/index';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

const preloadedState = window.__REDUX_STATE__ || {counter: 0};
delete window.__REDUX_STATE__;

const store = createStore(reducer, preloadedState);

ReactDOM.hydrate((
    <Provider store={store}>
        <Router>
            <App/>
        </Router>
    </Provider>
), document.getElementById('root'));