import { HttpClient } from '../helpers';

const urlApi = import.meta.env.VITE_API_URL;

// Récupérer tous les Parcelles
export async function rechercheElecteur(data) {
    try {
        const response = await HttpClient.post(`${urlApi}electeur/recherche`,  data );
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des électeurs:', error);
        throw error;
    }
}
