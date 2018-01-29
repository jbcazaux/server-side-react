import axios from 'axios';

export const port = 3000;

export default axios.create({
    baseURL: 'http://localhost:' + port + '/',
    timeout: 1000
});
