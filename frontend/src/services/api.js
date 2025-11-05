// Simple fetch wrapper for your deployed backend
export async function apiFetch(endpoint, options = {}) {
  // Get base URL from env or default
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://restaurant-qr-menu-stjp.onrender.com/api";
  const url = endpoint.startsWith("/") ? baseUrl + endpoint : baseUrl + "/" + endpoint;
  const opts = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    // credentials: 'include', // Uncomment if you use cookies/auth
  };
  const response = await fetch(url, opts);
  if (!response.ok) {
    let message = "API Error";
    try {
      const errorBody = await response.json();
      message = errorBody.message || message;
    } catch {}
    throw new Error(message);
  }
  return response.json();
}
