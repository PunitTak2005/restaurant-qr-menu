// src/utils/apiFetch.js

// Use environment variable if set; fallback to Render prod API
const baseUrl =
  import.meta.env.VITE_API_BASE_URL || "https://restaurant-qr-menu-stjp.onrender.com/api";

export async function apiFetch(endpoint, options = {}) {
  // Ensure there's only single slash between baseUrl and endpoint
  const url =
    endpoint.startsWith("/")
      ? baseUrl + endpoint
      : baseUrl + "/" + endpoint;

  const opts = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  const response = await fetch(url, opts);
  if (!response.ok) {
    let message = "API Error";
    try {
      const err = await response.json();
      message = err.message || message;
    } catch {}
    throw new Error(message);
  }
  return response.json();
}
