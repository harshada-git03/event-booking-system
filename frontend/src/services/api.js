import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);


export const getAllEvents = (page = 0, size = 10) => api.get(`/events?page=${page}&size=${size}`);
export const getAllEventsNoPagination = () => api.get('/events/all');
export const getEventById = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const searchEvents = (params) => api.get('/events/search', { params });


export const createBooking = (data) => api.post('/bookings', data);
export const getAllBookings = () => api.get('/bookings');
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const cancelBooking = (id) => api.delete(`/bookings/${id}`);


export const getAllUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);


export const createPaymentOrder = (bookingId) => api.post(`/payments/create-order/${bookingId}`);
export const verifyPayment = (data) => api.post('/payments/verify', data);


export const createReview = (data) => api.post('/reviews', data);
export const getReviewsByEvent = (eventId) => api.get(`/reviews/event/${eventId}`);
export const getEventSentimentSummary = (eventId) => api.get(`/reviews/event/${eventId}/summary`);

export default api;