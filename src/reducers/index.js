import {combineReducers} from 'redux';
import counter from './counter';
import users from './users';

export const reducer = combineReducers({
    counter,
    users
});