
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