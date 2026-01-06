
"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { DemandeurBreadcrumb as Breadcrumb } from "@/components";
import { useAuthContext } from "@/context";
import { getLocalites } from "@/services/localiteService";
import { createDemande, createDemandeFromElecteur } from "@/services/demandeService"; // doit pointer vers /api/demande/nouvelle-demande
import { Loader2, Save } from "lucide-react";
import { LuUpload } from "react-icons/lu";
import { cn } from "@/utils";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { message } from "antd";

// Conformément à l'entité DemandeTerrain (typeDemande) + tes titres (typeTitre)
const TYPE_DEMANDE_OPTIONS = [
    { label: "Attribution", value: "Attribution" },
    { label: "Régularisation", value: "Régularisation" },
    { label: "Authentification", value: "Authentification" },
];

const TYPE_TITRE_OPTIONS = [
    { label: "Permis d'occuper", value: "Permis d'occuper" },
    { label: "Bail communal", value: "Bail communal" },
    { label: "Proposition de bail", value: "Proposition de bail" },
    { label: "Transfert définitif", value: "Transfert définitif" },
];

const TYPE_DOCUMENT_OPTIONS = [
    { label: "CNI", value: "CNI" },
    // { label: "Passeport", value: "PASSEPORT" },
    // { label: "Extrait de naissance", value: "EXTRAIT_DE_NAISSANCE" },
];

// ✅ Schéma de validation adapté à /nouvelle-demande (tous les champs requis backend)
const formSchema = yup.object({
    // Demande
    typeDemande: yup.string().oneOf(TYPE_DEMANDE_OPTIONS.map(o => o.value)).required("Le type de demande est requis"),
    typeTitre: yup.string().oneOf(TYPE_TITRE_OPTIONS.map(o => o.value)).nullable().required("Le type de titre est requis"),
    typeDocument: yup.string().oneOf(TYPE_DOCUMENT_OPTIONS.map(o => o.value)).required("Le type de document est requis"),
    localiteId: yup.string().min(1, "La localité est requise"),
    superficie: yup.number().typeError("Superficie invalide").min(1, "Superficie minimale 1").required("La superficie est requise"),
    usagePrevu: yup.string().min(1, "L'usage prévu est requis"),
    possedeAutreTerrain: yup.boolean().default(false),
    terrainAKaolack: yup.boolean().default(false),
    terrainAilleurs: yup.boolean().default(false),
    // recto: yup
    //     .mixed()
    //     .test("recto-required", "Le recto du document est requis", (v) => v && v.length === 1),
     recto: yup
        .mixed(),
    // verso: yup
    //     .mixed()
    //     .test("verso-required", "Le verso du document est requis", (v) => v && v.length === 1),
    verso: yup
        .mixed(),

    // Identité électeur (requis par /nouvelle-demande)
    email: yup.string().email("Email invalide").required("Email requis"),
    prenom: yup.string().min(1, "Prénom requis"),
    nom: yup.string().min(1, "Nom requis"),
    telephone: yup.string().min(1, "Téléphone requis"),
    profession: yup.string().min(1, "Profession requise"),
    adresse: yup.string().min(1, "Adresse requise"),
    lieuNaissance: yup.string().min(1, "Lieu de naissance requis"),
    dateNaissance: yup.string().min(4, "Date de naissance requise"), // tu peux raffiner au format
    numeroElecteur: yup.string().min(1, "Numéro électeur requis"),
});

