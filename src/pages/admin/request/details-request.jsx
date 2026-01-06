
// /* eslint-disable react/prop-types */
// "use client";

// import { useEffect, useMemo, useState, useCallback } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import {
//   Card,
//   Descriptions,
//   Divider,
//   Button,
//   Tag,
//   Space,
//   Skeleton,
//   Result,
//   Typography,
//   ConfigProvider,
//   theme as antdTheme,
//   message,
//   Popconfirm,
//   Modal,
//   Form,
//   Input,
//   DatePicker,
//   Select,
//   Row,
//   Col,
//   InputNumber,
//   Tooltip,
// } from "antd";
// import {
//   ArrowLeftOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   UserAddOutlined,
//   LeftOutlined,
//   RightOutlined,
//   SaveOutlined,
//   CloseOutlined,
// } from "@ant-design/icons";
// import dayjs from "dayjs";
// import {
//   deleteDemande,
//   getDetailsRequest,
//   retirerAttribution,
//   listRequests,
//   getFileRequest,
//   updateStatutRequest,
// } from "@/services/requestService";
// import { createUserAccount } from "@/services/userService";
// import { useAuthContext } from "@/context";

// const { Title } = Typography;
// const { Option } = Select;

// /* =========================
//    Helpers FR / normalisation
//    ========================= */
// const STATUT = Object.freeze({
//   EN_ATTENTE: "En attente",
//   EN_COURS_TRAITEMENT: "En cours de traitement",
//   REJETEE: "Rejetée",
//   APPROUVEE: "Approuvée",
//   APPROUVE: "approuve",
// });

// const STATUT_OPTIONS = [
//   { label: STATUT.EN_ATTENTE, value: STATUT.EN_ATTENTE },
//   { label: STATUT.EN_COURS_TRAITEMENT, value: STATUT.EN_COURS_TRAITEMENT },
//   { label: STATUT.REJETEE, value: STATUT.REJETEE },
//   { label: STATUT.APPROUVEE, value: STATUT.APPROUVEE },
// ];

// const STATUT_TAG = {
//   [STATUT.EN_ATTENTE]: { color: "gold" },
//   [STATUT.EN_COURS_TRAITEMENT]: { color: "processing" },
//   [STATUT.REJETEE]: { color: "error" },
//   [STATUT.APPROUVEE]: { color: "success" },
//   [STATUT.APPROUVE]: { color: "success" },
// };

// const CAN_UPDATE_STATUT_ROLES = ["ROLE_MAIRE", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"];
// const hasAnyRole = (user, roles) => user?.roles?.some((r) => roles.includes(r));

// const norm = (v) =>
//   String(v ?? "")
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .trim()
//     .toLowerCase()
//     .replace(/\s+/g, "_");

// const TYPE_DEMANDE_LABELS = {
//   occupancy_permit: "Permis d'occuper",
//   communal_lease: "Bail communal",
//   definitive_transfer: "Transfert définitif",
//   regularization: "Régularisation",
//   regularisation: "Régularisation",
//   "régularisation": "Régularisation",
//   attribution: "Permis d'occuper",
//   authentication: "Authentification",
//   authentification: "Authentification",
// };
// const toFrenchDemande = (v) => TYPE_DEMANDE_LABELS[norm(v)] || (v || "—");

// const TYPE_TITRE_LABELS = {
//   occupancy_permit: "Permis d'occuper",
//   communal_lease: "Bail communal",
//   lease_proposal: "Proposition de bail",
//   definitive_transfer: "Transfert définitif",
//   "permis_d'occuper": "Permis d'occuper",
//   "permis_d_occuper": "Permis d'occuper",
//   bail_communal: "Bail communal",
//   proposition_de_bail: "Proposition de bail",
//   transfert_definitif: "Transfert définitif",
//   "transfert_définitif": "Transfert définitif",
// };
// const toFrenchTitre = (v) => TYPE_TITRE_LABELS[norm(v)] || (v || "—");

// const statusColor = (statut) => {
//   const s = norm(statut);
//   if (["approuve", "approuvee", "approved", "valide", "validee"].includes(s)) return "green";
//   if (["pending", "en_attente"].includes(s)) return "gold";
//   if (["processing", "en_cours", "en_etude"].includes(s)) return "blue";
//   if (["refuse", "refusee", "rejected"].includes(s)) return "red";
//   return "default";
// };
// const statutFr = (s) => {
//   if (s == null) return "—";
//   const v = norm(s);
//   if (v === "pending" || v === "en_attente") return "En attente";
//   if (["processing", "en_cours", "en_etude"].includes(v)) return "En cours";
//   if (["approuve", "approuvee", "approved", "valide", "validee"].includes(v)) return "Approuvée";
//   if (["refuse", "refusee", "rejected"].includes(v)) return "Refusée";
//   return s;
// };
// const isApproved = (s) => {
//   const v = norm(s);
//   return ["approuve", "approuvee", "approved", "valide", "validee"].includes(v);
// };

// /* =========================
//    Formatters
//    ========================= */
// const fmt = (v) => (v === null || v === undefined || v === "" ? "—" : v);
// const fmtDate = (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "—");
// const money = (v) => (v || v === 0 ? new Intl.NumberFormat("fr-FR").format(v) : "—");

// /* =========================
//    Component
//    ========================= */
// export default function RequestDetails() {
//   const { id } = useParams();
//   const { user } = useAuthContext();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [item, setItem] = useState(null);
//   const [error, setError] = useState(null);

//   // neighbors
//   const [prevId, setPrevId] = useState(null);
//   const [nextId, setNextId] = useState(null);
//   const [loadingNeighbors, setLoadingNeighbors] = useState(false);

//   // statut editing
//   const [editing, setEditing] = useState(false);
//   const [newStatut, setNewStatut] = useState();
//   const [saving, setSaving] = useState(false);
//   const canUpdateStatut = hasAnyRole(user, CAN_UPDATE_STATUT_ROLES);

//   // reject flow (optionnel)
//   const [rejectOpen, setRejectOpen] = useState(false);
//   const [loadingReject] = useState(false);
//   const disableActions = false; // hooké à tes règles si besoin

//   // create account
//   const [createOpen, setCreateOpen] = useState(false);
//   const [creating, setCreating] = useState(false);
//   const [form] = Form.useForm();

//   const [files, setFiles] = useState({ recto: null, verso: null });

//   const SITUATION_OPTIONS = [
//     { value: "Célibataire", label: "Célibataire" },
//     { value: "Marié(e)", label: "Marié(e)" },
//     { value: "Divorcé(e)", label: "Divorcé(e)" },
//     { value: "Veuf(ve)", label: "Veuf(ve)" },
//   ];

//   const demandeur = useMemo(() => {
//     if (item?.demandeur) return item.demandeur;
//     return {
//       prenom: item?.prenom,
//       nom: item?.nom,
//       email: item?.email,
//       telephone: item?.telephone,
//       adresse: item?.adresse,
//       profession: item?.profession,
//       numeroElecteur: item?.numeroElecteur,
//       dateNaissance: item?.dateNaissance,
//       lieuNaissance: item?.lieuNaissance,
//       situationMatrimoniale: item?.situationMatrimoniale,
//       statutLogement: item?.statutLogement,
//       nombreEnfant: item?.nombreEnfant,
//     };
//   }, [item]);

