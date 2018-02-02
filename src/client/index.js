import React from 'react';
import ReactDOM from 'react-dom';
import Counter from '../app/counter';


ReactDOM.hydrate((
    <Counter/>
), document.getElementById('root'));