"use client"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AdminBreadcrumb } from "@/components"
import { toast } from "sonner"
import { generateDocument, getDemandeDetails, getFileDocument } from "@/services/demandeService"
import { getLocaliteDtailsConfirmation, getLocaliteLotissement } from "@/services/localiteService"
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
} from "antd"
import {
    SaveOutlined,
    FileTextOutlined,
    LoadingOutlined,
    EnvironmentOutlined,
    UserOutlined,
    AreaChartOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"

const { Content } = Layout
const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input
const { useBreakpoint } = Grid

const AdminDemandeConfirmation = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const screens = useBreakpoint()
    const [showMap, setShowMap] = useState(false);

    const [localite, setLocalite] = useState({})
    const [lotissements, setLotissements] = useState([])
    const [lots, setLots] = useState([])
    const [selectedLotissement, setSelectedLotissement] = useState("")
    const [parcelles, setParcelles] = useState([])
    const [demande, setDemande] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isMapModalVisible, setIsMapModalVisible] = useState(false);
    const [isViewerOpen, setIsViewerOpen] = useState(false)
    const [fileLoading, setFileLoading] = useState(false)
    const [activeDocument, setActiveDocument] = useState(null)
    const [viewType, setViewType] = useState(null)

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
    })


    const showMapModal = () => {
        setIsMapModalVisible(true);
    };

    // Handle document viewing
    const handleViewDocument = async (type) => {
        try {
            setFileLoading(true)
            setViewType(type)
            setIsViewerOpen(true)

            // Get file from service
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


    useEffect(() => {
        const fetchDetailsLocalite = async () => {
            try {
                const data = await getLocaliteDtailsConfirmation(id)
                console.log("data localite")
                console.log(data)
                setLocalite(data)
                setLotissements(data.lotissements)
            } catch (error) {
                toast.error("Erreur lors du chargement des lotissements")
            }
        }
        fetchDetailsLocalite()
    }, [id])


    useEffect(() => {
        const fetchDemande = async () => {
            try {
                const data = await getDemandeDetails(id)
                setDemande(data)

                setFormData((prev) => ({
                    ...prev,
                    superficie: data.superficie,
                    usagePrevu: data.usagePrevu,
                    localite: data.localite?.nom || "",
                    localiteId: data.localite?.id || null,
                    numeroPermis:
                        data.typeDemande === "BAIL_COMMUNAL"
                            ? `BC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
                            : `PO-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
                    dateFin:
                        data.typeDemande === "BAIL_COMMUNAL"
                            ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0]
                            : "",
                    adresseTerrain: data.localite?.nom || "",

                    beneficiaire: {
                        ...prev.beneficiaire,
                        prenom: data.demandeur.prenom || "",
                        nom: data.demandeur.nom || "",
                        dateNaissance: data.demandeur.dateNaissance || "",
                        lieuNaissance: data.demandeur.lieuNaissance || "",
                        cni: {
                            ...prev.cni,
                            numero: data.demandeur.numeroElecteur || "",
                        }
                    }
                }))




                // Set form values
                form.setFieldsValue({
                    "document.reference": formData.document.reference,
                    "document.dateDelivrance": dayjs(formData.document.dateDelivrance),
                    "document.lieuSignature": formData.document.lieuSignature,
                    "parcelle.referenceCadastrale": formData.parcelle.referenceCadastrale,
                })
            } catch (error) {
                toast.error("Erreur lors du chargement de la demande")
            } finally {
                setLoading(false)
            }
        }

        fetchDemande()
    }, [id, form])

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



    const validateFormData = (data, type) => {
        const commonValidation =
            data.document?.reference && data.document?.dateDelivrance && data.document?.lieuSignature && data.parcelle?.numero

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

    const handleSubmit = async (values) => {
        setIsSubmitting(true)
        try {
            let dataToSubmit = {
                demande: id,
                typeDemande: demande?.typeDemande,
            }

            // Common data structure for all document types
            const commonData = {
                dateDelivrance: formData.document.dateDelivrance,
                superficie: Number(demande?.superficie) || 0,
                demandeId: demande?.id,
                usagePrevu: demande?.usagePrevu || "",
                localite: demande?.localite?.nom || "",
                referenceCadastrale: formData.parcelle.referenceCadastrale,
                lotissement: lotissements.find((lot) => lot.id === Number(selectedLotissement))?.nom || "",
                numeroParcelle: formData.parcelle.numero,
                cni: {
                    numero: formData.beneficiaire.cni.numero,
                    dateDelivrance: formData.beneficiaire.cni.dateDelivrance,
                    lieuDelivrance: formData.beneficiaire.cni.lieuDelivrance,
                },
                beneficiaire: {
                    prenom: demande?.demandeur?.prenom || "",
                    nom: demande?.demandeur?.nom || "",
                    dateNaissance: demande?.demandeur?.dateNaissance || "",
                    lieuNaissance: demande?.demandeur?.lieuNaissance || "",
                },
            }
            console.log(dataToSubmit)
            switch (demande?.typeDemande) {
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

            if (!validateFormData(dataToSubmit, demande?.typeDemande)) {
                toast.error("Veuillez remplir tous les champs obligatoires")
                return
            }


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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} tip="Chargement..." />
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
                                <Card
                                    title={
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Title level={4}>Confirmation de la demande #{id}</Title>
                                            {getRequestTypeTag(demande?.typeDemande)}
                                        </div>
                                    }
                                >
                                    <Divider orientation="left">Informations de la demande</Divider>

                                    <Row gutter={[24, 24]}>
                                        {/* Requester Information */}
                                        <Col xs={24} md={12} lg={6}>
                                            <Card
                                                title={
                                                    <span>
                                                        <UserOutlined /> Informations du demandeur
                                                    </span>
                                                }
                                                size="small"
                                                bordered={false}
                                                style={{ height: "100%" }}
                                            >
                                                <Descriptions column={1} size="small">
                                                    <Descriptions.Item label="Nom complet">
                                                        {demande?.demandeur?.prenom} {demande?.demandeur?.nom}
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
                                        <Col xs={24} md={12} lg={6}>
                                            <Card
                                                title={
                                                    <span>
                                                        <FileTextOutlined /> Détails de la demande
                                                    </span>
                                                }
                                                size="small"
                                                bordered={false}
                                                style={{ height: "100%" }}
                                            >
                                                <Descriptions column={1} size="small">
                                                    <Descriptions.Item label="Date de soumission">
                                                        {dayjs(demande?.dateCreation).format("DD/MM/YYYY")}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="Type de demande">
                                                        {demande?.typeDemande === "PERMIS_OCCUPATION"
                                                            ? "Permis d'Occupation"
                                                            : demande?.typeDemande === "BAIL_COMMUNAL"
                                                                ? "Bail Communal"
                                                                : "Proposition de Bail"}
                                                    </Descriptions.Item>
                                                </Descriptions>

                                                <Divider orientation="left" plain style={{ margin: "12px 0" }}>
                                                    <small>Documents d'identification</small>
                                                </Divider>

                                                <Space direction="vertical" style={{ width: "100%" }}>
                                                    <Button className="text-primary" icon={<FileTextOutlined />} onClick={() => handleViewDocument("recto")}>
                                                        Recto
                                                    </Button>
                                                    <Button className="text-primary" icon={<FileTextOutlined />} onClick={() => handleViewDocument("verso")}>
                                                        Verso
                                                    </Button>
                                                </Space>
                                            </Card>
                                        </Col>

                                        {/* Locality Information */}
                                        <Col xs={24} md={12} lg={6}>
                                            <Card
                                                title={
                                                    <span>
                                                        <EnvironmentOutlined /> Localité Souhaitée
                                                    </span>
                                                }
                                                size="small"
                                                bordered={false}
                                                style={{ height: "100%" }}
                                            >
                                                <Descriptions column={1} size="small">
                                                    <Descriptions.Item label="Nom">{demande?.localite?.nom}</Descriptions.Item>
                                                    <Descriptions.Item label="Description">
                                                        <Text ellipsis>{demande?.localite?.description}</Text>
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="Prix">{formatPrice(demande?.localite?.prix)}</Descriptions.Item>

                                                    <Descriptions.Item label="Coordonnées">
                                                        <Space>
                                                            {formatCoordinates(demande.localite.latitude, demande.localite.longitude)}
                                                            <Tooltip title="Voir sur la carte">
                                                                <Button
                                                                    type="text"
                                                                    icon={<EnvironmentOutlined />}
                                                                    onClick={() => setIsMapModalVisible(!isMapModalVisible)}
                                                                />
                                                            </Tooltip>
                                                        </Space>
                                                    </Descriptions.Item>


                                                </Descriptions>


                                            </Card>
                                        </Col>

                                        {/* Specifications */}
                                        <Col xs={24} md={12} lg={6}>
                                            <Card
                                                title={
                                                    <span>
                                                        <AreaChartOutlined /> Spécifications
                                                    </span>
                                                }
                                                size="small"
                                                bordered={false}
                                                style={{ height: "100%" }}
                                            >
                                                <Descriptions column={1} size="small">
                                                    <Descriptions.Item label="Superficie souhaitée">{demande?.superficie} m²</Descriptions.Item>
                                                    <Descriptions.Item label="Usage prévu">{demande?.usagePrevu}</Descriptions.Item>
                                                    <Descriptions.Item label="Possède autre terrain">
                                                        {demande?.possedeAutreTerrain ? "Oui" : "Non"}
                                                    </Descriptions.Item>
                                                </Descriptions>
                                            </Card>
                                        </Col>
                                    </Row>

                                    <Divider orientation="left">Formulaire de confirmation</Divider>

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
                                        <Row gutter={16}>
                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="document.reference"
                                                    label="Référence"
                                                    rules={[{ required: true, message: "Veuillez saisir la référence" }]}
                                                >
                                                    <Input
                                                        placeholder="Référence du document"
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
                                                    rules={[{ required: true, message: "Veuillez sélectionner la date de délivrance" }]}
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
                                                    rules={[{ required: true, message: "Veuillez saisir le lieu de signature" }]}
                                                >
                                                    <Input
                                                        placeholder="Lieu de signature"
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
                                                    label="Parcelle"
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
                                                        placeholder="Référence cadastrale"
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

                                        <Row gutter={16}>
                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    name="beneficiaire.cni.numero"
                                                    label="Numéro D'identification National"
                                                    rules={[
                                                        { required: true, message: "Veuillez saisir le Numéro d'Identification National" },
                                                        {
                                                            max: 13,
                                                            min: 13,
                                                            message: "Le Numéro d'Identification National doit contenir 13 chiffres",
                                                            pattern: /^[0-9]{13}$/,
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        placeholder="Ex: 1 548 1988 06765"
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
                                                    label="Date délivrance CNI"
                                                    rules={[{ required: true, message: "Veuillez sélectionner la date de délivrance CNI" }]}
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
                                                    label="Lieu délivrance CNI"
                                                    rules={[{ required: true, message: "Veuillez saisir le lieu de délivrance CNI" }]}
                                                >
                                                    <Input
                                                        placeholder="Lieu de délivrance"
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

                                        {demande?.typeDemande === "PROPOSITION_BAIL" && (
                                            <Row gutter={16}>
                                                <Col xs={24} md={8}>
                                                    <Form.Item
                                                        name="propositionBail.typeBail"
                                                        label="Type de bail"
                                                        rules={[{ required: true, message: "Veuillez sélectionner le type de bail" }]}
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
                                                            <Option value="">Sélectionner le type</Option>
                                                            <Option value="COMMERCIAL">Commercial</Option>
                                                            <Option value="HABITATION">Habitation</Option>
                                                        </Select>
                                                    </Form.Item>
                                                </Col>

                                                <Col xs={24} md={8}>
                                                    <Form.Item
                                                        name="propositionBail.duree"
                                                        label="Durée (années)"
                                                        rules={[{ required: true, message: "Veuillez saisir la durée" }]}
                                                    >
                                                        <Input
                                                            type="number"
                                                            placeholder="Durée en années"
                                                            onChange={(e) =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    propositionBail: { ...prev.propositionBail, duree: e.target.value },
                                                                }))
                                                            }
                                                            value={formData.propositionBail?.duree}
                                                        />
                                                    </Form.Item>
                                                </Col>

                                                <Col xs={24} md={8}>
                                                    <Form.Item
                                                        name="propositionBail.montantLocation"
                                                        label="Montant location"
                                                        rules={[{ required: true, message: "Veuillez saisir le montant de location" }]}
                                                    >
                                                        <Input
                                                            type="number"
                                                            placeholder="Montant en FCFA"
                                                            onChange={(e) =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    propositionBail: { ...prev.propositionBail, montantLocation: e.target.value },
                                                                }))
                                                            }
                                                            value={formData.propositionBail?.montantLocation}
                                                            suffix="FCFA"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        )}

                                        {demande?.typeDemande === "BAIL_COMMUNAL" && (
                                            <Row gutter={16}>
                                                <Col xs={24} md={8}>
                                                    <Form.Item
                                                        name="montantLocation"
                                                        label="Montant location"
                                                        rules={[{ required: true, message: "Veuillez saisir le montant de location" }]}
                                                    >
                                                        <Input
                                                            type="number"
                                                            placeholder="Montant en FCFA"
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
                                                        label="Date début"
                                                        rules={[{ required: true, message: "Veuillez sélectionner la date de début" }]}
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
                                                        label="Date fin"
                                                        rules={[{ required: true, message: "Veuillez sélectionner la date de fin" }]}
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
                                        )}

                                        {demande?.typeDemande === "PERMIS_OCCUPATION" && (
                                            <Row gutter={16}>
                                                <Col xs={24} md={12}>
                                                    <Form.Item
                                                        name="dureeValidite"
                                                        label="Durée de validité"
                                                        rules={[{ required: true, message: "Veuillez saisir la durée de validité" }]}
                                                    >
                                                        <Input
                                                            type="number"
                                                            placeholder="En années"
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
                                                        label="Usage prévu"
                                                        rules={[{ required: true, message: "Veuillez sélectionner l'usage prévu" }]}
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
                                                            <Option value="">Sélectionner l'usage</Option>
                                                            <Option value="HABITATION">Habitation</Option>
                                                            <Option value="COMMERCIAL">Commercial</Option>
                                                            <Option value="MIXTE">Mixte</Option>
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        )}

                                        <Form.Item>
                                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
                                                <Button onClick={() => navigate(-1)}>Annuler</Button>
                                                <Button className="text-primary" htmlType="submit" loading={isSubmitting} icon={<SaveOutlined />}>
                                                    Générer le document
                                                </Button>
                                            </div>
                                        </Form.Item>
                                    </Form>
                                </Card>
                            </Content>
                        </div>
                    </div>
                </div>
            </section >


            <Modal
                title="Carte de la Localité"
                open={isMapModalVisible}
                onCancel={() => setIsMapModalVisible(false)}
                width={800}
                footer={null}
            >
                <MapCar
                    latitude={demande.localite.latitude}
                    longitude={demande.localite.longitude}
                />
            </Modal>

            {/* Document viewer modal */}
            <Modal Modal
                title={`Document ${viewType === "recto" ? "Recto" : "Verso"}`
                }
                open={isViewerOpen}
                onCancel={closeViewer}
                footer={null}
                width="80%"
                style={{ top: 20 }}
                bodyStyle={{ padding: "12px", height: "70vh" }}
            >
                {
                    fileLoading ? (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }} >
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} tip="Chargement du document..." />
                        </div >
                    ) : activeDocument ? (

                        <iframe
                            src={`data:application/pdf;base64,${activeDocument}`}
                            width="100%"
                            height="100%"
                            title="Document PDF"
                            className="border rounded"
                            style={{ border: "none" }}
                        />
                    ) : (
                        <Empty description="Document non disponible" />
                    )}
            </Modal >
        </>
    )
}

export default AdminDemandeConfirmation

