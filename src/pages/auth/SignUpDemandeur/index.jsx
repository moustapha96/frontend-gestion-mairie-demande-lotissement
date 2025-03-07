
import {
  PageMetaData,
  PasswordFormInput,
  TextFormInput,
  ThirdPartyAuth,
} from "@/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { toast } from "sonner";
import { useState } from "react";
import { Controller } from 'react-hook-form';

const SignUpDemandeur = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const registerFormSchema = yup.object({
    sexe: yup.string().oneOf(['Masculin', 'Féminin'], 'Veuillez sélectionner un sexe valide').required('Le sexe est requis'),
    name: yup.string().required('Le nom est requis'),
    phone: yup.string().required('Le numéro de téléphone est requis'),
    email: yup.string().email('Email invalide').required('L\'email est requis'),
    adresse: yup.string().required('L\'adresse est requise'),
    intitule: yup.string().required('L\'intitulé est requis'),
    profession: yup.string().required('La profession est requise'),
    lieu_naissance: yup.string().required('Le lieu de naissance est requis'),
    pays_residence: yup.string().required('Le pays de résidence est requis'),
    date_naissance: yup.date().required('La date de naissance est requise'),
    password: yup.string().required('Le mot de passe est requis'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Les mots de passe doivent correspondre')
  })

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerFormSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await fetch('http://africatransit.sn:8916/api/create-demandeur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (response.ok) {
        toast.success('Compte créé avec succès')
        // Redirect or handle successful signup
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Erreur lors de la création du compte')
      }
    } catch (error) {
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageMetaData title="Inscription" />

      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg"
        >
          {/* Ligne pour le Sexe et le Nom */}
          <div className="flex mb-4">
            <div className="flex-1 mr-2">
              <label htmlFor="sexe" className="block text-sm font-medium text-white">Sexe</label>
              <Controller
                name="sexe"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="sexe"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                )}
              />
              {errors.sexe && <span className="text-red-500">{errors.sexe.message}</span>}
            </div>
            <div className="flex-1 ml-2">
              <label htmlFor="name" className="block text-sm font-medium text-white">Nom</label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="name"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                )}
              />
              {errors.name && <span className="text-red-500">{errors.name.message}</span>}
            </div>
          </div>

          {/* Ligne pour le Numéro de téléphone et l'Email */}
          <div className="flex mb-4">
            <div className="flex-1 mr-2">
              <label htmlFor="phone" className="block text-sm font-medium text-white">Numéro de téléphone</label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="phone"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                )}
              />
              {errors.phone && <span className="text-red-500">{errors.phone.message}</span>}
            </div>
            <div className="flex-1 ml-2">
              <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    id="email"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                )}
              />
              {errors.email && <span className="text-red-500">{errors.email.message}</span>}
            </div>
          </div>

          {/* Ligne pour l'Adresse */}
          <div className="mb-4">
            <label htmlFor="adresse" className="block text-sm font-medium text-white">Adresse</label>
            <Controller
              name="adresse"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="adresse"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              )}
            />
            {errors.adresse && <span className="text-red-500">{errors.adresse.message}</span>}
          </div>

          {/* Ligne pour l'Intitulé et la Profession */}
          <div className="flex mb-4">
            <div className="flex-1 mr-2">
              <label htmlFor="intitule" className="block text-sm font-medium text-white">Intitulé</label>
              <Controller
                name="intitule"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="intitule"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                )}
              />
              {errors.intitule && <span className="text-red-500">{errors.intitule.message}</span>}
            </div>
            <div className="flex-1 ml-2">
              <label htmlFor="profession" className="block text-sm font-medium text-white">Profession</label>
              <Controller
                name="profession"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="profession"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                )}
              />
              {errors.profession && <span className="text-red-500">{errors.profession.message}</span>}
            </div>
          </div>

          {/* Ligne pour le Lieu de naissance et le Pays de résidence */}
          <div className="flex mb-4">
            <div className="flex-1 mr-2">
              <label htmlFor="lieu_naissance" className="block text-sm font-medium text-white">Lieu de naissance</label>
              <Controller
                name="lieu_naissance"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="lieu_naissance"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                )}
              />
              {errors.lieu_naissance && <span className="text-red-500">{errors.lieu_naissance.message}</span>}
            </div>
            <div className="flex-1 ml-2">
              <label htmlFor="pays_residence" className="block text-sm font-medium text-white">Pays de résidence</label>
              <Controller
                name="pays_residence"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="pays_residence"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                )}
              />
              {errors.pays_residence && <span className="text-red-500">{errors.pays_residence.message}</span>}
            </div>
          </div>

          {/* Ligne pour la Date de naissance */}
          <div className="mb-4">
            <label htmlFor="date_naissance" className="block text-sm font-medium text-white">Date de naissance</label>
            <Controller
              name="date_naissance"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  id="date_naissance"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              )}
            />
            {errors.date_naissance && <span className="text-red-500">{errors.date_naissance.message}</span>}
          </div>

          {/* Ligne pour le Mot de passe et la Confirmation */}
          <div className="flex mb-4">
            <div className="flex-1 mr-2">
              <label htmlFor="password" className="block text-sm font-medium text-white">Mot de passe</label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="password"
                    id="password"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Entrez votre mot de passe"
                  />
                )}
              />
              {errors.password && <span className="text-red-500">{errors.password.message}</span>}
            </div>
            <div className="flex-1 ml-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">Confirmation Mot de passe</label>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="password"
                    id="confirmPassword"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Confirmer votre mot de passe"
                  />
                )}
              />
              {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
            </div>
          </div>

          <div className="text-center">
            <button
              className="group mt-5 inline-flex w-full justify-center rounded bg-primary px-6 py-2.5 text-white backdrop-blur-2xl transition-all hover:bg-primary-700 hover:text-white"
              type="submit"
              disabled={loading}
            >
              {loading ? "Chargement..." : "S'inscrire"}
            </button>
          </div>
        </form>
      </div>

      <p className="text-center text-zinc-200 mt-4">
        Vous avez déjà un compte ?
        <Link to="/auth/sign-in" className="text-primary ms-1">
          <b>Connexion</b>
        </Link>
      </p>
    </>
  );
};

export default SignUpDemandeur;