//   // Load item + files
//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         const [res, f] = await Promise.all([
//           getDetailsRequest(String(id)).catch(() => null),
//           getFileRequest(String(id)).catch(() => ({})),
//         ]);
//         console.log(res, f)
//         const recto = f?.data?.recto ?? f?.recto ?? null;
//         const verso = f?.data?.verso ?? f?.verso ?? null;
//         setFiles({ recto, verso });

//         if (!res?.success || !res.item) throw new Error("Chargement impossible");
//         setItem(res.item);
//         setError(null);
//       } catch (e) {
//         setError(e?.response?.data?.message || e?.message || "Erreur de chargement");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id, createOpen]);

//   // Prev/Next based on total and current numeric id (logique demandée)
//   const loadNeighbors = useCallback(async (currentId) => {
//     const cur = Number(currentId);
//     if (!Number.isFinite(cur) || cur <= 0) {
//       setPrevId(null);
//       setNextId(null);
//       return;
//     }
//     try {
//       setLoadingNeighbors(true);
//       const res = await listRequests({
//         page: 1,
//         pageSize: 1,
//         sortField: "id",
//         sortOrder: "DESC",
//       });
//       const total = Number(res?.total ?? 0);
//       if (!Number.isFinite(total) || total <= 0) {
//         setPrevId(null);
//         setNextId(null);
//         return;
//       }
//       setPrevId(cur > 1 ? String(cur - 1) : null);
//       setNextId(cur < total ? String(cur + 1) : null);
//     } catch {
//       setPrevId(null);
//       setNextId(null);
//     } finally {
//       setLoadingNeighbors(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (id) loadNeighbors(id);
//   }, [id, loadNeighbors]);

//   // Save statut
//   const saveStatut = async () => {
//     if (!newStatut) return message.error("Sélectionnez un statut");
//     try {
//       setSaving(true);
//       await updateStatutRequest(String(id), { statut: newStatut });
//       setItem((prev) => ({
//         ...prev,
//         statut: newStatut,
//         dateModification: new Date().toISOString(),
//       }));
//       setEditing(false);
//       message.success("Statut mis à jour");
//     } catch (e) {
//       message.error(e?.response?.data?.message || e?.message || "Échec de la mise à jour du statut");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Keyboard ← →
//   useEffect(() => {
//     const onKey = (e) => {
//       const tag = e.target?.tagName;
//       if (tag && ["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
//       if (e.key === "ArrowLeft" && prevId) navigate(`/admin/demandes/${prevId}/details`);
//       if (e.key === "ArrowRight" && nextId) navigate(`/admin/demandes/${nextId}/details`);
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [prevId, nextId, navigate]);

//   const onDelete = async () => {
//     try {
//       await deleteDemande(String(id));
//       message.success("Demande supprimée");
//       navigate("/admin/demandes");
//     } catch (e) {
//       message.error(e?.response?.data?.message || e?.message || "Suppression impossible");
//     }
//   };

//   // Create account
//   const [createForm] = Form.useForm(); // separate form state to avoid confusion
//   const openCreateModal = () => {
//     const initialValues = {
//       prenom: demandeur?.prenom || "",
//       nom: demandeur?.nom || "",
//       email: demandeur?.email || "",
//       telephone: demandeur?.telephone || "",
//       adresse: demandeur?.adresse || "",
//       profession: demandeur?.profession || "",
//       numeroElecteur: demandeur?.numeroElecteur || "",
//       lieuNaissance: demandeur?.lieuNaissance || "",
//       dateNaissance: demandeur?.dateNaissance ? dayjs(demandeur.dateNaissance) : null,
//       stuationDemandeur: demandeur?.statutLogement || "",
//       nombreEnfant:
//         typeof demandeur?.nombreEnfant === "number"
//           ? demandeur.nombreEnfant
//           : demandeur?.nombreEnfant
//             ? Number(demandeur.nombreEnfant)
//             : 0,
//       password: "",
//       roles: ["ROLE_DEMANDEUR"],
//       situationMatrimoniale: demandeur?.situationMatrimoniale || undefined,
//     };
//     createForm.setFieldsValue(initialValues);
//     setCreateOpen(true);
//   };

//   const handleCreateUser = async () => {
//     try {
//       const values = await createForm.validateFields();
//       setCreating(true);
//       const payload = {
//         prenom: values.prenom,
//         nom: values.nom,
//         email: values.email,
//         password: values.password || undefined,
//         telephone: values.telephone || null,
//         adresse: values.adresse || null,
//         profession: values.profession || null,
//         numeroElecteur: values.numeroElecteur || null,
//         lieuNaissance: values.lieuNaissance || null,
//         dateNaissance: values.dateNaissance ? values.dateNaissance.format("YYYY-MM-DD") : null,
//         roles: "ROLE_DEMANDEUR",
//         stuationDemandeur: values.stuationDemandeur || null, // API expects this key
//         nombreEnfant: values.nombreEnfant ?? 0,
//         situationMatrimoniale: values.situationMatrimoniale || null,
//         demandeId: id,
//       };
//       await createUserAccount(payload);
//       message.success("Compte utilisateur créé avec succès");
//       setCreateOpen(false);
//     } catch (e) {
//       if (!e?.errorFields) {
//         message.error(e?.response?.data?.message || e?.message || "Création impossible");
//       }
//     } finally {
//       setCreating(false);
//     }
//   };

//   const handleRetireAttribution = async () => {
//     try {
//       await retirerAttribution(String(id));
//       message.success("Attribution retirée");
//       // reload current details
//       navigate(`/admin/demandes/${id}/details`, { replace: true });
//     } catch (e) {
//       message.error(e?.response?.data?.message || e?.message || "Retrait impossible");
//     }
//   };

//   const statutTagProps = item?.statut ? STATUT_TAG[item.statut] || { color: statusColor(item.statut) } : {};

//   return (
//     <ConfigProvider theme={{ algorithm: antdTheme.defaultAlgorithm }}>
//       <div className="container mx-auto px-4 my-6 bg-white">
//         <Space className="mb-4" align="center" wrap>
//           <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
//             Retour
//           </Button>

//           {/* Prev / Next */}
//           <Space size="small" wrap>
//             <Tooltip title="Demande précédente (←)">
//               <Button
//                 icon={<LeftOutlined />}
//                 disabled={!prevId || loadingNeighbors}
//                 onClick={() => prevId && navigate(`/admin/demandes/${prevId}/details`)}
//               >
//                 Précédente
//               </Button>
//             </Tooltip>
//             <Tooltip title="Demande suivante (→)">
//               <Button
//                 icon={<RightOutlined />}
//                 disabled={!nextId || loadingNeighbors}
//                 onClick={() => nextId && navigate(`/admin/demandes/${nextId}/details`)}
//               >
//                 Suivante
//               </Button>
//             </Tooltip>
//           </Space>

//           <Title level={4} className="!m-0">
//             Détails de la demande #{id}
//           </Title>
//         </Space>

//         {loading ? (
//           <Card>
//             <Skeleton active paragraph={{ rows: 6 }} />
//           </Card>
//         ) : error ? (
//           <Result
//             status="error"
//             title="Impossible d’afficher la demande"
//             subTitle={error}
//             extra={<Button onClick={() => window.location.reload()}>Recharger</Button>}
//           />
//         ) : (
//           <>
//             <Card className="mb-6">
//               <Space className="w-full justify-between" align="start">
//                 <div>
//                   <Title level={5} className="!mb-1">
//                     Informations principales
//                   </Title>
//                   <Space size="small" wrap>

