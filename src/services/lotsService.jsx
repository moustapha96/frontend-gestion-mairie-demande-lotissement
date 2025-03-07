import { HttpClient } from '../helpers';

const urlApi = import.meta.env.VITE_API_URL;

// Récupérer tous les lots
export async function getLots() {
    try {
        const response = await HttpClient.get(`${urlApi}lot/liste`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des lots:', error);
        throw error;
    }
}

// Récupérer les détails d'un lot
export async function getLotDetails(id) {
    try {
        const response = await HttpClient.get(`${urlApi}lot/${id}/details`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du lot:', error);
        throw error;
    }
}

// Créer un nouveau lot
export async function createLot(lotData) {
    try {
        const response = await HttpClient.post(`${urlApi}lot/create`, lotData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création du lot:', error);
        throw error;
    }
}

// Mettre à jour un lot
export async function updateLot(id, lotData) {
    try {
        const response = await HttpClient.put(`${urlApi}lot/${id}/update`, lotData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du lot:', error);
        throw error;
    }
}

// Supprimer un lot
export async function deleteLot(id) {
    try {
        const response = await HttpClient.delete(`${urlApi}lot/${id}/delete`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression du lot:', error);
        throw error;
    }
}


// Ajouter cette fonction dans le service
export async function updateLotStatut(id, statut) {
    try {
        const response = await HttpClient.put(`${urlApi}lot/${id}/update-statut`, { statut });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        throw error;
    }
}