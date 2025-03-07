import { HttpClient } from '../helpers';

const urlApi = import.meta.env.VITE_API_URL;



export async function getDocumentDemandeur(id) {
    try {
        const response = await HttpClient.get(`${urlApi}document/user/${id}/liste`);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la recuperation des demandes:', error);
        throw error;
    }
}


export async function getDocuments() {
    try {
        const response = await HttpClient.get(`${urlApi}document/liste`);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la recuperation des demandes:', error);
        throw error;
    }
}


