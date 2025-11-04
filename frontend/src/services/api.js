// Simple fetch wrapper
export async function apiFetch(endpoint, options = {}) {
  // Use your deployed backend API URL here:
  const baseUrl = "https://restaurant-qr-menu-stjp.onrender.com/api"; // <-- Update to your backend's Render URL
  const response = await fetch(`${baseUrl}${endpoint}`, options);
  if (!response.ok) throw new Error("API Error");
  return response.json();
}
