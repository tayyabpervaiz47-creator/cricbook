import axiosClient from './axiosClient';

export const getStadiums = () => axiosClient.get('/stadiums');
export const getStadiumById = (id) => axiosClient.get(`/stadiums/${id}`);
export const createStadium = (data) => axiosClient.post('/stadiums', data);
export const updateStadium = (id, data) => axiosClient.put(`/stadiums/${id}`, data);
export const deleteStadium = (id) => axiosClient.delete(`/stadiums/${id}`);