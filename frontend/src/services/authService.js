import api from './api';

export async function loginUser(credentials) {
  const response = await api.post('/auth/login', credentials);

  return response.data;
}

export async function registerUser(userData) {
  const response = await api.post('/auth/register', userData);

  return response.data;
}

export async function verifyEmail(token) {
  const response = await api.get('/auth/verify-email', {
    params: { token },
  });

  return response.data;
}

export async function forgotPassword(data) {
  const response = await api.post('/auth/forgot-password', data);

  return response.data;
}

export async function resetPassword(data) {
  const response = await api.post('/auth/reset-password', data);

  return response.data;
}