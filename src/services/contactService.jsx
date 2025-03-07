
import { HttpClient } from '../helpers';




const urlApi = import.meta.env.VITE_API_URL
// Function to create a new demande
export async function createContact(data) {
    const response = await fetch(urlApi + "contacts/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return response;
}

// Function to get a demande by ID
export async function getContact(id) {
    try {
        const response = await HttpClient.get(`${urlApi}contacts/${id}`);
        return response.data; // Return the demande data
    } catch (error) {
        console.error('Erreur lors de la récupération de la demande:', error);
        throw error;
    }
}

// get all contact 
export async function getAllContact() {
    try {
        const response = await HttpClient.get(`${urlApi}contacts/liste`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de layses demandes:', error);
        throw error;
    }
}