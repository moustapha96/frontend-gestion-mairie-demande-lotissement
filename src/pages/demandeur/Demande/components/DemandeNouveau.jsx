
// "use client";

// import { LuUpload } from "react-icons/lu";
// import { useState, useEffect, useMemo } from "react";
// import { cn } from "@/utils";
// import { useAuthContext } from "@/context";
// import { getLocalites } from "@/services/localiteService";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { DemandeurBreadcrumb } from "@/components";
// import { Loader2, Save } from "lucide-react";
// import { createDemande } from "@/services/demandeService";
// import MapCar from "../../../admin/Map/MapCar";

// // ---------- helpers nombre ----------
// const parseFrNumber = (v) => {
//   if (v === null || v === undefined) return undefined;
//   const s = String(v).trim().replace(/\s+/g, "").replace(",", ".");
//   const n = Number(s);
//   return Number.isNaN(n) ? undefined : n;
// };

// // ---------- listes (alignées avec DemandeCreatePaginatedForMe) ----------
// const TYPE_DEMANDE_OPTIONS = [
//   { label: "Attribution", value: "Attribution" },
//   { label: "Régularisation", value: "Régularisation" },
//   { label: "Authentification", value: "Authentification" },
// ];
// const TYPE_DOCUMENT_OPTIONS = [
//   { label: "CNI", value: "CNI" },
//   { label: "Passeport", value: "PASSEPORT" },
//   { label: "Carte Consulaire", value: "CARTE_CONSULAIRE" },
// ];
// const TYPE_TITRE_OPTIONS = [
//   { label: "Permis d'occuper", value: "Permis d'occuper" },
//   { label: "Bail communal", value: "Bail communal" },
//   { label: "Proposition de bail", value: "Proposition de bail" },
//   { label: "Transfert définitif", value: "Transfert définitif" },
// ];

// // ---------- validation ----------
// const formSchema = yup.object({
//   superficie: yup
//     .number()
//     .transform((curr, orig) => (orig === "" ? undefined : parseFrNumber(orig)))
//     .typeError("La superficie doit être un nombre")
//     .moreThan(0, "La superficie doit être > 0")
//     .max(1_000_000, "Superficie trop élevée")
//     .required("La superficie est requise"),
//   usagePrevu: yup.string().trim().min(1, "L'usage prévu est requis"),
//   localiteId: yup
//     .number()
//     .transform((curr, orig) => parseFrNumber(orig))
//     .typeError("La localité est requise")
//     .required("La localité est requise"),
//   typeDemande: yup.string().trim().min(1, "Le type de demande est requis"),
//   typeDocument: yup.string().trim().min(1, "Le type de document est requis"),
//   typeTitre: yup.string().nullable().default("").notRequired(),
//   possedeAutreTerrain: yup.boolean().default(false),
//   terrainAKaolack: yup.boolean().default(false),
//   terrainAilleurs: yup.boolean().default(false),
//   recto: yup
//     .mixed()
//     .test("recto-required", "Le recto du document est requis", (v) => !!v && v.length === 1),
//   verso: yup
//     .mixed()
//     .test("verso-required", "Le verso du document est requis", (v) => !!v && v.length === 1),
// });

// const DemandeNouveau = () => {
//   const { user } = useAuthContext();

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [flash, setFlash] = useState({ type: "", content: "" });
//   const [localites, setLocalites] = useState([]);
//   const [loadingLoc, setLoadingLoc] = useState(false);
//   const [error, setError] = useState("");

//   const [selectedLocalite, setSelectedLocalite] = useState(null);
//   const showMap = useMemo(() => {
//     if (!selectedLocalite) return false;
//     const lat = parseFrNumber(selectedLocalite?.latitude);
//     const lng = parseFrNumber(selectedLocalite?.longitude);
//     return typeof lat === "number" && typeof lng === "number";
//   }, [selectedLocalite]);

//   const {
//     register,
//     reset,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//     watch,
//   } = useForm({
//     resolver: yupResolver(formSchema),
//     defaultValues: {
//       possedeAutreTerrain: false,
//       terrainAKaolack: false,
//       terrainAilleurs: false,
//       superficie: "",
//       usagePrevu: "",
//       localiteId: "",
//       typeDemande: "",
//       typeTitre: "",
//       typeDocument: "CNI",
//       recto: null,
//       verso: null,
//     },
//   });

