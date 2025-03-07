'use client'

import React, { useEffect, useState } from 'react';
import { Save, Building, Phone, Globe, Mail, Link2, Loader, User, MapPin, UserCheck, UserX, UserPlus, Calendar, Briefcase } from 'lucide-react';
import { AdminBreadcrumb } from "@/components";
import { toast } from 'sonner';
import { getConfigurations, updateConfiguration } from '@/services/configurationService';
import { getAllAccounts, updateActivatedStatus, createAdminUser, updateUserRole } from '@/services/userService';
import { useAuthContext } from '@/context';
import { cn } from '@/utils';
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";


const AdminConfiguration = () => {
  const { user } = useAuthContext();
  console.log(user)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null)
  const [config, setConfig] = useState({
    titre: '',
    adresse: '',
    telephone: '',
    siteWeb: '',
    email: '',
    nomMaire: ''
  });

  const [activeTab, setActiveTab] = useState('config');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    nom: '',
    prenom: '',
    dateNaissance: '',
    lieuNaissance: '',
    numeroElecteur: '',
    telephone: '',
    adresse: '',
    profession: ''
  });
  const [loadingUser, setLoadingUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // Nombre d'utilisateurs par page

  // Ajouter cette fonction pour la pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchConfigurations = async () => {
      setLoading(true);
      try {
        const response = await getConfigurations();
        console.log(response)
        const configObj = {};
        configObj["titre"] = response.titre;
        configObj["nomMaire"] = response.nomMaire;
        configObj["telephone"] = response.telephone;
        configObj["email"] = response.email;
        configObj["siteWeb"] = response.siteWeb;
        configObj["adresse"] = response.adresse;

        setConfig(configObj);
      } catch (error) {
        setError(err.message)
        toast.error('Erreur lors de la récupération des configurations');
      } finally {
        setLoading(false);
      }
    };

    fetchConfigurations();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllAccounts();

      if (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_SUPER_ADMIN')) {
        setUsers(data);
      } else {
        const filteredUsers = data.filter(user =>
          !user.roles.includes('ROLE_ADMIN') &&
          !user.roles.includes('ROLE_SUPER_ADMIN'));
        setUsers(filteredUsers);
      }

      // console.log(data)
      // setUsers(data);
    } catch (error) {
      setError(err.message)
      toast.error('Erreur lors de la récupération des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (userId, currentStatus) => {
    setLoadingUser(userId);
    try {
      await updateActivatedStatus(userId, currentStatus);
      await fetchUsers(); // Recharger la liste
      toast.success('Statut de l\'utilisateur mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
    } finally {
      setLoadingUser(null);
    }
  };


  const handleRoleChange = async (userId, newRole) => {

    if (newRole === 'ROLE_ADMIN' && !user.roles.includes('ROLE_SUPER_ADMIN')) {
      toast.error('Seul un super administrateur peut attribuer le rôle administrateur');
      return;
    }

    setLoadingUser(userId);
    try {
      await updateUserRole(userId, newRole);
      await fetchUsers();
      toast.success('Rôle de l\'utilisateur mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du rôle');
    } finally {
      setLoadingUser(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mettre à jour chaque configuration
      await Promise.all(
        Object.entries(config).map(([key, value]) =>
          updateConfiguration(key, value)
        )
      );
      toast.success('Configurations mises à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des configurations:', error);
      toast.error('Erreur lors de la mise à jour des configurations');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log(newAdmin)
    try {
      await createAdminUser(newAdmin);
      toast.success('Administrateur créé avec succès');
      setNewAdmin({
        email: '',
        nom: '',
        prenom: '',
        dateNaissance: '',
        lieuNaissance: '',
        numeroElecteur: '',
        telephone: '',
        adresse: '',
        profession: ''
      });
    } catch (error) {
      toast.error('Erreur lors de la création de l\'administrateur');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const tabs = [
    { id: 'config', label: 'Configuration' },
    { id: 'users', label: 'Utilisateurs' },
    ...(user.roles.includes('ROLE_SUPER_ADMIN') ? [
      { id: 'new-admin', label: 'Nouvel Admin' }
    ] : [])
  ];

  const formatRoleDisplay = (role) => {
    const roleMap = {
      'ROLE_DEMANDEUR': 'Demandeur',
      'ROLE_AGENT': 'Agent',
      'ROLE_ADMIN': 'Administrateur',
      'ROLE_SUPER_ADMIN': 'Super Administrateur'
    };
    return roleMap[role] || role;
  };

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorDisplay error={error} />

  return (
    <>
      <AdminBreadcrumb title="Configuration" />
      <div className="container mx-auto py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Onglets */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'py-4 px-1 border-b-2 font-medium text-sm',
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'config' ? (
              // Configuration existante
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">
                      Titre de la mairie
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        id="titre"
                        name="titre"
                        type="text"
                        value={config.titre}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="nomMaire" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du maire
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        id="nomMaire"
                        name="nomMaire"
                        type="text"
                        value={config.nomMaire}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <textarea
                        id="adresse"
                        name="adresse"
                        rows="2"
                        value={config.adresse}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        id="telephone"
                        name="telephone"
                        type="tel"
                        value={config.telephone}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={config.email}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="siteWeb" className="block text-sm font-medium text-gray-700 mb-1">
                      Site Web
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        id="siteWeb"
                        name="siteWeb"
                        type="url"
                        value={config.siteWeb}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="https://www.example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-1/2 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="animate-spin mr-2" size={20} />
                        Mise à jour...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2" size={20} />
                        Enregistrer les modifications
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : activeTab === 'new-admin' && user.roles.includes('ROLE_SUPER_ADMIN') ? (
              // Formulaire de création d'un nouvel admin
              <form onSubmit={handleAdminSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        id="nom"
                        name="nom"
                        type="text"
                        value={newAdmin.nom}
                        onChange={handleAdminInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        id="prenom"
                        name="prenom"
                        type="text"
                        value={newAdmin.prenom}
                        onChange={handleAdminInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={newAdmin.email}
                        onChange={handleAdminInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700 mb-1">
                      Date de Naissance
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        id="dateNaissance"
                        name="dateNaissance"
                        type="date"
                        value={newAdmin.dateNaissance}
                        onChange={handleAdminInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lieuNaissance" className="block text-sm font-medium text-gray-700 mb-1">
                      Lieu de Naissance
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        id="lieuNaissance"
                        name="lieuNaissance"
                        type="text"
                        value={newAdmin.lieuNaissance}
                        onChange={handleAdminInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="numeroElecteur" className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro d'Électeur
                    </label>
                    <div className="relative">
                      <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        id="numeroElecteur"
                        name="numeroElecteur"
                        type="text"
                        value={newAdmin.numeroElecteur}
                        onChange={handleAdminInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        id="telephone"
                        name="telephone"
                        type="tel"
                        value={newAdmin.telephone}
                        onChange={handleAdminInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-1">
                      Profession
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        id="profession"
                        name="profession"
                        type="text"
                        value={newAdmin.profession}
                        onChange={handleAdminInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <textarea
                        id="adresse"
                        name="adresse"
                        rows="2"
                        value={newAdmin.adresse}
                        onChange={handleAdminInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-1/2 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="animate-spin mr-2" size={20} />
                        Création...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2" size={20} />
                        Créer l'administrateur
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentUsers.map((userr) => (
                      <tr key={userr.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {userr.nom} {userr.prenom}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{userr.email}</td>

                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <select
                            value={userr.roles[0]}
                            onChange={(e) => handleRoleChange(userr.id, e.target.value)}
                            disabled={loadingUser === userr.id || (userr.roles[0] === 'ROLE_ADMIN' || user.roles.includes('ROLE_SUPER_ADMIN'))}

                            className={cn(
                              "block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
                              loadingUser === userr.id && "opacity-50 cursor-not-allowed",
                              userr.roles[0] === 'ROLE_ADMIN' && !user.roles.includes('ROLE_SUPER_ADMIN') && "bg-gray-100"
                            )}
                          >
                            <option value="ROLE_DEMANDEUR">Demandeur</option>
                            <option value="ROLE_AGENT">Agent</option>
                            {user.roles.includes('ROLE_SUPER_ADMIN') && (
                              <option value="ROLE_ADMIN">Admin</option>
                            )}
                          </select>
                          {loadingUser === userr.id && (
                            <Loader className="animate-spin w-4 h-4 ml-2 inline" />
                          )}
                        </td> */}

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <select
                            value={userr.roles[0]}
                            onChange={(e) => handleRoleChange(userr.id, e.target.value)}
                            disabled={loadingUser === userr.id ||
                              (userr.roles[0] === 'ROLE_ADMIN' && !user.roles.includes('ROLE_SUPER_ADMIN')) ||
                              userr.roles.includes('ROLE_SUPER_ADMIN')}
                            className={cn(
                              "block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
                              loadingUser === userr.id && "opacity-50 cursor-not-allowed",
                              (userr.roles[0] === 'ROLE_ADMIN' && !user.roles.includes('ROLE_SUPER_ADMIN')) && "bg-gray-100"
                            )}
                          >
                            <option value="ROLE_DEMANDEUR">Demandeur</option>
                            <option value="ROLE_AGENT">Agent</option>
                            <option value="ROLE_ADMIN">Admin</option>
                            {user.roles.includes('ROLE_SUPER_ADMIN') && (
                              <option value="ROLE_SUPER_ADMIN">Super Admin</option>
                            )}
                          </select>
                          {loadingUser === userr.id && (
                            <Loader className="animate-spin w-4 h-4 ml-2 inline" />
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                            userr.activated
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          )}>
                            {userr.activated ? 'Activé' : 'Désactivé'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">

                          <button
                            onClick={() => handleActivateUser(userr.id, userr.activated)}
                            disabled={loadingUser === userr.id}
                            className={cn(
                              "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium",
                              userr.activated
                                ? "text-red-700 bg-red-100 hover:bg-red-200"
                                : "text-green-700 bg-green-100 hover:bg-green-200",
                              loadingUser === userr.id && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            {loadingUser === userr.id ? (
                              <>
                                <Loader className="animate-spin w-4 h-4 mr-1" />
                                {userr.activated ? 'Désactivation...' : 'Activation...'}
                              </>
                            ) : (
                              <>
                                {userr.activated ? (
                                  <><UserX className="w-4 h-4 mr-1" /> Désactiver</>
                                ) : (
                                  <><UserCheck className="w-4 h-4 mr-1" /> Activer</>
                                )}
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex items-center justify-between mt-4 px-6 py-4 border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Affichage de {indexOfFirstUser + 1} à {Math.min(indexOfLastUser, users.length)} sur{" "}
                    {users.length} utilisateurs
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={cn(
                        "px-3 py-1 rounded-md",
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      <LuChevronLeft className="h-5 w-5" />
                    </button>

                    {Array.from({ length: Math.ceil(users.length / usersPerPage) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={cn(
                          "px-3 py-1 rounded-md",
                          currentPage === index + 1
                            ? "bg-primary text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50",
                        )}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === Math.ceil(users.length / usersPerPage)}
                      className={cn(
                        "px-3 py-1 rounded-md",
                        currentPage === Math.ceil(users.length / usersPerPage)
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50",
                      )}
                    >
                      <LuChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>


              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
function LoadingSkeleton() {
  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="h-9 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="flex items-center space-x-3 mt-4">
                      <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function ErrorDisplay({ error }) {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow rounded-lg overflow-hidden w-full max-w-md">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-red-600 mb-4">Erreur</h3>
          <p className="text-center">{error}</p>
        </div>
      </div>
    </div>
  )
}

export default AdminConfiguration;