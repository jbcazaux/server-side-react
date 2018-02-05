import axios from 'axios';

export const port = 3000;
//export const host = '10.132.130.103';
export const host = 'localhost';

export default axios.create({
    baseURL: 'http://' + host + ':' + port + '/',
    timeout: 1000
});
