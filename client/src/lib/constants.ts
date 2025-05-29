export const BACKEND_URL =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_BACKEND_PRODUCTION_URL
    : import.meta.env.VITE_BACKEND_DEVELOPMENT_URL;
