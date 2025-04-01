import { HttpClient } from '../helpers';

const urlApi = import.meta.env.VITE_API_URL;
const BASE_URL = `${urlApi}document-models`;

/**
 * Service pour la gestion des modèles de documents
 */

class DocumentModelService {
  /**
   * Récupère la liste de tous les modèles de documents
   * @returns {Promise<Array>} Liste des modèles de documents
   */
  async getAllModels() {
    try {
      const response = await HttpClient.get(`${BASE_URL}/liste`);
      return {
        success: true,
        data: response.data,
        message: 'Modèles récupérés avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des modèles:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Erreur lors de la récupération des modèles'
      };
    }
  }

  /**
   * Récupère un modèle de document par son ID
   * @param {string} id - ID du modèle
   * @returns {Promise<Object>} Modèle de document
   */
  async getModelById(id) {
    try {
      const response = await HttpClient.get(`${BASE_URL}/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Modèle récupéré avec succès'
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération du modèle ${id}:`, error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Erreur lors de la récupération du modèle'
      };
    }
  }

  /**
   * Crée un nouveau modèle de document
   * @param {Object} modelData - Données du modèle
   * @returns {Promise<Object>} Modèle créé
   */
  async createModel(modelData) {
    try {
      // Validation des données requises
      if (!modelData.name || !modelData.description || !modelData.format) {
        throw new Error('Les champs nom, description et format sont requis');
      }

      const response = await HttpClient.post(`${BASE_URL}/create`, modelData);
      return {
        success: true,
        data: response.data,
        message: 'Modèle créé avec succès'
      };
    } catch (error) {
      console.error('Erreur lors de la création du modèle:', error);
      return {
        success: false,
        data: null,
        message: error.message || error.response?.data?.message || 'Erreur lors de la création du modèle'
      };
    }
  }

  /**
   * Met à jour un modèle de document existant
   * @param {string} id - ID du modèle
   * @param {Object} modelData - Nouvelles données du modèle
   * @returns {Promise<Object>} Modèle mis à jour
   */
  async updateModel(id, modelData) {
    try {
      if (!id) {
        throw new Error('ID du modèle requis');
      }

      // Validation des données requises
      if (!modelData.name && !modelData.description && !modelData.format) {
        throw new Error('Au moins un champ à modifier est requis');
      }

      const response = await HttpClient.put(`${BASE_URL}/${id}/update`, modelData);
      return {
        success: true,
        data: response.data,
        message: 'Modèle mis à jour avec succès'
      };
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du modèle ${id}:`, error);
      return {
        success: false,
        data: null,
        message: error.message || error.response?.data?.message || 'Erreur lors de la mise à jour du modèle'
      };
    }
  }

  /**
   * Supprime un modèle de document
   * @param {string} id - ID du modèle à supprimer
   * @returns {Promise<Object>} Résultat de la suppression
   */
  async deleteModel(id) {
    try {
      if (!id) {
        throw new Error('ID du modèle requis');
      }

      const response = await HttpClient.delete(`${BASE_URL}/${id}/delete`);
      return {
        success: true,
        data: response.data,
        message: 'Modèle supprimé avec succès'
      };
    } catch (error) {
      console.error(`Erreur lors de la suppression du modèle ${id}:`, error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Erreur lors de la suppression du modèle'
      };
    }
  }

  /**
   * Vérifie si un modèle est utilisé par des documents
   * @param {string} id - ID du modèle
   * @returns {Promise<Object>} Résultat de la vérification
   */
  async checkModelUsage(id) {
    try {
      const response = await HttpClient.get(`${BASE_URL}/${id}/usage`);
      return {
        success: true,
        data: response.data,
        message: 'Vérification effectuée avec succès'
      };
    } catch (error) {
      console.error(`Erreur lors de la vérification de l'utilisation du modèle ${id}:`, error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Erreur lors de la vérification'
      };
    }
  }
}

// Export une instance unique du service
export const documentModelService = new DocumentModelService();
