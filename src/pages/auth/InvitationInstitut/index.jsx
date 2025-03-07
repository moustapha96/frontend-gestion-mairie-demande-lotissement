import {
    PageMetaData,
    PasswordFormInput,
    TextFormInput,
} from "@/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { AppContext } from "../../../AppContext";

const registerFormSchema = yup.object({
    name: yup.string().required("Veuillez entrer votre nom"),
    email: yup.string().email("Veuillez entrer un email valide").required("L'email est requis"),
    phone: yup.string().required("Le numéro de téléphone est requis"),
    adresse: yup.string().required("L'adresse est requise"),
    intitule: yup.string().required("L'intitulé est requis"),
    profession: yup.string().required("La profession est requise"),
    lieu_naissance: yup.string().required("Le lieu de naissance est requis"),
    pays_residence: yup.string().required("Le pays de résidence est requis"),
    date_naissance: yup.date().required("La date de naissance est requise").max(new Date(), "La date ne peut pas être dans le futur"),
    sexe: yup.string().oneOf(['Masculin', 'Féminin'], "Veuillez sélectionner un sexe valide").required("Le sexe est requis"),
    password: yup.string().required("Le mot de passe est requis").min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], "Les mots de passe doivent correspondre")
        .required("La confirmation du mot de passe est requise"),
});

