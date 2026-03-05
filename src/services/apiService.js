import axios from 'axios';

const BASE_URL = 'https://as3-be-auth.onrender.com';

const getToken = () => localStorage.getItem('token');

const apiCall = async (endpoint, method = 'GET', body = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (getToken()) {
    headers['Authorization'] = `Bearer ${getToken()}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API Error');
  }

  return response.json();
};

// Authentication APIs
export const authAPI = {
  register: (username, password) =>
    axios.post(`${BASE_URL}/api/auth/register`, { username, password, admin: false }),
  login: (username, password) =>
    axios.post(`${BASE_URL}/api/auth/login`, { username, password }),
};

// Users APIs
export const userAPI = {
  getAllUsers: () =>
    axios.get(`${BASE_URL}/api/auth/users`, { headers: { Authorization: `Bearer ${getToken()}` } }),
  getUser: (userId) =>
    axios.get(`${BASE_URL}/api/auth/users/${userId}`),
  updateUser: (userId, updates) =>
    axios.put(`${BASE_URL}/api/auth/users/${userId}`, updates, { headers: { Authorization: `Bearer ${getToken()}` } }),
  deleteUser: (userId) =>
    axios.delete(`${BASE_URL}/api/auth/users/${userId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
};

// Questions APIs
export const questionAPI = {
  getAll: () =>
    axios.get(`${BASE_URL}/api/questions`),
  getById: (id) =>
    axios.get(`${BASE_URL}/api/questions/${id}`),
  create: (data) =>
    axios.post(`${BASE_URL}/api/questions`, data, { headers: { Authorization: `Bearer ${getToken()}` } }),
  update: (id, data) =>
    axios.put(`${BASE_URL}/api/questions/${id}`, data, { headers: { Authorization: `Bearer ${getToken()}` } }),
  delete: (id) =>
    axios.delete(`${BASE_URL}/api/questions/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
};

// Quizzes APIs
export const quizAPI = {
  getAll: () =>
    axios.get(`${BASE_URL}/api/quizzes`),
  getById: (id) =>
    axios.get(`${BASE_URL}/api/quizzes/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
  create: (data) =>
    axios.post(`${BASE_URL}/api/quizzes`, data, { headers: { Authorization: `Bearer ${getToken()}` } }),
  update: (id, data) =>
    axios.put(`${BASE_URL}/api/quizzes/${id}`, data, { headers: { Authorization: `Bearer ${getToken()}` } }),
  delete: (id) =>
    axios.delete(`${BASE_URL}/api/quizzes/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
  addQuestion: (quizId, questionId) =>
    axios.post(`${BASE_URL}/api/quizzes/${quizId}/questions/${questionId}`, {}, { headers: { Authorization: `Bearer ${getToken()}` } }),
  removeQuestion: (quizId, questionId) =>
    axios.delete(`${BASE_URL}/api/quizzes/${quizId}/questions/${questionId}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
  addSingleQuestion: (quizId, data) =>
    axios.post(`${BASE_URL}/api/quizzes/${quizId}/question`, data, { headers: { Authorization: `Bearer ${getToken()}` } }),
  addMultipleQuestions: (quizId, data) =>
    axios.post(`${BASE_URL}/api/quizzes/${quizId}/questions`, data, { headers: { Authorization: `Bearer ${getToken()}` } }),
  getWithPopulate: (quizId) =>
    axios.get(`${BASE_URL}/api/quizzes/${quizId}/populate`),
};

export default { authAPI, userAPI, questionAPI, quizAPI };