//                     {item?.typeDemande && <Tag color="geekblue">{toFrenchDemande(item.typeDemande)}</Tag>}
//                     {item?.typeTitre && <Tag color="purple">{toFrenchTitre(item.typeTitre)}</Tag>}
//                   </Space>
//                 </div>

//                 <Space wrap>


//                   {!editing ? (
//                     <>
//                       <Tag {...statutTagProps}>{statutFr(item.statut)}</Tag>
//                       {canUpdateStatut && (
//                         <Button
//                           icon={<EditOutlined />}
//                           onClick={() => {
//                             setNewStatut(item.statut || STATUT.EN_ATTENTE);
//                             setEditing(true);
//                           }}
//                         >
//                           Modifier le statut
//                         </Button>
//                       )}
//                     </>
//                   ) : (
//                     <Space.Compact>
//                       <Select
//                         style={{ minWidth: 240 }}
//                         value={newStatut}
//                         onChange={setNewStatut}
//                         options={STATUT_OPTIONS}
//                         disabled={saving}
//                       />
//                       <Button type="primary" icon={<SaveOutlined />} onClick={saveStatut} loading={saving}>
//                         Enregistrer
//                       </Button>
//                       <Button icon={<CloseOutlined />} onClick={() => setEditing(false)} disabled={saving}>
//                         Annuler
//                       </Button>
//                     </Space.Compact>
//                   )}

//                   <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/demandes/${id}/edit`)}>
//                     Éditer
//                   </Button>


//                   {/* Retirer attribution */}
//                   {user &&
//                     (user.roles?.includes("ROLE_PRESIDENT_COMMISSION") ||
//                       user.roles?.includes("ROLE_MAIRE") ||
//                       user.roles?.includes("ROLE_ADMIN") ||
//                       user.roles?.includes("ROLE_SUPER_ADMIN")) && (
//                       <>
//                         {isApproved(item.statut) && item.attribution && (
//                           <Popconfirm
//                             title="Voulez-vous vraiment retirer l'attribution ?"
//                             okText="Oui"
//                             cancelText="Non"
//                             onConfirm={handleRetireAttribution}
//                           >
//                             <Button icon={<DeleteOutlined />} style={{ color: "red" }}>
//                               Retirer l'attribution
//                             </Button>
//                           </Popconfirm>
//                         )}
//                       </>
//                     )}



//                   {user &&
//                     (user.roles?.includes("ROLE_PRESIDENT_COMMISSION") ||
//                       user.roles?.includes("ROLE_MAIRE") ||
//                       user.roles?.includes("ROLE_ADMIN") ||
//                       user.roles?.includes("ROLE_SUPER_ADMIN")) && (
//                       <>

//                         {(item.statut === STATUT.APPROUVEE || item.statut === STATUT.APPROUVE) &&  !item.attribution && (
//                           <Link to={`/admin/demandes/${item.id}/attribution`}>
//                             <Button type="default">Attribuer une parcelle</Button>
//                           </Link>
//                         )}

//                       </>)}



//                   <Button
//                     danger
//                     onClick={() => setRejectOpen(true)}
//                     disabled={!canUpdateStatut || disableActions}
//                     loading={loadingReject}
//                   >
//                     Rejeter
//                   </Button>


//                   {/* Supprimer */}
//                   {user &&
//                     (
//                       user.roles?.includes("ROLE_ADMIN") ||
//                       user.roles?.includes("ROLE_SUPER_ADMIN")) && (
//                       <Popconfirm title="Supprimer cette demande ?" okText="Oui" cancelText="Non" onConfirm={onDelete}>
//                         <Button danger icon={<DeleteOutlined />} />
//                       </Popconfirm>
//                     )}

//                 </Space>




//               </Space>

//               {/* Bloc édition statut harmonisé */}
//               <Divider />


//               <Divider />

//               <Descriptions bordered column={1} size="small">
//                 <Descriptions.Item label="Type de demande">
//                   {toFrenchDemande(item?.typeDemande)}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Type de titre">{toFrenchTitre(item?.typeTitre)}</Descriptions.Item>
//                 <Descriptions.Item label="Type de document">{fmt(item?.typeDocument)}</Descriptions.Item>
//                 <Descriptions.Item label="Quartier">{fmt(item?.quartier?.nom || item?.localite)}</Descriptions.Item>
//                 <Descriptions.Item label="Usage prévu">{fmt(item?.usagePrevu)}</Descriptions.Item>
//                 <Descriptions.Item label="Superficie (m²)">{fmt(item?.superficie)}</Descriptions.Item>
//                 <Descriptions.Item label="Possède autre terrain">
//                   {item?.possedeAutreTerrain ? "Oui" : "Non"}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Terrain à Kaolack">{item?.terrainAKaolack ? "Oui" : "Non"}</Descriptions.Item>
//                 <Descriptions.Item label="Terrain ailleurs">{item?.terrainAilleurs ? "Oui" : "Non"}</Descriptions.Item>
//                 <Descriptions.Item label="Date de création">{fmtDate(item?.dateCreation)}</Descriptions.Item>
//                 <Descriptions.Item label="Dernière modification">
//                   {fmtDate(item?.dateModification)}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Statut de la demande">{statutFr(item?.statut)}</Descriptions.Item>

//                 {item?.motif_refus && (
//                   <Descriptions.Item label="Motif de refus">{item.motif_refus}</Descriptions.Item>
//                 )}
//                 {item?.decisionCommission && (
//                   <Descriptions.Item label="Décision commission">{item.decisionCommission}</Descriptions.Item>
//                 )}
//                 {item?.rapport && <Descriptions.Item label="Rapport">{item.rapport}</Descriptions.Item>}
//                 {item?.recommandation && (
//                   <Descriptions.Item label="Recommandation">{item.recommandation}</Descriptions.Item>
//                 )}
//               </Descriptions>
//             </Card>

//             <Divider />
//             <div className="grid md:grid-cols-2 gap-6">
//               <Card
//                 title="Demandeur"
//                 extra={
//                   !item?.utilisateur &&
//                   user &&
//                   (user.roles?.includes("ROLE_ADMIN") ||
//                     user.roles?.includes("ROLE_SUPER_ADMIN") ||
//                     user.roles?.includes("ROLE_MAIRE")) && (
//                     <Button type="primary" icon={<UserAddOutlined />} onClick={openCreateModal}>
//                       Créer le compte
//                     </Button>
//                   )
//                 }
//               >
//                 <Descriptions bordered column={1} size="small">
//                   <Descriptions.Item label="Nom complet">
//                     {fmt(item?.utilisateur?.prenom ?? demandeur?.prenom)} {fmt(item?.utilisateur?.nom ?? demandeur?.nom)}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Email">{fmt(item?.utilisateur?.email ?? demandeur?.email)}</Descriptions.Item>
//                   <Descriptions.Item label="Téléphone">
//                     {fmt(item?.utilisateur?.telephone ?? demandeur?.telephone)}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Adresse">
//                     {fmt(item?.utilisateur?.adresse ?? demandeur?.adresse)}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Profession">
//                     {fmt(item?.utilisateur?.profession ?? demandeur?.profession)}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="N° électeur">
//                     {fmt(item?.utilisateur?.numeroElecteur ?? demandeur?.numeroElecteur)}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Naissance">
//                     {fmtDate(item?.utilisateur?.dateNaissance ?? demandeur?.dateNaissance)}{" "}
//                     {demandeur?.lieuNaissance
//                       ? `à ${item?.utilisateur?.lieuNaissance ?? demandeur?.lieuNaissance}`
//                       : ""}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Situation matrimoniale">
//                     {fmt(item?.utilisateur?.situationMatrimoniale ?? demandeur?.situationMatrimoniale)}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Statut logement">
//                     {fmt(item?.utilisateur?.statutLogement ?? demandeur?.statutLogement)}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Nombre d'enfants">
//                     {fmt(item?.utilisateur?.nombreEnfant ?? demandeur?.nombreEnfant)}
//                   </Descriptions.Item>
//                 </Descriptions>
//               </Card>

