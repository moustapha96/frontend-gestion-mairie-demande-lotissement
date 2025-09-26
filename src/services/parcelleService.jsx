import { HttpClient } from "../helpers";

const urlApi = import.meta.env.VITE_API_URL;

// Récupérer tous les Parcelles
export async function getParcellesListe() {
    try {
        const response = await HttpClient.get(`${urlApi}parcelle/liste`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des Parcelles:", error);
        throw error;
    }
}

export async function getParcellesByLotissement(idLotissement) {
    try {
        const response = await HttpClient.get(
            `${urlApi}parcelle/lotissement/${idLotissement}/liste`
        );
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des Parcelles:", error);
        throw error;
    }
}

// Récupérer les détails d'un lot
export async function getLotDetails(id) {
    try {
        const response = await HttpClient.get(`${urlApi}parcelle/${id}/details`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des détails du lot:", error);
        throw error;
    }
}

// // Créer un nouveau lot
export async function createLot(lotData) {
    try {
        const response = await HttpClient.post(`${urlApi}parcelle/create`, lotData);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création du lot:", error);
        throw error;
    }
}

// // Mettre à jour un lot
export async function updateLot(id, lotData) {
    try {
        const response = await HttpClient.put(
            `${urlApi}parcelle/${id}/update`,
            lotData
        );
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du lot:", error);
        throw error;
    }
}

// // Supprimer un lot
export async function deleteLot(id) {
    try {
        const response = await HttpClient.delete(`${urlApi}parcelle/${id}/delete`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression du lot:", error);
        throw error;
    }
}

// // Ajouter cette fonction dans le service
export async function updateParcellestatut(id, statut) {
    try {
        const response = await HttpClient.put(
            `${urlApi}parcelle/${id}/update-statut`,
            { statut }
        );
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut:", error);
        throw error;
    }
}

export async function updateParcelle(id, data) {
    try {
        const response = await HttpClient.put(
            `${urlApi}parcelle/${id}/update`,
            data
        );
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut:", error);
        throw error;
    }
}


export async function getParcellesByUserPaginated(
    userId,
    {
        page = 1,
        size = 10,
        sort = "id,DESC",
        search,
        statut,
        typeParcelle,
        lotissementId,
    } = {}
) {
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("size", size);
    if (sort) params.set("sort", sort);
    if (search) params.set("search", search);
    if (statut) params.set("statut", statut);
    if (typeParcelle) params.set("typeParcelle", typeParcelle);
    if (lotissementId) params.set("lotissementId", lotissementId);

    const { data } = await HttpClient.get(
        `${urlApi}users/${userId}/parcelles?${params.toString()}`
    );
    return data;
}

export async function getParcelles({ page = 1, size = 10, sort = "id,DESC", search, statut, lotissementId } = {}) {
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("size", size);
    if (sort) params.set("sort", sort);
    if (search) params.set("search", search);
    if (statut) params.set("statut", statut);
    if (lotissementId) params.set("lotissementId", lotissementId);

    const { data } = await HttpClient.get(`${urlApi}parcelles-paginated?${params.toString()}`);
    return data;
}

// CRUD existants
export async function createParcelle(payload) {
    const { data } = await HttpClient.post(`${urlApi}parcelle/create`, payload);
    return data;
}
