import axiosClient from './axiosClient';

export const getMatches = () => axiosClient.get('/matches');
export const getMatchById = (id) => axiosClient.get(`/matches/${id}`);
export const createMatch = (data) => axiosClient.post('/matches', data);
export const updateMatch = (id, data) => axiosClient.put(`/matches/${id}`, data);
export const deleteMatch = (id) => axiosClient.delete(`/matches/${id}`);