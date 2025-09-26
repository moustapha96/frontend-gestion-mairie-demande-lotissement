

// "use client"
// import { useState, useEffect } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { AdminBreadcrumb } from "@/components"
// import { toast } from "sonner"
// import { generateDocument, getDemandeDetails, getFileDocument } from "@/services/demandeService"
// import { getLocaliteDtailsConfirmation } from "@/services/localiteService"
// import MapCar from "../../Map/MapCar"
// import { formatCoordinates, formatPhoneNumber, formatPrice } from "@/utils/formatters"
// import {
//     Layout,
//     Card,
//     Typography,
//     Tag,
//     Descriptions,
//     Button,
//     Form,
//     Input,
//     Select,
//     DatePicker,
//     Row,
//     Col,
//     Divider,
//     Space,
//     Spin,
//     Modal,
//     Empty,
//     Grid,
//     Tooltip,
//     Alert,
//     Steps,
// } from "antd"
// import {
//     SaveOutlined,
//     FileTextOutlined,
//     LoadingOutlined,
//     EnvironmentOutlined,
//     UserOutlined,
//     AreaChartOutlined,
//     CheckCircleOutlined,
//     FormOutlined,
//     FileProtectOutlined,
// } from "@ant-design/icons"
// import dayjs from "dayjs"

// const { Content } = Layout
// const { Title, Text } = Typography
// const { Option } = Select
// const { TextArea } = Input
// const { useBreakpoint } = Grid
// const { Step } = Steps

// const AdminDemandeConfirmation = () => {
//     const { id } = useParams()
//     const navigate = useNavigate()
//     const [form] = Form.useForm()
//     const screens = useBreakpoint()

//     // State management
//     const [localite, setLocalite] = useState({})
//     const [lotissements, setLotissements] = useState([])
//     const [parcelles, setParcelles] = useState([])
//     const [selectedLotissement, setSelectedLotissement] = useState("")
//     const [demande, setDemande] = useState(null)
//     const [loading, setLoading] = useState(true)
//     const [isSubmitting, setIsSubmitting] = useState(false)
//     const [isMapModalVisible, setIsMapModalVisible] = useState(false)
//     const [isViewerOpen, setIsViewerOpen] = useState(false)
//     const [fileLoading, setFileLoading] = useState(false)
//     const [activeDocument, setActiveDocument] = useState(null)
//     const [viewType, setViewType] = useState(null)
//     const [currentStep, setCurrentStep] = useState(0)

//     // Enhanced form data structure
//     const [formData, setFormData] = useState({
//         // Document information
//         document: {
//             type: "PERMIS_OCCUPER",
//             reference: `N° C.KL/SG/DDPF ${new Date().getFullYear()}`,
//             dateDelivrance: new Date().toISOString().split("T")[0],
//             lieuSignature: "Kaolack",
//         },
//         // Administrative information
//         administration: {
//             pays: "République du Sénégal",
//             region: "Kaolack",
//             commune: "Kaolack",
//             ampliations: ["S.G", "DDPF", "Intéressé", "Archives", "Cadastre", "Domaine"],
//         },
//         // Beneficiary information
//         beneficiaire: {
//             prenom: "",
//             nom: "",
//             dateNaissance: "",
//             lieuNaissance: "",
//             cni: {
//                 numero: "",
//                 dateDelivrance: "",
//                 lieuDelivrance: "",
//             },
//         },
//         // Plot information
//         parcelle: {
//             // id: null,
//             lotissement: "",
//             numero: "",
//             superficie: "",
//             usage: "",
//             referenceCadastrale: "T.F...912... (propriété de la Commune de Kaolack)",
//         },
//         // Request type specific data
//         propositionBail: {
//             typeBail: "",
//             duree: "",
//             montantLocation: "",
//         },
//         // Common fields
//         montantLocation: "",
//         dateDebut: "",
//         dateFin: "",
//         dureeValidite: "",
//     })

//     // Handle document viewing
//     const handleViewDocument = async (type) => {
//         try {
//             setFileLoading(true)
//             setViewType(type)
//             setIsViewerOpen(true)

//             const fileData = await getFileDocument(id)
//             const document = type === "recto" ? fileData.recto : fileData.verso
//             setActiveDocument(document)
//         } catch (error) {
//             console.error("Erreur lors du chargement du document:", error)
//             toast.error("Erreur lors du chargement du document")
//         } finally {
//             setFileLoading(false)
//         }
//     }

//     // Close document viewer
//     const closeViewer = () => {
//         setIsViewerOpen(false)
//         setActiveDocument(null)
//         setViewType(null)
//     }

//     // Fetch locality details
//     useEffect(() => {
//         const fetchDetailsLocalite = async () => {
//             try {
//                 const data = await getLocaliteDtailsConfirmation(id)
//                 console.log("data localite", data)
//                 setLocalite(data)
//                 setLotissements(data.lotissements || [])
//             } catch (error) {
//                 toast.error("Erreur lors du chargement des lotissements")
//             }
//         }
//         fetchDetailsLocalite()
//     }, [id])

//     // Fetch request details
//     useEffect(() => {
//         const fetchDemande = async () => {
//             try {
//                 const data = await getDemandeDetails(id)
//                 setDemande(data)

//                 // Generate reference number based on request type
//                 const generateReference = (type) => {
//                     const year = new Date().getFullYear()
//                     const randomNum = Math.floor(100000 + Math.random() * 900000)
//                     switch (type) {
//                         case "BAIL_COMMUNAL":
//                             return `BC-${year}-${randomNum}`
//                         case "PROPOSITION_BAIL":
//                             return `PB-${year}-${randomNum}`
//                         default:
//                             return `PO-${year}-${randomNum}`
//                     }
//                 }

//                 // Calculate end date for bail communal (1 year from now)
//                 const calculateEndDate = () => {
//                     const endDate = new Date()
//                     endDate.setFullYear(endDate.getFullYear() + 1)
//                     return endDate.toISOString().split("T")[0]
//                 }

//                 const updatedFormData = {
//                     ...formData,
//                     superficie: data.superficie,
//                     usagePrevu: data.usagePrevu,
//                     localite: data.localite?.nom || "",
//                     localiteId: data.localite?.id || null,
//                     numeroPermis: generateReference(data.typeDemande),
//                     dateFin: data.typeDemande === "BAIL_COMMUNAL" ? calculateEndDate() : "",
//                     adresseTerrain: data.localite?.nom || "",

//                     beneficiaire: {
//                         ...formData.beneficiaire,
//                         prenom: data.demandeur?.prenom || "",
//                         nom: data.demandeur?.nom || "",
//                         dateNaissance: data.demandeur?.dateNaissance || "",
//                         lieuNaissance: data.demandeur?.lieuNaissance || "",
//                         cni: {
//                             ...formData.beneficiaire.cni,
//                             numero: data.demandeur?.numeroElecteur || "",
//                         },
//                     },
//                 }

//                 setFormData(updatedFormData)

//                 // Set initial form values
//                 form.setFieldsValue({
//                     "document.reference": updatedFormData.document.reference,
//                     "document.dateDelivrance": dayjs(updatedFormData.document.dateDelivrance),
//                     "document.lieuSignature": updatedFormData.document.lieuSignature,
//                     "parcelle.referenceCadastrale": updatedFormData.parcelle.referenceCadastrale,
//                     "beneficiaire.cni.numero": updatedFormData.beneficiaire.cni.numero,
//                 })
//             } catch (error) {
//                 console.error("Erreur lors du chargement de la demande:", error)
//                 toast.error("Erreur lors du chargement de la demande")
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchDemande()
//     }, [id])

//     // Handle lotissement change
//     const handleLotissementChange = async (lotissementId) => {
//         try {
//             if (!lotissementId) {
//                 setParcelles([])
//                 setSelectedLotissement("")
//                 return
//             }

//             setSelectedLotissement(lotissementId)
//             const lotissement = lotissements.find((lot) => lot.id === Number(lotissementId))

//             if (!lotissement) {
//                 toast.error("Lotissement non trouvé")
//                 setParcelles([])
//                 return
//             }

//             setParcelles(lotissement.parcelles || [])

//             setFormData((prev) => ({
//                 ...prev,
//                 lotissement: lotissement.nom,
//                 propositionBail: {
//                     ...prev.propositionBail,
//                     lotissement: lotissement.nom,
//                 },
//             }))
//         } catch (error) {
//             console.error("Erreur lors du changement de lotissement:", error)
//             toast.error("Erreur lors du chargement des parcelles")
//             setParcelles([])
//         }
//     }

//     // Enhanced form validation
//     const validateFormData = (data, type) => {
//         const commonValidation =
//             data.document?.reference &&
//             data.document?.dateDelivrance &&
//             data.document?.lieuSignature &&
//             data.parcelle?.numero &&
//             data.beneficiaire?.cni?.numero &&
//             data.beneficiaire?.cni?.dateDelivrance &&
//             data.beneficiaire?.cni?.lieuDelivrance

//         switch (type) {
//             case "PROPOSITION_BAIL":
//                 return (
//                     commonValidation &&
//                     data.propositionBail?.typeBail &&
//                     data.propositionBail?.duree &&
//                     data.propositionBail?.montantLocation
//                 )

//             case "BAIL_COMMUNAL":
//                 return commonValidation && data.montantLocation && data.dateDebut && data.dateFin