const InvitationInstitut = () => {
    const { urlApi } = useContext(AppContext);
    const [submitStatus, setSubmitStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { control, register, reset, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(registerFormSchema)
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await fetch(urlApi + "create-demandeur", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            reset();
            if (response.ok) {
                toast.success('Compte créé avec succès');
            } else {
                toast.error(response.statusText || 'Erreur lors de la création du compte');
                throw new Error(response.statusText || 'Une erreur est survenue lors de l\'inscription');
            }
            setLoading(false);
            setSubmitStatus('success');
        } catch (error) {
            setLoading(false);
            setSubmitStatus('error');
            setErrorMessage(error.message);
        }
    };

    return (
        <>
            <PageMetaData title="Inscription" />

            <form onSubmit={handleSubmit(onSubmit)} className="mt-2 shrink">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextFormInput
                        containerClassName="mb-4"
                        label="Nom complet"
                        name="name"
                        labelClassName="block text-base/normal text-zinc-200 font-semibold"
                        className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0 dark:bg-gray-800 dark:text-gray-300" // Ajout des classes pour le mode sombre
                        fullWidth
                        placeholder="Entrez votre nom complet"
                        control={control}
                    />
                    <TextFormInput
                        containerClassName="mb-4"
                        label="Adresse email"
                        name="email"
                        labelClassName="block text-base/normal text-zinc-200 font-semibold"
                        className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0 dark:bg-gray-800 dark:text-gray-300" // Ajout des classes pour le mode sombre
                        placeholder="Entrez votre email"
                        fullWidth
                        control={control}
                    />
                    <TextFormInput
                        containerClassName="mb-4"
                        label="Numéro de téléphone"
                        name="phone"
                        labelClassName="block text-base/normal text-zinc-200 font-semibold"
                        className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0 dark:bg-gray-800 dark:text-gray-300" // Ajout des classes pour le mode sombre
                        placeholder="Entrez votre numéro de téléphone"
                        fullWidth
                        control={control}
                    />
                    <TextFormInput
                        containerClassName="mb-4"
                        label="Adresse"
                        name="adresse"
                        labelClassName="block text-base/normal text-zinc-200 font-semibold"
                        className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0 dark:bg-gray-800 dark:text-gray-300" // Ajout des classes pour le mode sombre
                        placeholder="Entrez votre adresse"
                        fullWidth
                        control={control}
                    />
                    <TextFormInput
                        containerClassName="mb-4"
                        label="Intitulé"
                        name="intitule"
                        labelClassName="block text-base/normal text-zinc-200 font-semibold"
                        className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0 dark:bg-gray-800 dark:text-gray-300" // Ajout des classes pour le mode sombre
                        placeholder="Entrez l'intitulé"
                        fullWidth
                        control={control}
                    />
                    <TextFormInput
                        containerClassName="mb-4"
                        label="Profession"
                        name="profession"
                        labelClassName="block text-base/normal text-zinc-200 font-semibold"
                        className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0 dark:bg-gray-800 dark:text-gray-300" // Ajout des classes pour le mode sombre
                        placeholder="Entrez votre profession"
                        fullWidth
                        control={control}
                    />
                    <TextFormInput
                        containerClassName="mb-4"
                        label="Lieu de naissance"
                        name="lieu_naissance"
                        labelClassName="block text-base/normal text-zinc-200 font-semibold"
                        className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0 dark:bg-gray-800 dark:text-gray-300" // Ajout des classes pour le mode sombre
                        placeholder="Entrez votre lieu de naissance"
                        fullWidth
                        control={control}
                    />
                    <TextFormInput
                        containerClassName='mb-4'
                        label='Pays de résidence'
                        name='pays_residence'
                        labelClassName='block text-base normal text-zinc-200 font-semibold'
                        className='block rounded border-white/10 bg-transparent py-2.5 text-white/80 dark:bg-gray-800 dark:text-gray-300' // Ajout des classes pour le mode sombre
                        placeholder='Entrez votre pays de résidence'
                        fullWidth
                        control={control}
                    />
                    <TextFormInput
                        containerClassName='mb-4'
                        label='Date de naissance'
                        name='date_naissance'
                        type='date'
                        labelClassName='block text-base normal text-zinc-200 font-semibold'
                        className='block rounded border-white/10 bg-transparent py-2.5 text-white/80 dark:bg-gray-800 dark:text-gray-300' // Ajout des classes pour le mode sombre
                        fullWidth
                        control={control}
                    />
                    <div className='mb-4'>
                        <label className='block text-base normal text-zinc-200 font-semibold'>Sexe</label>
                        <select {...register('sexe')} className='block w-full rounded border-white/10 bg-transparent py-2.5 text-white/80 dark:bg-gray-800 dark:text-gray-300'> // Ajout des classes pour le mode sombre
                            <option value="">Sélectionnez votre sexe</option>
                            <option value='Masculin'>Masculin</option>
                            <option value='Féminin'>Féminin</option>
                        </select>
                        {errors.sexe && <p className='text-red-500'>{errors.sexe.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                    <PasswordFormInput
                        label="Mot de passe"
                        containerClassName="mb-4"
                        name="password"
                        labelClassName="block text-base/normal text-zinc-200 font-semibold"
                        placeholder="Entrez votre mot de passe"
                        fullWidth
                        className={`block w-full rounded border-white/10 py-2.5 bg-transparent ${errors.password ? 'border-red-500' : ''} border-white/10 bg-transparent py-2.5 text-white/80 dark:bg-gray-800 dark:text-gray-300'`}
                        control={control}
                    />

                    <PasswordFormInput
                        label="Confirmer mot de passe"
                        containerClassName="mb-4"
                        name="confirmPassword"
                        labelClassName="block text-base/normal text-zinc-200 font-semibold"
                        placeholder="Confirmez votre mot de passe"
                        fullWidth
                        className={`block w-full rounded border-white/10 py-2.5 bg-transparent ${errors.confirmPassword ? 'border-red-500' : ''}  text-white/80 dark:bg-gray-800 dark:text-gray-300'`}
                        control={control}
                    />
                </div>

                <div className='text-center'>
                    <button
                        className={`group mt-5 inline-flex w-full items-center justify-center rounded text-white bg-primary px-6 py-2.5 ${loading ? 'opacity-[0.6]' : ''} transition-opacity duration-[250ms] hover:bg-primary-hover`}
                        type='submit'
                        disabled={loading}
                    >
                        {loading ? 'Chargement...' : "S'inscrire"}
                    </button>
                </div>
            </form>

            {submitStatus === 'error' && (
                <p className='text-red-500'>{errorMessage}</p>
            )}

            <p className='shrink text-center text-zinc-200'>
                Vous avez déjà un compte ?
                <Link to="/auth/sign-in" className='ms-1 text-primary'>
                    <b>Connexion</b>
                </Link>
            </p>
        </>
    );
};

export default InvitationInstitut;