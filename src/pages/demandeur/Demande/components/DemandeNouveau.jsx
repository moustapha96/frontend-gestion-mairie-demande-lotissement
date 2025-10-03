// "use client"

// import { LuSearch, LuChevronLeft, LuChevronRight, LuFileText, LuUpload } from "react-icons/lu";
// import { Link } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { cn } from "@/utils";
// import { useAuthContext } from "@/context";
// import { getLocalites } from "@/services/localiteService";
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import { DemandeurBreadcrumb } from "@/components";
// import { Loader2, Save } from "lucide-react";
// import { createDemande } from "@/services/demandeService";
// import MapCar from "../../../admin/Map/MapCar";
// import { formatPrice } from "@/utils/formatters";

// const formSchema = yup.object({
//     superficie: yup.string().min(1, "La superficie est requise"),
//     usagePrevu: yup.string().min(1, "L'usage prévu est requis"),
//     localiteId: yup.string().min(1, "La localité est requise"),
//     typeDemande: yup.string().min(1, "Le type de demande est requis"),
//     typeDocument: yup.string().min(1, "Le type de document est requis"),
//     possedeAutreTerrain: yup.boolean().default(false),

//     recto: yup.mixed().test("fileSize", "Le recto du document est requis", (value) => {
//         return value && value.length === 1;
//     }),
//     verso: yup.mixed().test("fileSize", "Le verso du document est requis", (value) => {
//         return value && value.length === 1;
//     }),
// });

// const DemandeNouveau = () => {
//     const { user } = useAuthContext();
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [message, setMessage] = useState({ type: "", content: "" });
//     const [localites, setLocalites] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [demandeInfo, setDemandeInfo] = useState(null);
//     const [selectedLocalite, setSelectedLocalite] = useState(null);
//     const [showMap, setShowMap] = useState(false);

//     const { register, reset, handleSubmit, formState: { errors } } = useForm({
//         resolver: yupResolver(formSchema),
//         defaultValues: {
//             possedeAutreTerrain: false,
//             superficie: 0,
//             usagePrevu: "",
//             localiteId: null,
//             typeDemande: "",
//             recto: null,
//             verso: null,
//             typeDocument: "CNI"
//         },
//     });

//     const handleLocaliteChange = (e) => {
//         const localiteId = e.target.value;
//         const selectedLoc = localites.find(loc => loc.id === localiteId);
//         setSelectedLocalite(selectedLoc);
//         setShowMap(!!selectedLoc);
//     };

//     async function onSubmit(values) {
//         console.log("values", values);
//         try {
//             setIsSubmitting(true);
//             setMessage({ type: "", content: "" });

//             const formData = new FormData();
//             formData.append("userId", user.id);
//             formData.append("superficie", values.superficie);
//             formData.append("usagePrevu", values.usagePrevu);
//             formData.append("localiteId", values.localiteId);
//             formData.append("typeDemande", values.typeDemande);
//             formData.append("typeDocument", values.typeDocument);
//             formData.append("possedeAutreTerrain", String(values.possedeAutreTerrain));

//             formData.append("recto", values.recto[0]);
//             formData.append("verso", values.verso[0]);

//             const response = await createDemande(formData);
//             setDemandeInfo(response); // Stockage de la réponse
//             setMessage({
//                 type: "success",
//                 content: response.message,
//             });
//             reset();
//         } catch (error) {
//             setMessage({
//                 type: "error",
//                 content: error.message,
//             });
//         } finally {
//             setIsSubmitting(false);
//         }
//     }

//     useEffect(() => {

//         const fetchLocalites = async () => {
//             setLoading(true)
//             try {
//                 const data = await getLocalites();
//                 setLocalites(data);
//             } catch (err) {
//                 console.log(err)
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchLocalites();
//     }, [user]);

//     return (
//         <>
//             <DemandeurBreadcrumb title="Nouvelle demande de terrain" />
//             <section>
//                 <div className="container">
//                     <div className="my-6 space-y-6">
//                         <div className="grid grid-cols-1">
//                             <div className="bg-gray-100 min-h-screen pb-10">
//                                 {/* <header className="bg-white shadow">
//                                     <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//                                         <h1 className="text-3xl font-bold text-gray-900">{"Nouveau demande de terain"}</h1>
//                                     </div>
//                                 </header> */}
//                                 <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//                                     <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
//                                         <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
//                                             <h2 className="text-xl font-semibold text-gray-800">Nouvelle demande de terrain</h2>
//                                             <p className="mt-1 text-sm text-gray-600">
//                                                 Remplissez le formulaire ci-dessous pour soumettre votre demande de terrain
//                                             </p>
//                                         </div>

