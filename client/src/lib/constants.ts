export const API_BASE_URL =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_PRODUCTION_URL
    : import.meta.env.VITE_API_BASE_DEVELOPMENT_URL;