//   // Charger localités
//   useEffect(() => {
//     const run = async () => {
//       setLoadingLoc(true);
//       try {
//         const data = await getLocalites();
//         setLocalites(Array.isArray(data) ? data : []);
//       } catch (err) {
//         setError(err?.message || "Erreur de chargement");
//       } finally {
//         setLoadingLoc(false);
//       }
//     };
//     run();
//   }, [user]);

//   // Sur changement de localité -> set selectedLocalite
//   const handleLocaliteChange = (e) => {
//     const rawId = e.target.value;
//     setValue("localiteId", rawId);
//     const idNum = parseFrNumber(rawId);
//     const selected = (localites || []).find((l) => Number(l.id) === idNum);
//     setSelectedLocalite(selected || null);
//   };

//   // Saisie superficie: laisser l’utilisateur taper virgule/espaces
//   const superficieVal = watch("superficie");
//   const onSuperficieChange = (e) => {
//     setValue("superficie", e.target.value, { shouldValidate: false });
//   };

//   async function onSubmit(values) {
//     try {
//       if (!user?.id) {
//         setFlash({ type: "error", content: "Vous devez être connecté." });
//         return;
//       }
//       setIsSubmitting(true);
//       setFlash({ type: "", content: "" });

//       const supNum = parseFrNumber(values.superficie);
//       const locId = parseFrNumber(values.localiteId);

//       const formData = new FormData();
//       formData.append("userId", String(user.id));
//       formData.append("typeDemande", values.typeDemande);
//       formData.append("typeDocument", values.typeDocument);
//       formData.append("typeTitre", values.typeTitre || "");
//       formData.append("localiteId", String(locId ?? ""));
//       formData.append("superficie", String(supNum ?? ""));
//       formData.append("usagePrevu", values.usagePrevu ?? "");

//       // booléens comme dans la page d'admin
//       formData.append("possedeAutreTerrain", String(!!values.possedeAutreTerrain));
//       formData.append("terrainAKaolack", String(!!values.terrainAKaolack));
//       formData.append("terrainAilleurs", String(!!values.terrainAilleurs));

//       if( values.recto?.length > 0 ) formData.append("recto", values.recto[0]);
//       if( values.verso?.length > 0 ) formData.append("verso", values.verso[0]);

      
//       const response = await createDemande(formData);

//       setFlash({
//         type: "success",
//         content: response?.message || "Demande créée avec succès.",
//       });
//       setSelectedLocalite(null);
//       reset({
//         possedeAutreTerrain: false,
//         terrainAKaolack: false,
//         terrainAilleurs: false,
//         superficie: "",
//         usagePrevu: "",
//         localiteId: "",
//         typeDemande: "",
//         typeTitre: "",
//         typeDocument: "CNI",
//         recto: null,
//         verso: null,
//       });
//     } catch (err) {
//       setFlash({
//         type: "error",
//         content: err?.response?.data?.message || err?.message || "Erreur lors de l’envoi.",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   return (
//     <>
//       <DemandeurBreadcrumb title="Nouvelle demande de terrain" />
//       <section>
//         <div className="container">
//           <div className="my-6 space-y-6">
//             <div className="grid grid-cols-1">
//               <div className="bg-gray-100 min-h-screen pb-10">
//                 <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//                   <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
//                     <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
//                       <h2 className="text-xl font-semibold text-gray-800">Nouvelle demande de terrain</h2>
//                       <p className="mt-1 text-sm text-gray-600">
//                         Remplissez le formulaire ci-dessous pour soumettre votre demande de terrain
//                       </p>
//                     </div>

//                     {flash.content && (
//                       <div
//                         className={`px-6 py-4 ${
//                           flash.type === "success"
//                             ? "bg-green-50 text-green-700"
//                             : "bg-red-50 text-red-700"
//                         }`}
//                       >
//                         {flash.content}
//                       </div>
//                     )}