//                                         {message.content && (
//                                             <div
//                                                 className={`px-6 py-4 ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
//                                                     }`}
//                                             >
//                                                 {message.content}
//                                             </div>
//                                         )}

//                                         <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-6">
//                                             <div className="space-y-4">
//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700">Type de demande</label>
//                                                     <select
//                                                         {...register("typeDemande")}
//                                                         className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900  focus:outline-none focus:ring-1 focus:bg-primary-light"
//                                                     >
//                                                         <option value="">Sélectionnez le type de demande</option>
//                                                         <option value="PERMIS_OCCUPATION">PERMIS OCCUPATION</option>
//                                                         <option value="PROPOSITION_BAIL">PROPOSITION DE BAIL</option>
//                                                         <option value="BAIL_COMMUNAL">BAIL COMMUNAL</option>
//                                                         <option value="CALCUL_REDEVANCE">CALCUL REDEVANCE</option>

//                                                     </select>
//                                                     {errors.typeDemande && <p className="mt-1 text-sm text-red-600">{errors.typeDemande.message}</p>}
//                                                 </div>

//                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                     <div>
//                                                         <label className="block text-sm font-medium text-gray-700">Superficie (m²)</label>
//                                                         <input
//                                                             type="number" step={0.1}
//                                                             {...register("superficie")}
//                                                             placeholder="Ex: 500"
//                                                             className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900  focus:outline-none focus:ring-1 focus:bg-primary-light"
//                                                         />
//                                                         {errors.superficie && <p className="mt-1 text-sm text-red-600">{errors.superficie.message}</p>}
//                                                     </div>

//                                                     <div>
//                                                         <label className="block text-sm font-medium text-gray-700">Localité</label>
//                                                         <select
//                                                             {...register("localiteId")}
//                                                             onChange={(e) => {
//                                                                 register("localiteId").onChange(e);
//                                                                 handleLocaliteChange(e);
//                                                             }}
//                                                             className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900  focus:outline-none focus:ring-1 focus:bg-primary-light"
//                                                         >
//                                                             <option value="">Sélectionnez la localité</option>
//                                                             {localites.map((localite) => (
//                                                                 <option key={localite.id} value={localite.id}>
//                                                                     {localite.nom}
//                                                                 </option>
//                                                             ))}
//                                                         </select>
//                                                         {errors.localiteId && <p className="mt-1 text-sm text-red-600">{errors.localiteId.message}</p>}
//                                                     </div>
//                                                 </div>



//                                                 <div>
//                                                     <label className="block text-sm font-medium text-gray-700">Usage prévu</label>
//                                                     <textarea
//                                                         {...register("usagePrevu")}
//                                                         rows={4}
//                                                         placeholder="Décrivez l'usage prévu pour ce terrain"
//                                                         className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900  focus:outline-none focus:ring-1 focus:bg-primary-light"
//                                                     />
//                                                     {errors.usagePrevu && <p className="mt-1 text-sm text-red-600">{errors.usagePrevu.message}</p>}
//                                                 </div>


//                                                 <div className="space-y-4">
//                                                     <div>
//                                                         <label className="block text-sm font-medium text-gray-700">Type de document</label>
//                                                         <select
//                                                             {...register("typeDocument")}
//                                                             className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:bg-primary-light"
//                                                         >
//                                                             <option >Sélectionnez le type</option>
//                                                             <option value="CNI" selected>CNI</option>
//                                                             <option value="PASSPORT">Passport</option>
//                                                             <option value="EXTRAIT DE NAISSANCE">Extrait de Naissance</option>
//                                                             {/* <option value="AUTRE">Autre</option> */}
//                                                         </select>
//                                                         {errors.typeDocument && <p className="mt-1 text-sm text-red-600">{errors.typeDocument.message}</p>}
//                                                     </div>

