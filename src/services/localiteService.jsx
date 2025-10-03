
import { HttpClient } from '../helpers';

const urlApi = import.meta.env.VITE_API_URL;


export async function getLocalites() {
    try {
        const response = await HttpClient.get(`${urlApi}localite/liste`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des localités:', error);
        throw error;
    }
};


export async function getLocaliteDetails(id) {
    try {
        const response = await HttpClient.get(`${urlApi}localite/${id}/details`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des Détail du Quartié:', error);
        throw error;
    }
}

export async function createLocalite(localiteData) {
    try {
        const response = await HttpClient.post(`${urlApi}localite/create`, localiteData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création de la localité:', error);
        throw error;
    }
}

// Mettre à jour une localité
export async function updateLocalite(id, localiteData) {
    try {
        const response = await HttpClient.put(`${urlApi}localite/${id}/update`, localiteData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la localité:', error);
        throw error;
    }
}

// Supprimer une localité
export async function deleteLocalite(id) {
    try {
        const response = await HttpClient.delete(`${urlApi}localite/${id}/delete`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression de la localité:', error);
        throw error;
    }
}



export async function getLocalitesWeb() {
    try {
        // const responseFetch = await fetch(`${urlApi}localite/liste-web`);
        const responseFetch = await fetch(`${urlApi}localite/liste-web`, { mode: 'cors' });
        const responseData = await responseFetch.json();
        return responseData;
    } catch (error) {
        throw error;
    }
};

export async function getLocalitesWebd() {
    try {

        const response = await fetch(`${urlApi}localite/liste-web`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            credentials: 'omit',
            cache: 'no-cache',
            referrerPolicy: 'no-referrer'
        });


        if (!response.ok) {
            const errorText = await response.text();
            console.error('Réponse serveur:', errorText);
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        // Amélioration des logs d'erreur
        console.error('Détails de l\'erreur:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });

        // Vérification de la connectivité réseau
        if (!navigator.onLine) {
            throw new Error('Pas de connexion Internet');
        }

        throw new Error(`Impossible de récupérer les localités: ${error.message}`);
    }
}
export async function getLocaliteLotissement(id) {
    try {
        const response = await HttpClient.get(`${urlApi}localite/${id}/lotissements`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des localités:', error);
        throw error;
    }
}

export async function getLocaliteDtailsConfirmation(id) {
    try {
        const response = await HttpClient.get(`${urlApi}localite/${id}/details-confirmation`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des localités:', error);
        throw error;
    }
}