//             case "PERMIS_OCCUPATION":
//                 return commonValidation && data.dureeValidite && data.parcelle?.usage

//             default:
//                 return false
//         }
//     }

//     // Enhanced form submission
//     const handleSubmit = async (values) => {
//         console.log("Form values:", values)
//         console.log("Form data:", formData)

//         setIsSubmitting(true)
//         try {
//             // Validate required fields
//             if (!validateFormData(formData, demande?.typeDemande)) {
//                 console.warn(formData, validateFormData(formData, demande?.typeDemande))
//                 toast.error("Veuillez remplir tous les champs obligatoires")
//                 return
//             }

//             let dataToSubmit = {
//                 demande: id,
//                 typeDemande: demande?.typeDemande,
//             }

//             // Common data structure for all document types
//             const commonData = {
//                 dateDelivrance: formData.document.dateDelivrance,
//                 superficie: Number(demande?.superficie) || 0,
//                 demandeId: demande?.id,
//                 usagePrevu: demande?.usagePrevu || "",
//                 localite: demande?.localite?.nom || "",
//                 referenceCadastrale: formData.parcelle.referenceCadastrale,
//                 lotissement: lotissements.find((lot) => lot.id === Number(selectedLotissement))?.nom || "",
//                 parcelleId: values.parcelle.id,
//                 localiteId: values.localiteId || demande?.localite?.id || null,
//                 lotissementId: values.lotissement || null,
//                 numeroParcelle: formData.parcelle.numero,
//                 cni: {
//                     numero: formData.beneficiaire.cni.numero,
//                     dateDelivrance: formData.beneficiaire.cni.dateDelivrance,
//                     lieuDelivrance: formData.beneficiaire.cni.lieuDelivrance,
//                 },
//                 beneficiaire: {
//                     prenom: demande?.demandeur?.prenom || "",
//                     nom: demande?.demandeur?.nom || "",
//                     dateNaissance: demande?.demandeur?.dateNaissance || "",
//                     lieuNaissance: demande?.demandeur?.lieuNaissance || "",
//                 },
//             }

//             // Type-specific data preparation
//             switch (demande?.typeDemande) {
//                 case "PERMIS_OCCUPATION":
//                     dataToSubmit = {
//                         ...dataToSubmit,
//                         ...commonData,
//                         numeroPermis: `PO-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9)}`,
//                         dureeValidite: `${formData.dureeValidite} an${formData.dureeValidite > 1 ? "s" : ""}`,
//                         usage: formData.parcelle.usage,
//                     }
//                     break

//                 case "BAIL_COMMUNAL":
//                     dataToSubmit = {
//                         ...dataToSubmit,
//                         ...commonData,
//                         numeroBail: `BC-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9)}`,
//                         montantLocation: Number(formData.montantLocation),
//                         montantCaution: Number(formData.montantLocation) * 3,
//                         dateDebut: formData.dateDebut,
//                         dateFin: formData.dateFin,
//                     }
//                     break

//                 case "PROPOSITION_BAIL":
//                     dataToSubmit = {
//                         ...dataToSubmit,
//                         ...commonData,
//                         propositionBail: {
//                             reference: `PB-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9)}`,
//                             typeBail: formData.propositionBail?.typeBail,
//                             duree: `${formData.propositionBail?.duree} an${formData.propositionBail?.duree > 1 ? "s" : ""}`,
//                             montantLocation: Number(formData.propositionBail?.montantLocation),
//                             montantCaution: Number(formData.propositionBail?.montantLocation) * 3,
//                         },
//                     }
//                     break

//                 default:
//                     throw new Error("Type de document non supporté")
//             }

//             console.log("Data to submit:", dataToSubmit)
//             console.log(dataToSubmit)
//             // await generateDocument(id, dataToSubmit)
//             toast.success("Document généré avec succès")
//             // navigate(`/admin/demandes/${id}/details`)
//         } catch (error) {
//             console.error("Erreur lors de la génération:", error)
//             toast.error("Erreur lors de la génération du document")
//         } finally {
//             setIsSubmitting(false)
//         }
//     }

//     // Get request type tag
//     const getRequestTypeTag = (type) => {
//         switch (type) {
//             case "PERMIS_OCCUPATION":
//                 return <Tag color="success">Permis d'Occupation</Tag>
//             case "BAIL_COMMUNAL":
//                 return <Tag color="processing">Bail Communal</Tag>
//             case "PROPOSITION_BAIL":
//                 return <Tag color="warning">Proposition de Bail</Tag>
//             default:
//                 return <Tag>Inconnu</Tag>
//         }
//     }

//     // Get form steps based on request type
//     const getFormSteps = () => {
//         return [
//             {
//                 title: "Informations",
//                 icon: <UserOutlined />,
//                 description: "Vérification des données",
//             },
//             {
//                 title: "Document",
//                 icon: <FileProtectOutlined />,
//                 description: "Configuration du document",
//             },
//             {
//                 title: "Confirmation",
//                 icon: <CheckCircleOutlined />,
//                 description: "Génération finale",
//             },
//         ]
//     }

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
//             </div>
//         )
//     }

//     return (
//         <>
//             <AdminBreadcrumb title="Confirmation de la demande" />
//             <section>
//                 <div className="container">
//                     <div className="my-6 space-y-6">
//                         <div className="grid grid-cols-1">
//                             <Content style={{ padding: "24px" }}>
//                                 {/* Header Card */}
//                                 <Card className="mb-6">
//                                     <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//                                         <div>
//                                             <Title level={3} className="m-0">
//                                                 Confirmation de la demande #{id}
//                                             </Title>
//                                             <Text type="secondary">
//                                                 Vérifiez et complétez les informations avant la génération du document
//                                             </Text>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                             {getRequestTypeTag(demande?.typeDemande)}
//                                             <Tag color="blue">{dayjs(demande?.dateCreation).format("DD/MM/YYYY")}</Tag>
//                                         </div>
//                                     </div>



//                                 </Card>

//                                 {/* Information Cards */}
//                                 <Row gutter={[24, 24]} className="mb-6">
//                                     {/* Requester Information */}
//                                     <Col xs={24} lg={6}>
//                                         <Card
//                                             title={
//                                                 <span>
//                                                     <UserOutlined className="mr-2" />
//                                                     Demandeur
//                                                 </span>
//                                             }
//                                             size="small"
//                                             className="h-full"
//                                         >
//                                             <Descriptions column={1} size="small">
//                                                 <Descriptions.Item label="Nom complet">
//                                                     <Text strong>
//                                                         {demande?.demandeur?.prenom} {demande?.demandeur?.nom}
//                                                     </Text>
//                                                 </Descriptions.Item>
//                                                 <Descriptions.Item label="Email">
//                                                     <Text ellipsis>{demande?.demandeur?.email}</Text>
//                                                 </Descriptions.Item>
//                                                 <Descriptions.Item label="Téléphone">
//                                                     {formatPhoneNumber(demande?.demandeur?.telephone)}
//                                                 </Descriptions.Item>
//                                                 <Descriptions.Item label="Adresse">{demande?.demandeur?.adresse}</Descriptions.Item>
//                                                 <Descriptions.Item label="Date de naissance">
//                                                     {demande?.demandeur?.dateNaissance
//                                                         ? dayjs(demande.demandeur.dateNaissance).format("DD/MM/YYYY")
//                                                         : "Non renseigné"}
//                                                 </Descriptions.Item>
//                                                 <Descriptions.Item label="Lieu de naissance">
//                                                     {demande?.demandeur?.lieuNaissance || "Non renseigné"}
//                                                 </Descriptions.Item>
//                                                 <Descriptions.Item label="Profession">
//                                                     {demande?.demandeur?.profession || "Non renseigné"}
//                                                 </Descriptions.Item>
//                                             </Descriptions>
//                                         </Card>
//                                     </Col>

//                                     {/* Request Details */}
//                                     <Col xs={24} lg={6}>
//                                         <Card
//                                             title={
//                                                 <span>
//                                                     <FileTextOutlined className="mr-2" />
//                                                     Détails de la demande
//                                                 </span>
//                                             }
//                                             size="small"
//                                             className="h-full"
//                                         >
//                                             <Descriptions column={1} size="small">
//                                                 <Descriptions.Item label="Type de demande">
//                                                     {demande?.typeDemande === "PERMIS_OCCUPATION"
//                                                         ? "Permis d'Occupation"
//                                                         : demande?.typeDemande === "BAIL_COMMUNAL"
//                                                             ? "Bail Communal"
//                                                             : "Proposition de Bail"}
//                                                 </Descriptions.Item>
//                                                 <Descriptions.Item label="Statut">
//                                                     <Tag color="orange">{demande?.statut}</Tag>
//                                                 </Descriptions.Item>
//                                             </Descriptions>

//                                             <Divider orientation="left" plain style={{ margin: "12px 0" }}>
//                                                 <small>Documents d'identification</small>
//                                             </Divider>

//                                             <Space direction="vertical" style={{ width: "100%" }}>
//                                                 <Button block icon={<FileTextOutlined />} onClick={() => handleViewDocument("recto")}>
//                                                     Voir Recto
//                                                 </Button>
//                                                 <Button block icon={<FileTextOutlined />} onClick={() => handleViewDocument("verso")}>
//                                                     Voir Verso
//                                                 </Button>
//                                             </Space>
//                                         </Card>
//                                     </Col>