//                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                         <div>
//                                                             <label className="block text-sm font-medium text-gray-700">Recto du document</label>
//                                                             <div className="mt-1 flex items-center">
//                                                                 <input
//                                                                     type="file"
//                                                                     {...register("recto")}
//                                                                     accept=".pdf,.jpg,.jpeg,.png"
//                                                                     className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
//                                                                 />
//                                                                 <LuUpload className="h-5 w-5 text-gray-400 ml-2" />
//                                                             </div>
//                                                             {errors.recto && <p className="mt-1 text-sm text-red-600">{errors.recto.message}</p>}
//                                                         </div>

//                                                         <div>
//                                                             <label className="block text-sm font-medium text-gray-700">Verso du document</label>
//                                                             <div className="mt-1 flex items-center">
//                                                                 <input
//                                                                     type="file"
//                                                                     {...register("verso")}
//                                                                     accept=".pdf,.jpg,.jpeg,.png"
//                                                                     className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
//                                                                 />
//                                                                 <LuUpload className="h-5 w-5 text-gray-400 ml-2" />
//                                                             </div>
//                                                             {errors.verso && <p className="mt-1 text-sm text-red-600">{errors.verso.message}</p>}
//                                                         </div>
//                                                     </div>
//                                                     <p className="mt-1 text-sm text-gray-500">Formats acceptés: PDF, JPG, JPEG, PNG</p>
//                                                 </div>

//                                                 <div className="relative flex items-start">
//                                                     <div className="flex h-6 items-center">
//                                                         <input
//                                                             type="checkbox"
//                                                             {...register("possedeAutreTerrain")}
//                                                             className="h-4 w-4 rounded border-gray-300 text-primary focus:bg-primary-light"
//                                                         />
//                                                     </div>
//                                                     <div className="ml-3">
//                                                         <label className="text-sm font-medium text-gray-700">Possédez-vous déjà un terrain ?</label>
//                                                         <p className="text-sm text-gray-500">Cochez si vous êtes déjà propriétaire d'un terrain</p>
//                                                     </div>
//                                                 </div>
//                                             </div>


//                                             <div className="mt-6 flex justify-center">
//                                                 <button
//                                                     type="submit"
//                                                     disabled={isSubmitting}
//                                                     className={cn(
//                                                         "w-1/2 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light",
//                                                         isSubmitting && "opacity-50 cursor-not-allowed",
//                                                     )}
//                                                 >
//                                                     {isSubmitting ? (
//                                                         <Loader2 className="animate-spin mr-2" size={20} />
//                                                     ) : (
//                                                         <Save className="mr-2" size={20} />
//                                                     )}
//                                                     {isSubmitting ? "Envoi en cours..." : "Soumettre la demande"}
//                                                 </button>
//                                             </div>
//                                         </form>
//                                         {showMap && selectedLocalite && (
//                                             <div className="mt-4 col-span-2">
//                                                 <div className="border rounded-lg overflow-hidden">
//                                                     <div className="h-[400px]">
//                                                         <MapCar
//                                                             selectedItem={selectedLocalite}
//                                                             type="localite"
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         )}

//                                         {demandeInfo && (
//                                             <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
//                                                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Détails de la demande</h3>
//                                                 <div className="space-y-4">
//                                                     <div className="grid grid-cols-2 gap-4">
//                                                         <div>
//                                                             <p className="text-sm font-medium text-gray-500">Numéro de demande</p>
//                                                             <p className="mt-1">{demandeInfo.demande.id}</p>
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-sm font-medium text-gray-500">Statut</p>
//                                                             <p className="mt-1">{demandeInfo.demande.statut}</p>
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-sm font-medium text-gray-500">Date de création</p>
//                                                             <p className="mt-1">{new Date(demandeInfo.demande.dateCreation).toLocaleString()}</p>
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-sm font-medium text-gray-500">Type de demande</p>
//                                                             <p className="mt-1">{demandeInfo.demande.typeDemande}</p>
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-sm font-medium text-gray-500">Superficie</p>
//                                                             <p className="mt-1">{demandeInfo.demande.superficie} m²</p>
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-sm font-medium text-gray-500">Usage prévu</p>
//                                                             <p className="mt-1">{demandeInfo.demande.usagePrevu}</p>
//                                                         </div>
//                                                     </div>