export default function AdminCreerDemandeFromElecteur() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuthContext();

    // Électeur sélectionné depuis la recherche (source externe)
    const electeurFromState = location?.state?.electeur || null;
    const electeur = useMemo(() => electeurFromState, [electeurFromState]);
    console.log("electeur", electeur)
    const [localites, setLocalites] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [msg, setMsg] = useState({ type: "", content: "" });
    const [selectedLocalite, setSelectedLocalite] = useState(null);
    const [showMap, setShowMap] = useState(false);

    const {
        register,
        reset,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(formSchema),
        defaultValues: {
            // Demande
            typeDemande: "",
            typeTitre: "",
            typeDocument: "CNI",
            localiteId: "",
            superficie: "",
            usagePrevu: "",
            possedeAutreTerrain: false,
            terrainAKaolack: false,
            terrainAilleurs: false,
            recto: null,
            verso: null,
            // Identité électeur
            email: electeur?.EMAIL || "",
            prenom: electeur?.PRENOM || "",
            nom: electeur?.NOM || "",
            telephone: electeur?.TEL1 || electeur?.TEL2 || electeur?.WHATSAPP || "",
            profession: electeur?.PROFESSION || "",
            adresse: electeur?.ADRESSE || "",
            lieuNaissance: electeur?.LIEU_NAISS || "",
            dateNaissance: electeur?.DATE_NAISS ? electeur.DATE_NAISS : electeur?.DATE_NAISS ? moment(electeur.DATE_NAISS).format(" YYYY-MM-DD") : "", // au format YYYY-MM-DD
            numeroElecteur: electeur?.NIN || "",
        },
    });

    // Si accès direct sans state => retour liste électeurs
    useEffect(() => {
        if (!electeur) navigate("/admin/recherche-electeurs");
    }, [electeur, navigate]);

    // Pré-remplir avec l'électeur externe
    useEffect(() => {
        if (!electeur) return;
        setValue("prenom", electeur?.PRENOM || "");
        setValue("nom", electeur?.NOM || "");
        setValue("telephone", electeur?.TEL1 || electeur?.TEL2 || electeur?.WHATSAPP || "");
        setValue("numeroElecteur", electeur?.NIN || "");
        setValue("email", electeur?.EMAIL || "");
        setValue("profession", electeur?.PROFESSION || "");
        setValue("adresse", electeur?.ADRESSE || "");
        setValue("lieuNaissance", electeur?.LIEU_NAISS || "");
        setValue("dateNaissance", electeur?.DATE_NAISS || "");
    }, [electeur, setValue]);

    // Charger les localités
    useEffect(() => {
        (async () => {
            try {
                const data = await getLocalites();
                setLocalites(
                    (Array.isArray(data) ? data : []).map((l) => ({
                        id: l.id ?? l?.ID ?? l?.Id,
                        nom: l.nom ?? l?.name ?? l?.label,
                    }))
                );
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);

    const handleLocaliteChange = (e) => {
        const id = e.target.value;
        const loc = localites.find((l) => String(l.id) === String(id));
        setSelectedLocalite(loc || null);
        setShowMap(!!loc);
    };

    async function onSubmit(values) {
        console.log("values", values)
        try {
            setIsSubmitting(true);
            setMsg({ type: "", content: "" });

            const formData = new FormData();
            // Demande
            formData.append("typeDemande", values.typeDemande);    // Attribution / Régularisation / Authentification
            formData.append("typeTitre", values.typeTitre);        // Permis d'occuper / Bail communal / ...
            formData.append("typeDocument", values.typeDocument);
            formData.append("localiteId", values.localiteId);
            formData.append("superficie", String(values.superficie));
            formData.append("usagePrevu", values.usagePrevu);
            formData.append("possedeAutreTerrain", String(values.possedeAutreTerrain));
            formData.append("terrainAKaolack", String(values.terrainAKaolack));
            formData.append("terrainAilleurs", String(values.terrainAilleurs));
            if( values.recto[0] && values.verso[0] ){
                formData.append("recto", values.recto[0]);
                formData.append("verso", values.verso[0]);
            }

            // Identité électeur (requis côté backend /nouvelle-demande)
            formData.append("prenom", values.prenom);
            formData.append("nom", values.nom);
            formData.append("email", values.email);
            formData.append("telephone", values.telephone);
            formData.append("profession", values.profession);
            formData.append("adresse", values.adresse);
            formData.append("lieuNaissance", electeur?.LIEU_NAISS ||  values.lieuNaissance);
            formData.append("dateNaissance",electeur?.DATE_NAISS || values.dateNaissance);
            formData.append("numeroElecteur", electeur?.NIN || values.numeroElecteur);

            // Optionnel: tagger l’admin qui soumet (utile en audit)
            if (user?.email) formData.append("adminEmail", user.email);

            const resp = await createDemandeFromElecteur(formData);
            message.success("Demande créée avec succès");
            setMsg({ type: "success", content: resp?.message || "Demande créée avec succès." });
            reset();
            navigate(`/admin/demandes/${resp?.demande?.id}/details`);
        } catch (e) {
            console.error(e);
            const apiMsg = e?.response?.data?.message || e?.message;
            setMsg({ type: "error", content: apiMsg || "Erreur lors de la création de la demande." });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <Breadcrumb title="Créer une demande pour un électeur" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="grid grid-cols-1">
                            <div className="bg-gray-100 min-h-screen pb-10">
                                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                                    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                            <h2 className="text-xl font-semibold text-gray-800">Nouvelle demande de terrain</h2>
                                            <p className="mt-1 text-sm text-gray-600">Électeur sélectionné depuis la recherche</p>
                                        </div>

                                        {/* Bandeau infos électeur */}
                                        {electeur && (
                                            <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-500">Nom & Prénom</p>
                                                        <p className="font-medium">{electeur.NOM} {electeur.PRENOM}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Email</p>
                                                        <p className="font-mono">{electeur.EMAIL}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Téléphone</p>
                                                        <p>{electeur.TEL1 || electeur.TEL2 || electeur.WHATSAPP || "—"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Numéro Électeur</p>
                                                        <p className="font-mono">{electeur.NIN || "—"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Profession</p>
                                                        <p className="font-mono">{electeur.PROFESSION || "—"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Naissance</p>
                                                        <p className="font-mono">le {electeur.DATE_NAISS + " à " + electeur.LIEU_NAISS || "—"}</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-500">Adresse</p>
                                                        <p className="font-mono">{electeur.ADRESSE || "—"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Centre</p>
                                                        <p>{electeur.CENTRE || "—"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Bureau</p>
                                                        <p>{electeur.BUREAU ?? "—"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {msg.content && (
                                            <div className={`px-6 py-4 ${msg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                                                {msg.content}
                                            </div>
                                        )}

                                        {/* Formulaire */}
                                        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-6">
                                            {/* Bloc identité (requis par /nouvelle-demande) */}
                                            <div>
                                                <h3 className="text-base font-semibold mb-2">Identité du demandeur</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Prénom</label>
                                                        <input
                                                            type="text"
                                                            {...register("prenom")}
                                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                                        />
                                                        {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom.message}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Nom</label>
                                                        <input
                                                            type="text"
                                                            {...register("nom")}
                                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                                        />
                                                        {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>}
                                                    </div>

                                                    
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                                        <input
                                                            type="email"
                                                            {...register("email")}
                                                            placeholder="ex: nom@example.com"
                                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                                        />
                                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                                                        <input
                                                            type="text"
                                                            {...register("telephone")}
                                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                                        />
                                                        {errors.telephone && <p className="mt-1 text-sm text-red-600">{errors.telephone.message}</p>}
                                                    </div>
                                                    
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Profession</label>
                                                        <input
                                                            type="text"
                                                            {...register("profession")}
                                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                                        />
                                                        {errors.profession && <p className="mt-1 text-sm text-red-600">{errors.profession.message}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Adresse</label>
                                                        <input
                                                            type="text"
                                                            {...register("adresse")}
                                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                                        />
                                                        {errors.adresse && <p className="mt-1 text-sm text-red-600">{errors.adresse.message}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Lieu de naissance</label>
                                                        <input
                                                            type="text"
                                                            {...register("lieuNaissance")}
                                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                                        />
                                                        {errors.lieuNaissance && <p className="mt-1 text-sm text-red-600">{errors.lieuNaissance.message}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                                                        <input
                                                            type="date"
                                                            {...register("dateNaissance")}
                                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                                        />
                                                        {errors.dateNaissance && <p className="mt-1 text-sm text-red-600">{errors.dateNaissance.message}</p>}
                                                    </div>


                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Numéro électeur</label>
                                                        <input
                                                            type="text"
                                                            {...register("numeroElecteur")}
                                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                                        />
                                                        {errors.numeroElecteur && <p className="mt-1 text-sm text-red-600">{errors.numeroElecteur.message}</p>}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bloc Demande */}
                                            <div>
                                                <h3 className="text-base font-semibold mb-2">Informations sur la demande</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Type de demande</label>
                                                        <select
                                                            {...register("typeDemande")}
                                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                                        >
                                                            <option value="">Sélectionnez</option>
                                                            {TYPE_DEMANDE_OPTIONS.map(o => (
                                                                <option key={o.value} value={o.value}>{o.label}</option>
                                                            ))}
                                                        </select>
                                                        {errors.typeDemande && <p className="mt-1 text-sm text-red-600">{errors.typeDemande.message}</p>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Type de titre</label>
                                                        <select
                                                            {...register("typeTitre")}
                                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                                        >
                                                            <option value="">Sélectionnez</option>
                                                            {TYPE_TITRE_OPTIONS.map(o => (
                                                                <option key={o.value} value={o.value}>{o.label}</option>
                                                            ))}
                                                        </select>
                                                        {errors.typeTitre && <p className="mt-1 text-sm text-red-600">{errors.typeTitre.message}</p>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Quartier</label>
                                                        <select
                                                            {...register("localiteId")}
                                                            onChange={(e) => {
                                                                register("localiteId").onChange(e);
                                                                handleLocaliteChange(e);
                                                            }}
                                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                                        >
                                                            <option value="">Sélectionnez</option>
                                                            {localites.map((l) => (
                                                                <option key={l.id} value={l.id}>{l.nom}</option>
                                                            ))}
                                                        </select>
                                                        {errors.localiteId && <p className="mt-1 text-sm text-red-600">{errors.localiteId.message}</p>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Superficie (m²)</label>
                                                        <input
                                                            type="number" step={0.1}
                                                            {...register("superficie")}
                                                            placeholder="Ex: 500"
                                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                                        />
                                                        {errors.superficie && <p className="mt-1 text-sm text-red-600">{errors.superficie.message}</p>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Type de document</label>
                                                        <select
                                                            {...register("typeDocument")}
                                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                                        >
                                                            <option value="">Sélectionnez</option>
                                                            {TYPE_DOCUMENT_OPTIONS.map(o => (
                                                                <option key={o.value} value={o.value}>{o.label}</option>
                                                            ))}
                                                        </select>
                                                        {errors.typeDocument && <p className="mt-1 text-sm text-red-600">{errors.typeDocument.message}</p>}
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700">Usage prévu</label>
                                                        <textarea
                                                            {...register("usagePrevu")}
                                                            rows={3}
                                                            placeholder="Décrivez l'usage prévu pour ce terrain"
                                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                                        />
                                                        {errors.usagePrevu && <p className="mt-1 text-sm text-red-600">{errors.usagePrevu.message}</p>}
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <input type="checkbox" {...register("possedeAutreTerrain")} className="h-4 w-4 rounded border-gray-300" />
                                                        <span className="text-sm text-gray-700">Possède déjà un autre terrain</span>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <input type="checkbox" {...register("terrainAKaolack")} className="h-4 w-4 rounded border-gray-300" />
                                                        <span className="text-sm text-gray-700">Terrain à Kaolack</span>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <input type="checkbox" {...register("terrainAilleurs")} className="h-4 w-4 rounded border-gray-300" />
                                                        <span className="text-sm text-gray-700">Terrain ailleurs</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Pièces */}
                                            <div>
                                                <h3 className="text-base font-semibold mb-2">Pièces justificatives</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Recto du document</label>
                                                        <div className="mt-1 flex items-center">
                                                            <input
                                                                type="file"
                                                                {...register("recto")}
                                                                accept=".pdf,.jpg,.jpeg,.png"
                                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
                                                            />
                                                            <LuUpload className="h-5 w-5 text-gray-400 ml-2" />
                                                        </div>
                                                        {errors.recto && <p className="mt-1 text-sm text-red-600">{errors.recto.message}</p>}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Verso du document</label>
                                                        <div className="mt-1 flex items-center">
                                                            <input
                                                                type="file"
                                                                {...register("verso")}
                                                                accept=".pdf,.jpg,.jpeg,.png"
                                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
                                                            />
                                                            <LuUpload className="h-5 w-5 text-gray-400 ml-2" />
                                                        </div>
                                                        {errors.verso && <p className="mt-1 text-sm text-red-600">{errors.verso.message}</p>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex justify-center">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className={cn(
                                                        "w-1/2 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light",
                                                        isSubmitting && "opacity-50 cursor-not-allowed",
                                                    )}
                                                >
                                                    {isSubmitting ? <Loader2 className="animate-spin mr-2" size={20} /> : <Save className="mr-2" size={20} />}
                                                    {isSubmitting ? "Envoi en cours..." : "Soumettre la demande"}
                                                </button>
                                            </div>
                                        </form>

                                        {/* (Optionnel) carte localité */}
                                        {showMap && selectedLocalite && (
                                            <div className="px-6 pb-6">
                                                <div className="border rounded-lg overflow-hidden">
                                                    <div className="h-[400px]">
                                                        {/* <MapCar selectedItem={selectedLocalite} type="localite" /> */}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </main>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
