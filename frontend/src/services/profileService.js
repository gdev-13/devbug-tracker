import api from './api';

export async function getProfile() {
  const response = await api.get('/auth/me');

  return response.data;
}

export async function updateProfile(profileData) {
  const response = await api.put('/auth/me', profileData);

  return response.data;
}

export async function updatePassword(passwordData) {
  const response = await api.put('/auth/me/password', passwordData);

  return response.data;
}

export async function uploadProfileImage(file) {
  const formData = new FormData();

  formData.append('file', file);

  const response = await api.post('/auth/me/profile-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function removeProfileImage() {
  const response = await api.delete('/auth/me/profile-image');

  return response.data;
}

export async function deleteAccount() {
  await api.delete('/auth/me');
}