//                                     {/* Locality Information */}
//                                     <Col xs={24} lg={6}>
//                                         <Card
//                                             title={
//                                                 <span>
//                                                     <EnvironmentOutlined className="mr-2" />
//                                                     Localité
//                                                 </span>
//                                             }
//                                             size="small"
//                                             className="h-full"
//                                         >
//                                             <Descriptions column={1} size="small">
//                                                 <Descriptions.Item label="Nom">
//                                                     <Text strong>{demande?.localite?.nom}</Text>
//                                                 </Descriptions.Item>
//                                                 <Descriptions.Item label="Description">
//                                                     <Text ellipsis>{demande?.localite?.description}</Text>
//                                                 </Descriptions.Item>
//                                                 <Descriptions.Item label="Prix">
//                                                     <Text strong>{formatPrice(demande?.localite?.prix)}</Text>
//                                                 </Descriptions.Item>
//                                                 <Descriptions.Item label="Coordonnées">
//                                                     <Space>
//                                                         {formatCoordinates(demande?.localite?.latitude, demande?.localite?.longitude)}
//                                                         <Tooltip title="Voir sur la carte">
//                                                             <Button
//                                                                 type="primary"
//                                                                 size="small"
//                                                                 icon={<EnvironmentOutlined />}
//                                                                 onClick={() => setIsMapModalVisible(true)}
//                                                             />
//                                                         </Tooltip>
//                                                     </Space>
//                                                 </Descriptions.Item>
//                                             </Descriptions>
//                                         </Card>
//                                     </Col>

//                                     {/* Specifications */}
//                                     <Col xs={24} lg={6}>
//                                         <Card
//                                             title={
//                                                 <span>
//                                                     <AreaChartOutlined className="mr-2" />
//                                                     Spécifications
//                                                 </span>
//                                             }
//                                             size="small"
//                                             className="h-full"
//                                         >
//                                             <Descriptions column={1} size="small">
//                                                 <Descriptions.Item label="Superficie">
//                                                     <Text strong>{demande?.superficie} m²</Text>
//                                                 </Descriptions.Item>
//                                                 <Descriptions.Item label="Usage prévu">
//                                                     <Text strong>{demande?.usagePrevu}</Text>
//                                                 </Descriptions.Item>
//                                                 <Descriptions.Item label="Autre terrain">
//                                                     <Tag color={demande?.possedeAutreTerrain ? "red" : "green"}>
//                                                         {demande?.possedeAutreTerrain ? "Oui" : "Non"}
//                                                     </Tag>
//                                                 </Descriptions.Item>
//                                             </Descriptions>
//                                         </Card>
//                                     </Col>
//                                 </Row>

//                                 {/* Main Form */}
//                                 <Card
//                                     title={
//                                         <span>
//                                             <FormOutlined className="mr-2" />
//                                             Formulaire de confirmation
//                                         </span>
//                                     }
//                                 >
//                                     <Alert
//                                         message="Information importante"
//                                         description="Veuillez vérifier attentivement toutes les informations avant de générer le document. Une fois généré, le document ne pourra plus être modifié."
//                                         type="info"
//                                         showIcon
//                                         className="mb-6"
//                                     />

//                                     <Form
//                                         form={form}
//                                         layout="vertical"
//                                         onFinish={handleSubmit}
//                                         initialValues={{
//                                             "document.reference": formData.document.reference,
//                                             "document.lieuSignature": formData.document.lieuSignature,
//                                             "parcelle.referenceCadastrale": formData.parcelle.referenceCadastrale,
//                                         }}
//                                     >
//                                         {/* Document Information Section */}
//                                         <Divider orientation="left">
//                                             <FileProtectOutlined className="mr-2" />
//                                             Informations du document
//                                         </Divider>

//                                         <Row gutter={16}>
//                                             <Col xs={24} md={8}>
//                                                 <Form.Item
//                                                     name="document.reference"
//                                                     label="Référence du document"
//                                                     rules={[{ required: true, message: "Veuillez saisir la référence" }]}
//                                                 >
//                                                     <Input
//                                                         placeholder="Ex: N° C.KL/SG/DDPF 2024"
//                                                         onChange={(e) =>
//                                                             setFormData((prev) => ({
//                                                                 ...prev,
//                                                                 document: { ...prev.document, reference: e.target.value },
//                                                             }))
//                                                         }
//                                                     />
//                                                 </Form.Item>
//                                             </Col>

//                                             <Col xs={24} md={8}>
//                                                 <Form.Item
//                                                     name="document.dateDelivrance"
//                                                     label="Date de délivrance"
//                                                     rules={[{ required: true, message: "Veuillez sélectionner la date" }]}
//                                                 >
//                                                     <DatePicker
//                                                         style={{ width: "100%" }}
//                                                         format="DD/MM/YYYY"
//                                                         onChange={(date, dateString) =>
//                                                             setFormData((prev) => ({
//                                                                 ...prev,
//                                                                 document: { ...prev.document, dateDelivrance: dateString },
//                                                             }))
//                                                         }
//                                                     />
//                                                 </Form.Item>
//                                             </Col>

//                                             <Col xs={24} md={8}>
//                                                 <Form.Item
//                                                     name="document.lieuSignature"
//                                                     label="Lieu de signature"
//                                                     rules={[{ required: true, message: "Veuillez saisir le lieu" }]}
//                                                 >
//                                                     <Input
//                                                         placeholder="Ex: Kaolack"
//                                                         onChange={(e) =>
//                                                             setFormData((prev) => ({
//                                                                 ...prev,
//                                                                 document: { ...prev.document, lieuSignature: e.target.value },
//                                                             }))
//                                                         }
//                                                     />
//                                                 </Form.Item>
//                                             </Col>
//                                         </Row>

//                                         {/* Plot Information Section */}
//                                         <Divider orientation="left">
//                                             <AreaChartOutlined className="mr-2" />
//                                             Informations de la parcelle
//                                         </Divider>

//                                         <Row gutter={16}>
//                                             <Col xs={24} md={8}>
//                                                 <Form.Item
//                                                     name="lotissement"
//                                                     label="Lotissement"
//                                                     rules={[{ required: true, message: "Veuillez sélectionner un lotissement" }]}
//                                                 >
//                                                     <Select
//                                                         placeholder="Sélectionner un lotissement"
//                                                         onChange={handleLotissementChange}
//                                                         value={selectedLotissement}
//                                                         showSearch
//                                                         optionFilterProp="children"
//                                                     >
//                                                         <Option value="">Sélectionner un lotissement</Option>
//                                                         {lotissements.map((lotissement) => (
//                                                             <Option key={lotissement.id} value={lotissement.id}>
//                                                                 {lotissement.nom}
//                                                             </Option>
//                                                         ))}
//                                                     </Select>
//                                                 </Form.Item>
//                                             </Col>

//                                             <Col xs={24} md={8}>
//                                                 <Form.Item
//                                                     name="parcelle.numero"
//                                                     label="Numéro de parcelle"
//                                                     rules={[{ required: true, message: "Veuillez sélectionner une parcelle" }]}
//                                                 >
//                                                     <Select
//                                                         placeholder="Sélectionner une parcelle"
//                                                         disabled={!selectedLotissement}
//                                                         onChange={(value) =>
//                                                             setFormData((prev) => ({
//                                                                 ...prev,
//                                                                 parcelle: { ...prev.parcelle, numero: value },

//                                                             }))
//                                                         }
//                                                         value={formData.parcelle.numero}
//                                                         showSearch
//                                                         optionFilterProp="children"
//                                                     >
//                                                         <Option value="">Sélectionner une parcelle</Option>
//                                                         {parcelles.map((parcelle) => (
//                                                             <Option key={parcelle.id} value={parcelle.numero}>
//                                                                 Parcelle {parcelle.numero}
//                                                             </Option>
//                                                         ))}
//                                                     </Select>
//                                                 </Form.Item>
//                                             </Col>

//                                             <Col xs={24} md={8}>
//                                                 <Form.Item
//                                                     name="parcelle.referenceCadastrale"
//                                                     label="Référence cadastrale"
//                                                     rules={[{ required: true, message: "Veuillez saisir la référence cadastrale" }]}
//                                                 >
//                                                     <Input
//                                                         placeholder="Ex: T.F...912... (propriété de la Commune)"
//                                                         onChange={(e) =>
//                                                             setFormData((prev) => ({
//                                                                 ...prev,
//                                                                 parcelle: { ...prev.parcelle, referenceCadastrale: e.target.value },
//                                                             }))
//                                                         }
//                                                     />
//                                                 </Form.Item>
//                                             </Col>
//                                         </Row>

//                                         {/* Beneficiary Information Section */}
//                                         <Divider orientation="left">
//                                             <UserOutlined className="mr-2" />
//                                             Informations d'identification
//                                         </Divider>

