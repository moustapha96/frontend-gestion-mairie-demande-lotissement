"use client"

import { LuFileText, LuUpload } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/utils";
import { useAuthContext } from "@/context";
import { getLocalites } from "@/services/localiteService";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DemandeurBreadcrumb } from "@/components";
import { Loader2, Save } from "lucide-react";
import { getDemandeDetails, updateDemande } from "@/services/demandeService";
import MapCar from "../../../admin/Map/MapCar";
import { formatPrice } from "@/utils/formatters";
import ErrorDisplay from "../../../Components/ErrorDisplay";
import LoadingSkeleton from "../../../Components/LoadingSkeleton";
import FilePreview from "../../../Components/FilePreview";

const formSchema = yup.object({
    superficie: yup.string().min(1, "La superficie est requise"),
    usagePrevu: yup.string().min(1, "L'usage prévu est requis"),
    localiteId: yup.string().min(1, "La localité est requise"),
    typeDemande: yup.string().min(1, "Le type de demande est requis"),
    typeDocument: yup.string().min(1, "Le type de document est requis"),
    possedeAutreTerrain: yup.boolean().default(false),
    recto: yup.mixed(),
    verso: yup.mixed()
});

export default function DemandeurDemandeModification() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", content: "" });
    const [localites, setLocalites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fichier, setFichier] = useState(null);
    const [selectedLocalite, setSelectedLocalite] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [newFiles, setNewFiles] = useState({ recto: null, verso: null });

    const { register, reset, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(formSchema),
        defaultValues: {
            possedeAutreTerrain: false,
            superficie: 0,
            usagePrevu: "",
            localiteId: "",
            typeDemande: "",
            typeDocument: "",
        },
    });

    const handleLocaliteChange = (e) => {
        const localiteId = e.target.value;
        if (!localiteId) {
            setSelectedLocalite(null);
            setShowMap(false);
            return;
        }
        const selectedLoc = localites.find(loc => loc.id === localiteId);
        if (selectedLoc && selectedLoc.latitude && selectedLoc.longitude) {
            setSelectedLocalite(selectedLoc);
            setShowMap(true);
        } else {
            setSelectedLocalite(null);
            setShowMap(false);
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setNewFiles(prev => ({ ...prev, [type]: file }));
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [demandeData, localitesData] = await Promise.all([
                    getDemandeDetails(id),
                    getLocalites()
                ]);

                setLocalites(localitesData);
                
                // Set form values
                setValue("typeDemande", demandeData.typeDemande);
                setValue("superficie", demandeData.superficie);
                setValue("usagePrevu", demandeData.usagePrevu);
                setValue("localiteId", demandeData.localite?.id);
                setValue("typeDocument", demandeData.typeDocument);
                setValue("possedeAutreTerrain", demandeData.possedeAutreTerrain);
                // Set selected localite if exists and has valid coordinates
                if (demandeData.localite && demandeData.localite.latitude && demandeData.localite.longitude) {
                    setSelectedLocalite(demandeData.localite);
                    setShowMap(true);
                }

                if (demandeData.document) {
                    setFichier(demandeData.document);
                }
            } catch (err) {
                setError(err.message);
                setMessage({
                    type: "error",
                    content: "Erreur lors de la récupération des données"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, setValue]);

    const onSubmit = async (values) => {
        try {
            setIsSubmitting(true);
            setMessage({ type: "", content: "" });

            const formData = new FormData();
            formData.append("userId", user.id);
            formData.append("superficie", values.superficie);
            formData.append("usagePrevu", values.usagePrevu);
            formData.append("localiteId", values.localiteId);
            formData.append("typeDemande", values.typeDemande);
            formData.append("typeDocument", values.typeDocument);
            formData.append("possedeAutreTerrain", values.possedeAutreTerrain);
            // Append new files if they exist
            if (newFiles.recto) {
                formData.append("recto", newFiles.recto);
            }
            if (newFiles.verso) {
                formData.append("verso", newFiles.verso);
            }

            await updateDemande(id, formData);
            setMessage({
                type: "success",
                content: "Demande mise à jour avec succès"
            });
            
            setTimeout(() => {
                navigate("/demandeur/demandes");
            }, 2000);
        } catch (error) {
            setMessage({
                type: "error",
                content: error.message
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorDisplay error={error} />;

    return (
        <>
            <DemandeurBreadcrumb title="Modification de la demande" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="grid grid-cols-1">
                            <div className="bg-gray-100 min-h-screen pb-10">
                                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                                    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                            <h2 className="text-xl font-semibold text-gray-800">Modifier la demande</h2>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Modifiez les informations de votre demande de terrain
                                            </p>
                                        </div>

                                        {message.content && (
                                            <div
                                                className={`px-6 py-4 ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                                            >
                                                {message.content}
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Type de demande</label>
                                                    <select
                                                        {...register("typeDemande")}
                                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:bg-primary-light"
                                                    >
                                                        <option value="">Sélectionnez le type de demande</option>
                                                        <option value="PERMIS_OCCUPATION">PERMIS OCCUPATION</option>
                                                        <option value="PROPOSITION_BAIL">PROPOSITION DE BAIL</option>
                                                        <option value="BAIL_COMMUNAL">BAIL COMMUNAL</option>
                                                        <option value="CALCUL_REDEVANCE">CALCUL REDEVANCE</option>
                                                    </select>
                                                    {errors.typeDemande && <p className="mt-1 text-sm text-red-600">{errors.typeDemande.message}</p>}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Superficie (m²)</label>
                                                        <input
                                                            type="number"
                                                            step={0.1}
                                                            {...register("superficie")}
                                                            placeholder="Ex: 500"
                                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:bg-primary-light"
                                                        />
                                                        {errors.superficie && <p className="mt-1 text-sm text-red-600">{errors.superficie.message}</p>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Localité</label>
                                                        <select
                                                            {...register("localiteId")}
                                                            onChange={handleLocaliteChange}
                                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:bg-primary-light"
                                                        >
                                                            <option value="">Sélectionnez une localité</option>
                                                            {localites.map((localite) => (
                                                                <option key={localite.id} value={localite.id}>
                                                                    {localite.nom} - {formatPrice(localite.prix)}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors.localiteId && <p className="mt-1 text-sm text-red-600">{errors.localiteId.message}</p>}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Usage prévu</label>
                                                    <textarea
                                                        {...register("usagePrevu")}
                                                        rows={4}
                                                        placeholder="Décrivez l'usage prévu pour ce terrain"
                                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:bg-primary-light"
                                                    />
                                                    {errors.usagePrevu && <p className="mt-1 text-sm text-red-600">{errors.usagePrevu.message}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Type de document</label>
                                                    <input
                                                        type="text"
                                                        disabled
                                                        {...register("typeDocument")}
                                                        placeholder="Type de document fourni"
                                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:bg-primary-light"
                                                    />
                                                    {errors.typeDocument && <p className="mt-1 text-sm text-red-600">{errors.typeDocument.message}</p>}
                                                </div>

                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        {...register("possedeAutreTerrain")}
                                                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                                    />
                                                    <label className="ml-2 block text-sm text-gray-700">
                                                        Je possède déjà un autre terrain
                                                    </label>
                                                </div>

                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-medium text-gray-900">Documents</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Recto du document
                                                            </label>
                                                            <div className="mt-1 flex items-center">
                                                                <input
                                                                    type="file"
                                                                    onChange={(e) => handleFileChange(e, 'recto')}
                                                                    className="block w-full text-sm text-gray-500
                                                                        file:mr-4 file:py-2 file:px-4
                                                                        file:rounded-md file:border-0
                                                                        file:text-sm file:font-semibold
                                                                        file:bg-primary file:text-white
                                                                        hover:file:bg-primary-dark"
                                                                    accept="image/*,.pdf"
                                                                />
                                                            </div>
                                                            {newFiles.recto && (
                                                                <p className="mt-2 text-sm text-gray-500">
                                                                    Nouveau fichier: {newFiles.recto.name}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Verso du document
                                                            </label>
                                                            <div className="mt-1 flex items-center">
                                                                <input
                                                                    type="file"
                                                                    onChange={(e) => handleFileChange(e, 'verso')}
                                                                    className="block w-full text-sm text-gray-500
                                                                        file:mr-4 file:py-2 file:px-4
                                                                        file:rounded-md file:border-0
                                                                        file:text-sm file:font-semibold
                                                                        file:bg-primary file:text-white
                                                                        hover:file:bg-primary-dark"
                                                                    accept="image/*,.pdf"
                                                                />
                                                            </div>
                                                            {newFiles.verso && (
                                                                <p className="mt-2 text-sm text-gray-500">
                                                                    Nouveau fichier: {newFiles.verso.name}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {showMap && selectedLocalite && (
                                                <div className="mt-6">
                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aperçu de la localité</h3>
                                                    <MapCar selectedItem={selectedLocalite} type="localite" />
                                                </div>
                                            )}

                                            <div className="flex justify-end space-x-4 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => navigate("/demandeur/demandes")}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                                >
                                                    Annuler
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className={cn(
                                                        "px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md",
                                                        isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-dark"
                                                    )}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
                                                            Enregistrement...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="inline-block w-4 h-4 mr-2" />
                                                            Enregistrer les modifications
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    {fichier && (
                                        <div className="mt-8 max-w-2xl mx-auto">
                                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Documents fournis</h2>
                                            <div className="grid gap-6 md:grid-cols-2">
                                                {fichier.recto && <FilePreview file={fichier.recto} title="Recto du document" />}
                                                {fichier.verso && <FilePreview file={fichier.verso} title="Verso du document" />}
                                            </div>
                                        </div>
                                    )}
                                </main>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
