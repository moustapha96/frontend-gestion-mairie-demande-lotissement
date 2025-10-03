// import { HttpClient } from '../helpers';

// const urlApi = import.meta.env.VITE_API_URL;

// export async function getTitres(params = {}) {
//     const res = await HttpClient.get(`${urlApi}titres`, { params });
//     return res.data; // { success, items, total, page, pageSize }
// }

// export async function getTitre(id) {
//     const res = await HttpClient.get(`${urlApi}titres/${id}`);
//     return res.data; // { success, item }
// }

// export async function createTitre(payload) {
//     const res = await HttpClient.post(`${urlApi}titres`, payload);
//     return res.data; // { success, item }
// }

// export async function updateTitre(id, payload) {
//     const res = await HttpClient.put(`${urlApi}titres/${id}`, payload);
//     return res.data; // { success, item }
// }

// export async function deleteTitre(id) {
//     const res = await HttpClient.delete(`${urlApi}titres/${id}`);
//     return res.data; // { success }
// }







// -----------------------------


// import { HttpClient } from '../helpers';

// const urlApi = import.meta.env.VITE_API_URL;


// export async function getTitres(params) {
//     const { data } = await HttpClient.get(`${urlApi}titres`, { params });
//     return data; 
// }

// export async function getTitre(id) {
//     const { data } = await HttpClient.get(`${urlApi}titres/${id}`);
//     return data;
// }

// export async function createTitre(payload, isMultipart = false) {
//     const headers = isMultipart ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" };
//     const body = isMultipart ? payload : JSON.stringify(payload);
//     const { data } = await HttpClient.post(`${urlApi}titres`, body, { headers });
//     return data;
// }

// export async function updateTitre(id, payload, isMultipart = false) {
//     const headers = isMultipart ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" };
//     const body = isMultipart ? payload : JSON.stringify(payload);
//     const { data } = await HttpClient.patch(`${urlApi}titres/${id}`, body, { headers });
//     return data;
// }

// export async function deleteTitre(id) {
//     const { data } = await HttpClient.delete(`${urlApi}titres/${id}`);
//     return data;
// }



// src/services/titreFoncierService.js
import { HttpClient } from '../helpers';
const urlApi = import.meta.env.VITE_API_URL;

// Ne JAMAIS forcer "Content-Type" pour du FormData (Axios posera la boundary).
function isFormData(x) {
    return typeof FormData !== 'undefined' && x instanceof FormData;
}

export async function getTitres(params) {
    const { data } = await HttpClient.get(`${urlApi}titres`, { params });
    return data; // { success, items, total, page, pageSize }
}

export async function getTitre(id) {
    const { data } = await HttpClient.get(`${urlApi}titres/${id}`);
    return data; // { success, item }
}

// export async function createTitre(payload, isMultipart = false) {
   
//     let body = payload;
//  const header = {
//         'Content-Type': 'multipart/form-data',
//         'Accept': 'application/json',
//     } 

//     const { data } = await HttpClient.post(`${urlApi}titres`, body, header);
//     return data; // { success, item }
// }

// export async function updateTitre(id, payload, isMultipart = false) {
//     let body = payload;
//     const header = {
//         'Content-Type': 'multipart/form-data',
//         'Accept': 'application/json',
//     } 

//     const { data } = await HttpClient.patch(`${urlApi}titres/${id}`, body, header);
//     return data; // { success, item }
// }
export async function createTitre(payload, isMultipart = false) {
    const config = {};
    // NE PAS forcer le Content-Type pour FormData, Axios le gère automatiquement
    if (!isMultipart) {
        config.headers = { 'Content-Type': 'application/json' };
    }
    const { data } = await HttpClient.post(`${urlApi}titres`, payload, config);
    return data;
}

export async function updateTitre(id, payload, isMultipart = false) {
    const config = {};
    // NE PAS forcer le Content-Type pour FormData, Axios le gère automatiquement
    if (!isMultipart) {
        config.headers = { 'Content-Type': 'application/json' };
    }
    const { data } = await HttpClient.patch(`${urlApi}titres/${id}`, payload, config);
    return data;
}


export async function mettreAjour(id, payload) {
    const { data } = await HttpClient.patch(`${urlApi}titres/${id}`, payload,
         { headers: { "Content-Type": "multipart/form-data" }  });
    return data;
}

export async function creationTitre(payload) {
    const { data } = await HttpClient.post(`${urlApi}titres`, payload,
         { headers: { "Content-Type": "multipart/form-data" }  });
    return data;
}

export async function deleteTitre(id) {
    const { data } = await HttpClient.delete(`${urlApi}titres/${id}`);
    return data; // { success:true }
}