//                                         <Row gutter={16}>
//                                             <Col xs={24} md={8}>
//                                                 <Form.Item
//                                                     name="beneficiaire.cni.numero"
//                                                     label="Numéro d'Identification National (NIN)"
//                                                     rules={[
//                                                         { required: true, message: "Veuillez saisir le NIN" },
//                                                         {
//                                                             pattern: /^[0-9]{13}$/,
//                                                             message: "Le NIN doit contenir exactement 13 chiffres",
//                                                         },
//                                                     ]}
//                                                 >
//                                                     <Input
//                                                         placeholder="Ex: 1548198806765"
//                                                         maxLength={13}
//                                                         onChange={(e) =>
//                                                             setFormData((prev) => ({
//                                                                 ...prev,
//                                                                 beneficiaire: {
//                                                                     ...prev.beneficiaire,
//                                                                     cni: { ...prev.beneficiaire.cni, numero: e.target.value },
//                                                                 },
//                                                             }))
//                                                         }
//                                                         value={formData.beneficiaire.cni.numero}
//                                                     />
//                                                 </Form.Item>
//                                             </Col>

//                                             <Col xs={24} md={8}>
//                                                 <Form.Item
//                                                     name="beneficiaire.cni.dateDelivrance"
//                                                     label="Date de délivrance CNI"
//                                                     rules={[{ required: true, message: "Veuillez sélectionner la date" }]}
//                                                 >
//                                                     <DatePicker
//                                                         style={{ width: "100%" }}
//                                                         format="DD/MM/YYYY"
//                                                         onChange={(date, dateString) =>
//                                                             setFormData((prev) => ({
//                                                                 ...prev,
//                                                                 beneficiaire: {
//                                                                     ...prev.beneficiaire,
//                                                                     cni: { ...prev.beneficiaire.cni, dateDelivrance: dateString },
//                                                                 },
//                                                             }))
//                                                         }
//                                                     />
//                                                 </Form.Item>
//                                             </Col>

//                                             <Col xs={24} md={8}>
//                                                 <Form.Item
//                                                     name="beneficiaire.cni.lieuDelivrance"
//                                                     label="Lieu de délivrance CNI"
//                                                     rules={[{ required: true, message: "Veuillez saisir le lieu" }]}
//                                                 >
//                                                     <Input
//                                                         placeholder="Ex: Kaolack"
//                                                         onChange={(e) =>
//                                                             setFormData((prev) => ({
//                                                                 ...prev,
//                                                                 beneficiaire: {
//                                                                     ...prev.beneficiaire,
//                                                                     cni: { ...prev.beneficiaire.cni, lieuDelivrance: e.target.value },
//                                                                 },
//                                                             }))
//                                                         }
//                                                         value={formData.beneficiaire.cni.lieuDelivrance}
//                                                     />
//                                                 </Form.Item>
//                                             </Col>
//                                         </Row>

//                                         {/* Request Type Specific Fields */}
//                                         {demande?.typeDemande === "PROPOSITION_BAIL" && (
//                                             <>
//                                                 <Divider orientation="left">
//                                                     <FileTextOutlined className="mr-2" />
//                                                     Détails de la proposition de bail
//                                                 </Divider>

//                                                 <Row gutter={16}>
//                                                     <Col xs={24} md={8}>
//                                                         <Form.Item
//                                                             name="propositionBail.typeBail"
//                                                             label="Type de bail"
//                                                             rules={[{ required: true, message: "Veuillez sélectionner le type" }]}
//                                                         >
//                                                             <Select
//                                                                 placeholder="Sélectionner le type"
//                                                                 onChange={(value) =>
//                                                                     setFormData((prev) => ({
//                                                                         ...prev,
//                                                                         propositionBail: { ...prev.propositionBail, typeBail: value },
//                                                                     }))
//                                                                 }
//                                                                 value={formData.propositionBail?.typeBail}
//                                                             >
//                                                                 <Option value="COMMERCIAL">Commercial</Option>
//                                                                 <Option value="HABITATION">Habitation</Option>
//                                                                 <Option value="MIXTE">Mixte</Option>
//                                                             </Select>
//                                                         </Form.Item>
//                                                     </Col>

//                                                     <Col xs={24} md={8}>
//                                                         <Form.Item
//                                                             name="propositionBail.duree"
//                                                             label="Durée (années)"
//                                                             rules={[
//                                                                 { required: true, message: "Veuillez saisir la durée" },
//                                                                 {
//                                                                     validator: (_, value) => {
//                                                                         const num = Number(value);
//                                                                         if (isNaN(num) || num < 1 || num > 99) {
//                                                                             return Promise.reject("Durée entre 1 et 99 ans");
//                                                                         }
//                                                                         return Promise.resolve();
//                                                                     },
//                                                                 },
//                                                             ]}
//                                                         >
//                                                             <Input
//                                                                 type="number"
//                                                                 placeholder="Ex: 5"
//                                                                 min={1}
//                                                                 max={99}
//                                                                 onChange={(e) => {
//                                                                     const value = e.target.value;
//                                                                     setFormData((prev) => ({
//                                                                         ...prev,
//                                                                         propositionBail: { ...prev.propositionBail, duree: value === "" ? "" : Number(value) },
//                                                                     }));
//                                                                 }}

//                                                                 value={formData.propositionBail?.duree}
//                                                                 suffix="an(s)"
//                                                             />
//                                                         </Form.Item>
//                                                     </Col>

//                                                     <Col xs={24} md={8}>
//                                                         <Form.Item
//                                                             name="propositionBail.montantLocation"
//                                                             label="Montant de location mensuel"
//                                                             rules={[
//                                                                 { required: true, message: "Veuillez saisir le montant" },
//                                                                 // { type: "number", min: 1, message: "Montant doit être positif" },
//                                                             ]}
//                                                         >
//                                                             <Input
//                                                                 type="number"
//                                                                 placeholder="Ex: 50000"
//                                                                 min={10000}
//                                                                 onChange={(e) =>
//                                                                     setFormData((prev) => ({
//                                                                         ...prev,
//                                                                         propositionBail: {
//                                                                             ...prev.propositionBail,
//                                                                             montantLocation: e.target.value,
//                                                                         },
//                                                                     }))
//                                                                 }
//                                                                 value={formData.propositionBail?.montantLocation}
//                                                                 suffix="FCFA"
//                                                             />
//                                                         </Form.Item>
//                                                     </Col>
//                                                 </Row>
//                                             </>
//                                         )}

//                                         {demande?.typeDemande === "BAIL_COMMUNAL" && (
//                                             <>
//                                                 <Divider orientation="left">
//                                                     <FileTextOutlined className="mr-2" />
//                                                     Détails du bail communal
//                                                 </Divider>

//                                                 <Row gutter={16}>
//                                                     <Col xs={24} md={8}>
//                                                         <Form.Item
//                                                             name="montantLocation"
//                                                             label="Montant de location mensuel"
//                                                             rules={[
//                                                                 { required: true, message: "Veuillez saisir le montant" },
//                                                                 { type: "number", min: 1, message: "Montant doit être positif" },
//                                                             ]}
//                                                         >
//                                                             <Input
//                                                                 type="number"
//                                                                 placeholder="Ex: 75000"
//                                                                 min={1}
//                                                                 onChange={(e) =>
//                                                                     setFormData((prev) => ({
//                                                                         ...prev,
//                                                                         montantLocation: e.target.value,
//                                                                     }))
//                                                                 }
//                                                                 value={formData.montantLocation}
//                                                                 suffix="FCFA"
//                                                             />
//                                                         </Form.Item>
//                                                     </Col>

//                                                     <Col xs={24} md={8}>
//                                                         <Form.Item
//                                                             name="dateDebut"
//                                                             label="Date de début"
//                                                             rules={[{ required: true, message: "Veuillez sélectionner la date" }]}
//                                                         >
//                                                             <DatePicker
//                                                                 style={{ width: "100%" }}
//                                                                 format="DD/MM/YYYY"
//                                                                 onChange={(date, dateString) =>
//                                                                     setFormData((prev) => ({
//                                                                         ...prev,
//                                                                         dateDebut: dateString,
//                                                                     }))
//                                                                 }
//                                                             />
//                                                         </Form.Item>
//                                                     </Col>

//                                                     <Col xs={24} md={8}>
//                                                         <Form.Item
//                                                             name="dateFin"
//                                                             label="Date de fin"
//                                                             rules={[{ required: true, message: "Veuillez sélectionner la date" }]}
//                                                         >
//                                                             <DatePicker
//                                                                 style={{ width: "100%" }}
//                                                                 format="DD/MM/YYYY"
//                                                                 onChange={(date, dateString) =>
//                                                                     setFormData((prev) => ({
//                                                                         ...prev,
//                                                                         dateFin: dateString,
//                                                                     }))
//                                                                 }
//                                                             />
//                                                         </Form.Item>
//                                                     </Col>
//                                                 </Row>
//                                             </>
//                                         )}

//                                         {demande?.typeDemande === "PERMIS_OCCUPATION" && (
//                                             <>
//                                                 <Divider orientation="left">
//                                                     <FileTextOutlined className="mr-2" />
//                                                     Détails du permis d'occupation
//                                                 </Divider>

