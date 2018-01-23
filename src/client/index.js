import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import App from './app';
import {reducer} from '../reducers/index';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';

const store = createStore(reducer, applyMiddleware(thunk));

ReactDOM.hydrate((
    <Provider store={store}>
        <Router>
            <App/>
        </Router>
    </Provider>
), document.getElementById('root'));