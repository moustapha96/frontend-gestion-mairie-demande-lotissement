
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

const SignUpInstitut = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const registerFormSchema = yup.object({
    name: yup.string().required("Veuillez entrer le nom de l'institut"),
    type: yup
      .string()
      .oneOf(["Ecole", "Banque", "Université", "Ambassade"], "Veuillez sélectionner un type valide")
      .required("Veuillez sélectionner le type d'institut"),
    phone: yup.string().required("Veuillez entrer le numéro de téléphone"),
    email: yup
      .string()
      .email("Veuillez entrer un email valide")
      .required("Veuillez entrer votre email"),
    adresse: yup.string().required("Veuillez entrer l'adresse"),
    intitule: yup.string().required("Veuillez entrer l'intitulé"),
    pays_residence: yup
      .string()
      .required("Veuillez entrer le pays de résidence"),
    siteWeb: yup.string().url("Veuillez entrer une URL valide").nullable(),
    password: yup.string().required("Veuillez entrer votre mot de passe"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], "Les mots de passe doivent correspondre")
      .required("Veuillez confirmer votre mot de passe"),
  });
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerFormSchema),
  });

  const onSubmit = async (data) => {
    console.log(data);
    const api = "http://africatransit.sn:8916/api/create-institut";
    try {
      setLoading(true);
      const response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Erreur lors de la création de l\'institut');
        setLoading(false);
        return;
      }
      toast.success("Institut créé avec succès !");
      toast.success("Merci de vérifier votre email pour activer votre compte");

      navigate('/auth/sign-in');
    } catch (error) {
      console.error('Erreur lors de la création de l\'institut:', error);
      setLoading(false);
      toast.error("Erreur lors de la création de l'institut");
    }
  };

  return (
    <>
      <PageMetaData title="Inscription" />

      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg"
        >
          {/* Ligne pour le Nom et le Type d'institut */}
          <div className="flex mb-4">
            <div className="flex-1 mr-2">

              <label htmlFor="name" className="block text-sm font-medium text-white">Nom de l'institut</label>
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
            <div className="flex-1 ml-2">
              <label htmlFor="type" className="block text-sm font-medium text-white">Type</label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="institutId"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="Ecole">École</option>
                    <option value="Banque">Banque</option>
                    <option value="Université">Université</option>
                    <option value="Ambassade">Ambassade</option>
                  </select>
                )}
              />
              {errors.type && <span className="text-red-500">{errors.type.message}</span>}

            </div>
          </div>

          {/* Ligne pour le Numéro de téléphone et l'Adresse */}
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
          </div>


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


          <div>
            <label htmlFor="siteWeb" className="block text-sm font-medium text-white">Site Web</label>
            <Controller
              name="siteWeb"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="siteWeb"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              )}
            />
            {errors.siteWeb && <span className="text-red-500">{errors.siteWeb.message}</span>}
          </div>

          <div>
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

          <div className="flex mb-4">
            <div className="flex-1 mr-2">
              <label htmlFor="password" className="block text-sm font-medium text-white">Mot de passe</label>
              <PasswordFormInput

                containerClassName="mb-4"
                name="password"
                labelClassName="block text-base/normal text-zinc-200 font-semibold"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Entrez votre mot de passe"
                control={control}
              />
              {errors.email && <span className="text-red-500">{errors.email.message}</span>}


            </div>
            <div className="flex-1 ml-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">Confirmation Mot de passe</label>
              <PasswordFormInput
                containerClassName="mb-4"
                name="confirmPassword"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="confirmer votre mot de passe"
                control={control}
              />

            </div>
          </div>


          <div className="text-center">
            <button
              className="group mt-5 inline-flex w-full justify-center rounded bg-primary px-6 py-2.5 text-white backdrop-blur-2xl transition-all hover:bg-primary-700 hover:text-white"
              type="submit"
              disabled={loading}
            >
              {loading ? "chargement..." : "S'inscrire"}
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

export default SignUpInstitut;
