// Simple fetch wrapper for your deployed backend
export async function apiFetch(endpoint, options = {}) {
  // Ensure only one slash between baseUrl and endpoint
  const baseUrl = "https://restaurant-qr-menu-stjp.onrender.com/api"; // Your backend's Render URL
  const url =
    endpoint.startsWith("/")
      ? baseUrl + endpoint
      : baseUrl + "/" + endpoint;

  // If you need to send cookies or authentication headers, add credentials
  const opts = {
    ...options,
    // credentials: 'include', // Uncomment if you use cookies/auth
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
  };

  const response = await fetch(url, opts);
  if (!response.ok) {
    // Optional: parse and include error message from body
    let message = "API Error";
    try {
      const errorBody = await response.json();
      message = errorBody.message || message;
    } catch {}
    throw new Error(message);
  }
  return response.json();
}
