import { HttpClient } from '../helpers';

const urlApi = import.meta.env.VITE_API_URL;

// Récupérer tous les Parcelles
export async function Statistiques() {
    try {
        const response = await HttpClient.get(`${urlApi}statistiques` );
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des électeurs:', error);
        throw error;
    }
}
