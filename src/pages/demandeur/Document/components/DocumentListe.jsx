
// "use client"

// import { useState, useEffect } from "react"
// import { Table, Input, Card, Tag, Space, Button, Modal, Typography, Descriptions, Empty } from "antd"
// import {
//     SearchOutlined,
//     FileTextOutlined,
//     FileExcelOutlined,
//     FilePdfOutlined,
//     DownloadOutlined,
//     FileOutlined,
// } from "@ant-design/icons"
// import { getDocumentDemandeur } from "@/services/documentService"
// import { useAuthContext } from "@/context"
// import { exportToCSV, exportToPDF } from "@/utils/export_function"

// const { Title } = Typography

// const DocumentListe = () => {
//     const { user } = useAuthContext()
//     const [documents, setDocuments] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState(null)
//     const [searchText, setSearchText] = useState("")
//     const [selectedDocument, setSelectedDocument] = useState(null)
//     const [modalVisible, setModalVisible] = useState(false)

//     useEffect(() => {
//         const fetchDocuments = async () => {
//             try {
//                 const res = await getDocumentDemandeur(user.id)
//                 console.log(res)
//                 if (res.error) {
//                     throw new Error(res.error)
//                 }
//                 setDocuments(res)
//             } catch (err) {
//                 setError(err.message)
//             } finally {
//                 setLoading(false)
//             }
//         }
//         fetchDocuments()
//     }, [user.id])

//     if (error) {
//         return <div className="flex justify-center items-center h-screen text-red-600">Erreur: {error}</div>
//     }

//     const columns = [
//         {
//             title: "Numéro",
//             key: "numero",
//             render: (_, record) =>
//                 record.type === "PERMIS_OCCUPATION"
//                     ? record.contenu.numeroPermis
//                     : record.type === "PROPOSITION_BAIL"
//                         ? record.contenu.numeroProposition
//                         : record.contenu.numeroBail,
//         },
//         {
//             title: "Type",
//             dataIndex: "type",
//             key: "type",
//             render: (type) => (
//                 <Tag color={type === "PERMIS_OCCUPATION" ? "success" : "processing"}>
//                     {type === "PERMIS_OCCUPATION"
//                         ? "Permis d'occuper"
//                         : type === "PROPOSITION_BAIL"
//                             ? "Proposition de bail"
//                             : "Bail communal"}
//                 </Tag>
//             ),
//             filters: [
//                 { text: "Bail communal", value: "BAIL_COMMUNAL" },
//                 { text: "Permis d'occuper", value: "PERMIS_OCCUPATION" },
//                 { text: "Proposition de bail", value: "PROPOSITION_BAIL" },
//             ],
//             onFilter: (value, record) => record.type === value,
//         },
//         {
//             title: "Date de création",
//             dataIndex: "dateCreation",
//             key: "dateCreation",
//             render: (date) =>
//                 new Date(date).toLocaleDateString("fr-FR", {
//                     day: "2-digit",
//                     month: "2-digit",
//                     year: "numeric",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                 }),
//             sorter: (a, b) => new Date(a.dateCreation) - new Date(b.dateCreation),
//         },
//         {
//             title: "Localité",
//             key: "localite",
//             render: (_, record) => record.demande.localite.nom,
//             filteredValue: [searchText],
//             onFilter: (value, record) => {
//                 return (
//                     record.demande.localite.nom.toLowerCase().includes(value.toLowerCase()) ||
//                     (record.type === "PERMIS_OCCUPATION" ? record.contenu.numeroPermis : record.contenu.numeroBail)
//                         .toString()
//                         .toLowerCase()
//                         .includes(value.toLowerCase())
//                 )
//             },
//         },
//         {
//             title: "Superficie",
//             key: "superficie",
//             render: (_, record) => `${record.contenu.superficie} m²`,
//             sorter: (a, b) => a.contenu.superficie - b.contenu.superficie,
//         },
//         {
//             title: "Document généré",
//             key: "is_generated",
//             render: (_, record) => (
//                 <Tag color={record.is_generated ? "success" : "default"}>{record.is_generated ? "Oui" : "Non"}</Tag>
//             ),
//             filters: [
//                 { text: "Généré", value: true },
//                 { text: "Non généré", value: false },
//             ],
//             onFilter: (value, record) => record.is_generated === value,
//         },
//         {
//             title: "Actions",
//             key: "actions",
//             render: (_, record) => (
//                 <Space>
//                     <Button
//                         className="text-primary"
//                         icon={<FileTextOutlined />}
//                         onClick={() => {
//                             setSelectedDocument(record)
//                             setModalVisible(true)
//                         }}
//                     >
//                         Détails
//                     </Button>
//                     {record.is_generated && record.fichier && (
//                         <Button type="primary" icon={<DownloadOutlined />} onClick={() => handleDownload(record.fichier)}>
//                             Télécharger
//                         </Button>
//                     )}
//                 </Space>
//             ),
//         },
//     ]