//                                                 <Row gutter={16}>
//                                                     <Col xs={24} md={12}>
//                                                         <Form.Item
//                                                             name="dureeValidite"
//                                                             label="Durée de validité"
//                                                             rules={[
//                                                                 { required: true, message: "Veuillez saisir la durée" },
//                                                                 {
//                                                                     validator: (_, value) => {
//                                                                         const num = Number(value);
//                                                                         if (isNaN(num) || num < 1 || num > 10) {
//                                                                             return Promise.reject("Durée entre 1 et 10 ans");
//                                                                         }
//                                                                         return Promise.resolve();
//                                                                     },
//                                                                 },
//                                                             ]}
//                                                         >
//                                                             <Input
//                                                                 type="number"
//                                                                 placeholder="Ex: 2"
//                                                                 min={1}
//                                                                 max={10}
//                                                                 onChange={(e) => {
//                                                                     const value = e.target.value;
//                                                                     setFormData((prev) => ({
//                                                                         ...prev,
//                                                                         dureeValidite: value === "" ? "" : Number(value),
//                                                                     }));
//                                                                 }}
//                                                                 value={formData.dureeValidite}
//                                                                 suffix="an(s)"
//                                                             />
//                                                         </Form.Item>
//                                                     </Col>

//                                                     <Col xs={24} md={12}>
//                                                         <Form.Item
//                                                             name="parcelle.usage"
//                                                             label="Usage autorisé"
//                                                             rules={[{ required: true, message: "Veuillez sélectionner l'usage" }]}
//                                                         >
//                                                             <Select
//                                                                 placeholder="Sélectionner l'usage"
//                                                                 onChange={(value) =>
//                                                                     setFormData((prev) => ({
//                                                                         ...prev,
//                                                                         parcelle: { ...prev.parcelle, usage: value },
//                                                                     }))
//                                                                 }
//                                                                 value={formData.parcelle.usage}
//                                                             >
//                                                                 <Option value="HABITATION">Habitation</Option>
//                                                                 <Option value="COMMERCIAL">Commercial</Option>
//                                                                 <Option value="MIXTE">Mixte</Option>
//                                                                 <Option value="INDUSTRIEL">Industriel</Option>
//                                                             </Select>
//                                                         </Form.Item>
//                                                     </Col>
//                                                 </Row>
//                                             </>
//                                         )}

//                                         {/* Form Actions */}
//                                         <Form.Item>
//                                             <div className="flex justify-end gap-3 mt-8">
//                                                 <Button size="large" onClick={() => navigate(-1)}>
//                                                     Annuler
//                                                 </Button>
//                                                 <Button
//                                                     className="bg-primary border-primary hover:bg-primary/90"
//                                                     size="large"
//                                                     htmlType="submit"
//                                                     loading={isSubmitting}
//                                                     icon={<SaveOutlined />}
//                                                 >
//                                                     Générer le document
//                                                 </Button>
//                                             </div>
//                                         </Form.Item>
//                                     </Form>
//                                 </Card>
//                             </Content>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Map Modal */}
//             <Modal
//                 title="Localisation de la parcelle"
//                 open={isMapModalVisible}
//                 onCancel={() => setIsMapModalVisible(false)}
//                 width={800}
//                 footer={null}
//             >
//                 <MapCar latitude={demande?.localite?.latitude} longitude={demande?.localite?.longitude} />
//             </Modal>

//             {/* Document Viewer Modal */}
//             <Modal
//                 title={`Document ${viewType === "recto" ? "Recto" : "Verso"}`}
//                 open={isViewerOpen}
//                 onCancel={closeViewer}
//                 footer={null}
//                 width="80%"
//                 style={{ top: 20 }}
//             >
//                 {fileLoading ? (
//                     <div className="flex justify-center items-center h-96">
//                         <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} tip="Chargement du document..." />
//                     </div>
//                 ) : activeDocument ? (
//                     <iframe
//                         src={`data:application/pdf;base64,${activeDocument}`}
//                         width="100%"
//                         height="600px"
//                         title="Document PDF"
//                         style={{ border: "none" }}
//                     />
//                 ) : (
//                     <Empty description="Document non disponible" />
//                 )}
//             </Modal>
//         </>
//     )
// }

// export default AdminDemandeConfirmation

