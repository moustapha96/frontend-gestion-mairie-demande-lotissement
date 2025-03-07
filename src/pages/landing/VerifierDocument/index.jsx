// import { PageMetaData, TopNavBar } from "@/components";
// import FormDemande from "./components/FormDemande";

// const VerifierDocumentPage = () => {
//     return (
//         <>
//             <PageMetaData title="Inscription en tant que institut" />

//             <TopNavBar
//                 menuItems={[
//                     "Accueil",
//                     "A propos",
//                     "Fonctionnalités",
//                     "Nos Services",
//                     "Tarification",
//                     "Contact",
//                     "FAQ",
//                 ]}
//                 position="fixed"
//                 hasDownloadButton
//             />

//             <FormDemande />
//         </>
//     );
// };

// export default VerifierDocumentPage;




'use client'

import { useContext, useState } from 'react'
import { set, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { PageMetaData, TopNavBar } from '@/components'
import ResponsiveAuthLayout from '../../../layouts/ResponsiveAuthLayout'
import { AppContext } from '../../../AppContext'
import { toast } from "sonner";
import { LoaderCircleIcon } from 'lucide-react'

const institutSchema = yup.object({
    name: yup.string().required("Veuillez entrer le nom de l'institut"),
    type: yup.string().required("Veuillez sélectionner le type d'institut"),
    email: yup.string().email("Veuillez entrer un email valide").required("L'email est requis"),
    phone: yup.string().required("Le numéro de téléphone est requis"),
    adresse: yup.string().required("L'adresse est requise"),
    intitule: yup.string().required("L'intitulé est requis"),
    pays_residence: yup.string().required("Le pays de résidence est requis"),
    siteWeb: yup.string().url("Veuillez entrer une URL valide").nullable(),
    password: yup.string().required("Le mot de passe est requis").min(8, "Le mot de passe doit contenir au moins 8 caractères"),
})

export default function VerifierDocumentPage() {
    const [submitStatus, setSubmitStatus] = useState('idle')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const { urlApi } = useContext(AppContext);
    const { register, reset, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(institutSchema)
    })

    const onSubmit = async (data) => {
        setLoading(true)
        setSubmitStatus('idle')
        setErrorMessage('')


        console.log(JSON.stringify(data))
        try {
            const response = await fetch(urlApi + "create-institut", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            console.log(data)

            if (response.ok) {
                reset()
                toast.success('Compte créé avec succès')
                // Redirect or handle successful signup
            } else {
                toast.error(response.statusText || 'Erreur lors de la création du compte')
                throw new Error(response.statusText || 'Une erreur est survenue lors de l\'inscription')
            }


            setSubmitStatus('success')
            setLoading(false)
        } catch (error) {
            console.log(error)
            setSubmitStatus('error')
            setErrorMessage(error.message)
            setLoading(false)
        }
    }

    return (
        <>
            <PageMetaData title="Inscription en tant qu'institut" />

            <TopNavBar
                menuItems={[
                    "Accueil",
                    "A propos",
                    "Fonctionnalités",
                    "Nos Services",
                    "Tarification",
                    "Contact",
                    "FAQ",
                ]}
                position="fixed"
                hasDownloadButton
            />

            <ResponsiveAuthLayout title="Créer un compte en tant qu'Institut">
                {submitStatus === 'success' && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        <p className="font-bold">Succès</p>
                        <p>Votre inscription a été effectuée avec succès. Vous recevrez bientôt un email de confirmation.</p>
                    </div>
                )}

                {submitStatus === 'error' && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        <p className="font-bold">Erreur</p>
                        <p>{errorMessage}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nom de l'institut
                        </label>
                        <input
                            id="name"
                            {...register('name')}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Type d'institut
                        </label>
                        <select
                            id="type"
                            {...register('type')}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">Sélectionnez le type d'institut</option>

                            <option value="Ecole">École</option>
                            <option value="Banque">Banque</option>
                            <option value="Ambassade">Ambassade</option>
                            <option value="Université">Université</option>
                        </select>
                        {errors.type && <p className="mt-2 text-sm text-red-600">{errors.type.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register('email')}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Numéro de téléphone
                        </label>
                        <input
                            id="phone"
                            {...register('phone')}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                            Adresse
                        </label>
                        <input
                            id="adresse"
                            {...register('adresse')}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.adresse && <p className="mt-2 text-sm text-red-600">{errors.adresse.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="intitule" className="block text-sm font-medium text-gray-700">
                            Intitulé
                        </label>
                        <input
                            id="intitule"
                            {...register('intitule')}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.intitule && <p className="mt-2 text-sm text-red-600">{errors.intitule.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="pays_residence" className="block text-sm font-medium text-gray-700">
                            Pays de résidence
                        </label>
                        <input
                            id="pays_residence"
                            {...register('pays_residence')}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.pays_residence && <p className="mt-2 text-sm text-red-600">{errors.pays_residence.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="siteWeb" className="block text-sm font-medium text-gray-700">
                            Site web (optionnel)
                        </label>
                        <input
                            id="siteWeb"
                            {...register('siteWeb')}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.siteWeb && <p className="mt-2 text-sm text-red-600">{errors.siteWeb.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register('password')}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary focus:outline-none  ${loading ? "cursor-not-allowed" : "cursor-pointer hover:bg-rougeLogo"}  `}
                        >
                            {!loading ? "S'inscrire" : "Inscription..."}
                            {loading && <LoaderCircleIcon className="animate-spin" />}

                        </button>
                    </div>
                </form>
            </ResponsiveAuthLayout>

        </>
    )
}