import {
  PageMetaData,
  PasswordFormInput,
  TextFormInput,
  ThirdPartyAuth,
} from "@/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as yup from "yup";

const SignUp = () => {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerFormSchema = yup.object({
    prenom: yup.string().required("Veuillez entrer votre prénom"),
    nom: yup.string().required("Veuillez entrer votre nom"),
    email: yup
      .string()
      .email("Veuillez entrer un email valide")
      .required("Veuillez entrer votre email"),
    adresse: yup.string().required("Veuillez entrer votre adresse"),
    profession: yup.string().required("Veuillez entrer votre profession"),
    telephone: yup.string().required("Veuillez entrer votre téléphone"),
    lieuNaissance: yup.string().required("Veuillez entrer votre lieu de naissance"),
    dateNaissance: yup.string().required("Veuillez entrer votre date de naissance"),
    numeroElecteur: yup.string().required("Veuillez entrer votre numéro d'électeur"),
    password: yup.string()
      .required("Veuillez entrer votre mot de passe")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .matches(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .matches(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .matches(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
      .matches(/[!@#$%^&*]/, "Le mot de passe doit contenir au moins un caractère spécial"),
    confirmPassword: yup.string()
      .required("Veuillez confirmer votre mot de passe")
      .oneOf([yup.ref('password')], "Les mots de passe ne correspondent pas"),
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(registerFormSchema),
  });

  const onSubmit = async (data) => {
    try {
      // Appel API d'inscription à implémenter
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <PageMetaData title="Inscription" />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              Créer votre compte
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <TextFormInput
                  containerClassName="mb-4"
                  label="Prénom"
                  name="prenom"
                  labelClassName="block text-base/normal text-zinc-200 font-semibold"
                  className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
                  fullWidth
                  placeholder="Entrez votre prénom"
                  control={control}
                />

                <TextFormInput
                  containerClassName="mb-4"
                  label="Nom"
                  name="nom"
                  labelClassName="block text-base/normal text-zinc-200 font-semibold"
                  className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
                  fullWidth
                  placeholder="Entrez votre nom"
                  control={control}
                />

                <TextFormInput
                  containerClassName="mb-4"
                  label="Email"
                  name="email"
                  type="email"
                  labelClassName="block text-base/normal text-zinc-200 font-semibold"
                  className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
                  placeholder="Entrez votre email"
                  fullWidth
                  control={control}
                />

                <TextFormInput
                  containerClassName="mb-4"
                  label="Téléphone"
                  name="telephone"
                  type="tel"
                  labelClassName="block text-base/normal text-zinc-200 font-semibold"
                  className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
                  placeholder="Entrez votre téléphone"
                  fullWidth
                  control={control}
                />

                <TextFormInput
                  containerClassName="mb-4"
                  label="Adresse"
                  name="adresse"
                  labelClassName="block text-base/normal text-zinc-200 font-semibold"
                  className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
                  placeholder="Entrez votre adresse"
                  fullWidth
                  control={control}
                />

                <TextFormInput
                  containerClassName="mb-4"
                  label="Profession"
                  name="profession"
                  labelClassName="block text-base/normal text-zinc-200 font-semibold"
                  className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
                  placeholder="Entrez votre profession"
                  fullWidth
                  control={control}
                />

                <TextFormInput
                  containerClassName="mb-4"
                  label="Lieu de naissance"
                  name="lieuNaissance"
                  labelClassName="block text-base/normal text-zinc-200 font-semibold"
                  className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
                  placeholder="Entrez votre lieu de naissance"
                  fullWidth
                  control={control}
                />

                <TextFormInput
                  containerClassName="mb-4"
                  label="Date de naissance"
                  name="dateNaissance"
                  type="date"
                  labelClassName="block text-base/normal text-zinc-200 font-semibold"
                  className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
                  fullWidth
                  control={control}
                />

                <TextFormInput
                  containerClassName="mb-4"
                  label="Numéro électeur"
                  name="numeroElecteur"
                  labelClassName="block text-base/normal text-zinc-200 font-semibold"
                  className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
                  placeholder="Entrez votre numéro électeur"
                  fullWidth
                  control={control}
                />

                <PasswordFormInput
                  label="Mot de passe"
                  name="password"
                  labelClassName="block text-base/normal text-zinc-200 font-semibold"
                  className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
                  placeholder="Entrez votre mot de passe"
                  fullWidth
                  control={control}
                />

                <PasswordFormInput
                  label="Confirmer le mot de passe"
                  name="confirmPassword"
                  labelClassName="block text-base/normal text-zinc-200 font-semibold"
                  className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
                  placeholder="Confirmez votre mot de passe"
                  fullWidth
                  control={control}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-white/20 bg-white/10 text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary/60 focus:ring-offset-0"
                    id="checkbox-signin"
                  />
                  <label
                    className="ml-3 select-none text-base text-zinc-200"
                    htmlFor="checkbox-signin"
                  >
                    Se souvenir de moi
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                <button
                  className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary hover:bg-primary-600 
                  focus:ring-4 focus:ring-primary/50 text-white font-medium transition-all 
                  duration-200 flex items-center justify-center gap-2"
                  type="submit"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">◌</span>
                      Inscription en cours...
                    </>
                  ) : (
                    <>
                      <span>S'inscrire</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 border-t border-gray-700 pt-6">
              <ThirdPartyAuth />
            </div>

            <p className="mt-6 text-center text-zinc-200">
              Vous avez déjà un compte ?{' '}
              <Link
                to="/auth/sign-in"
                className="text-primary hover:text-primary-400 font-medium transition-colors"
              >
                Connexion
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
