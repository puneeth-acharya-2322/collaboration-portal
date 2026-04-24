export async function apiCall(endpoint, options = {}) {
  return request(endpoint, options);
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // Construct URL: handle endpoints that already include /api or are absolute
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_BASE_URL}${endpoint.startsWith('/api') ? '' : '/api'}${endpoint}`;

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw { status: response.status, ...data };
  }

  return data;
}

// Projects
export const getProjects = () => request('/projects');
export const getProject = (id) => request(`/projects/${id}`);
export const createProject = (data) => request('/projects', { method: 'POST', body: JSON.stringify(data) });
export const updateProject = (id, data) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteProject = (id) => request(`/projects/${id}`, { method: 'DELETE' });

// Applications
export const submitApplication = (data) => request('/applications', { method: 'POST', body: JSON.stringify(data) });
export const getApplications = () => request('/applications');
export const updateApplication = (id, data) => request(`/applications/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

// Auth
export const login = (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
