import { HttpClient } from '../helpers';

const urlApi = import.meta.env.VITE_API_URL;

// Récupérer tous les plans de lotissement
// export async function getPlanLotissements() {
//     try {
//         const response = await HttpClient.get(`${urlApi}plan-lotissement/liste`);
//         return response.data;
//     } catch (error) {
//         console.error('Erreur lors de la récupération des plans de lotissement:', error);
//         throw error;
//     }
// }

// // Récupérer les détails d'un plan de lotissement
// export async function getPlanLotissementDetails(id) {
//     try {
//         const response = await HttpClient.get(`${urlApi}plan-lotissement/${id}/details`);
//         return response.data;
//     } catch (error) {
//         console.error('Erreur lors de la récupération des détails du plan de lotissement:', error);
//         throw error;
//     }
// }

// // Créer un nouveau plan de lotissement
// export async function createPlanLotissement(planData) {
//     try {
//         const response = await HttpClient.post(`${urlApi}plan-lotissement/create`, planData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Erreur lors de la création du plan de lotissement:', error);
//         throw error;
//     }
// }

// // Mettre à jour un plan de lotissement
// export async function updatePlanLotissement(id, planData) {
//     try {
//         const response = await HttpClient.put(`${urlApi}plan-lotissement/${id}/update`, planData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Erreur lors de la mise à jour du plan de lotissement:', error);
//         throw error;
//     }
// }

// // Supprimer un plan de lotissement
// export async function deletePlanLotissement(id) {
//     try {
//         const response = await HttpClient.delete(`${urlApi}plan-lotissement/${id}/delete`);
//         return response.data;
//     } catch (error) {
//         console.error('Erreur lors de la suppression du plan de lotissement:', error);
//         throw error;
//     }
// }

// export async function getFileDocumentPlan(id) {
//     try {
//         const response = await HttpClient.get(`${urlApi}plan-lotissement/file/${id}`);
//         return response.data;
//     } catch (error) {
//         console.error('Erreur lors de la récupération des localités:', error);
//         throw error;
//     }
// }




export async function getPlanLotissements({ page=1, size=10, sort="dateCreation,DESC", search, lotissementId } = {}) {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("size", size);
  if (sort) params.set("sort", sort);
  if (search) params.set("search", search);
  if (lotissementId) params.set("lotissementId", lotissementId);
  const { data } = await HttpClient.get(`${urlApi}plan-lotissements?${params.toString()}`);
  return data; // { data, meta }
}

export async function getFileDocumentPlan(id) {
  const { data } = await HttpClient.get(`${urlApi}plan-lotissements/${id}/document`, {
    responseType: "text", // base64
  });
  return data; // base64
}

export async function createPlanLotissement(formData) {
  const { data } = await HttpClient.post(`${urlApi}plan-lotissements`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updatePlanLotissement(id, formData) {
  const { data } = await HttpClient.put(`${urlApi}plan-lotissements/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}