import axios from 'axios';

export const getUser = (userId) => axios.get(`http://localhost:5000/auth/otheruser/${userId}`)