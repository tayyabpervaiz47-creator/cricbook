import axiosClient from './axiosClient';

// JSON server mein '_expand' use karne se matchId ki jagah poora match object aa jata hai
export const getBookings = () => axiosClient.get('/bookings?_expand=match');
export const getBookingById = (id) => axiosClient.get(`/bookings/${id}`);
export const createBooking = (data) => axiosClient.post('/bookings', data);
export const updateBooking = (id, data) => axiosClient.put(`/bookings/${id}`, data);
export const deleteBooking = (id) => axiosClient.delete(`/bookings/${id}`);