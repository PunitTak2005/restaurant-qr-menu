// src/utils/apiFetch.js
export async function apiFetch(endpoint, options = {}) {
  const baseUrl = "https://restaurant-qr-menu-stjp.onrender.com/api"; // Your Render backend URL
  const url =
    endpoint.startsWith("/")
      ? baseUrl + endpoint
      : baseUrl + "/" + endpoint;

  const opts = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
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
