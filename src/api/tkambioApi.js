import axios from 'axios';

const tkambioApi = axios.create({   
    baseURL: 'https://alvabus.online/api'
});



export default tkambioApi;