import { HttpClient } from '../helpers';

const urlApi = import.meta.env.VITE_API_URL;

// Récupérer tous les Parcelles
export async function getParcelles() {
    try {
        const response = await HttpClient.get(`${urlApi}parcelle/liste`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des Parcelles:', error);
        throw error;
    }
}

export async function getParcellesByLotissement(idLotissement) {
    try {
        const response = await HttpClient.get(`${urlApi}parcelle/lotissement/${idLotissement}/liste`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des Parcelles:', error);
        throw error;
    }
}


// Récupérer les détails d'un lot
export async function getLotDetails(id) {
    try {
        const response = await HttpClient.get(`${urlApi}parcelle/${id}/details`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du lot:', error);
        throw error;
    }
}

// Créer un nouveau lot
export async function createLot(lotData) {
    try {
        const response = await HttpClient.post(`${urlApi}parcelle/create`, lotData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création du lot:', error);
        throw error;
    }
}

// Mettre à jour un lot
export async function updateLot(id, lotData) {
    try {
        const response = await HttpClient.put(`${urlApi}parcelle/${id}/update`, lotData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du lot:', error);
        throw error;
    }
}

// Supprimer un lot
export async function deleteLot(id) {
    try {
        const response = await HttpClient.delete(`${urlApi}parcelle/${id}/delete`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression du lot:', error);
        throw error;
    }
}


// Ajouter cette fonction dans le service
export async function updateParcellestatut(id, statut) {
    try {
        const response = await HttpClient.put(`${urlApi}parcelle/${id}/update-statut`, { statut });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        throw error;
    }
}

export async function updateParcelle(id, data) {
    try {
        const response = await HttpClient.put(`${urlApi}parcelle/${id}/update`, data);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        throw error;
    }
}
export async function createParcelle(data) {
    try {
        const response = await HttpClient.post(`${urlApi}parcelle/create`, data);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        throw error;
    }
}