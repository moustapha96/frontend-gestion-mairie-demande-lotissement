'use client'

import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { PageMetaData, TopNavBar } from '@/components'
import ResponsiveAuthLayout from '../../../layouts/ResponsiveAuthLayout'
import { LoaderCircleIcon } from 'lucide-react'
import { toast } from "sonner"
import { Link, useNavigate } from 'react-router-dom'

import { AppContext } from "../../../AppContext";


const inscriptionSchema = yup.object({
    prenom: yup.string().required("Veuillez entrer votre prénom"),
    nom: yup.string().required("Veuillez entrer votre nom"),
    email: yup.string().email("Veuillez entrer un email valide").required("L'email est requis"),
    telephone: yup.string().required("Le numéro de téléphone est requis"),
    adresse: yup.string().required("L'adresse est requise"),
    profession: yup.string().required("La profession est requise"),
    lieuNaissance: yup.string().required("Le lieu de naissance est requis"),
    dateNaissance: yup
        .date()
        .required("La date de naissance est requise")
        .max(new Date(), "La date ne peut pas être dans le futur")
        .test("age", "Vous devez avoir au moins 18 ans", function (value) {
            if (!value) return false;
            const today = new Date();
            const birthDate = new Date(value);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age >= 18;
        }),
    // numeroElecteur: yup
    //     .string()
    //     .required("Le numéro de carte nationale est requis")
    //     .matches(/^\d{14}$/, "Le numéro doit contenir exactement 14 chiffres"),
    password: yup.string()
        .required("Le mot de passe est requis")
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .matches(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
        .matches(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
        .matches(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
        .matches(/[!@#$%^&*]/, "Le mot de passe doit contenir au moins un caractère spécial"),
    confirmPassword: yup.string()
        .required("Veuillez confirmer votre mot de passe")
        .oneOf([yup.ref('password')], "Les mots de passe ne correspondent pas"),
})

export default function InscriptionPage() {
    const { urlApi } = useContext(AppContext);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(inscriptionSchema)
    })

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            console.log(data)
            data = {
                ...data,
                url: window.location.origin
            }
            console.log(data)

            const response = await fetch(urlApi + "user/inscription", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
              });
              console.log(response)
              if( response.status === 201 ){
                toast.success("Inscription réussie")
                reset()
                navigate("/auth/sign-in")
              }
              if( response.status == 200 ){
                const data = await response.json()
                toast.success(data.message)
                // reset()
                // navigate("/auth/sign-in")
              }
              if( response.status == 409 ){
                toast.error("Email déjà utilisé")
              }

              if( response.status === 400 ){
                console.log(response)
                toast.error("Erreur lors de l'inscription")
              }

            setLoading(false);
        } catch (error) {
            console.error(error)
            toast.error(error.message || "Erreur lors de l'inscription")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <PageMetaData title="Inscription" />
            <TopNavBar menuItems={["accueil", "services", "ressources"]} position="fixed" />

            <section className="md:py-20 flex items-center justify-center relative overflow-hidden bg-cover bg-gradient-to-l from-primary/20 to-primary/20 via-primary/0">
                <div className="container">
                    <ResponsiveAuthLayout title="Créer votre compte">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Prénom */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Prénom</label>
                                    <input
                                        type="text"
                                        {...register('prenom')}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        placeholder="Votre prénom"
                                    />
                                    {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom.message}</p>}
                                </div>

                                {/* Nom */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                                    <input
                                        type="text"
                                        {...register('nom')}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        placeholder="Votre nom"
                                    />
                                    {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        {...register('email')}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        placeholder="votre@email.com"
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                                </div>

                                {/* Téléphone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                                    <input
                                        type="tel"
                                        {...register('telephone')}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        placeholder="Votre numéro de téléphone"
                                    />
                                    {errors.telephone && <p className="mt-1 text-sm text-red-600">{errors.telephone.message}</p>}
                                </div>

                                {/* Adresse */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Adresse</label>
                                    <input
                                        type="text"
                                        {...register('adresse')}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        placeholder="Votre adresse"
                                    />
                                    {errors.adresse && <p className="mt-1 text-sm text-red-600">{errors.adresse.message}</p>}
                                </div>

                                {/* Profession */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Profession</label>
                                    <input
                                        type="text"
                                        {...register('profession')}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        placeholder="Votre profession"
                                    />
                                    {errors.profession && <p className="mt-1 text-sm text-red-600">{errors.profession.message}</p>}
                                </div>

                                {/* Lieu de naissance */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Lieu de naissance</label>
                                    <input
                                        type="text"
                                        {...register('lieuNaissance')}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        placeholder="Votre lieu de naissance"
                                    />
                                    {errors.lieuNaissance && <p className="mt-1 text-sm text-red-600">{errors.lieuNaissance.message}</p>}
                                </div>

                                {/* Date de naissance */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                                    <input
                                        type="date"
                                        {...register('dateNaissance')}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                    />
                                    {errors.dateNaissance && <p className="mt-1 text-sm text-red-600">{errors.dateNaissance.message}</p>}
                                </div>

                                {/* Numéro électeur */}
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700">Numéro électeur</label>
                                    <input
                                        type="text"
                                        {...register('numeroElecteur')}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        placeholder="Votre numéro électeur (14 chiffres)"
                                    />
                                    {errors.numeroElecteur && <p className="mt-1 text-sm text-red-600">{errors.numeroElecteur.message}</p>}
                                </div> */}

                                {/* Mot de passe */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                                    <input
                                        type="password"
                                        {...register('password')}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        placeholder="Votre mot de passe"
                                    />
                                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                                </div>

                                {/* Confirmer le mot de passe */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                                    <input
                                        type="password"
                                        {...register('confirmPassword')}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        placeholder="Confirmez votre mot de passe"
                                    />
                                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
                                </div>
                            </div>

                            {/* Bouton de soumission */}
                            <div className="flex justify-center mt-6">


                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group mt-5 inline-flex w-2/3 items-center justify-center rounded bg-primary px-6 py-2.5 text-white backdrop-blur-2xl transition-all hover:text-white"
                                >
                                    {loading ? (
                                        <>
                                            <LoaderCircleIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                            Inscription en cours...
                                        </>
                                    ) : (
                                        "S'inscrire"
                                    )}
                                </button>
                            </div>

                            {/* Lien de connexion */}
                            <p className="mt-4 text-center text-sm text-gray-600">
                                Déjà inscrit ?{' '}
                                <Link to="/auth/login" className="font-medium text-primary hover:text-primary-dark">
                                    Se connecter
                                </Link>
                            </p>
                        </form>
                    </ResponsiveAuthLayout>
                </div>
            </section>
        </>
    )
}