import { HttpClient } from '../helpers';

const urlApi = import.meta.env.VITE_API_URL;



export async function getDemandesPaginated(params = {}) {
    const q = new URLSearchParams();
    const map = [
        'page', 'size', 'sort', 'search', 'statut', 'typeDemande', 'typeDocument',
        'userId', 'localiteId', 'from', 'to', 'includeActor'
    ];
    map.forEach(k => {
        if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
            q.append(k, params[k]);
        }
    });

    const url = `${urlApi}demandes?${q.toString()}`;
    const { data } = await HttpClient.get(url);
    return data;
}


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

export async function deleteDocumentGenerer(demandeId) {
    try {
        const response = await HttpClient.delete(`${urlApi}demande/document-generer/${demandeId}/delete`);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression du document:', error);
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
        const response = await HttpClient.post(`${urlApi}nouveau-demandes/create-demande-demandeur`, data, {
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

// export async function updateDemande(id, data) {

//     console.log("userId", data.get("userId"))
//     console.log("superficie", data.get("superficie"))
//     console.log("usagePrevu", data.get("usagePrevu"))
//     console.log("localiteId", data.get("localiteId"))
//     console.log("typeDemande", data.get("typeDemande"))
//     console.log("typeDocument", data.get("typeDocument"))
//     console.log("possedeAutreTerrain", data.get("possedeAutreTerrain"))
//     console.log("statut", data.get("statut"))
//     console.log("id", id)
//     console.log("data", data)

//     try {

//         if (!(data instanceof FormData)) {
//             const formData = new FormData()
//             // Convertir l'objet en FormData
//             Object.keys(data).forEach((key) => {
//                 formData.append(key, data[key])
//             })
//             data = formData
//         }
//         if (data.get("localiteId")) {
//             // Renommer localiteId en localite_id si nécessaire selon votre API
//             const localiteId = data.get("localiteId")
//             data.delete("localiteId")
//             data.append("localiteId", localiteId)
//         }

//         const response = await HttpClient.post(`${urlApi}demande/${id}/update`, data, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             }
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Erreur lors de la mise à jour de la demande:', error);
//         throw error;
//     }
// }

export const importDemandes = async (formData) => {
    try {

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

export const downloadDocument = async (documentId) => {
    try {
        const response = await api.get(`/document/${documentId}/download`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Error downloading document:', error);
        throw error;
    }
};

export const getDocumentDetails = async (documentId) => {
    try {
        const response = await api.get(`/document/${documentId}/details`);
        return response.data;
    } catch (error) {
        console.error('Error getting document details:', error);
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




export async function getDemandeFiles(demandeId) {
    // renvoie { recto: base64, verso: base64 }
    const { data } = await HttpClient.get(`${urlApi}demande/file/${demandeId}`);
    return data;
}


export async function createDemandeForUser(payload) {
  
    const { data } = await HttpClient.post(`${urlApi}demande/create`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
}


export async function updateDemande(id, payload, isMultipart = false) {
    // payload peut contenir: statut, recommandation, rapport, decisionCommission, typeTitre, terrainAKaolack, terrainAilleurs, etc.
    let body = payload;
    let headers = {};
    if (isMultipart) {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => {
            if (v !== undefined && v !== null) fd.append(k, v);
        });
        body = fd;
        headers = { "Content-Type": "multipart/form-data" };
    }
    const { data } = await HttpClient.post(`${urlApi}demande/${id}/update`, body, { headers });
    return data;
}



export async function createDemandeFromElecteur(formData) {
    const { data } = await HttpClient.post(`${urlApi}demande/create-from-electeur` , formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
}


export const updateRapportDemande = async (id, body) => {
    try {
        const response = await HttpClient.put(`${urlApi}demande/${id}/update-rapport`, body );
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du rapport de la demande:', error);
        throw error;
    }
}



export async function updateRecommandation(id, body) {
  // body = { recommandation: string }
  const { data } = await HttpClient.put(`${urlApi}demande/${id}/update-recommandation`, body);
  return data;
}

export async function updateDecisionCommission(id, body) {
  // body = { decision: string }
  const { data } = await HttpClient.put(`${urlApi}demande/${id}/update-decision-commission `, body);
  return data;
}

export async function validerEtape(id) {
  const { data } = await HttpClient.post(`${urlApi}demandes/${id}/valider`);
  return data;
}

export async function rejeterDemande(id, motif) {
  const { data } = await HttpClient.post(`${urlApi}demandes/${id}/rejeter`, { motif });
  return data;
}


export async function setDemandeNiveau(demandeId, niveauId) {
  const { data } = await HttpClient.patch(`${urlApi}demandes/${demandeId}/niveau`, {
    niveauId, 
  });
  return data;
}