//     const handleDownload = (fichier) => {
//         // Logique pour télécharger le fichier
//         console.log("Téléchargement du fichier:", fichier)
//         // Exemple: window.open(fichier.url, '_blank')
//     }

//     return (
//         <Card className="shadow-lg rounded-lg">
//             <div className="flex items-center justify-between mb-4">
//                 <Title level={4}>Liste des Documents</Title>
//                 <Space>
//                     <Button icon={<FileExcelOutlined />} onClick={() => exportToCSV(documents)}>
//                         Exporter CSV
//                     </Button>
//                     <Button className="text-primary" icon={<FilePdfOutlined />} onClick={() => exportToPDF(documents)}>
//                         Exporter PDF
//                     </Button>
//                 </Space>
//             </div>

//             <div className="mb-4">
//                 <Input
//                     placeholder="Rechercher par numéro ou localité..."
//                     prefix={<SearchOutlined />}
//                     onChange={(e) => setSearchText(e.target.value)}
//                     className="w-full max-w-md"
//                 />
//             </div>

//             <Table
//                 columns={columns}
//                 dataSource={documents}
//                 rowKey="id"
//                 loading={loading}
//                 pagination={{
//                     defaultPageSize: 5,
//                     showSizeChanger: true,
//                     showTotal: (total) => `Total ${total} documents`,
//                 }}
//             />

//             <Modal
//                 title={
//                     selectedDocument?.type === "PERMIS_OCCUPATION"
//                         ? "Détails du Permis d'occuper"
//                         : selectedDocument?.type === "PROPOSITION_BAIL"
//                             ? "Détails de la Proposition de bail"
//                             : "Détails du Bail communal"
//                 }
//                 open={modalVisible}
//                 onCancel={() => setModalVisible(false)}
//                 footer={[
//                     <Button key="close" onClick={() => setModalVisible(false)}>
//                         Fermer
//                     </Button>,
//                     selectedDocument?.is_generated && selectedDocument?.fichier && (
//                         <Button
//                             key="download"
//                             type="primary"
//                             icon={<DownloadOutlined />}
//                             onClick={() => handleDownload(selectedDocument.fichier)}
//                         >
//                             Télécharger le document
//                         </Button>
//                     ),
//                 ]}
//                 width={800}
//             >
//                 {selectedDocument && (
//                     <div className="space-y-6">
//                         <Descriptions title="Informations générales" bordered column={2}>
//                             <Descriptions.Item label="Numéro">
//                                 {selectedDocument.type === "PERMIS_OCCUPATION"
//                                     ? selectedDocument.contenu.numeroPermis
//                                     : selectedDocument.type === "PROPOSITION_BAIL"
//                                         ? selectedDocument.contenu.numeroProposition
//                                         : selectedDocument.contenu.numeroBail}
//                             </Descriptions.Item>
//                             <Descriptions.Item label="Type">
//                                 <Tag
//                                     color={
//                                         selectedDocument.type === "PERMIS_OCCUPATION"
//                                             ? "success"
//                                             : selectedDocument.type === "PROPOSITION_BAIL"
//                                                 ? "warning"
//                                                 : "processing"
//                                     }
//                                 >
//                                     {selectedDocument.type === "PERMIS_OCCUPATION"
//                                         ? "Permis d'occuper"
//                                         : selectedDocument.type === "PROPOSITION_BAIL"
//                                             ? "Proposition de bail"
//                                             : "Bail communal"}
//                                 </Tag>
//                             </Descriptions.Item>
//                             <Descriptions.Item label="Date de création">
//                                 {new Date(selectedDocument.dateCreation).toLocaleDateString("fr-FR", {
//                                     day: "2-digit",
//                                     month: "2-digit",
//                                     year: "numeric",
//                                     hour: "2-digit",
//                                     minute: "2-digit",
//                                 })}
//                             </Descriptions.Item>
//                             <Descriptions.Item label="Superficie">{selectedDocument.contenu.superficie} m²</Descriptions.Item>
//                             <Descriptions.Item label="Usage prévu" span={2}>
//                                 {selectedDocument.contenu.usagePrevu}
//                             </Descriptions.Item>
//                             <Descriptions.Item label="Document généré">
//                                 <Tag color={selectedDocument.is_generated ? "success" : "default"}>
//                                     {selectedDocument.is_generated ? "Oui" : "Non"}
//                                 </Tag>
//                             </Descriptions.Item>
//                         </Descriptions>

