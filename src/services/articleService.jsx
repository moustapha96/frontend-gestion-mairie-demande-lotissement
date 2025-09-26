import { HttpClient } from '../helpers';

const urlApi = import.meta.env.VITE_API_URL;

// Function to get all categories
export async function getCategories() {
    try {
        const response = await HttpClient.get(`${urlApi}categories`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        throw error;
    }
}

// Function to create a new category
export async function createCategory(data) {
    console.log(data)
    try {
        const response = await HttpClient.post(`${urlApi}categorie`, data);
        return response;
    } catch (error) {
        console.error('Erreur lors de la création de la catégorie:', error);
        throw error;
    }
}

// Function to update an existing category
export async function updateCategory(id, data) {
    try {
        const response = await HttpClient.put(`${urlApi}categorie/${id}`, data);
        return response;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la catégorie:', error);
        throw error;
    }
}

// Function to delete a category
export async function deleteCategory(id) {
    try {
        const response = await HttpClient.delete(`${urlApi}categorie/${id}`);
        return response;
    } catch (error) {
        console.error('Erreur lors de la suppression de la catégorie:', error);
        throw error;
    }
}

// Function to get all articles
export async function getArticles() {
    try {
        const response = await HttpClient.get(`${urlApi}articles`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error);
        throw error;
    }
}

// Function to create a new article
export async function createArticle(data) {
    try {
        const response = await HttpClient.post(`${urlApi}article`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response;
    } catch (error) {
        console.error('Erreur lors de la création de l\'article:', error);
        throw error;
    }
}

// Function to update an existing article
export async function updateArticle(id, data) {
    try {
        const response = await HttpClient.post(`${urlApi}article/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'article:', error);
        throw error;
    }
}

// Function to delete an article
export async function deleteArticle(id) {
    try {
        const response = await HttpClient.delete(`${urlApi}article/${id}`);
        return response;
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'article:', error);
        throw error;
    }
}
