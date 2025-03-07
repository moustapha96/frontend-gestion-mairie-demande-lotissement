import { HttpClient } from '../helpers';

const urlApi = import.meta.env.VITE_API_URL;

export async function getConfigurations() {
    try {
        const response = await HttpClient.get(`${urlApi}configurations/liste`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des configurations:', error);
        throw error;
    }
}

export async function updateConfiguration(cle, valeur) {
    try {
        const response = await HttpClient.put(`${urlApi}configurations/update`, {
            cle,
            valeur
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la configuration:', error);
        throw error;
    }
}