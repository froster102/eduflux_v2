export const BACKEND_BASE_URL =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_BACKEND_BASE_PRODUCTION_URL
    : import.meta.env.VITE_BACKEND_BASE_DEVELOPMENT_URL;

export const API_BASE_URL = `${BACKEND_BASE_URL}/api`;

export const CHAT_WEBSOCKET_URL = `${BACKEND_BASE_URL}`;

export const NOTIFICATION_SSE_URL = `${API_BASE_URL}/notifications/events`;

export const LIVEKIT_SERVER_URL = import.meta.env.VITE_LIVEKIT_SERVER_URL;