//                     <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-6">
//                       {/* Ligne 1 : Type de demande + Type de document */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">Type de demande</label>
//                           <select
//                             {...register("typeDemande")}
//                             className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:bg-primary-light"
//                           >
//                             <option value="">Sélectionnez le type de demande</option>
//                             {TYPE_DEMANDE_OPTIONS.map((opt) => (
//                               <option key={opt.value} value={opt.value}>
//                                 {opt.label}
//                               </option>
//                             ))}
//                           </select>
//                           {errors.typeDemande && (
//                             <p className="mt-1 text-sm text-red-600">{errors.typeDemande.message}</p>
//                           )}
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">Type de document</label>
//                           <select
//                             {...register("typeDocument")}
//                             className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:bg-primary-light"
//                           >
//                             <option value="">Sélectionnez le type</option>
//                             {TYPE_DOCUMENT_OPTIONS.map((opt) => (
//                               <option key={opt.value} value={opt.value}>
//                                 {opt.label}
//                               </option>
//                             ))}
//                           </select>
//                           {errors.typeDocument && (
//                             <p className="mt-1 text-sm text-red-600">{errors.typeDocument.message}</p>
//                           )}
//                         </div>
//                       </div>

//                       {/* Ligne 2 : Type de titre (facultatif) */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">Type de titre (facultatif)</label>
//                         <select
//                           {...register("typeTitre")}
//                           className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:bg-primary-light"
//                         >
//                           <option value="">Sélectionner (facultatif)</option>
//                           {TYPE_TITRE_OPTIONS.map((opt) => (
//                             <option key={opt.value} value={opt.value}>
//                               {opt.label}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       {/* Ligne 3 : Superficie + Localité */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">Superficie (m²)</label>
//                           <input
//                             type="text"
//                             inputMode="decimal"
//                             value={superficieVal}
//                             onChange={onSuperficieChange}
//                             placeholder="Ex: 500 ou 1 250,5"
//                             className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:bg-primary-light"
//                           />
//                           {errors.superficie && (
//                             <p className="mt-1 text-sm text-red-600">{errors.superficie.message}</p>
//                           )}
//                         </div>

//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">Localité</label>
//                           <select
//                             {...register("localiteId")}
//                             onChange={handleLocaliteChange}
//                             className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:bg-primary-light"
//                           >
//                             <option value="">Sélectionnez la localité</option>
//                             {localites.map((localite) => (
//                               <option key={localite.id} value={localite.id}>
//                                 {localite.nom}
//                               </option>
//                             ))}
//                           </select>
//                           {errors.localiteId && (
//                             <p className="mt-1 text-sm text-red-600">{errors.localiteId.message}</p>
//                           )}
//                         </div>
//                       </div>

//                       {/* Ligne 4 : Usage prévu */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700">Usage prévu</label>
//                         <textarea
//                           {...register("usagePrevu")}
//                           rows={4}
//                           placeholder="Décrivez l'usage prévu pour ce terrain"
//                           className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:bg-primary-light"
//                         />
//                         {errors.usagePrevu && (
//                           <p className="mt-1 text-sm text-red-600">{errors.usagePrevu.message}</p>
//                         )}
//                       </div>

//                       {/* Ligne 5 : Fichiers */}
//                       <div className="space-y-4">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div>
//                             <label className="block text-sm font-medium text-gray-700">Recto du document</label>
//                             <div className="mt-1 flex items-center">
//                               <input
//                                 type="file"
//                                 {...register("recto")}
//                                 accept=".pdf,.jpg,.jpeg,.png"
//                                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
//                               />
//                               <LuUpload className="h-5 w-5 text-gray-400 ml-2" />
//                             </div>
//                             {errors.recto && (
//                               <p className="mt-1 text-sm text-red-600">{errors.recto.message}</p>
//                             )}
//                           </div>

//                           <div>
//                             <label className="block text-sm font-medium text-gray-700">Verso du document</label>
//                             <div className="mt-1 flex items-center">
//                               <input
//                                 type="file"
//                                 {...register("verso")}
//                                 accept=".pdf,.jpg,.jpeg,.png"
//                                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
//                               />
//                               <LuUpload className="h-5 w-5 text-gray-400 ml-2" />
//                             </div>
//                             {errors.verso && (
//                               <p className="mt-1 text-sm text-red-600">{errors.verso.message}</p>
//                             )}
//                           </div>
//                         </div>
//                         <p className="mt-1 text-sm text-gray-500">Formats acceptés : PDF, JPG, JPEG, PNG</p>
//                       </div>

