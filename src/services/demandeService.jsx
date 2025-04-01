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

export async function updateDemandeRefus(id, message) {
    const body = {
        "message": message
    }
    console.log(body)
    try {
        const response = await HttpClient.put(`${urlApi}demande/${id}/update-refus`, body);
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

export async function updateDemande(id, data) {

    // formData.append("userId", user.id);
    // formData.append("superficie", values.superficie);
    // formData.append("usagePrevu", values.usagePrevu);
    // formData.append("localiteId", values.localiteId);
    // formData.append("typeDemande", values.typeDemande);
    // formData.append("typeDocument", values.typeDocument);
    // formData.append("possedeAutreTerrain", values.possedeAutreTerrain);
    // formData.append("statut", "EN_COURS");

    console.log("userId", data.get("userId"))
    console.log("superficie", data.get("superficie"))
    console.log("usagePrevu", data.get("usagePrevu"))
    console.log("localiteId", data.get("localiteId"))
    console.log("typeDemande", data.get("typeDemande"))
    console.log("typeDocument", data.get("typeDocument"))
    console.log("possedeAutreTerrain", data.get("possedeAutreTerrain"))
    console.log("statut", data.get("statut"))
    console.log("id", id)
    console.log("data", data)

    try {

        if (!(data instanceof FormData)) {
            const formData = new FormData()
            // Convertir l'objet en FormData
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key])
            })
            data = formData
        }
        if (data.get("localiteId")) {
            // Renommer localiteId en localite_id si nécessaire selon votre API
            const localiteId = data.get("localiteId")
            data.delete("localiteId")
            data.append("localiteId", localiteId)
        }

        const response = await HttpClient.post(`${urlApi}demande/${id}/update`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la demande:', error);
        throw error;
    }
}

export const importDemandes = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await HttpClient.post(`${urlApi}demande/import`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'importation des demandes:', error);
        throw error;
    }
};

export const generateDocument = async (demandeId, documentData) => {
    try {
        const response = await HttpClient.post(`${urlApi}document/${demandeId}/generate`, documentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDemandeurDemandes = async (id) => {
    try {
        const response = await HttpClient.get(`${urlApi}demande/demandeur/${id}/liste`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la recuperation des demandes:', error);
        throw error;
    }
};

export const deleteDemande = async (id) => {
    try {
        const response = await HttpClient.delete(`${urlApi}demande/${id}/delete`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression de la demande:', error);
        throw error;
    }
};
