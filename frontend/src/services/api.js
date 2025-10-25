// Simple fetch wrapper
export async function apiFetch(endpoint, options = {}) {
  const baseUrl = "http://localhost:5000/api"; // Change as needed
  const response = await fetch(`${baseUrl}${endpoint}`, options);
  if (!response.ok) throw new Error("API Error");
  return response.json();
}