//                       {/* Ligne 6 : Cases à cocher */}
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <label className="relative flex items-start">
//                           <input
//                             type="checkbox"
//                             {...register("possedeAutreTerrain")}
//                             className="h-4 w-4 rounded border-gray-300 text-primary focus:bg-primary-light mt-1"
//                           />
//                           <span className="ml-3">
//                             <span className="text-sm font-medium text-gray-700">Possède un autre terrain</span>
//                             <p className="text-sm text-gray-500">Déjà propriétaire ailleurs</p>
//                           </span>
//                         </label>

//                         <label className="relative flex items-start">
//                           <input
//                             type="checkbox"
//                             {...register("terrainAKaolack")}
//                             className="h-4 w-4 rounded border-gray-300 text-primary focus:bg-primary-light mt-1"
//                           />
//                           <span className="ml-3">
//                             <span className="text-sm font-medium text-gray-700">Terrain à Kaolack</span>
//                             <p className="text-sm text-gray-500">Possession dans la commune</p>
//                           </span>
//                         </label>

//                         <label className="relative flex items-start">
//                           <input
//                             type="checkbox"
//                             {...register("terrainAilleurs")}
//                             className="h-4 w-4 rounded border-gray-300 text-primary focus:bg-primary-light mt-1"
//                           />
//                           <span className="ml-3">
//                             <span className="text-sm font-medium text-gray-700">Terrain ailleurs</span>
//                             <p className="text-sm text-gray-500">Possession hors commune</p>
//                           </span>
//                         </label>
//                       </div>

//                       {/* Submit */}
//                       <div className="mt-6 flex justify-center">
//                         <button
//                           type="submit"
//                           disabled={isSubmitting}
//                           className={cn(
//                             "w-1/2 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light",
//                             isSubmitting && "opacity-50 cursor-not-allowed"
//                           )}
//                         >
//                           {isSubmitting ? (
//                             <Loader2 className="animate-spin mr-2" size={20} />
//                           ) : (
//                             <Save className="mr-2" size={20} />
//                           )}
//                           {isSubmitting ? "Envoi en cours..." : "Soumettre la demande"}
//                         </button>
//                       </div>
//                     </form>

//                     {/* Aperçu carte si la localité sélectionnée a des coords */}
//                     {showMap && selectedLocalite && (
//                       <div className="mt-4 col-span-2 px-6 pb-6">
//                         <div className="border rounded-lg overflow-hidden">
//                           <div className="h-[400px]">
//                             <MapCar selectedItem={selectedLocalite} type="localite" />
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </main>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default DemandeNouveau;

// src/pages/demandeur/demandes/DemandeNouveau.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Statistic,
  Upload,
  Spin,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { DemandeurBreadcrumb } from "@/components";
import { useAuthContext } from "@/context";
import { getLocalites } from "@/services/localiteService";
import { createDemande } from "@/services/demandeService"; // adapte le nom si besoin
import MapCar from "@/pages/admin/Map/MapCar";

const { Dragger } = Upload;
const { Option } = Select;

/* === listes (aligne-les avec ce que ton back attend) === */
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

/* === utils === */
const parseFrNumber = (v) => {
  if (v === null || v === undefined || v === "") return undefined;
  const s = String(v).trim().replace(/\s+/g, "").replace(",", ".");
  const n = Number(s);
  return Number.isNaN(n) ? undefined : n;
};
const money = (v) =>
  v || v === 0 ? new Intl.NumberFormat("fr-FR").format(v) : "—";

/* === Upload config === */
const ACCEPTED_MIMES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE = 2 * 1024 * 1024; // 2 Mo