//                                                     <div className="mt-4">
//                                                         <h4 className="text-md font-semibold text-gray-800 mb-2">Informations de la localité</h4>
//                                                         <div className="grid grid-cols-2 gap-4">
//                                                             <div>
//                                                                 <p className="text-sm font-medium text-gray-500">Nom de la localité</p>
//                                                                 <p className="mt-1">{demandeInfo.localite.nom}</p>
//                                                             </div>
//                                                             <div>
//                                                                 <p className="text-sm font-medium text-gray-500">Prix</p>
//                                                                 <p className="mt-1"> {formatPrice(demandeInfo.localite.prix)}</p>
//                                                             </div>
//                                                             <div className="col-span-2">
//                                                                 <p className="text-sm font-medium text-gray-500">Description</p>
//                                                                 <p className="mt-1">{demandeInfo.localite.description}</p>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </main>
//                             </div>
//                         </div>
//                     </div>
//                 </div >
//             </section >
//         </>
//     );
// };

// export default DemandeNouveau;

"use client";

import { LuUpload } from "react-icons/lu";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/utils";
import { useAuthContext } from "@/context";
import { getLocalites } from "@/services/localiteService";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DemandeurBreadcrumb } from "@/components";
import { Loader2, Save } from "lucide-react";
import { createDemande } from "@/services/demandeService";
import MapCar from "../../../admin/Map/MapCar";

// ---------- helpers nombre ----------
const parseFrNumber = (v) => {
  if (v === null || v === undefined) return undefined;
  const s = String(v).trim().replace(/\s+/g, "").replace(",", ".");
  const n = Number(s);
  return Number.isNaN(n) ? undefined : n;
};

// ---------- listes (alignées avec DemandeCreatePaginatedForMe) ----------
const TYPE_DEMANDE_OPTIONS = [
  { label: "Attribution", value: "Attribution" },
  { label: "Régularisation", value: "Régularisation" },
  { label: "Authentification", value: "Authentification" },
];
const TYPE_DOCUMENT_OPTIONS = [
  { label: "CNI", value: "CNI" },
  { label: "Passeport", value: "PASSEPORT" },
  { label: "Carte Consulaire", value: "CARTE_CONSULAIRE" },
];
const TYPE_TITRE_OPTIONS = [
  { label: "Permis d'occuper", value: "Permis d'occuper" },
  { label: "Bail communal", value: "Bail communal" },
  { label: "Proposition de bail", value: "Proposition de bail" },
  { label: "Transfert définitif", value: "Transfert définitif" },
];

// ---------- validation ----------
const formSchema = yup.object({
  superficie: yup
    .number()
    .transform((curr, orig) => (orig === "" ? undefined : parseFrNumber(orig)))
    .typeError("La superficie doit être un nombre")
    .moreThan(0, "La superficie doit être > 0")
    .max(1_000_000, "Superficie trop élevée")
    .required("La superficie est requise"),
  usagePrevu: yup.string().trim().min(1, "L'usage prévu est requis"),
  localiteId: yup
    .number()
    .transform((curr, orig) => parseFrNumber(orig))
    .typeError("La localité est requise")
    .required("La localité est requise"),
  typeDemande: yup.string().trim().min(1, "Le type de demande est requis"),
  typeDocument: yup.string().trim().min(1, "Le type de document est requis"),
  typeTitre: yup.string().nullable().default("").notRequired(),
  possedeAutreTerrain: yup.boolean().default(false),
  terrainAKaolack: yup.boolean().default(false),
  terrainAilleurs: yup.boolean().default(false),
  recto: yup
    .mixed()
    .test("recto-required", "Le recto du document est requis", (v) => !!v && v.length === 1),
  verso: yup
    .mixed()
    .test("verso-required", "Le verso du document est requis", (v) => !!v && v.length === 1),
});

