

// // src/services/titreFoncierService.js
// import { HttpClient } from '../helpers';
// const urlApi = import.meta.env.VITE_API_URL;

// // Ne JAMAIS forcer "Content-Type" pour du FormData (Axios posera la boundary).
// function isFormData(x) {
//     return typeof FormData !== 'undefined' && x instanceof FormData;
// }

// export async function getTitres(params) {
//     const { data } = await HttpClient.get(`${urlApi}titres`, { params });
//     return data; // { success, items, total, page, pageSize }
// }

// export async function getTitre(id) {
//     const { data } = await HttpClient.get(`${urlApi}titres/${id}`);
//     return data; // { success, item }
// }

// // export async function createTitre(payload, isMultipart = false) {

// //     let body = payload;
// //  const header = {
// //         'Content-Type': 'multipart/form-data',
// //         'Accept': 'application/json',
// //     } 

// //     const { data } = await HttpClient.post(`${urlApi}titres`, body, header);
// //     return data; // { success, item }
// // }

// // export async function updateTitre(id, payload, isMultipart = false) {
// //     let body = payload;
// //     const header = {
// //         'Content-Type': 'multipart/form-data',
// //         'Accept': 'application/json',
// //     } 

// //     const { data } = await HttpClient.patch(`${urlApi}titres/${id}`, body, header);
// //     return data; // { success, item }
// // }
// export async function createTitre(payload, isMultipart = false) {
//     const config = {};
//     // NE PAS forcer le Content-Type pour FormData, Axios le gère automatiquement
//     if (!isMultipart) {
//         config.headers = { 'Content-Type': 'application/json' };
//     }
//     const { data } = await HttpClient.post(`${urlApi}titres`, payload, config);
//     return data;
// }

// export async function updateTitre(id, payload, isMultipart = false) {
//     const config = {};
//     // NE PAS forcer le Content-Type pour FormData, Axios le gère automatiquement
//     if (!isMultipart) {
//         config.headers = { 'Content-Type': 'application/json' };
//     }
//     const { data } = await HttpClient.patch(`${urlApi}titres/${id}`, payload, config);
//     return data;
// }


// export async function mettreAjour(id, payload) {
//     const { data } = await HttpClient.patch(`${urlApi}titres/${id}`, payload,
//          { headers: { "Content-Type": "multipart/form-data" }  });
//     return data;
// }

// export async function creationTitre(payload) {
//     const { data } = await HttpClient.post(`${urlApi}titres`, payload,
//          { headers: { "Content-Type": "multipart/form-data" }  });
//     return data;
// }

// export async function deleteTitre(id) {
//     const { data } = await HttpClient.delete(`${urlApi}titres/${id}`);
//     return data; // { success:true }
// }


// // src/services/titreFoncierService.js
import { HttpClient } from '../helpers';
const urlApi = import.meta.env.VITE_API_URL;

export const getTitres = (params) =>
    HttpClient.get(`${urlApi}titres`, { params }).then(r => r.data);

export const getTitre = (id) =>
    HttpClient.get(`${urlApi}titres/${id}`).then(r => r.data);

export const creationTitre = (formData) =>
    HttpClient.post(`${urlApi}titres`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data);

export const mettreAjour = (id, formData) =>
    HttpClient.post(`${urlApi}titres/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data);

export const deleteTitre = (id) =>
    HttpClient.delete(`${urlApi}titres/${id}`).then(r => r.data);
