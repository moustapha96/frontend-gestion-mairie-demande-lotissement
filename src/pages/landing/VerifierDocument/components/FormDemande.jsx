import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextFormInput } from "@/components";

const FormDemande = () => {
    const contactFormSchema = yup.object({
        demandeur_id: yup.number().required("Veuillez entrer l'ID du demandeur"),
        intitule: yup.string().required("Veuillez entrer l'intitulé"),
        paysInstitut: yup.string().required("Veuillez entrer le pays de l'institut"),
        emailInstitut: yup
            .string()
            .email("Veuillez entrer un email valide")
            .required("Veuillez entrer l'email de l'institut"),
        nameInstitut: yup.string().required("Veuillez entrer le nom de l'institut"),
        phoneInstitut: yup.string().required("Veuillez entrer le téléphone de l'institut"),
        adresseInstitut: yup.string().required("Veuillez entrer l'adresse de l'institut"),
        anneeObtention: yup.number().required("Veuillez entrer l'année d'obtention").min(1990, "Année invalide").max(new Date().getFullYear(), "Année invalide"),
    });

    const { control, handleSubmit, setError } = useForm({
        resolver: yupResolver(contactFormSchema),
    });

    const onSubmit = async (data) => {
        const demandeData = {
            demandeur_id: data.demandeur_id,
            resultat: "En cours",
            intitule: data.intitule,
            paysInstitut: data.paysInstitut,
            emailInstitut: data.emailInstitut,
            nameInstitut: data.nameInstitut,
            phoneInstitut: data.phoneInstitut,
            adresseInstitut: data.adresseInstitut,
            anneeObtention: data.anneeObtention,
        };

        try {
            const response = await fetch('/api/create-demande', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(demandeData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.errors) {
                    Object.entries(errorData.errors).forEach(([key, value]) => {
                        setError(key, { type: 'manual', message: value });
                    });
                }
                throw new Error('Failed to create demande');
            }

            const result = await response.json();
            console.log(result.message); // Handle success message

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <section id="Contact" className="py-10 lg:py-20 bg-default-100 dark:bg-default-50">
            <div className="container">
                <div className="flex flex-wrap items-center justify-around gap-6">
                    <div className="text-center text-3xl ">
                        Nouvelle Demande
                    </div>
                </div>

                <div className="grid xl:grid-cols-1 grid-cols-1 gap-6 items-center">
                    <div className="p-8 rounded-lg">
                        <div className="p-6 rounded-md bg-white dark:bg-default-100">
                            <h3 className="text-2xl font-medium text-default-950">
                                N'hésitez pas à nous contacter !
                            </h3>
                            <p className="text-base mt-3">
                                Nous sommes là pour répondre à toutes vos questions concernant nos services.
                            </p>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
                                <TextFormInput
                                    name="demandeur_id"
                                    label="ID du Demandeur"
                                    labelClassName="text-default-950"
                                    className="h-12 rounded py-4 ps-4 text-default-950 dark:bg-default-50"
                                    placeholder="ID du demandeur"
                                    control={control}
                                    fullWidth
                                />

                                <TextFormInput
                                    name="intitule"
                                    label="Intitulé"
                                    labelClassName="text-default-950"
                                    className="h-12 rounded py-4 ps-4 text-default-950 dark:bg-default-50"
                                    placeholder="Intitulé de la demande"
                                    control={control}
                                    fullWidth
                                />
                                <TextFormInput
                                    name="paysInstitut"
                                    label="Pays de l'Institut"
                                    labelClassName="text-default-950"
                                    className="h-12 rounded py-4 ps-4 text-default-950 dark:bg-default-50"
                                    placeholder="Pays de l'institut"
                                    control={control}
                                    fullWidth
                                />
                                <TextFormInput
                                    name="emailInstitut"
                                    label="Email de l'Institut"
                                    type="email"
                                    labelClassName="text-default-950"
                                    className="h-12 rounded py-4 ps-4 text-default-950 dark:bg-default-50"
                                    placeholder="Email de l'institut"
                                    control={control}
                                    fullWidth
                                />
                                <TextFormInput
                                    name="nameInstitut"
                                    label="Nom de l'Institut"
                                    labelClassName="text-default-950"
                                    className="h12 rounded py=4 ps=4 text-default=950 dark:bg-default=50"
                                    placeholder="Nom de l'institut"
                                    control={control}
                                    fullWidth
                                />
                                <TextFormInput
                                    name="phoneInstitut"
                                    label="Téléphone de l'Institut"
                                    labelClassName="text-default950"
                                    placeholder="Téléphone de l'institut"
                                    control={control}
                                    fullWidth
                                />
                                <TextFormInput
                                    name="adresseInstitut"
                                    label="Adresse de l'Institut"
                                    labelClassName="text-default950"
                                    placeholder="Adresse de l'institut"
                                    control={control}
                                    fullWidth
                                />
                                <TextFormInput
                                    name="anneeObtention"
                                    label="Année d'Obtention"
                                    type="number"
                                    min={1990}
                                    max={new Date().getFullYear()}
                                    labelClassName="text-default950"
                                    placeholder="Année d'obtention (ex : 2024)"
                                    control={control}
                                    fullWidth
                                />
                                <div className="flex justify-center">


                                    <button
                                        type="submit"
                                        className="px6 py2 text-lg w-1/2 rounded text-white bg-black hover:bg-primary transition-all"
                                    >
                                        Envoyer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FormDemande;