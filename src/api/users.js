import axios from './axios';

export const fetchUsers = () =>
    axios.get('public/users.json')
        .then(response => response.data);