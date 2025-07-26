// Frontend Configuration
export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
export const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

// API endpoints
export const API_BASE_URL = `${BACKEND_URL}/api`;

// Socket configuration
export const SOCKET_URL = BACKEND_URL;