//                         <Descriptions title="Détails du document" bordered column={2}>
//                             {selectedDocument.type === "PERMIS_OCCUPATION" && (
//                                 <>
//                                     <Descriptions.Item label="Date de délivrance">
//                                         {selectedDocument.contenu.dateDelivrance}
//                                     </Descriptions.Item>
//                                     <Descriptions.Item label="Durée de validité">
//                                         {selectedDocument.contenu.dureeValidite}
//                                     </Descriptions.Item>
//                                 </>
//                             )}
//                             {selectedDocument.type === "BAIL_COMMUNAL" && (
//                                 <>
//                                     <Descriptions.Item label="Date de début">{selectedDocument.contenu.dateDebut}</Descriptions.Item>
//                                     <Descriptions.Item label="Durée">{selectedDocument.contenu.duree}</Descriptions.Item>
//                                 </>
//                             )}
//                             {selectedDocument.type === "PROPOSITION_BAIL" && (
//                                 <>
//                                     <Descriptions.Item label="Date de proposition">
//                                         {selectedDocument.contenu.dateProposition}
//                                     </Descriptions.Item>
//                                     <Descriptions.Item label="Durée proposée">{selectedDocument.contenu.dureeProposee}</Descriptions.Item>
//                                 </>
//                             )}
//                             <Descriptions.Item label="Localité (document)">{selectedDocument.contenu.localite}</Descriptions.Item>
//                         </Descriptions>

//                         <Descriptions title="Informations de la demande" bordered column={2}>
//                             <Descriptions.Item label="ID de la demande">{selectedDocument.demande.id}</Descriptions.Item>
//                             <Descriptions.Item label="Type de demande">{selectedDocument.demande.typeDemande}</Descriptions.Item>
//                             <Descriptions.Item label="Statut">
//                                 <Tag
//                                     color={
//                                         selectedDocument.demande.statut === "VALIDE"
//                                             ? "success"
//                                             : selectedDocument.demande.statut === "REJETE"
//                                                 ? "error"
//                                                 : "processing"
//                                     }
//                                 >
//                                     {selectedDocument.demande.statut}
//                                 </Tag>
//                             </Descriptions.Item>
//                             <Descriptions.Item label="Date de création">
//                                 {new Date(selectedDocument.demande.dateCreation).toLocaleDateString("fr-FR", {
//                                     day: "2-digit",
//                                     month: "2-digit",
//                                     year: "numeric",
//                                     hour: "2-digit",
//                                     minute: "2-digit",
//                                 })}
//                             </Descriptions.Item>
//                             <Descriptions.Item label="Superficie demandée">
//                                 {selectedDocument.demande.superficie} m²
//                             </Descriptions.Item>
//                             <Descriptions.Item label="Usage prévu">{selectedDocument.demande.usagePrevu}</Descriptions.Item>
//                         </Descriptions>

//                         <Descriptions title="Informations de la localité" bordered column={2}>
//                             <Descriptions.Item label="ID de la localité">{selectedDocument.demande.localite.id}</Descriptions.Item>
//                             <Descriptions.Item label="Nom">{selectedDocument.demande.localite.nom}</Descriptions.Item>
//                             <Descriptions.Item label="Prix">
//                                 {selectedDocument.demande.localite.prix.toLocaleString("fr-FR")} FCFA
//                             </Descriptions.Item>
//                             <Descriptions.Item label="Description">{selectedDocument.demande.localite.description}</Descriptions.Item>
//                             <Descriptions.Item label="Coordonnées">
//                                 Lat: {selectedDocument.demande.localite.latitude}, Long: {selectedDocument.demande.localite.longitude}
//                             </Descriptions.Item>
//                         </Descriptions>

