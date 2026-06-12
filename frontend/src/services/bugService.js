import api from './api';

export async function getBugsByProjectId(projectId) {
  const response = await api.get(`/bugs/project/${projectId}`);

  return response.data;
}