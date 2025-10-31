// Simple fetch wrapper
export async function apiFetch(endpoint, options = {}) {
  const baseUrl = "https://restaurant-qr-menu-g5s5.onrender.com";
  const response = await fetch(`${baseUrl}${endpoint}`, options);
  if (!response.ok) throw new Error("API Error");
  return response.json();
}
