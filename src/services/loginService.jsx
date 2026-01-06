
import { HttpClient } from '../helpers';




const urlApi = import.meta.env.VITE_API_URL
export async function login(email, password) {
    try {
        const response = await HttpClient.post(`${urlApi}login`, {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw error;
    }
}


// src/services/authService.js
export async function refreshTokenApi({ baseURL, refreshToken }) {
  const res = await fetch(`${baseURL}/api/token/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // selon ton API Symfony: { refresh_token: "..." }
    body: JSON.stringify({ refresh_token: refreshToken }),
    credentials: "include",
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Refresh failed (${res.status}): ${t}`);
  }
  // attendu: { token, refresh_token?, user? }
  return res.json();
}