//               {item?.quartier && (
//                 <Card title="Quartier demandé">
//                   <Descriptions bordered column={1} size="small">
//                     <Descriptions.Item label="Nom">{fmt(item.quartier?.nom)}</Descriptions.Item>
//                     {item.quartier?.prix !== undefined && (
//                       <Descriptions.Item label="Prix">{String(item.quartier.prix)}</Descriptions.Item>
//                     )}
//                     {item.quartier?.description && (
//                       <Descriptions.Item label="Description">{item.quartier.description}</Descriptions.Item>
//                     )}
//                   </Descriptions>
//                 </Card>
//               )}

//               {item?.attribution && (
//                 <>
//                   <Descriptions title="Information de l'attribution" bordered column={2} size="small">
//                     <Descriptions.Item label="Montant">{money(item.attribution.montant)}</Descriptions.Item>
//                     <Descriptions.Item label="Date d'effet">{fmtDate(item.attribution.dateEffet)}</Descriptions.Item>
//                     <Descriptions.Item label="Date de fin">{fmtDate(item.attribution.dateFin)}</Descriptions.Item>
//                     <Descriptions.Item label="Fréquence">{fmt(item.attribution.frequence)}</Descriptions.Item>
//                     <Descriptions.Item label="Paiement">
//                       <Tag color={item.attribution.etatPaiement ? "green" : "red"}>
//                         {item.attribution.etatPaiement ? "Payé" : "Non payé"}
//                       </Tag>
//                     </Descriptions.Item>
//                   </Descriptions>

//                   <Descriptions title="Parcelle attribuée" bordered column={2} size="small">
//                     <Descriptions.Item label="Numéro">{fmt(item.attribution.parcelle?.numero)}</Descriptions.Item>
//                     <Descriptions.Item label="Surface">{fmt(item.attribution.parcelle?.surface)} m²</Descriptions.Item>
//                     <Descriptions.Item label="Statut">{fmt(item.attribution.parcelle?.statut)}</Descriptions.Item>
//                     <Descriptions.Item label="Latitude">{fmt(item.attribution.parcelle?.latitude)}</Descriptions.Item>
//                     <Descriptions.Item label="Longitude">{fmt(item.attribution.parcelle?.longitude)}</Descriptions.Item>
//                     <Descriptions.Item label="Lotissement">
//                       {fmt(item.attribution.parcelle?.lotissement?.nom)} ({fmt(item.attribution.parcelle?.lotissement?.id)})
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Quartier">
//                       {fmt(item.attribution.parcelle?.lotissement?.localite?.nom)}
//                     </Descriptions.Item>
//                   </Descriptions>
//                 </>
//               )}
//             </div>

//             {!!(files?.recto || files?.verso) && (
//               <Descriptions title="Documents fournis" bordered column={2} size="small" className="mt-6">
//                 <Descriptions.Item label="Recto">
//                   {files.recto ? (
//                     <a href={`${import.meta.env.VITE_API_URL_SIMPLE}${files.recto}`} target="_blank" rel="noreferrer">
//                       Ouvrir
//                     </a>
//                   ) : (
//                     "—"
//                   )}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Verso">
//                   {files.verso ? (
//                     <a href={`${import.meta.env.VITE_API_URL_SIMPLE}${files.verso}`} target="_blank" rel="noreferrer">
//                       Ouvrir
//                     </a>
//                   ) : (
//                     "—"
//                   )}
//                 </Descriptions.Item>
//               </Descriptions>
//             )}

//             {/* Modale de création de compte */}
//             <Modal
//               title="Créer le compte utilisateur"
//               open={createOpen}
//               onOk={handleCreateUser}
//               onCancel={() => !creating && setCreateOpen(false)}
//               okText="Créer le compte"
//               confirmLoading={creating}
//               destroyOnClose
//             >
//               <Form form={createForm} layout="vertical">
//                 <Row gutter={[16, 8]}>
//                   <Col xs={24} md={12}>
//                     <Form.Item label="Prénom" name="prenom" rules={[{ required: true, message: "Prénom requis" }]}>
//                       <Input />
//                     </Form.Item>
//                   </Col>
//                   <Col xs={24} md={12}>
//                     <Form.Item label="Nom" name="nom" rules={[{ required: true, message: "Nom requis" }]}>
//                       <Input />
//                     </Form.Item>
//                   </Col>

//                   <Col xs={24} md={12}>
//                     <Form.Item
//                       label="Email"
//                       name="email"
//                       rules={[{ type: "email", required: true, message: "Email invalide" }]}
//                     >
//                       <Input />
//                     </Form.Item>
//                   </Col>
//                   <Col xs={24} md={12}>
//                     <Form.Item label="Mot de passe" name="password" tooltip="Laisser vide pour générer par défaut">
//                       <Input.Password placeholder="••••••••" />
//                     </Form.Item>
//                   </Col>

//                   <Col xs={24} md={12}>
//                     <Form.Item
//                       label="Téléphone"
//                       name="telephone"
//                       rules={[{ required: true, message: "Téléphone requis" }]}
//                     >
//                       <Input />
//                     </Form.Item>
//                   </Col>
//                   <Col xs={24} md={12}>
//                     <Form.Item label="Adresse" name="adresse" rules={[{ required: true, message: "Adresse requise" }]}>
//                       <Input />
//                     </Form.Item>
//                   </Col>

//                   <Col xs={24} md={12}>
//                     <Form.Item
//                       label="Profession"
//                       name="profession"
//                       rules={[{ required: true, message: "Profession requise" }]}
//                     >
//                       <Input />
//                     </Form.Item>
//                   </Col>
//                   <Col xs={24} md={12}>
//                     <Form.Item
//                       label="Numéro électeur"
//                       name="numeroElecteur"
//                       rules={[{ required: true, message: "Numéro électeur requis" }]}
//                     >
//                       <Input maxLength={20} />
//                     </Form.Item>
//                   </Col>

//                   <Col xs={24} md={12}>
//                     <Form.Item
//                       label="Lieu de naissance"
//                       name="lieuNaissance"
//                       rules={[{ required: true, message: "Lieu de naissance requis" }]}
//                     >
//                       <Input />
//                     </Form.Item>
//                   </Col>
//                   <Col xs={24} md={12}>
//                     <Form.Item
//                       label="Date de naissance"
//                       name="dateNaissance"
//                       rules={[{ required: true, message: "Date de naissance requise" }]}
//                     >
//                       <DatePicker className="w-full" format="YYYY-MM-DD" />
//                     </Form.Item>
//                   </Col>

