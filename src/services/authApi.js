const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const getAuthHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const request = async (path, options = {}) => {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch {
    throw new Error('Auth server is not running. Start the app with "npm run dev".');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
};

export const signupUser = (payload) =>
  request('/auth/signup', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

export const loginUser = (payload) =>
  request('/auth/login', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

export const fetchCurrentUser = (token) =>
  request('/auth/me', {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

export const logoutUser = (token) =>
  request('/auth/logout', {
    method: 'POST',
    headers: getAuthHeaders(token),
  });
