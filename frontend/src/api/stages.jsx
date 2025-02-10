import axiosInstance from './config';

export const stagesApi = () => axiosInstance.get('/stage/api/stages/');