import { HttpClient } from '../helpers';

const urlApi = import.meta.env.VITE_API_URL

// Niveaux
export async function getLevels(params = {}) {
    const { data } = await HttpClient.get(`${urlApi}niveaux`, { params });
    return data; // { success, items, total, page, pageSize }
}
export async function createLevel(payload) {
    const { data } = await HttpClient.post(`${urlApi}niveaux`, payload);
    return data;
}
export async function updateLevel(id, payload) {
    const { data } = await HttpClient.put(`${urlApi}niveaux/${id}`, payload);
    return data;
}
export async function deleteLevel(id) {
    const { data } = await HttpClient.delete(`${urlApi}niveaux/${id}`);
    return data;
}

// Historique
export async function getHistoriques(params = {}) {
    const { data } = await HttpClient.get(`${urlApi}historiques`, { params });
    return data; // { success, items, total, page, pageSize }
}
export async function createHistorique(payload) {
    const { data } = await HttpClient.post(`${urlApi}historiques`, payload);
    return data; // { success, item }
}
export async function deleteHistorique(id) {
    const { data } = await HttpClient.delete(`${urlApi}historiques/${id}`);
    return data;
}