//                         {selectedDocument.is_generated ? (
//                             <div className="border p-4 rounded-lg">
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex items-center gap-2">
//                                         <FileOutlined />
//                                         <span>Document généré</span>
//                                     </div>
//                                     {selectedDocument.fichier ? (
//                                         <Button
//                                             type="primary"
//                                             icon={<DownloadOutlined />}
//                                             onClick={() => handleDownload(selectedDocument.fichier)}
//                                         >
//                                             Télécharger
//                                         </Button>
//                                     ) : (
//                                         <Tag color="warning">Fichier non disponible</Tag>
//                                     )}
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="border p-4 rounded-lg">
//                                 <Empty description="Document non généré" image={Empty.PRESENTED_IMAGE_SIMPLE} />
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </Modal>
//         </Card>
//     )
// }

// export default DocumentListe
"use client"

import { useState, useEffect } from "react"
import { Table, Input, Card, Tag, Space, Button, Modal, Typography, Descriptions, Empty, Spin } from "antd"
import {
    SearchOutlined,
    FileTextOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    DownloadOutlined,
    FileOutlined,
    EyeOutlined,
} from "@ant-design/icons"
import { getDocumentDemandeur, getFileDocument } from "@/services/documentService"
import { useAuthContext } from "@/context"
import { exportToCSV, exportToPDF } from "@/utils/export_function"

const { Title } = Typography

