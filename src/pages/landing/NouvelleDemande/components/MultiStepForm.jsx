import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";

const applicantSchema = yup.object({
    prenom: yup.string().required("Veuillez entrer votre prénom"),
    nom: yup.string().required("Veuillez entrer votre nom"),
    email: yup.string().email("Veuillez entrer un email valide").required("L'email est requis"),
    telephone: yup.string().required("Le numéro de téléphone est requis"),
    adresse: yup.string().required("L'adresse est requise"),
    profession: yup.string().required("La profession est requise"),
    lieuNaissance: yup.string().required("Le lieu de naissance est requis"),
    dateNaissance: yup.date().required("La date de naissance est requise").max(new Date(), "La date ne peut pas être dans le futur"),
    possedeAutreTerrain: yup.boolean(),
    typeDocument: yup.string().required("Le type de document est requis"),
    typeDemande: yup.string().required("Le type de demande est requis"),
    usagePrevu: yup.string().required("L'usage prévu est requis"),
    superficie: yup.number().required("La superficie est requise"),
    numeroElecteur: yup.string().required("Le numéro de carte nationale est requis"),
    document: yup.string().required("Le document est requis"),
    localiteId: yup.number().required("La localité est requise"),
});

const MultiStepForm = () => {
    const [step, setStep] = useState(1);

    return (
        <Formik
            initialValues={{
                prenom: "",
                nom: "",
                email: "",
                telephone: "",
                adresse: "",
                profession: "",
                lieuNaissance: "",
                dateNaissance: "",
                possedeAutreTerrain: false,
                typeDocument: "",
                typeDemande: "",
                usagePrevu: "",
                superficie: "",
                numeroElecteur: "",
                document: "",
                localiteId: "",
            }}
            validationSchema={applicantSchema}
            onSubmit={(values) => {
                console.log("Données soumises", values);
            }}
        >
            {({ values }) => (
                <Form className="p-4 border rounded shadow-lg max-w-lg mx-auto">
                    {step === 1 && (
                        <div>
                            <h2 className="text-lg font-bold">Informations personnelles</h2>
                            <div>
                                <label>Prénom</label>
                                <Field name="prenom" className="border p-2 w-full" />
                                <ErrorMessage name="prenom" component="div" className="text-red-500" />
                            </div>
                            <div>
                                <label>Nom</label>
                                <Field name="nom" className="border p-2 w-full" />
                                <ErrorMessage name="nom" component="div" className="text-red-500" />
                            </div>
                            <div>
                                <label>Email</label>
                                <Field name="email" type="email" className="border p-2 w-full" />
                                <ErrorMessage name="email" component="div" className="text-red-500" />
                            </div>
                            <button type="button" onClick={() => setStep(2)} className="mt-4 bg-blue-500 text-white p-2 rounded">Suivant</button>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2 className="text-lg font-bold">Détails de la demande</h2>
                            <div>
                                <label>Type de document</label>
                                <Field name="typeDocument" className="border p-2 w-full" />
                                <ErrorMessage name="typeDocument" component="div" className="text-red-500" />
                            </div>
                            <div>
                                <label>Type de demande</label>
                                <Field name="typeDemande" className="border p-2 w-full" />
                                <ErrorMessage name="typeDemande" component="div" className="text-red-500" />
                            </div>
                            <button type="button" onClick={() => setStep(1)} className="mt-4 bg-gray-500 text-white p-2 rounded">Retour</button>
                            <button type="button" onClick={() => setStep(3)} className="mt-4 bg-blue-500 text-white p-2 rounded">Suivant</button>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h2 className="text-lg font-bold">Finalisation</h2>
                            <div>
                                <label>Numéro de carte nationale</label>
                                <Field name="numeroElecteur" className="border p-2 w-full" />
                                <ErrorMessage name="numeroElecteur" component="div" className="text-red-500" />
                            </div>
                            <div>
                                <label>Superficie</label>
                                <Field name="superficie" className="border p-2 w-full" />
                                <ErrorMessage name="superficie" component="div" className="text-red-500" />
                            </div>
                            <button type="button" onClick={() => setStep(2)} className="mt-4 bg-gray-500 text-white p-2 rounded">Retour</button>
                            <button type="submit" className="mt-4 bg-green-500 text-white p-2 rounded">Soumettre</button>
                        </div>
                    )}
                </Form>
            )}
        </Formik>
    );
};

export default MultiStepForm;
