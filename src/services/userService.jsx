
import { HttpClient } from '../helpers';

const urlApi = import.meta.env.VITE_API_URL
// Function to create a new user
export async function createUser(userData) {
    try {
        const response = await HttpClient.post(`${urlApi}create-users`, userData);
        return response.data; // Return success message or created user
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
}

export async function inscription(userData) {
    try {
        const response = await HttpClient.post(`${urlApi}user/inscription`, userData);
        return response.data; // Return success message or created user
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
}

// Function to verify a user account
export async function verifyAccount(token) {
    try {
        const response = await HttpClient.get(`${urlApi}verifier-compte/${token}`);
        return response.data; // Return verification result
    } catch (error) {
        console.error('Erreur lors de la vérification du compte:', error);
        throw error;
    }
}

// Function to deactivate a user account
export async function deactivateAccount(userId) {
    try {
        const response = await HttpClient.get(`${urlApi}deactiver-compte/${userId}`);
        return response.data; // Return success message
    } catch (error) {
        console.error('Erreur lors de la désactivation du compte:', error);
        throw error;
    }
}

// Function to modify user account information
export async function modifyAccount(userId, userData) {
    try {
        const response = await HttpClient.put(`${urlApi}modifier-compte/${userId}`, userData);
        return response.data; // Return updated user data
    } catch (error) {
        console.error('Erreur lors de la modification du compte:', error);
        throw error;
    }
}

// Function to create an admin user
export async function createAdminUser(adminData) {
    try {
        const response = await HttpClient.post(`${urlApi}user/create-admin`, adminData);
        return response.data; // Return success message or created admin
    } catch (error) {
        console.error('Erreur lors de la création de l\'administrateur:', error);
        throw error;
    }
}

// finc all accounts
export async function getAllAccounts() {
    try {
        const response = await HttpClient.get(`${urlApi}user/liste`);
        return response.data; // Return list of users
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        throw error;
    }
}

// update activeted status user 
export async function updateActivatedStatus(userId, currentStatus) {
    try {
        console.log(currentStatus)
        const response = await HttpClient.put(`${urlApi}user/update-activated-status/${userId}`, { isActive: !currentStatus });
        return response.data; // Return list of users
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        throw error;
    }
}


//  send reset password
export async function sendResetPassword(email) {
    try {
        const response = await HttpClient.post(`${urlApi}password-reset`, { email });
        return response.data; // Return list of users
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        throw error;
    }
}
// upload profile picture


// setCompteEnable
export async function setCompteEnable(userId, status) {
    try {
        const response = await HttpClient.put(`${urlApi}set-compte-enable/${userId}`, {
            enabled: status
        });
        return response.data; // Return list of users
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        throw error;
    }
}

export async function updateUserProfile(id, data) {
    console.log(data)
    try {
        const response = await HttpClient.put(`${urlApi}user/update-profile/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        throw error;
    }
}




export const uploadProfileImage = async (formData) => {
    try {
        const response = await HttpClient.post(`${urlApi}user/upload-profile-picture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors du téléchargement de l'image de profil:", error);
        throw error;
    }
};

export const getDemandeurDetails = async (id) => {
    try {
        const response = await HttpClient.get(`${urlApi}user/${id}/details`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw error;
    }
}

export const getDemandeurListe = async () => {
    try {
        const response = await HttpClient.get(`${urlApi}user/liste`);
        return response.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

// updatePassword
export const updatePassword = async (id, data) => {
    try {
        const response = await HttpClient.put(`${urlApi}user/${id}/update-password`, data);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        throw error;
    }
}

export const updateUserRole = async (id, role) => {
    try {
        const response = await HttpClient.put(`${urlApi}user/${id}/update-role`, { role });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        throw error;
    }

}

export const getDetaitHabitant = async (id) => {
    try {
        const response = await HttpClient.get(`${urlApi}user/${id}/is-habitant`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la recuperation des details du habitant:', error);
        throw error;
    }
}