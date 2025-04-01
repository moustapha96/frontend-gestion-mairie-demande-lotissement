import { HttpClient } from '../helpers';

const urlApi = import.meta.env.VITE_API_URL;

export async function sendSimpleMail(data) {
    try {
        const response = await HttpClient.post(`${urlApi}sendSimpleMail`, data);
        return response.data; // Return success message or created institute
    } catch (error) {
        console.error('Erreur lors de l\'envoi du mail:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
}


export async function sendSimpleMailRefus(data) {
    try {
        const response = await HttpClient.post(`${urlApi}sendSimpleMailRefus`, data);
        return response.data; // Return success message or created institute
    } catch (error) {
        console.error('Erreur lors de l\'envoi du mail:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
}