//                   <Col xs={24} md={12}>
//                     <Form.Item label="Situation matrimoniale" name="situationMatrimoniale" rules={[{ required: true }]}>
//                       <Select allowClear placeholder="Sélectionner">
//                         {SITUATION_OPTIONS.map((o) => (
//                           <Option key={o.value} value={o.value}>
//                             {o.label}
//                           </Option>
//                         ))}
//                       </Select>
//                     </Form.Item>
//                   </Col>

//                   <Col xs={24} md={12}>
//                     <Form.Item
//                       label="Statut logement"
//                       name="stuationDemandeur"
//                       tooltip="Correspond à 'stuationDemandeur' attendu par l'API"
//                     >
//                       <Select allowClear placeholder="Sélectionner">
//                         <Option value="Propriétaire">Propriétaire</Option>
//                         <Option value="Locataire">Locataire</Option>
//                         <Option value="Hébergé(e)">Hébergé(e)</Option>
//                       </Select>
//                     </Form.Item>
//                   </Col>

//                   <Col xs={24} md={12}>
//                     <Form.Item label="Nombre d'enfants" name="nombreEnfant">
//                       <InputNumber min={0} className="w-full" />
//                     </Form.Item>
//                   </Col>

//                   <Col xs={24} md={12}>
//                     <Form.Item label="Rôles" name="roles" initialValue={["ROLE_DEMANDEUR"]}>
//                       <Select mode="multiple" allowClear>
//                         <Option value="ROLE_DEMANDEUR">ROLE_DEMANDEUR</Option>
//                       </Select>
//                     </Form.Item>
//                   </Col>
//                 </Row>
//               </Form>
//             </Modal>
//           </>
//         )}
//       </div>
//     </ConfigProvider>
//   );
// }

"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Descriptions,
  Divider,
  Button,
  Tag,
  Space,
  Skeleton,
  Result,
  Typography,
  ConfigProvider,
  theme as antdTheme,
  message,
  Popconfirm,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Row,
  Col,
  InputNumber,
  Tooltip,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  LeftOutlined,
  RightOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  deleteDemande,
  getDetailsRequest,
  retirerAttribution,
  listRequests,
  getFileRequest,
  updateStatutRequest,
} from "@/services/requestService";
import { createUserAccount } from "@/services/userService";
import { useAuthContext } from "@/context";

const { Title } = Typography;
const { Option } = Select;

/* =========================
   Helpers FR / normalisation
   ========================= */
const STATUT = Object.freeze({
  EN_ATTENTE: "En attente",
  EN_COURS_TRAITEMENT: "En cours de traitement",
  REJETEE: "Rejetée",
  APPROUVEE: "Approuvée",
  APPROUVE: "approuve",
});

const STATUT_OPTIONS = [
  { label: STATUT.EN_ATTENTE, value: STATUT.EN_ATTENTE },
  { label: STATUT.EN_COURS_TRAITEMENT, value: STATUT.EN_COURS_TRAITEMENT },
  { label: STATUT.REJETEE, value: STATUT.REJETEE },
  { label: STATUT.APPROUVEE, value: STATUT.APPROUVEE },
];

const STATUT_TAG = {
  [STATUT.EN_ATTENTE]: { color: "gold" },
  [STATUT.EN_COURS_TRAITEMENT]: { color: "processing" },
  [STATUT.REJETEE]: { color: "error" },
  [STATUT.APPROUVEE]: { color: "success" },
  [STATUT.APPROUVE]: { color: "success" },
};

