import React from 'react';
import {Redirect, Route} from 'react-router-dom';

const RedirectToCounter = () => (
    <Route render={({staticContext}) => {
        if (staticContext) {
            staticContext.status = 302;
        }
        return <Redirect from="/redirection" to="/counter"/>;
    }}/>
);

export default RedirectToCounter;