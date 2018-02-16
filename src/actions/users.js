import {fetchUsers} from '../api/users';

export const setUsers = (users) => ({
    type: 'SET_USERS',
    users
});

export const loadUsers = () =>
    (dispatch) => fetchUsers()
        .catch((e) => {
            console.error('erreur server: ', e);
            return [];
        })
        .then(users => setTimeout(() => dispatch(setUsers(users)), 1000));