import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const authHeaders = getAuthHeaders();
    if (authHeaders) {
      config.headers = {
        ...config.headers,
        ...authHeaders,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    const authHeaders = [
      'access-token',
      'client',
      'expiry',
      'uid',
      'token-type',
    ];
    
    const hasAuthHeaders = authHeaders.every(
      (header) => response.headers[header]
    );
    
    if (hasAuthHeaders) {
      const newHeaders = {
        'access-token': response.headers['access-token'],
        client: response.headers.client,
        expiry: response.headers.expiry,
        uid: response.headers.uid,
        'token-type': response.headers['token-type'],
      };
      
      localStorage.setItem('authHeaders', JSON.stringify(newHeaders));
    }
    
    return response;
  },
  (error) => Promise.reject(error)
);

export const getAuthHeaders = () => {
  if (typeof window === 'undefined') return null;
  
  const authHeaders = localStorage.getItem('authHeaders');
  return authHeaders ? JSON.parse(authHeaders) : null;
};

export const clearAuthHeaders = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authHeaders');
  }
};

export default apiClient;