const DocumentListe = () => {
    const { user } = useAuthContext()
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchText, setSearchText] = useState("")
    const [selectedDocument, setSelectedDocument] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [fileContent, setFileContent] = useState(null)
    const [fileLoading, setFileLoading] = useState(false)
    const [viewerVisible, setViewerVisible] = useState(false)

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const res = await getDocumentDemandeur(user.id)
                console.log(res)
                if (res.error) {
                    throw new Error(res.error)
                }
                setDocuments(res)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchDocuments()
    }, [user.id])

    const fetchFileContent = async (documentId) => {
        setFileLoading(true)
        try {
            const fileData = await getFileDocument(documentId)
            setFileContent(fileData)
            setViewerVisible(true)
        } catch (err) {
            console.error("Erreur lors de la récupération du fichier:", err)
        } finally {
            setFileLoading(false)
        }
    }

    const handleDownload = (documentId) => {
        fetchFileContent(documentId)
            .then(() => {
                if (fileContent) {
                    // Créer un lien de téléchargement pour le fichier base64
                    const linkSource = `data:application/pdf;base64,${fileContent.base64}`
                    const downloadLink = document.createElement("a")
                    const fileName = `document-${documentId}.pdf`

                    downloadLink.href = linkSource
                    downloadLink.download = fileName
                    downloadLink.click()
                }
            })
            .catch((err) => console.error("Erreur lors du téléchargement:", err))
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-600">Erreur: {error}</div>
    }

    const columns = [
        {
            title: "Numéro",
            key: "numero",
            render: (_, record) =>
                record.type === "PERMIS_OCCUPATION"
                    ? record.contenu.numeroPermis
                    : record.type === "PROPOSITION_BAIL"
                        ? record.contenu.numeroProposition
                        : record.contenu.numeroBail,
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => (
                <Tag color={type === "PERMIS_OCCUPATION" ? "success" : "processing"}>
                    {type === "PERMIS_OCCUPATION"
                        ? "Permis d'occuper"
                        : type === "PROPOSITION_BAIL"
                            ? "Proposition de bail"
                            : "Bail communal"}
                </Tag>
            ),
            filters: [
                { text: "Bail communal", value: "BAIL_COMMUNAL" },
                { text: "Permis d'occuper", value: "PERMIS_OCCUPATION" },
                { text: "Proposition de bail", value: "PROPOSITION_BAIL" },
            ],
            onFilter: (value, record) => record.type === value,
        },
        {
            title: "Date de création",
            dataIndex: "dateCreation",
            key: "dateCreation",
            render: (date) =>
                new Date(date).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            sorter: (a, b) => new Date(a.dateCreation) - new Date(b.dateCreation),
        },
        {
            title: "Localité",
            key: "localite",
            render: (_, record) => record.demande.localite.nom,
            filteredValue: [searchText],
            onFilter: (value, record) => {
                return (
                    record.demande.localite.nom.toLowerCase().includes(value.toLowerCase()) ||
                    (record.type === "PERMIS_OCCUPATION" ? record.contenu.numeroPermis : record.contenu.numeroBail)
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase())
                )
            },
        },
        {
            title: "Superficie",
            key: "superficie",
            render: (_, record) => `${record.contenu.superficie} m²`,
            sorter: (a, b) => a.contenu.superficie - b.contenu.superficie,
        },
        {
            title: "Document généré",
            key: "is_generated",
            render: (_, record) => (
                <Tag color={record.is_generated ? "success" : "default"}>{record.is_generated ? "Oui" : "Non"}</Tag>
            ),
            filters: [
                { text: "Généré", value: true },
                { text: "Non généré", value: false },
            ],
            onFilter: (value, record) => record.is_generated === value,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        className="text-primary"
                        icon={<FileTextOutlined />}
                        onClick={() => {
                            setSelectedDocument(record)
                            setModalVisible(true)
                        }}
                    >
                        Détails
                    </Button>
                    {record.is_generated && record.fichier && (
                        <>

                            <Button type="default" icon={<EyeOutlined />} onClick={() => fetchFileContent(record.id)}>
                                Visualiser
                            </Button>
                        </>
                    )}
                </Space>
            ),
        },
    ]

    return (
        <Card className="shadow-lg rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <Title level={4}>Liste des Documents</Title>
                <Space>
                    <Button icon={<FileExcelOutlined />} onClick={() => exportToCSV(documents)}>
                        Exporter CSV
                    </Button>
                    <Button className="text-primary" icon={<FilePdfOutlined />} onClick={() => exportToPDF(documents)}>
                        Exporter PDF
                    </Button>
                </Space>
            </div>

            <div className="mb-4">
                <Input
                    placeholder="Rechercher par numéro ou localité..."
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full max-w-md"
                />
            </div>

            <Table
                columns={columns}
                dataSource={documents}
                rowKey="id"
                loading={loading}
                pagination={{
                    defaultPageSize: 5,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} documents`,
                }}
            />

            <Modal
                title={
                    selectedDocument?.type === "PERMIS_OCCUPATION"
                        ? "Détails du Permis d'occuper"
                        : selectedDocument?.type === "PROPOSITION_BAIL"
                            ? "Détails de la Proposition de bail"
                            : "Détails du Bail communal"
                }
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setModalVisible(false)}>
                        Fermer
                    </Button>,
                ]}
                width={800}
            >
                {selectedDocument && (
                    <div className="space-y-6">
                        <Descriptions title="Informations générales" bordered column={2}>
                            <Descriptions.Item label="Numéro">
                                {selectedDocument.type === "PERMIS_OCCUPATION"
                                    ? selectedDocument.contenu.numeroPermis
                                    : selectedDocument.type === "PROPOSITION_BAIL"
                                        ? selectedDocument.contenu.numeroProposition
                                        : selectedDocument.contenu.numeroBail}
                            </Descriptions.Item>
                            <Descriptions.Item label="Type">
                                <Tag
                                    color={
                                        selectedDocument.type === "PERMIS_OCCUPATION"
                                            ? "success"
                                            : selectedDocument.type === "PROPOSITION_BAIL"
                                                ? "warning"
                                                : "processing"
                                    }
                                >
                                    {selectedDocument.type === "PERMIS_OCCUPATION"
                                        ? "Permis d'occuper"
                                        : selectedDocument.type === "PROPOSITION_BAIL"
                                            ? "Proposition de bail"
                                            : "Bail communal"}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Date de création">
                                {new Date(selectedDocument.dateCreation).toLocaleDateString("fr-FR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Descriptions.Item>
                            <Descriptions.Item label="Superficie">{selectedDocument.contenu.superficie} m²</Descriptions.Item>
                            <Descriptions.Item label="Usage prévu" span={2}>
                                {selectedDocument.contenu.usagePrevu}
                            </Descriptions.Item>
                            <Descriptions.Item label="Document généré">
                                <Tag color={selectedDocument.is_generated ? "success" : "default"}>
                                    {selectedDocument.is_generated ? "Oui" : "Non"}
                                </Tag>
                            </Descriptions.Item>
                        </Descriptions>

                        <Descriptions title="Détails du document" bordered column={2}>
                            {selectedDocument.type === "PERMIS_OCCUPATION" && (
                                <>
                                    <Descriptions.Item label="Date de délivrance">
                                        {selectedDocument.contenu.dateDelivrance}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Durée de validité">
                                        {selectedDocument.contenu.dureeValidite}
                                    </Descriptions.Item>
                                </>
                            )}
                            {selectedDocument.type === "BAIL_COMMUNAL" && (
                                <>
                                    <Descriptions.Item label="Date de début">{selectedDocument.contenu.dateDebut}</Descriptions.Item>
                                    <Descriptions.Item label="Durée">{selectedDocument.contenu.duree}</Descriptions.Item>
                                </>
                            )}
                            {selectedDocument.type === "PROPOSITION_BAIL" && (
                                <>
                                    <Descriptions.Item label="Date de proposition">
                                        {selectedDocument.contenu.dateProposition}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Durée proposée">{selectedDocument.contenu.dureeProposee}</Descriptions.Item>
                                </>
                            )}
                            <Descriptions.Item label="Localité (document)">{selectedDocument.contenu.localite}</Descriptions.Item>
                        </Descriptions>

                        <Descriptions title="Informations de la demande" bordered column={2}>
                            <Descriptions.Item label="ID de la demande">{selectedDocument.demande.id}</Descriptions.Item>
                            <Descriptions.Item label="Type de demande">{selectedDocument.demande.typeDemande}</Descriptions.Item>
                            <Descriptions.Item label="Statut">
                                <Tag
                                    color={
                                        selectedDocument.demande.statut === "VALIDE"
                                            ? "success"
                                            : selectedDocument.demande.statut === "REJETE"
                                                ? "error"
                                                : "processing"
                                    }
                                >
                                    {selectedDocument.demande.statut}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Date de création">
                                {new Date(selectedDocument.demande.dateCreation).toLocaleDateString("fr-FR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Descriptions.Item>
                            <Descriptions.Item label="Superficie demandée">
                                {selectedDocument.demande.superficie} m²
                            </Descriptions.Item>
                            <Descriptions.Item label="Usage prévu">{selectedDocument.demande.usagePrevu}</Descriptions.Item>
                        </Descriptions>

                        <Descriptions title="Informations de la localité" bordered column={2}>
                            <Descriptions.Item label="ID de la localité">{selectedDocument.demande.localite.id}</Descriptions.Item>
                            <Descriptions.Item label="Nom">{selectedDocument.demande.localite.nom}</Descriptions.Item>
                            <Descriptions.Item label="Prix">
                                {selectedDocument.demande.localite.prix.toLocaleString("fr-FR")} FCFA
                            </Descriptions.Item>
                            <Descriptions.Item label="Description">{selectedDocument.demande.localite.description}</Descriptions.Item>
                            <Descriptions.Item label="Coordonnées">
                                Lat: {selectedDocument.demande.localite.latitude}, Long: {selectedDocument.demande.localite.longitude}
                            </Descriptions.Item>
                        </Descriptions>

                        {selectedDocument.is_generated ? (
                            <div className="border p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileOutlined />
                                        <span>Document généré</span>
                                    </div>
                                    {selectedDocument.fichier ? (
                                        <Space>

                                            <Button
                                                key="download"
                                                className="text-primary"
                                                icon={<DownloadOutlined />}
                                                onClick={() => handleDownload(selectedDocument.id)}
                                            >
                                                Télécharger
                                            </Button>

                                            <Button
                                                type="default"
                                                className="text-primary"
                                                icon={<EyeOutlined />}
                                                onClick={() => fetchFileContent(selectedDocument.id)}
                                            >
                                                Visualiser
                                            </Button>
                                        </Space>
                                    ) : (
                                        <Tag color="warning">Fichier non disponible</Tag>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="border p-4 rounded-lg">
                                <Empty description="Document non généré" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Modal pour afficher le PDF */}
            <Modal
                title="Visualisation du document"
                open={viewerVisible}
                onCancel={() => setViewerVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setViewerVisible(false)}>
                        Fermer
                    </Button>,
                    <Button
                        key="download"
                        className="text-primary"
                        icon={<DownloadOutlined />}
                        onClick={() => handleDownload(selectedDocument?.id)}
                    >
                        Télécharger
                    </Button>,
                ]}
                width={1000}
                bodyStyle={{ height: "80vh" }}
            >
                {fileLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Spin size="large" tip="Chargement du document..." />
                    </div>
                ) : fileContent ? (
                    <iframe
                        src={`data:application/pdf;base64,${fileContent.base64}`}
                        width="100%"
                        height="100%"
                        style={{ border: "none" }}
                        title="Document PDF"
                    />
                ) : (
                    <Empty description="Impossible de charger le document" />
                )}
            </Modal>
        </Card>
    )
}

export default DocumentListe