"use client"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AdminBreadcrumb } from "@/components"
import { toast } from "sonner"
import { generateDocument, getDemandeDetails, getFileDocument } from "@/services/demandeService"
import { getLocaliteDtailsConfirmation } from "@/services/localiteService"
import MapCar from "../../Map/MapCar"
import { formatCoordinates, formatPhoneNumber, formatPrice } from "@/utils/formatters"
import {
    Layout,
    Card,
    Typography,
    Tag,
    Descriptions,
    Button,
    Form,
    Input,
    Select,
    DatePicker,
    Row,
    Col,
    Divider,
    Space,
    Spin,
    Modal,
    Empty,
    Grid,
    Tooltip,
    Alert,
    Steps,
} from "antd"
import {
    SaveOutlined,
    FileTextOutlined,
    LoadingOutlined,
    EnvironmentOutlined,
    UserOutlined,
    AreaChartOutlined,
    CheckCircleOutlined,
    FormOutlined,
    FileProtectOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import { Loader2, Save } from "lucide-react"

const { Content } = Layout
const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input
const { useBreakpoint } = Grid
const { Step } = Steps

const AdminDemandeConfirmation = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const screens = useBreakpoint()

    // State management
    const [localite, setLocalite] = useState({})
    const [lotissements, setLotissements] = useState([])
    const [parcelles, setParcelles] = useState([])
    const [selectedLotissement, setSelectedLotissement] = useState("")
    const [demande, setDemande] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isMapModalVisible, setIsMapModalVisible] = useState(false)
    const [isViewerOpen, setIsViewerOpen] = useState(false)
    const [fileLoading, setFileLoading] = useState(false)
    const [activeDocument, setActiveDocument] = useState(null)
    const [viewType, setViewType] = useState(null)
    const [currentStep, setCurrentStep] = useState(0)

    // Enhanced form data structure
    const [formData, setFormData] = useState({
        // Document information
        document: {
            type: "PERMIS_OCCUPER",
            reference: `N° C.KL/SG/DDPF ${new Date().getFullYear()}`,
            dateDelivrance: new Date().toISOString().split("T")[0],
            lieuSignature: "Kaolack",
        },

        // Administrative information
        administration: {
            pays: "République du Sénégal",
            region: "Kaolack",
            commune: "Kaolack",
            ampliations: ["S.G", "DDPF", "Intéressé", "Archives", "Cadastre", "Domaine"],
        },

        // Beneficiary information
        beneficiaire: {
            prenom: "",
            nom: "",
            dateNaissance: "",
            lieuNaissance: "",
            cni: {
                numero: "",
                dateDelivrance: "",
                lieuDelivrance: "",
            },
        },

        // Plot information
        parcelle: {
            lotissement: "",
            numero: "",
            superficie: "",
            usage: "",
            referenceCadastrale: "T.F...912... (propriété de la Commune de Kaolack)",
        },

        // Request type specific data
        propositionBail: {
            typeBail: "",
            duree: "",
            montantLocation: "",
        },

        // Common fields
        montantLocation: "",
        dateDebut: "",
        dateFin: "",
        dureeValidite: "",
    })

    // Handle document viewing
    const handleViewDocument = async (type) => {
        try {
            setFileLoading(true)
            setViewType(type)
            setIsViewerOpen(true)

            const fileData = await getFileDocument(id)
            const document = type === "recto" ? fileData.recto : fileData.verso
            setActiveDocument(document)
        } catch (error) {
            console.error("Erreur lors du chargement du document:", error)
            toast.error("Erreur lors du chargement du document")
        } finally {
            setFileLoading(false)
        }
    }

    // Close document viewer
    const closeViewer = () => {
        setIsViewerOpen(false)
        setActiveDocument(null)
        setViewType(null)
    }

    // Fetch locality details
    useEffect(() => {
        const fetchDetailsLocalite = async () => {
            try {
                const data = await getLocaliteDtailsConfirmation(id)
                console.log("data localite", data)
                setLocalite(data)
                setLotissements(data.lotissements || [])
            } catch (error) {
                // fetchDetailsLocalite()
                toast.error("Erreur lors du chargement des lotissements")
            }
        }
        setTimeout(() => {
            fetchDetailsLocalite()
        }, 1000)
        // fetchDetailsLocalite()
    }, [id])

    // Fetch request details
    useEffect(() => {
        const fetchDemande = async () => {
            try {
                const data = await getDemandeDetails(id)
                setDemande(data)

                // Generate reference number based on request type
                const generateReference = (type) => {
                    const year = new Date().getFullYear()
                    const randomNum = Math.floor(100000 + Math.random() * 900000)
                    switch (type) {
                        case "BAIL_COMMUNAL":
                            return `BC-${year}-${randomNum}`
                        case "PROPOSITION_BAIL":
                            return `PB-${year}-${randomNum}`
                        default:
                            return `PO-${year}-${randomNum}`
                    }
                }

                // Calculate end date for bail communal (1 year from now)
                const calculateEndDate = () => {
                    const endDate = new Date()
                    endDate.setFullYear(endDate.getFullYear() + 1)
                    return endDate.toISOString().split("T")[0]
                }

                const updatedFormData = {
                    ...formData,
                    superficie: data.superficie,
                    usagePrevu: data.usagePrevu,
                    localite: data.localite?.nom || "",
                    localiteId: data.localite?.id || null,
                    numeroPermis: generateReference(data.typeDemande),
                    dateFin: data.typeDemande === "BAIL_COMMUNAL" ? calculateEndDate() : "",
                    adresseTerrain: data.localite?.nom || "",

                    beneficiaire: {
                        ...formData.beneficiaire,
                        prenom: data.demandeur?.prenom || "",
                        nom: data.demandeur?.nom || "",
                        dateNaissance: data.demandeur?.dateNaissance || "",
                        lieuNaissance: data.demandeur?.lieuNaissance || "",
                        cni: {
                            ...formData.beneficiaire.cni,
                            numero: data.demandeur?.numeroElecteur || "",
                        },
                    },
                }

                setFormData(updatedFormData)

                // Set initial form values
                form.setFieldsValue({
                    "document.reference": updatedFormData.document.reference,
                    "document.dateDelivrance": dayjs(updatedFormData.document.dateDelivrance),
                    "document.lieuSignature": updatedFormData.document.lieuSignature,
                    "parcelle.referenceCadastrale": updatedFormData.parcelle.referenceCadastrale,
                    "beneficiaire.cni.numero": updatedFormData.beneficiaire.cni.numero,
                })
            } catch (error) {
                console.error("Erreur lors du chargement de la demande:", error)
                toast.error("Erreur lors du chargement de la demande")
            } finally {
                setLoading(false)
            }
        }

        fetchDemande()
    }, [id])

    // Handle lotissement change
    const handleLotissementChange = async (lotissementId) => {
        try {
            if (!lotissementId) {
                setParcelles([])
                setSelectedLotissement("")
                return
            }

            setSelectedLotissement(lotissementId)
            const lotissement = lotissements.find((lot) => lot.id === Number(lotissementId))

            if (!lotissement) {
                toast.error("Lotissement non trouvé")
                setParcelles([])
                return
            }

            setParcelles(lotissement.parcelles || [])

            setFormData((prev) => ({
                ...prev,
                lotissement: lotissement.nom,
                propositionBail: {
                    ...prev.propositionBail,
                    lotissement: lotissement.nom,
                },
            }))
        } catch (error) {
            console.error("Erreur lors du changement de lotissement:", error)
            toast.error("Erreur lors du chargement des parcelles")
            setParcelles([])
        }
    }

    // Enhanced form validation
    const validateFormData = (data, type) => {
        const commonValidation =
            data.document?.reference &&
            data.document?.dateDelivrance &&
            data.document?.lieuSignature &&
            data.parcelle?.numero &&
            data.beneficiaire?.cni?.numero &&
            data.beneficiaire?.cni?.dateDelivrance &&
            data.beneficiaire?.cni?.lieuDelivrance

        switch (type) {
            case "PROPOSITION_BAIL":
                return (
                    commonValidation &&
                    data.propositionBail?.typeBail &&
                    data.propositionBail?.duree &&
                    data.propositionBail?.montantLocation
                )

            case "BAIL_COMMUNAL":
                return commonValidation && data.montantLocation && data.dateDebut && data.dateFin

            case "PERMIS_OCCUPATION":
                return commonValidation && data.dureeValidite && data.parcelle?.usage

            default:
                return false
        }
    }

    // Enhanced form submission
    const handleSubmit = async (values) => {
        console.log("Form values:", values)
        console.log("Form data:", formData)

        setIsSubmitting(true)
        try {
            // Vérifier que demande existe avant de continuer
            if (!demande) {
                toast.error("Erreur: Données de la demande non disponibles")
                return
            }

            // Validate required fields
            if (!validateFormData(formData, demande?.typeDemande)) {
                console.warn(formData, validateFormData(formData, demande?.typeDemande))
                toast.error("Veuillez remplir tous les champs obligatoires")
                return
            }

            let dataToSubmit = {
                demande: id,
                typeDemande: demande.typeDemande,
            }

            // Common data structure for all document types
            const commonData = {
                dateDelivrance: formData.document.dateDelivrance,
                superficie: Number(demande.superficie) || 0,
                demandeId: demande.id,
                usagePrevu: demande.usagePrevu || "",
                localite: demande.localite?.nom || "",
                referenceCadastrale: formData.parcelle.referenceCadastrale,
                lotissement: lotissements.find((lot) => lot.id === Number(selectedLotissement))?.nom || "",
                numeroParcelle: formData.parcelle.numero,
                localiteId: demande.localite?.id || null,
                lotissementId: selectedLotissement || null,
                cni: {
                    numero: formData.beneficiaire.cni.numero,
                    dateDelivrance: formData.beneficiaire.cni.dateDelivrance,
                    lieuDelivrance: formData.beneficiaire.cni.lieuDelivrance,
                },
                beneficiaire: {
                    prenom: demande.demandeur?.prenom || "",
                    nom: demande.demandeur?.nom || "",
                    dateNaissance: demande.demandeur?.dateNaissance || "",
                    lieuNaissance: demande.demandeur?.lieuNaissance || "",
                },
            }

            // Type-specific data preparation
            switch (demande.typeDemande) {
                case "PERMIS_OCCUPATION":
                    dataToSubmit = {
                        ...dataToSubmit,
                        ...commonData,
                        numeroPermis: `PO-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9)}`,
                        dureeValidite: `${formData.dureeValidite} an${formData.dureeValidite > 1 ? "s" : ""}`,
                        usage: formData.parcelle.usage,
                    }
                    break

                case "BAIL_COMMUNAL":
                    dataToSubmit = {
                        ...dataToSubmit,
                        ...commonData,
                        numeroBail: `BC-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9)}`,
                        montantLocation: Number(formData.montantLocation),
                        montantCaution: Number(formData.montantLocation) * 3,
                        dateDebut: formData.dateDebut,
                        dateFin: formData.dateFin,
                    }
                    break

                case "PROPOSITION_BAIL":
                    dataToSubmit = {
                        ...dataToSubmit,
                        ...commonData,
                        propositionBail: {
                            reference: `PB-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9)}`,
                            typeBail: formData.propositionBail?.typeBail,
                            duree: `${formData.propositionBail?.duree} an${formData.propositionBail?.duree > 1 ? "s" : ""}`,
                            montantLocation: Number(formData.propositionBail?.montantLocation),
                            montantCaution: Number(formData.propositionBail?.montantLocation) * 3,
                        },
                    }
                    break

                default:
                    throw new Error("Type de document non supporté")
            }

            console.log("Data to submit:", dataToSubmit)

            // Décommenter cette ligne quand vous voulez vraiment générer le document
            await generateDocument(id, dataToSubmit)
            toast.success("Document généré avec succès")
            navigate(`/admin/demandes/${id}/details`)
        } catch (error) {
            console.error("Erreur lors de la génération:", error)
            toast.error("Erreur lors de la génération du document")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Get request type tag
    const getRequestTypeTag = (type) => {
        switch (type) {
            case "PERMIS_OCCUPATION":
                return <Tag color="success">Permis d'Occupation</Tag>
            case "BAIL_COMMUNAL":
                return <Tag color="processing">Bail Communal</Tag>
            case "PROPOSITION_BAIL":
                return <Tag color="warning">Proposition de Bail</Tag>
            default:
                return <Tag>Inconnu</Tag>
        }
    }

    // Get form steps based on request type
    const getFormSteps = () => {
        return [
            {
                title: "Informations",
                icon: <UserOutlined />,
                description: "Vérification des données",
            },
            {
                title: "Document",
                icon: <FileProtectOutlined />,
                description: "Configuration du document",
            },
            {
                title: "Confirmation",
                icon: <CheckCircleOutlined />,
                description: "Génération finale",
            },
        ]
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            </div>
        )
    }

    if (!demande) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <Title level={3}>Demande non trouvée</Title>
                    <Text>La demande #{id} n'a pas pu être chargée.</Text>
                    <div className="mt-4">
                        <Button onClick={() => navigate(-1)}>Retour</Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <AdminBreadcrumb title="Confirmation de la demande" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="grid grid-cols-1">
                            <Content style={{ padding: "24px" }}>
                                {/* Header Card */}
                                <Card className="mb-6">
                                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                        <div>
                                            <Title level={3} className="m-0">
                                                Confirmation de la demande #{id}
                                            </Title>
                                            <Text type="secondary">
                                                Vérifiez et complétez les informations avant la génération du document
                                            </Text>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getRequestTypeTag(demande?.typeDemande)}
                                            <Tag color="blue">{dayjs(demande?.dateCreation).format("DD/MM/YYYY")}</Tag>
                                        </div>
                                    </div>

                                    {/* Progress Steps */}
                                    <div className="mt-6">
                                        <Steps current={currentStep} items={getFormSteps()} />
                                    </div>
                                </Card>

                                {/* Information Cards */}
                                <Row gutter={[24, 24]} className="mb-6">
                                    {/* Requester Information */}
                                    <Col xs={24} lg={6}>
                                        <Card
                                            title={
                                                <span>
                                                    <UserOutlined className="mr-2" />
                                                    Demandeur
                                                </span>
                                            }
                                            size="small"
                                            className="h-full"
                                        >
                                            <Descriptions column={1} size="small">
                                                <Descriptions.Item label="Nom complet">
                                                    <Text strong>
                                                        {demande?.demandeur?.prenom} {demande?.demandeur?.nom}
                                                    </Text>
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Email">
                                                    <Text ellipsis>{demande?.demandeur?.email}</Text>
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Téléphone">
                                                    {formatPhoneNumber(demande?.demandeur?.telephone)}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Adresse">{demande?.demandeur?.adresse}</Descriptions.Item>
                                                <Descriptions.Item label="Date de naissance">
                                                    {demande?.demandeur?.dateNaissance
                                                        ? dayjs(demande.demandeur.dateNaissance).format("DD/MM/YYYY")
                                                        : "Non renseigné"}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Lieu de naissance">
                                                    {demande?.demandeur?.lieuNaissance || "Non renseigné"}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Profession">
                                                    {demande?.demandeur?.profession || "Non renseigné"}
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Card>
                                    </Col>

                                    {/* Request Details */}
                                    <Col xs={24} lg={6}>
                                        <Card
                                            title={
                                                <span>
                                                    <FileTextOutlined className="mr-2" />
                                                    Détails de la demande
                                                </span>
                                            }
                                            size="small"
                                            className="h-full"
                                        >
                                            <Descriptions column={1} size="small">
                                                <Descriptions.Item label="Type de demande">
                                                    {demande?.typeDemande === "PERMIS_OCCUPATION"
                                                        ? "Permis d'Occupation"
                                                        : demande?.typeDemande === "BAIL_COMMUNAL"
                                                            ? "Bail Communal"
                                                            : "Proposition de Bail"}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Statut">
                                                    <Tag color="orange">{demande?.statut}</Tag>
                                                </Descriptions.Item>
                                            </Descriptions>

                                            <Divider orientation="left" plain style={{ margin: "12px 0" }}>
                                                <small>Documents d'identification</small>
                                            </Divider>

                                            <Space direction="vertical" style={{ width: "100%" }}>
                                                <Button block icon={<FileTextOutlined />} onClick={() => handleViewDocument("recto")}>
                                                    Voir Recto
                                                </Button>
                                                <Button block icon={<FileTextOutlined />} onClick={() => handleViewDocument("verso")}>
                                                    Voir Verso
                                                </Button>
                                            </Space>
                                        </Card>
                                    </Col>

                                    {/* Locality Information */}
                                    <Col xs={24} lg={6}>
                                        <Card
                                            title={
                                                <span>
                                                    <EnvironmentOutlined className="mr-2" />
                                                    Localité
                                                </span>
                                            }
                                            size="small"
                                            className="h-full"
                                        >
                                            <Descriptions column={1} size="small">
                                                <Descriptions.Item label="Nom">
                                                    <Text strong>{demande?.localite?.nom}</Text>
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Description">
                                                    <Text ellipsis>{demande?.localite?.description}</Text>
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Prix">
                                                    <Text strong>{formatPrice(demande?.localite?.prix)}</Text>
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Coordonnées">
                                                    <Space>
                                                        {formatCoordinates(demande?.localite?.latitude, demande?.localite?.longitude)}
                                                        <Tooltip title="Voir sur la carte">
                                                            <Button
                                                                className="ant-btn-primary"
                                                                size="small"
                                                                icon={<EnvironmentOutlined />}
                                                                onClick={() => setIsMapModalVisible(true)}
                                                            />
                                                        </Tooltip>
                                                    </Space>
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Card>
                                    </Col>

                                    {/* Specifications */}
                                    <Col xs={24} lg={6}>
                                        <Card
                                            title={
                                                <span>
                                                    <AreaChartOutlined className="mr-2" />
                                                    Spécifications
                                                </span>
                                            }
                                            size="small"
                                            className="h-full"
                                        >
                                            <Descriptions column={1} size="small">
                                                <Descriptions.Item label="Superficie">
                                                    <Text strong>{demande?.superficie} m²</Text>
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Usage prévu">
                                                    <Text strong>{demande?.usagePrevu}</Text>
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Autre terrain">
                                                    <Tag color={demande?.possedeAutreTerrain ? "red" : "green"}>
                                                        {demande?.possedeAutreTerrain ? "Oui" : "Non"}
                                                    </Tag>
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Card>
                                    </Col>
                                </Row>

                                {/* Main Form */}
                                <Card
                                    title={
                                        <span>
                                            <FormOutlined className="mr-2" />
                                            Formulaire de confirmation
                                        </span>
                                    }
                                >
                                    <Alert
                                        message="Information importante"
                                        description="Veuillez vérifier attentivement toutes les informations avant de générer le document. Une fois généré, le document ne pourra plus être modifié."
                                        type="info"
                                        showIcon
                                        className="mb-6"
                                    />

                                    <Form
                                        form={form}
                                        layout="vertical"
                                        onFinish={handleSubmit}
                                        initialValues={{
                                            "document.reference": formData.document.reference,
                                            "document.lieuSignature": formData.document.lieuSignature,
                                            "parcelle.referenceCadastrale": formData.parcelle.referenceCadastrale,
                                        }}
                                    >
                                        {/* Document Information Section */}
                                        <Divider orientation="left">
                                            <FileProtectOutlined className="mr-2" />
                                            Informations du document
                                        </Divider>

                                        <Row gutter={16}>
                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="document.reference"
                                                    label="Référence du document"
                                                    rules={[{ required: true, message: "Veuillez saisir la référence" }]}
                                                >
                                                    <Input
                                                        placeholder="Ex: N° C.KL/SG/DDPF 2024"
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                document: { ...prev.document, reference: e.target.value },
                                                            }))
                                                        }
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="document.dateDelivrance"
                                                    label="Date de délivrance"
                                                    rules={[{ required: true, message: "Veuillez sélectionner la date" }]}
                                                >
                                                    <DatePicker
                                                        style={{ width: "100%" }}
                                                        format="DD/MM/YYYY"
                                                        onChange={(date, dateString) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                document: { ...prev.document, dateDelivrance: dateString },
                                                            }))
                                                        }
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="document.lieuSignature"
                                                    label="Lieu de signature"
                                                    rules={[{ required: true, message: "Veuillez saisir le lieu" }]}
                                                >
                                                    <Input
                                                        placeholder="Ex: Kaolack"
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                document: { ...prev.document, lieuSignature: e.target.value },
                                                            }))
                                                        }
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        {/* Plot Information Section */}
                                        <Divider orientation="left">
                                            <AreaChartOutlined className="mr-2" />
                                            Informations de la parcelle
                                        </Divider>

                                        <Row gutter={16}>
                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="lotissement"
                                                    label="Lotissement"
                                                    rules={[{ required: true, message: "Veuillez sélectionner un lotissement" }]}
                                                >
                                                    <Select
                                                        placeholder="Sélectionner un lotissement"
                                                        onChange={handleLotissementChange}
                                                        value={selectedLotissement}
                                                        showSearch
                                                        optionFilterProp="children"
                                                    >
                                                        <Option value="">Sélectionner un lotissement</Option>
                                                        {lotissements.map((lotissement) => (
                                                            <Option key={lotissement.id} value={lotissement.id}>
                                                                {lotissement.nom}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="parcelle.numero"
                                                    label="Numéro de parcelle"
                                                    rules={[{ required: true, message: "Veuillez sélectionner une parcelle" }]}
                                                >
                                                    <Select
                                                        placeholder="Sélectionner une parcelle"
                                                        disabled={!selectedLotissement}
                                                        onChange={(value) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                parcelle: { ...prev.parcelle, numero: value },
                                                            }))
                                                        }
                                                        value={formData.parcelle.numero}
                                                        showSearch
                                                        optionFilterProp="children"
                                                    >
                                                        <Option value="">Sélectionner une parcelle</Option>
                                                        {parcelles.map((parcelle) => (
                                                            <Option key={parcelle.id} value={parcelle.numero}>
                                                                Parcelle {parcelle.numero}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="parcelle.referenceCadastrale"
                                                    label="Référence cadastrale"
                                                    rules={[{ required: true, message: "Veuillez saisir la référence cadastrale" }]}
                                                >
                                                    <Input
                                                        placeholder="Ex: T.F...912... (propriété de la Commune)"
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                parcelle: { ...prev.parcelle, referenceCadastrale: e.target.value },
                                                            }))
                                                        }
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        {/* Beneficiary Information Section */}
                                        <Divider orientation="left">
                                            <UserOutlined className="mr-2" />
                                            Informations d'identification
                                        </Divider>

                                        <Row gutter={16}>
                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="beneficiaire.cni.numero"
                                                    label="Numéro d'Identification National (NIN)"
                                                    rules={[
                                                        { required: true, message: "Veuillez saisir le NIN" },
                                                        {
                                                            pattern: /^[0-9]{13}$/,
                                                            message: "Le NIN doit contenir exactement 13 chiffres",
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        placeholder="Ex: 1548198806765"
                                                        maxLength={13}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                beneficiaire: {
                                                                    ...prev.beneficiaire,
                                                                    cni: { ...prev.beneficiaire.cni, numero: e.target.value },
                                                                },
                                                            }))
                                                        }
                                                        value={formData.beneficiaire.cni.numero}
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="beneficiaire.cni.dateDelivrance"
                                                    label="Date de délivrance CNI"
                                                    rules={[{ required: true, message: "Veuillez sélectionner la date" }]}
                                                >
                                                    <DatePicker
                                                        style={{ width: "100%" }}
                                                        format="DD/MM/YYYY"
                                                        onChange={(date, dateString) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                beneficiaire: {
                                                                    ...prev.beneficiaire,
                                                                    cni: { ...prev.beneficiaire.cni, dateDelivrance: dateString },
                                                                },
                                                            }))
                                                        }
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="beneficiaire.cni.lieuDelivrance"
                                                    label="Lieu de délivrance CNI"
                                                    rules={[{ required: true, message: "Veuillez saisir le lieu" }]}
                                                >
                                                    <Input
                                                        placeholder="Ex: Kaolack"
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                beneficiaire: {
                                                                    ...prev.beneficiaire,
                                                                    cni: { ...prev.beneficiaire.cni, lieuDelivrance: e.target.value },
                                                                },
                                                            }))
                                                        }
                                                        value={formData.beneficiaire.cni.lieuDelivrance}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        {/* Request Type Specific Fields */}
                                        {demande?.typeDemande === "PROPOSITION_BAIL" && (
                                            <>
                                                <Divider orientation="left">
                                                    <FileTextOutlined className="mr-2" />
                                                    Détails de la proposition de bail
                                                </Divider>

                                                <Row gutter={16}>
                                                    <Col xs={24} md={8}>
                                                        <Form.Item
                                                            name="propositionBail.typeBail"
                                                            label="Type de bail"
                                                            rules={[{ required: true, message: "Veuillez sélectionner le type" }]}
                                                        >
                                                            <Select
                                                                placeholder="Sélectionner le type"
                                                                onChange={(value) =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        propositionBail: { ...prev.propositionBail, typeBail: value },
                                                                    }))
                                                                }
                                                                value={formData.propositionBail?.typeBail}
                                                            >
                                                                <Option value="COMMERCIAL">Commercial</Option>
                                                                <Option value="HABITATION">Habitation</Option>
                                                                <Option value="MIXTE">Mixte</Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col xs={24} md={8}>
                                                        <Form.Item
                                                            name="propositionBail.duree"
                                                            label="Durée (années)"
                                                            rules={[
                                                                { required: true, message: "Veuillez saisir la durée" },
                                                                // { type: "number", min: 1, max: 99, message: "Durée entre 1 et 99 ans" },

                                                                {
                                                                    validator: (_, value) => {
                                                                        const num = Number(value);
                                                                        if (isNaN(num) || num < 1 || num > 99) {
                                                                            return Promise.reject("Durée entre 1 et 99 ans");
                                                                        }
                                                                        return Promise.resolve();
                                                                    },
                                                                },
                                                            ]}
                                                        >
                                                            <Input
                                                                type="number"
                                                                placeholder="Ex: 5"
                                                                min={1}
                                                                max={99}
                                                                onChange={(e) =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        propositionBail: { ...prev.propositionBail, duree: e.target.value },
                                                                    }))
                                                                }
                                                                value={formData.propositionBail?.duree}
                                                                suffix="an(s)"
                                                            />
                                                        </Form.Item>
                                                    </Col>

                                                    <Col xs={24} md={8}>
                                                        <Form.Item
                                                            name="propositionBail.montantLocation"
                                                            label="Montant de location mensuel"
                                                            rules={[
                                                                { required: true, message: "Veuillez saisir le montant" },
                                                                // { type: "number", min: 1, message: "Montant doit être positif" },
                                                            ]}
                                                        >
                                                            <Input
                                                                type="number"
                                                                placeholder="Ex: 50000"
                                                                min={1}
                                                                onChange={(e) =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        propositionBail: {
                                                                            ...prev.propositionBail,
                                                                            montantLocation: e.target.value,
                                                                        },
                                                                    }))
                                                                }
                                                                value={formData.propositionBail?.montantLocation}
                                                                suffix="FCFA"
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </>
                                        )}

                                        {demande?.typeDemande === "BAIL_COMMUNAL" && (
                                            <>
                                                <Divider orientation="left">
                                                    <FileTextOutlined className="mr-2" />
                                                    Détails du bail communal
                                                </Divider>

                                                <Row gutter={16}>
                                                    <Col xs={24} md={8}>
                                                        <Form.Item
                                                            name="montantLocation"
                                                            label="Montant de location mensuel"
                                                            rules={[
                                                                { required: true, message: "Veuillez saisir le montant" },
                                                                { type: "number", min: 1, message: "Montant doit être positif" },
                                                            ]}
                                                        >
                                                            <Input
                                                                type="number"
                                                                placeholder="Ex: 75000"
                                                                min={1}
                                                                onChange={(e) =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        montantLocation: e.target.value,
                                                                    }))
                                                                }
                                                                value={formData.montantLocation}
                                                                suffix="FCFA"
                                                            />
                                                        </Form.Item>
                                                    </Col>

                                                    <Col xs={24} md={8}>
                                                        <Form.Item
                                                            name="dateDebut"
                                                            label="Date de début"
                                                            rules={[{ required: true, message: "Veuillez sélectionner la date" }]}
                                                        >
                                                            <DatePicker
                                                                style={{ width: "100%" }}
                                                                format="DD/MM/YYYY"
                                                                onChange={(date, dateString) =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        dateDebut: dateString,
                                                                    }))
                                                                }
                                                            />
                                                        </Form.Item>
                                                    </Col>

                                                    <Col xs={24} md={8}>
                                                        <Form.Item
                                                            name="dateFin"
                                                            label="Date de fin"
                                                            rules={[{ required: true, message: "Veuillez sélectionner la date" }]}
                                                        >
                                                            <DatePicker
                                                                style={{ width: "100%" }}
                                                                format="DD/MM/YYYY"
                                                                onChange={(date, dateString) =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        dateFin: dateString,
                                                                    }))
                                                                }
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </>
                                        )}

                                        {demande?.typeDemande === "PERMIS_OCCUPATION" && (
                                            <>
                                                <Divider orientation="left">
                                                    <FileTextOutlined className="mr-2" />
                                                    Détails du permis d'occupation
                                                </Divider>

                                                <Row gutter={16}>
                                                    <Col xs={24} md={12}>
                                                        <Form.Item
                                                            name="dureeValidite"
                                                            label="Durée de validité"
                                                            // rules={[
                                                            //     { required: true, message: "Veuillez saisir la durée" },
                                                            //     { type: "number", min: 1, max: 10, message: "Durée entre 1 et 10 ans" },
                                                            // ]}

                                                            rules={[
                                                                { required: true, message: "Veuillez saisir la durée" },
                                                                {
                                                                    validator: (_, value) => {
                                                                        const num = Number(value);
                                                                        if (isNaN(num) || num < 1 || num > 10) {
                                                                            return Promise.reject("Durée entre 1 et 10 ans");
                                                                        }
                                                                        return Promise.resolve();
                                                                    },
                                                                },
                                                            ]}
                                                        >
                                                            <Input
                                                                type="number"
                                                                placeholder="Ex: 2"
                                                                min={1}
                                                                max={10}
                                                                onChange={(e) =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        dureeValidite: e.target.value,
                                                                    }))
                                                                }
                                                                value={formData.dureeValidite}
                                                                suffix="an(s)"
                                                            />
                                                        </Form.Item>
                                                    </Col>

                                                    <Col xs={24} md={12}>
                                                        <Form.Item
                                                            name="parcelle.usage"
                                                            label="Usage autorisé"
                                                            rules={[{ required: true, message: "Veuillez sélectionner l'usage" }]}
                                                        >
                                                            <Select
                                                                placeholder="Sélectionner l'usage"
                                                                onChange={(value) =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        parcelle: { ...prev.parcelle, usage: value },
                                                                    }))
                                                                }
                                                                value={formData.parcelle.usage}
                                                            >
                                                                <Option value="HABITATION">Habitation</Option>
                                                                <Option value="COMMERCIAL">Commercial</Option>
                                                                <Option value="MIXTE">Mixte</Option>
                                                                <Option value="INDUSTRIEL">Industriel</Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </>
                                        )}

                                        {/* Form Actions */}
                                        <Form.Item>
                                            <div className="flex justify-end gap-3 mt-8">
                                                <Button size="large" onClick={() => navigate(-1)}>
                                                    Annuler
                                                </Button>

                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? <Loader2 className="mr-1 animate-spin" /> : <Save className="mr-1" />}
                                                    Générer le document
                                                </button>


                                            </div>
                                        </Form.Item>
                                    </Form>
                                </Card>
                            </Content>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Modal */}
            <Modal
                title="Localisation de la parcelle"
                open={isMapModalVisible}
                onCancel={() => setIsMapModalVisible(false)}
                width={800}
                footer={null}
            >
                <MapCar latitude={demande?.localite?.latitude} longitude={demande?.localite?.longitude} />
            </Modal>

            {/* Document Viewer Modal */}
            <Modal
                title={`Document ${viewType === "recto" ? "Recto" : "Verso"}`}
                open={isViewerOpen}
                onCancel={closeViewer}
                footer={null}
                width="80%"
                style={{ top: 20 }}
            >
                {fileLoading ? (
                    <div className="flex justify-center items-center h-96">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} tip="Chargement du document..." />
                    </div>
                ) : activeDocument ? (
                        <iframe
                            src={`data:application/pdf;base64,${activeDocument}`}
                            width="100%"
                            height="600px"
                            title="Document PDF"
                        style={{ border: "none" }}
                    />
                ) : (
                    <Empty description="Document non disponible" />
                )}
            </Modal>
        </>
    )
}

export default AdminDemandeConfirmation