export default function DemandeurDemandeNouveau() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [localites, setLocalites] = useState([]);
  const [loadingLoc, setLoadingLoc] = useState(true);
  const [rectoList, setRectoList] = useState([]);
  const [versoList, setVersoList] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const localiteId = Form.useWatch("localiteId", form);
  const superficie = Form.useWatch("superficie", form);

  useEffect(() => {
    (async () => {
      try {
        setLoadingLoc(true);
        const data = await getLocalites();
        setLocalites(Array.isArray(data) ? data : []);
      } catch {
        message.error("Impossible de charger les localités.");
      } finally {
        setLoadingLoc(false);
      }
    })();
  }, []);

  const selectedLocalite = useMemo(
    () => localites.find((l) => Number(l.id) === Number(localiteId)) || null,
    [localites, localiteId]
  );

  const hasCoords = useMemo(() => {
    if (!selectedLocalite) return false;
    const lat = parseFrNumber(selectedLocalite?.latitude);
    const lng = parseFrNumber(selectedLocalite?.longitude);
    return typeof lat === "number" && typeof lng === "number";
  }, [selectedLocalite]);

  const prixLocalite = selectedLocalite?.prix ?? null;

  const estimation = useMemo(() => {
    const sup = parseFrNumber(superficie);
    if (!sup || !prixLocalite) return null;
    return sup * Number(prixLocalite);
  }, [superficie, prixLocalite]);

  /* === Upload guards === */
  const beforeUpload = (file) => {
    if (!ACCEPTED_MIMES.includes(file.type)) {
      message.error("Format invalide (PDF/JPG/PNG)");
      return Upload.LIST_IGNORE;
    }
    if (file.size > MAX_SIZE) {
      message.error("Fichier trop volumineux (max 2 Mo)");
      return Upload.LIST_IGNORE;
    }
    return false; // empêche l'upload auto: on gère via FormData
  };

  const onFinish = async (values) => {
    if (!user?.id) {
      message.error("Connectez-vous pour soumettre une demande.");
      return;
    }

    if (rectoList.length !== 1) {
      message.error("Le fichier Recto est requis.");
      return;
    }
    if (versoList.length !== 1) {
      message.error("Le fichier Verso est requis.");
      return;
    }

    try {
      setSubmitting(true);

      const fd = new FormData();
      fd.append("userId", String(user.id));
      fd.append("typeDemande", values.typeDemande);
      fd.append("typeDocument", values.typeDocument);
      fd.append("typeTitre", values.typeTitre || "");
      fd.append("localiteId", String(values.localiteId));
      fd.append("superficie", String(parseFrNumber(values.superficie) ?? ""));
      fd.append("usagePrevu", values.usagePrevu ?? "");
      fd.append("possedeAutreTerrain", String(!!values.possedeAutreTerrain));
      fd.append("terrainAKaolack", String(!!values.terrainAKaolack));
      fd.append("terrainAilleurs", String(!!values.terrainAilleurs));
      fd.append("recto", rectoList[0].originFileObj);
      fd.append("verso", versoList[0].originFileObj);

      const res = await createDemande(fd);

      const newId = res?.item?.id ?? res?.data?.id ?? res?.id ?? null;
      message.success("Demande soumise avec succès.");

      form.resetFields();
      setRectoList([]);
      setVersoList([]);

      if (newId) {
        navigate(`/demandeur/demandes/${newId}/details`);
      }
    } catch (e) {
      message.error(e?.response?.data?.message || e?.message || "Échec de la soumission.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <DemandeurBreadcrumb title="Nouvelle demande de terrain" />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <Card
              title={
                <Space direction="vertical" size={0}>
                  <span>Formulaire de demande</span>
                  <span style={{ fontSize: 12, color: "#999" }}>
                    {dayjs().format("DD/MM/YYYY HH:mm")}
                  </span>
                </Space>
              }
              extra={
                <Space>
                  <Alert
                    type="info"
                    showIcon
                    message="Les champs marqués * sont obligatoires"
                  />
                </Space>
              }
            >
              <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                initialValues={{
                  typeDemande: "",
                  typeDocument: "CNI",
                  typeTitre: "",
                  localiteId: undefined,
                  superficie: undefined,
                  usagePrevu: "",
                  possedeAutreTerrain: false,
                  terrainAKaolack: false,
                  terrainAilleurs: false,
                }}
              >
                {/* Ligne 1 */}
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Type de demande *"
                      name="typeDemande"
                      rules={[{ required: true, message: "Le type de demande est requis" }]}
                    >
                      <Select placeholder="Sélectionner">
                        {TYPE_DEMANDE_OPTIONS.map((o) => (
                          <Option key={o.value} value={o.value}>
                            {o.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label="Type de titre (optionnel)" name="typeTitre">
                      <Select placeholder="—">
                        {TYPE_TITRE_OPTIONS.map((o) => (
                          <Option key={o.value} value={o.value}>
                            {o.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Type de document *"
                      name="typeDocument"
                      rules={[{ required: true, message: "Le type de document est requis" }]}
                    >
                      <Select>
                        {TYPE_DOCUMENT_OPTIONS.map((o) => (
                          <Option key={o.value} value={o.value}>
                            {o.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                {/* Ligne 2 */}
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Superficie (m²) *"
                      name="superficie"
                      rules={[
                        { required: true, message: "La superficie est requise" },
                        {
                          validator: (_, val) => {
                            const n = parseFrNumber(val);
                            if (n === undefined || Number.isNaN(n)) return Promise.reject("Nombre invalide");
                            if (n <= 0) return Promise.reject("La superficie doit être > 0");
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input placeholder="Ex: 250" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Localité *"
                      name="localiteId"
                      rules={[{ required: true, message: "La localité est requise" }]}
                    >
                      <Select
                        placeholder={loadingLoc ? "Chargement..." : "Sélectionner"}
                        loading={loadingLoc}
                        showSearch
                        optionFilterProp="children"
                      >
                        {localites.map((l) => (
                          <Option key={l.id} value={Number(l.id)}>
                            {l.nom}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Card size="small" style={{ height: "100%" }}>
                      <Row>
                        <Col span={24}>
                          <Statistic
                            title="Prix localité (FCFA/m²)"
                            value={prixLocalite ? money(prixLocalite) : "—"}
                          />
                        </Col>
                        <Col span={24} style={{ marginTop: 8 }}>
                          <Statistic
                            title="Total estimé (FCFA)"
                            value={estimation ? money(estimation) : "—"}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>

                {/* Usage prévu */}
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label="Usage prévu *"
                      name="usagePrevu"
                      rules={[{ required: true, message: "L'usage prévu est requis" }]}
                    >
                      <Input.TextArea rows={4} placeholder="Ex: Habitation" />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Fichiers */}
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Recto (PDF/JPG/PNG, max 2 Mo) *"
                      required
                    >
                      <Dragger
                        multiple={false}
                        fileList={rectoList}
                        beforeUpload={beforeUpload}
                        onChange={({ fileList }) => setRectoList(fileList.slice(-1))}
                        accept=".pdf,.jpg,.jpeg,.png"
                      >
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                          Cliquer ou glisser le fichier Recto ici
                        </p>
                      </Dragger>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Verso (PDF/JPG/PNG, max 2 Mo) *"
                      required
                    >
                      <Dragger
                        multiple={false}
                        fileList={versoList}
                        beforeUpload={beforeUpload}
                        onChange={({ fileList }) => setVersoList(fileList.slice(-1))}
                        accept=".pdf,.jpg,.jpeg,.png"
                      >
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                          Cliquer ou glisser le fichier Verso ici
                        </p>
                      </Dragger>
                    </Form.Item>
                  </Col>
                </Row>

                {/* Cases à cocher */}
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Form.Item name="possedeAutreTerrain" valuePropName="checked">
                      <Checkbox>Je possède déjà un terrain</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item name="terrainAKaolack" valuePropName="checked">
                      <Checkbox>Terrain à Kaolack</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item name="terrainAilleurs" valuePropName="checked">
                      <Checkbox>Terrain ailleurs</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>

                <Row justify="center">
                  <Col>
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                      >
                        {submitting ? "Envoi…" : "Soumettre"}
                      </Button>
                      <Button
                        onClick={() => {
                          form.resetFields();
                          setRectoList([]);
                          setVersoList([]);
                        }}
                        disabled={submitting}
                      >
                        Réinitialiser
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Form>
            </Card>

            {/* Carte de la localité (si coordonnées) */}
            <Card title="Localisation" hidden={!hasCoords}>
              {hasCoords ? (
                <div style={{ height: 360 }}>
                  <MapCar selectedItem={selectedLocalite} type="localite" />
                </div>
              ) : (
                <Alert
                  showIcon
                  type="info"
                  message="Sélectionnez une localité avec des coordonnées pour afficher la carte."
                />
              )}
            </Card>

            {/* Loader localités */}
            {loadingLoc && (
              <div className="flex justify-center">
                <Spin />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