const DemandeNouveau = () => {
  const { user } = useAuthContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flash, setFlash] = useState({ type: "", content: "" });
  const [localites, setLocalites] = useState([]);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [error, setError] = useState("");

  const [selectedLocalite, setSelectedLocalite] = useState(null);
  const showMap = useMemo(() => {
    if (!selectedLocalite) return false;
    const lat = parseFrNumber(selectedLocalite?.latitude);
    const lng = parseFrNumber(selectedLocalite?.longitude);
    return typeof lat === "number" && typeof lng === "number";
  }, [selectedLocalite]);

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      possedeAutreTerrain: false,
      terrainAKaolack: false,
      terrainAilleurs: false,
      superficie: "",
      usagePrevu: "",
      localiteId: "",
      typeDemande: "",
      typeTitre: "",
      typeDocument: "CNI",
      recto: null,
      verso: null,
    },
  });

  // Charger localités
  useEffect(() => {
    const run = async () => {
      setLoadingLoc(true);
      try {
        const data = await getLocalites();
        setLocalites(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.message || "Erreur de chargement");
      } finally {
        setLoadingLoc(false);
      }
    };
    run();
  }, [user]);

  // Sur changement de localité -> set selectedLocalite
  const handleLocaliteChange = (e) => {
    const rawId = e.target.value;
    setValue("localiteId", rawId);
    const idNum = parseFrNumber(rawId);
    const selected = (localites || []).find((l) => Number(l.id) === idNum);
    setSelectedLocalite(selected || null);
  };

  // Saisie superficie: laisser l’utilisateur taper virgule/espaces
  const superficieVal = watch("superficie");
  const onSuperficieChange = (e) => {
    setValue("superficie", e.target.value, { shouldValidate: false });
  };

  async function onSubmit(values) {
    try {
      if (!user?.id) {
        setFlash({ type: "error", content: "Vous devez être connecté." });
        return;
      }
      setIsSubmitting(true);
      setFlash({ type: "", content: "" });

      const supNum = parseFrNumber(values.superficie);
      const locId = parseFrNumber(values.localiteId);

      const formData = new FormData();
      formData.append("userId", String(user.id));
      formData.append("typeDemande", values.typeDemande);
      formData.append("typeDocument", values.typeDocument);
      formData.append("typeTitre", values.typeTitre || "");
      formData.append("localiteId", String(locId ?? ""));
      formData.append("superficie", String(supNum ?? ""));
      formData.append("usagePrevu", values.usagePrevu ?? "");

      // booléens comme dans la page d'admin
      formData.append("possedeAutreTerrain", String(!!values.possedeAutreTerrain));
      formData.append("terrainAKaolack", String(!!values.terrainAKaolack));
      formData.append("terrainAilleurs", String(!!values.terrainAilleurs));

      if( values.recto?.length > 0 ) formData.append("recto", values.recto[0]);
      if( values.verso?.length > 0 ) formData.append("verso", values.verso[0]);

      
      const response = await createDemande(formData);

      setFlash({
        type: "success",
        content: response?.message || "Demande créée avec succès.",
      });
      setSelectedLocalite(null);
      reset({
        possedeAutreTerrain: false,
        terrainAKaolack: false,
        terrainAilleurs: false,
        superficie: "",
        usagePrevu: "",
        localiteId: "",
        typeDemande: "",
        typeTitre: "",
        typeDocument: "CNI",
        recto: null,
        verso: null,
      });
    } catch (err) {
      setFlash({
        type: "error",
        content: err?.response?.data?.message || err?.message || "Erreur lors de l’envoi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <DemandeurBreadcrumb title="Nouvelle demande de terrain" />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <div className="grid grid-cols-1">
              <div className="bg-gray-100 min-h-screen pb-10">
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-800">Nouvelle demande de terrain</h2>
                      <p className="mt-1 text-sm text-gray-600">
                        Remplissez le formulaire ci-dessous pour soumettre votre demande de terrain
                      </p>
                    </div>

                    {flash.content && (
                      <div
                        className={`px-6 py-4 ${
                          flash.type === "success"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {flash.content}
                      </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-6">
                      {/* Ligne 1 : Type de demande + Type de document */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Type de demande</label>
                          <select
                            {...register("typeDemande")}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:bg-primary-light"
                          >
                            <option value="">Sélectionnez le type de demande</option>
                            {TYPE_DEMANDE_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          {errors.typeDemande && (
                            <p className="mt-1 text-sm text-red-600">{errors.typeDemande.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Type de document</label>
                          <select
                            {...register("typeDocument")}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:bg-primary-light"
                          >
                            <option value="">Sélectionnez le type</option>
                            {TYPE_DOCUMENT_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          {errors.typeDocument && (
                            <p className="mt-1 text-sm text-red-600">{errors.typeDocument.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Ligne 2 : Type de titre (facultatif) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Type de titre (facultatif)</label>
                        <select
                          {...register("typeTitre")}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:bg-primary-light"
                        >
                          <option value="">Sélectionner (facultatif)</option>
                          {TYPE_TITRE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Ligne 3 : Superficie + Localité */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Superficie (m²)</label>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={superficieVal}
                            onChange={onSuperficieChange}
                            placeholder="Ex: 500 ou 1 250,5"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:bg-primary-light"
                          />
                          {errors.superficie && (
                            <p className="mt-1 text-sm text-red-600">{errors.superficie.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Localité</label>
                          <select
                            {...register("localiteId")}
                            onChange={handleLocaliteChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:bg-primary-light"
                          >
                            <option value="">Sélectionnez la localité</option>
                            {localites.map((localite) => (
                              <option key={localite.id} value={localite.id}>
                                {localite.nom}
                              </option>
                            ))}
                          </select>
                          {errors.localiteId && (
                            <p className="mt-1 text-sm text-red-600">{errors.localiteId.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Ligne 4 : Usage prévu */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Usage prévu</label>
                        <textarea
                          {...register("usagePrevu")}
                          rows={4}
                          placeholder="Décrivez l'usage prévu pour ce terrain"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:bg-primary-light"
                        />
                        {errors.usagePrevu && (
                          <p className="mt-1 text-sm text-red-600">{errors.usagePrevu.message}</p>
                        )}
                      </div>

                      {/* Ligne 5 : Fichiers */}
                      <div className="space-y-4">
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
                            {errors.recto && (
                              <p className="mt-1 text-sm text-red-600">{errors.recto.message}</p>
                            )}
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
                            {errors.verso && (
                              <p className="mt-1 text-sm text-red-600">{errors.verso.message}</p>
                            )}
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Formats acceptés : PDF, JPG, JPEG, PNG</p>
                      </div>

                      {/* Ligne 6 : Cases à cocher */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="relative flex items-start">
                          <input
                            type="checkbox"
                            {...register("possedeAutreTerrain")}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:bg-primary-light mt-1"
                          />
                          <span className="ml-3">
                            <span className="text-sm font-medium text-gray-700">Possède un autre terrain</span>
                            <p className="text-sm text-gray-500">Déjà propriétaire ailleurs</p>
                          </span>
                        </label>

                        <label className="relative flex items-start">
                          <input
                            type="checkbox"
                            {...register("terrainAKaolack")}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:bg-primary-light mt-1"
                          />
                          <span className="ml-3">
                            <span className="text-sm font-medium text-gray-700">Terrain à Kaolack</span>
                            <p className="text-sm text-gray-500">Possession dans la commune</p>
                          </span>
                        </label>

                        <label className="relative flex items-start">
                          <input
                            type="checkbox"
                            {...register("terrainAilleurs")}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:bg-primary-light mt-1"
                          />
                          <span className="ml-3">
                            <span className="text-sm font-medium text-gray-700">Terrain ailleurs</span>
                            <p className="text-sm text-gray-500">Possession hors commune</p>
                          </span>
                        </label>
                      </div>

                      {/* Submit */}
                      <div className="mt-6 flex justify-center">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={cn(
                            "w-1/2 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light",
                            isSubmitting && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {isSubmitting ? (
                            <Loader2 className="animate-spin mr-2" size={20} />
                          ) : (
                            <Save className="mr-2" size={20} />
                          )}
                          {isSubmitting ? "Envoi en cours..." : "Soumettre la demande"}
                        </button>
                      </div>
                    </form>

                    {/* Aperçu carte si la localité sélectionnée a des coords */}
                    {showMap && selectedLocalite && (
                      <div className="mt-4 col-span-2 px-6 pb-6">
                        <div className="border rounded-lg overflow-hidden">
                          <div className="h-[400px]">
                            <MapCar selectedItem={selectedLocalite} type="localite" />
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
};

export default DemandeNouveau;
