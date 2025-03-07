import { HttpClient } from '../helpers';

const urlApi = import.meta.env.VITE_API_URL;


export async function getLotissements() {
    try {
        const response = await HttpClient.get(`${urlApi}lotissement/liste`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des localités:', error);
        throw error;
    }
};

export async function getLotissementDetails(id) {
    try {
        const response = await HttpClient.get(`${urlApi}lotissement/${id}/details`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de la localité:', error);
        throw error;
    }
}

export async function createLotissement(localiteData) {
    try {
        const response = await HttpClient.post(`${urlApi}lotissement/create`, localiteData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création de la localité:', error);
        throw error;
    }
}

export async function updateLotissement(id, localiteData) {
    try {
        const response = await HttpClient.put(`${urlApi}lotissement/${id}/update`, localiteData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la localité:', error);
        throw error;
    }
}


export async function getLotissementLot(id) {
    try {
        const response = await HttpClient.get(`${urlApi}lotissement/${id}/lots`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des localités:', error);
        throw error;
    }
}

export async function getLotissementPlan(id) {
    try {
        const response = await HttpClient.get(`${urlApi}lotissement/${id}/plans`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des plans:', error);
        throw error;
    }
}


// Ajouter cette fonction dans le service
export async function updateLotissementStatut(id, statut) {
    try {
        const response = await HttpClient.put(`${urlApi}lotissement/${id}/update-statut`, { statut });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        throw error;
    }
}

