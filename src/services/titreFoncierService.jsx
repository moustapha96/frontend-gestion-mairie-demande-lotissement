import { HttpClient } from '../helpers';

const urlApi = import.meta.env.VITE_API_URL;

export async function getTitres(params = {}) {
    const res = await HttpClient.get(`${urlApi}titres`, { params });
    return res.data; // { success, items, total, page, pageSize }
}

export async function getTitre(id) {
    const res = await HttpClient.get(`${urlApi}titres/${id}`);
    return res.data; // { success, item }
}

export async function createTitre(payload) {
    const res = await HttpClient.post(`${urlApi}titres`, payload);
    return res.data; // { success, item }
}

export async function updateTitre(id, payload) {
    const res = await HttpClient.put(`${urlApi}titres/${id}`, payload);
    return res.data; // { success, item }
}

export async function deleteTitre(id) {
    const res = await HttpClient.delete(`${urlApi}titres/${id}`);
    return res.data; // { success }
}