const CAN_UPDATE_STATUT_ROLES = ["ROLE_MAIRE", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"];
const hasAnyRole = (user, roles) => user?.roles?.some((r) => roles.includes(r));

const norm = (v) =>
  String(v ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

const TYPE_DEMANDE_LABELS = {
  occupancy_permit: "Permis d'occuper",
  communal_lease: "Bail communal",
  definitive_transfer: "Transfert définitif",
  regularization: "Régularisation",
  regularisation: "Régularisation",
  "régularisation": "Régularisation",
  attribution: "Permis d'occuper",
  authentication: "Authentification",
  authentification: "Authentification",
};

const toFrenchDemande = (v) => TYPE_DEMANDE_LABELS[norm(v)] || (v || "—");

const TYPE_TITRE_LABELS = {
  occupancy_permit: "Permis d'occuper",
  communal_lease: "Bail communal",
  lease_proposal: "Proposition de bail",
  definitive_transfer: "Transfert définitif",
  "permis_d'occuper": "Permis d'occuper",
  "permis_d_occuper": "Permis d'occuper",
  bail_communal: "Bail communal",
  proposition_de_bail: "Proposition de bail",
  transfert_definitif: "Transfert définitif",
  "transfert_définitif": "Transfert définitif",
};



const toFrenchTitre = (v) => TYPE_TITRE_LABELS[norm(v)] || (v || "—");

const statusColor = (statut) => {
  const s = norm(statut);
  if (["approuve", "approuvee", "approved", "valide", "validee"].includes(s)) return "green";
  if (["pending", "en_attente"].includes(s)) return "gold";
  if (["processing", "en_cours", "en_etude"].includes(s)) return "blue";
  if (["refuse", "refusee", "rejected"].includes(s)) return "red";
  return "default";
};

const statutFr = (s) => {
  if (s == null) return "—";
  const v = norm(s);
  if (v === "pending" || v === "en_attente") return "En attente";
  if (["processing", "en_cours", "en_etude"].includes(v)) return "En cours";
  if (["approuve", "approuvee", "approved", "valide", "validee"].includes(v)) return "Approuvée";
  if (["refuse", "refusee", "rejected"].includes(v)) return "Refusée";
  return s;
};

const isApproved = (s) => {
  const v = norm(s);
  return ["approuve", "approuvee", "approved", "valide", "validee"].includes(v);
};

/* =========================
   Formatters
   ========================= */
const fmt = (v) => (v === null || v === undefined || v === "" ? "—" : v);
const fmtDate = (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "—");
const money = (v) => (v || v === 0 ? new Intl.NumberFormat("fr-FR").format(v) : "—");

/* =========================
   Component
   ========================= */
export default function RequestDetails() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  // neighbors
  const [prevId, setPrevId] = useState(null);
  const [nextId, setNextId] = useState(null);
  const [loadingNeighbors, setLoadingNeighbors] = useState(false);
  // statut editing
  const [editing, setEditing] = useState(false);
  const [newStatut, setNewStatut] = useState();
  const [saving, setSaving] = useState(false);
  const canUpdateStatut = hasAnyRole(user, CAN_UPDATE_STATUT_ROLES);
  // reject flow (optionnel)
  const [rejectOpen, setRejectOpen] = useState(false);
  const [loadingReject] = useState(false);
  const disableActions = false; // hooké à tes règles si besoin
  // create account
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [mustCreateAccount, setMustCreateAccount] = useState(false);
  const [attributionPending, setAttributionPending] = useState(false);
  const [form] = Form.useForm();
  const [files, setFiles] = useState({ recto: null, verso: null });

  const SITUATION_OPTIONS = [
    { value: "Célibataire", label: "Célibataire" },
    { value: "Marié(e)", label: "Marié(e)" },
    { value: "Divorcé(e)", label: "Divorcé(e)" },
    { value: "Veuf(ve)", label: "Veuf(ve)" },
  ];

  const demandeur = useMemo(() => {
    if (item?.demandeur) return item.demandeur;
    return {
      prenom: item?.prenom,
      nom: item?.nom,
      email: item?.email,
      telephone: item?.telephone,
      adresse: item?.adresse,
      profession: item?.profession,
      numeroElecteur: item?.numeroElecteur,
      dateNaissance: item?.dateNaissance,
      lieuNaissance: item?.lieuNaissance,
      situationMatrimoniale: item?.situationMatrimoniale,
      statutLogement: item?.statutLogement,
      nombreEnfant: item?.nombreEnfant,
    };
  }, [item]);

  // Load item + files
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [res, f] = await Promise.all([
          getDetailsRequest(String(id)).catch(() => null),
          getFileRequest(String(id)).catch(() => ({})),
        ]);
        const recto = f?.data?.recto ?? f?.recto ?? null;
        const verso = f?.data?.verso ?? f?.verso ?? null;
        setFiles({ recto, verso });
        if (!res?.success || !res.item) throw new Error("Chargement impossible");
        setItem(res.item);
        setError(null);
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, createOpen]);

  // Prev/Next based on total and current numeric id (logique demandée)
  const loadNeighbors = useCallback(async (currentId) => {
    const cur = Number(currentId);
    if (!Number.isFinite(cur) || cur <= 0) {
      setPrevId(null);
      setNextId(null);
      return;
    }
    try {
      setLoadingNeighbors(true);
      const res = await listRequests({
        page: 1,
        pageSize: 1,
        sortField: "id",
        sortOrder: "DESC",
      });
      const total = Number(res?.total ?? 0);
      if (!Number.isFinite(total) || total <= 0) {
        setPrevId(null);
        setNextId(null);
        return;
      }
      setPrevId(cur > 1 ? String(cur - 1) : null);
      setNextId(cur < total ? String(cur + 1) : null);
    } catch {
      setPrevId(null);
      setNextId(null);
    } finally {
      setLoadingNeighbors(false);
    }
  }, []);

  useEffect(() => {
    if (id) loadNeighbors(id);
  }, [id, loadNeighbors]);

  // Save statut
  const saveStatut = async () => {
    if (!newStatut) return message.error("Sélectionnez un statut");
    try {
      setSaving(true);
      await updateStatutRequest(String(id), { statut: newStatut });
      setItem((prev) => ({
        ...prev,
        statut: newStatut,
        dateModification: new Date().toISOString(),
      }));
      setEditing(false);
      message.success("Statut mis à jour");
    } catch (e) {
      message.error(e?.response?.data?.message || e?.message || "Échec de la mise à jour du statut");
    } finally {
      setSaving(false);
    }
  };

  // Keyboard ← →
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag && ["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
      if (e.key === "ArrowLeft" && prevId) navigate(`/admin/demandes/${prevId}/details`);
      if (e.key === "ArrowRight" && nextId) navigate(`/admin/demandes/${nextId}/details`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevId, nextId, navigate]);

  const onDelete = async () => {
    try {
      await deleteDemande(String(id));
      message.success("Demande supprimée");
      navigate("/admin/demandes");
    } catch (e) {
      message.error(e?.response?.data?.message || e?.message || "Suppression impossible");
    }
  };

  // Create account
  const [createForm] = Form.useForm();


  const openCreateModal = () => {
    const initialValues = {
      prenom: demandeur?.prenom || "",
      nom: demandeur?.nom || "",
      email: demandeur?.email || "",
      telephone: demandeur?.telephone || "",
      adresse: demandeur?.adresse || "",
      profession: demandeur?.profession || "",
      numeroElecteur: demandeur?.numeroElecteur || "",
      lieuNaissance: demandeur?.lieuNaissance || "",
      dateNaissance: demandeur?.dateNaissance ? dayjs(demandeur.dateNaissance) : null,
      stuationDemandeur: demandeur?.statutLogement == "heberge" ? "Hébergé(e)" : demandeur?.statutLogement == "proprietaire" ? "Propriétaire" : demandeur?.statutLogement == "locataire" ? "Locataire" : demandeur?.statutLogement || "",
      nombreEnfant:
        typeof demandeur?.nombreEnfant === "number"
          ? demandeur.nombreEnfant
          : demandeur?.nombreEnfant
            ? Number(demandeur.nombreEnfant)
            : 0,
      password: "",
      roles: "ROLE_DEMANDEUR",
      situationMatrimoniale: demandeur?.situationMatrimoniale == "marié(e)" ? "Marié(e)" :
        demandeur?.situationMatrimoniale == "célibataire" ? "Célibataire" :
          demandeur?.situationMatrimoniale == "divorcé(e)" ? "Divorcé(e)" :
            demandeur?.situationMatrimoniale == "veuf(ve)" ? "Veuf(ve)" : demandeur?.situationMatrimoniale || undefined,
    };
    createForm.setFieldsValue(initialValues);
    setCreateOpen(true);
  };

  const handleCreateUser = async () => {
    try {
      const values = await createForm.validateFields();
      setCreating(true);
      const payload = {
        prenom: values.prenom,
        nom: values.nom,
        email: values.email,
        password: values.password || undefined,
        telephone: values.telephone || null,
        adresse: values.adresse || null,
        profession: values.profession || null,
        numeroElecteur: values.numeroElecteur || null,
        lieuNaissance: values.lieuNaissance || null,
        dateNaissance: values.dateNaissance ? values.dateNaissance.format("YYYY-MM-DD") : null,
        roles: "ROLE_DEMANDEUR",
        stuationDemandeur: values.stuationDemandeur || null,
        nombreEnfant: values.nombreEnfant ?? 0,
        situationMatrimoniale: values.situationMatrimoniale || null,
        demandeId: id,
      };
      await createUserAccount(payload);
      message.success("Compte utilisateur créé avec succès");
      setCreateOpen(false);
      if (attributionPending) {
        navigate(`/admin/demandes/${id}/attribution`);
      }
    } catch (e) {
      console.log(e);
      if (!e?.errorFields) {
        message.error(e?.response?.data?.message || e?.message || "Création impossible");
      }
    } finally {
      setCreating(false);
      setMustCreateAccount(false);
      setAttributionPending(false);
    }
  };

  const handleRetireAttribution = async () => {
    try {
      await retirerAttribution(String(id));
      message.success("Attribution retirée");
      navigate(`/admin/demandes/${id}/details`, { replace: true });
    } catch (e) {
      message.error(e?.response?.data?.message || e?.message || "Retrait impossible");
    }
  };

  const statutTagProps = item?.statut ? STATUT_TAG[item.statut] || { color: statusColor(item.statut) } : {};

  return (
    <ConfigProvider theme={{ algorithm: antdTheme.defaultAlgorithm }}>
      <div className="container mx-auto px-4 my-6 bg-white">
        <Space className="mb-4" align="center" wrap>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            Retour
          </Button>
          {/* Prev / Next */}
          <Space size="small" wrap>
            <Tooltip title="Demande précédente (←)">
              <Button
                icon={<LeftOutlined />}
                disabled={!prevId || loadingNeighbors}
                onClick={() => prevId && navigate(`/admin/demandes/${prevId}/details`)}
              >
                Précédente
              </Button>
            </Tooltip>
            <Tooltip title="Demande suivante (→)">
              <Button
                icon={<RightOutlined />}
                disabled={!nextId || loadingNeighbors}
                onClick={() => nextId && navigate(`/admin/demandes/${nextId}/details`)}
              >
                Suivante
              </Button>
            </Tooltip>
          </Space>
          <Title level={4} className="!m-0">
            Détails de la demande #{id}
          </Title>
        </Space>
        {loading ? (
          <Card>
            <Skeleton active paragraph={{ rows: 6 }} />
          </Card>
        ) : error ? (
          <Result
            status="error"
            title="Impossible d'afficher la demande"
            subTitle={error}
            extra={<Button onClick={() => window.location.reload()}>Recharger</Button>}
          />
        ) : (
          <>
            <Card className="mb-6">
              <Space className="w-full justify-between" align="start">
                <div>
                  <Title level={5} className="!mb-1">
                    Informations principales
                  </Title>
                  <Space size="small" wrap>
                    {item?.typeDemande && <Tag color="geekblue">{toFrenchDemande(item.typeDemande)}</Tag>}
                    {item?.typeTitre && <Tag color="purple">{toFrenchTitre(item.typeTitre)}</Tag>}
                  </Space>
                </div>
                <Space wrap>
                  {!editing ? (
                    <>
                      <Tag {...statutTagProps}>{statutFr(item.statut)}</Tag>
                      {canUpdateStatut && (
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => {
                            setNewStatut(item.statut || STATUT.EN_ATTENTE);
                            setEditing(true);
                          }}
                        >
                          Modifier le statut
                        </Button>
                      )}
                    </>
                  ) : (
                    <Space.Compact>
                      <Select
                        style={{ minWidth: 240 }}
                        value={newStatut}
                        onChange={setNewStatut}
                        options={STATUT_OPTIONS}
                        disabled={saving}
                      />
                      <Button type="primary" icon={<SaveOutlined />} onClick={saveStatut} loading={saving}>
                        Enregistrer
                      </Button>
                      <Button icon={<CloseOutlined />} onClick={() => setEditing(false)} disabled={saving}>
                        Annuler
                      </Button>
                    </Space.Compact>
                  )}
                  <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/demandes/${id}/edit`)}>
                    Éditer
                  </Button>
                  {/* Retirer attribution */}
                  {user &&
                    (user.roles?.includes("ROLE_PRESIDENT_COMMISSION") ||
                      user.roles?.includes("ROLE_MAIRE") ||
                      user.roles?.includes("ROLE_ADMIN") ||
                      user.roles?.includes("ROLE_SUPER_ADMIN")) && (
                      <>
                        {isApproved(item.statut) && item.attribution && (
                          <Popconfirm
                            title="Voulez-vous vraiment retirer l'attribution ?"
                            okText="Oui"
                            cancelText="Non"
                            onConfirm={handleRetireAttribution}
                          >
                            <Button icon={<DeleteOutlined />} style={{ color: "red" }}>
                              Retirer l'attribution
                            </Button>
                          </Popconfirm>
                        )}
                      </>
                    )}
                  {user &&
                    (user.roles?.includes("ROLE_PRESIDENT_COMMISSION") ||
                      user.roles?.includes("ROLE_MAIRE") ||
                      user.roles?.includes("ROLE_ADMIN") ||
                      user.roles?.includes("ROLE_SUPER_ADMIN")) && (
                      <>
                        {(item.statut === STATUT.APPROUVEE || item.statut === STATUT.APPROUVE) && (
                          <Button
                            type="default"
                            onClick={() => {
                              if (!item.utilisateur) {
                                Modal.confirm({
                                  title: "Création de compte requise",
                                  content: "Le demandeur n'a pas encore de compte. Voulez-vous créer un compte avant d'attribuer une parcelle ?",
                                  okText: "Oui, créer le compte",
                                  cancelText: "Annuler",
                                  onOk: () => {
                                    setMustCreateAccount(true);
                                    setAttributionPending(true);
                                    openCreateModal();
                                  },
                                });
                              } else {
                                navigate(`/admin/demandes/${item.id}/attribution`);
                              }
                            }}
                          >
                            {item.utilisateur ? "Attribuer une parcelle" : "Créer le compte et attribuer une parcelle"}
                          </Button>
                        )}
                      </>
                    )}
                  <Button
                    danger
                    onClick={() => setRejectOpen(true)}
                    disabled={!canUpdateStatut || disableActions}
                    loading={loadingReject}
                  >
                    Rejeter
                  </Button>
                  {/* Supprimer */}
                  {user &&
                    (
                      user.roles?.includes("ROLE_ADMIN") ||
                      user.roles?.includes("ROLE_SUPER_ADMIN")) && (
                      <Popconfirm title="Supprimer cette demande ?" okText="Oui" cancelText="Non" onConfirm={onDelete}>
                        <Button danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    )}
                </Space>
              </Space>
              {/* Bloc édition statut harmonisé */}
              <Divider />
              <Divider />
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Type de demande">
                  {toFrenchDemande(item?.typeDemande)}
                </Descriptions.Item>
                <Descriptions.Item label="Type de titre">{toFrenchTitre(item?.typeTitre)}</Descriptions.Item>
                <Descriptions.Item label="Type de document">{fmt(item?.typeDocument)}</Descriptions.Item>
                <Descriptions.Item label="Quartier">{fmt(item?.quartier?.nom || item?.localite)}</Descriptions.Item>
                <Descriptions.Item label="Usage prévu">{fmt(item?.usagePrevu)}</Descriptions.Item>
                <Descriptions.Item label="Superficie (m²)">{fmt(item?.superficie)}</Descriptions.Item>
                <Descriptions.Item label="Possède autre terrain">
                  {item?.possedeAutreTerrain ? "Oui" : "Non"}
                </Descriptions.Item>
                <Descriptions.Item label="Terrain à Kaolack">{item?.terrainAKaolack ? "Oui" : "Non"}</Descriptions.Item>
                <Descriptions.Item label="Terrain ailleurs">{item?.terrainAilleurs ? "Oui" : "Non"}</Descriptions.Item>
                <Descriptions.Item label="Date de création">{fmtDate(item?.dateCreation)}</Descriptions.Item>
                <Descriptions.Item label="Dernière modification">
                  {fmtDate(item?.dateModification)}
                </Descriptions.Item>
                <Descriptions.Item label="Statut de la demande">{statutFr(item?.statut)}</Descriptions.Item>
                {item?.motif_refus && (
                  <Descriptions.Item label="Motif de refus">{item.motif_refus}</Descriptions.Item>
                )}
                {item?.decisionCommission && (
                  <Descriptions.Item label="Décision commission">{item.decisionCommission}</Descriptions.Item>
                )}
                {item?.rapport && <Descriptions.Item label="Rapport">{item.rapport}</Descriptions.Item>}
                {item?.recommandation && (
                  <Descriptions.Item label="Recommandation">{item.recommandation}</Descriptions.Item>
                )}
              </Descriptions>
            </Card>
            <Divider />
            <div className="grid md:grid-cols-2 gap-6">
              <Card
                title="Demandeur"
                extra={
                  !item?.utilisateur &&
                  user &&
                  (user.roles?.includes("ROLE_ADMIN") ||
                    user.roles?.includes("ROLE_SUPER_ADMIN") ||
                    user.roles?.includes("ROLE_MAIRE")) && (
                    <Button type="primary" icon={<UserAddOutlined />} onClick={openCreateModal}>
                      Créer le compte
                    </Button>
                  )
                }
              >
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="Nom complet">
                    {fmt(item?.utilisateur?.prenom ?? demandeur?.prenom)} {fmt(item?.utilisateur?.nom ?? demandeur?.nom)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">{fmt(item?.utilisateur?.email ?? demandeur?.email)}</Descriptions.Item>
                  <Descriptions.Item label="Téléphone">
                    {fmt(item?.utilisateur?.telephone ?? demandeur?.telephone)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Adresse">
                    {fmt(item?.utilisateur?.adresse ?? demandeur?.adresse)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Profession">
                    {fmt(item?.utilisateur?.profession ?? demandeur?.profession)}
                  </Descriptions.Item>
                  <Descriptions.Item label="N° électeur">
                    {fmt(item?.utilisateur?.numeroElecteur ?? demandeur?.numeroElecteur)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Naissance">
                    {fmtDate(item?.utilisateur?.dateNaissance ?? demandeur?.dateNaissance)}{" "}
                    {demandeur?.lieuNaissance
                      ? `à ${item?.utilisateur?.lieuNaissance ?? demandeur?.lieuNaissance}`
                      : ""}
                  </Descriptions.Item>
                  <Descriptions.Item label="Situation matrimoniale">
                    {fmt(item?.utilisateur?.situationMatrimoniale ?? demandeur?.situationMatrimoniale)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Statut logement">
                    {fmt(item?.utilisateur?.statutLogement ?? demandeur?.statutLogement)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Nombre d'enfants">
                    {fmt(item?.utilisateur?.nombreEnfant ?? demandeur?.nombreEnfant)}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
              {item?.quartier && (
                <Card title="Quartier demandé">
                  <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="Nom">{fmt(item.quartier?.nom)}</Descriptions.Item>
                    {item.quartier?.prix !== undefined && (
                      <Descriptions.Item label="Prix">{String(item.quartier.prix)}</Descriptions.Item>
                    )}
                    {item.quartier?.description && (
                      <Descriptions.Item label="Description">{item.quartier.description}</Descriptions.Item>
                    )}
                  </Descriptions>
                </Card>
              )}
              {item?.attribution && (
                <>
                  <Descriptions title="Information de l'attribution" bordered column={2} size="small">
                    <Descriptions.Item label="Montant">{money(item.attribution.montant)}</Descriptions.Item>
                    <Descriptions.Item label="Date d'effet">{fmtDate(item.attribution.dateEffet)}</Descriptions.Item>
                    <Descriptions.Item label="Date de fin">{fmtDate(item.attribution.dateFin)}</Descriptions.Item>
                    <Descriptions.Item label="Fréquence">{fmt(item.attribution.frequence)}</Descriptions.Item>
                    <Descriptions.Item label="Paiement">
                      <Tag color={item.attribution.etatPaiement ? "green" : "red"}>
                        {item.attribution.etatPaiement ? "Payé" : "Non payé"}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                  <Descriptions title="Parcelle attribuée" bordered column={2} size="small">
                    <Descriptions.Item label="Numéro">{fmt(item.attribution.parcelle?.numero)}</Descriptions.Item>
                    <Descriptions.Item label="Surface">{fmt(item.attribution.parcelle?.surface)} m²</Descriptions.Item>
                    <Descriptions.Item label="Statut">{fmt(item.attribution.parcelle?.statut)}</Descriptions.Item>
                    <Descriptions.Item label="Latitude">{fmt(item.attribution.parcelle?.latitude)}</Descriptions.Item>
                    <Descriptions.Item label="Longitude">{fmt(item.attribution.parcelle?.longitude)}</Descriptions.Item>
                    <Descriptions.Item label="Lotissement">
                      {fmt(item.attribution.parcelle?.lotissement?.nom)} ({fmt(item.attribution.parcelle?.lotissement?.id)})
                    </Descriptions.Item>
                    <Descriptions.Item label="Quartier">
                      {fmt(item.attribution.parcelle?.lotissement?.localite?.nom)}
                    </Descriptions.Item>
                  </Descriptions>
                </>
              )}
            </div>
            {!!(files?.recto || files?.verso) && (
              <Descriptions title="Documents fournis" bordered column={2} size="small" className="mt-6">
                <Descriptions.Item label="Recto">
                  {files.recto ? (
                    <a href={`${import.meta.env.VITE_API_URL_SIMPLE}${files.recto}`} target="_blank" rel="noreferrer">
                      Ouvrir
                    </a>
                  ) : (
                    "—"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Verso">
                  {files.verso ? (
                    <a href={`${import.meta.env.VITE_API_URL_SIMPLE}${files.verso}`} target="_blank" rel="noreferrer">
                      Ouvrir
                    </a>
                  ) : (
                    "—"
                  )}
                </Descriptions.Item>
              </Descriptions>
            )}
            {/* Modale de création de compte */}
            <Modal
              title="Créer le compte utilisateur"
              open={createOpen}
              onOk={handleCreateUser}
              onCancel={() => !creating && setCreateOpen(false)}
              okText="Créer le compte"
              confirmLoading={creating}
              destroyOnClose
            >
              <Form form={createForm} layout="vertical">
                <Row gutter={[16, 8]}>
                  <Col xs={24} md={12}>
                    <Form.Item label="Prénom" name="prenom" rules={[{ required: true, message: "Prénom requis" }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Nom" name="nom" rules={[{ required: true, message: "Nom requis" }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[{ type: "email", required: true, message: "Email invalide" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Mot de passe" name="password" tooltip="Laisser vide pour générer par défaut">
                      <Input.Password placeholder="••••••••" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Téléphone"
                      name="telephone"
                      rules={[{ required: true, message: "Téléphone requis" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Adresse" name="adresse" rules={[{ required: true, message: "Adresse requise" }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Profession"
                      name="profession"
                      rules={[{ required: true, message: "Profession requise" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Numéro électeur"
                      name="numeroElecteur"
                      rules={[{ required: true, message: "Numéro électeur requis" }]}
                    >
                      <Input maxLength={20} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Lieu de naissance"
                      name="lieuNaissance"
                      rules={[{ required: true, message: "Lieu de naissance requis" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Date de naissance"
                      name="dateNaissance"
                      rules={[{ required: true, message: "Date de naissance requise" }]}
                    >
                      <DatePicker className="w-full" format="YYYY-MM-DD" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Situation matrimoniale" name="situationMatrimoniale" rules={[{ required: true }]}>
                      <Select allowClear placeholder="Sélectionner">
                        {SITUATION_OPTIONS.map((o) => (
                          <Option key={o.value} value={o.value}>
                            {o.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Statut logement"
                      name="stuationDemandeur"
                      tooltip="Correspond à 'stuationDemandeur' attendu par l'API"
                    >
                      <Select allowClear placeholder="Sélectionner">
                        <Option value="Propriétaire">Propriétaire</Option>
                        <Option value="Locataire">Locataire</Option>
                        <Option value="Hébergé(e)">Hébergé(e)</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Nombre d'enfants" name="nombreEnfant">
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Rôles" name="roles" initialValue={"ROLE_DEMANDEUR"}>
                      <Select mode="multiple" allowClear>
                        <Option value="ROLE_DEMANDEUR">ROLE_DEMANDEUR</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Modal>
          </>
        )}
      </div>
    </ConfigProvider>
  );
}
