import { HttpClient } from '../helpers';

const urlApi = import.meta.env.VITE_API_URL;


export async function getDemandes() {
    try {
        const response = await HttpClient.get(`${urlApi}demande/liste`);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la recuperation des demandes:', error);
        throw error;
    }
}

export async function getDemandesDemandeur(id) {
    try {
        const response = await HttpClient.get(`${urlApi}demande/user/${id}/liste`);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la recuperation des demandes:', error);
        throw error;
    }
}

export async function getDemandeDetails(demandeId) {
    try {
        const response = await HttpClient.get(`${urlApi}demande/details/${demandeId}`);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la recuperation de la demande:', error);
        throw error;
    }
}

export async function getFileDocument(demandeId) {
    try {
        const response = await HttpClient.get(`${urlApi}demande/file/${demandeId}`);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la recuperation du document:', error);
        throw error;
    }
}

export async function createDemande(data) {
    try {
        const response = await HttpClient.post(`${urlApi}demande/create`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data
    } catch (error) {
        console.log(error)
        throw error;
    }
}


export async function nouvelleDemande(data) {
    try {
        const response = await fetch(`${urlApi}demande/nouvelle-demande`, {
            method: 'POST',
            body: data,  // Pas besoin de préciser Content-Type avec FormData
        });
        console.log(response)
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Erreur lors de la création de la demande:", error);
        throw error;
    }
}


// Ajouter cette nouvelle fonction
export async function updateDemandeStatut(id, statut) {
    try {
        const response = await HttpClient.put(`${urlApi}demande/${id}/update-statut`, { statut });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        throw error;
    }
}


export const generateDocument = async (demandeId, documentData) => {
    try {
        const response = await HttpClient.post(`${urlApi}documents/${demandeId}/generate`, documentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};