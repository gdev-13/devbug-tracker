import api from './api';

export async function getBugsByProjectId(projectId) {
  const response = await api.get(`/bugs/project/${projectId}`);

  return response.data;
}

export async function getBugById(bugId) {
  const response = await api.get(`/bugs/${bugId}`);

  return response.data;
}

export async function createBug(bugData) {
  const response = await api.post('/bugs', bugData);

  return response.data;
}