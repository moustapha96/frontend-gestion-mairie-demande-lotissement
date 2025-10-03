import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Card, Space, Typography, Tag, Button, Modal, Spin, Result, Descriptions, Tooltip } from "antd";
import { EyeOutlined, FileOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { AdminBreadcrumb } from "@/components";
import { getLotissementDetails } from "@/services/lotissementService";
import { getFileDocumentPlan } from "@/services/planLotissement";
import MapCar from "../../Map/MapCar";
import { formatCoordinates, formatPrice } from "@/utils/formatters";

const { Title, Text } = Typography;

export default function AdminLotissementDetails() {
    const { id } = useParams();
    const [lotissement, setLotissement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fileLoading, setFileLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fichier, setFichier] = useState(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        const fetchLotissement = async () => {
            try {
                const data = await getLotissementDetails(id);
                console.log(data);
                setLotissement(data);
                if (data.planLotissements?.length > 0) {
                    const response = await getFileDocumentPlan(data.planLotissements[0].id);
                    setFichier(response);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLotissement();
    }, [id]);

    const handleViewDocument = async (plan) => {
        setFileLoading(true);
        setIsViewerOpen(true);
        try {
            const response = await getFileDocumentPlan(plan.id);
            setFichier(response);
        } catch (error) {
            console.error("Erreur lors de l'ouverture du document:", error);
        } finally {
            setFileLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" tip="Chargement..." />
            </div>
        );
    }

    if (error) {
        return <Result status="error" title="Erreur" subTitle={error} />;
    }

    const statusColors = {
        en_cours: 'processing',
        acheve: 'success',
        rejete: 'error'
    };

    const lotColumns = [
        {
            title: 'Numéro de iLot',
            dataIndex: 'numeroLot',
            key: 'numeroLot',
        },
        {
            title: 'Superficie',
            dataIndex: 'superficie',
            key: 'superficie',
            render: (superficie) => `${superficie} m²`,
        },
        {
            title: 'Coordonnées',
            key: 'coordinates',
            render: (_, record) => formatCoordinates(record.latitude, record.longitude),
        },
        {
            title: 'Statut',
            dataIndex: 'statut',
            key: 'statut',
            render: (statut) => (
                <Tag color={statusColors[statut] || 'default'}>{statut}</Tag>
            ),
        },
        {
            title: 'Prix',
            dataIndex: 'prix',
            key: 'prix',
            render: (prix) => formatPrice(prix),
        },
    ];

    const planColumns = [
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Date de Création',
            dataIndex: 'dateCreation',
            key: 'dateCreation',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Version',
            dataIndex: 'version',
            key: 'version',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (

                <Button className="bg-primary text-white"
                    icon={<FileOutlined />} onClick={() => handleViewDocument(record)}
                    title="Voir les détails">
                    document
                </Button>

            ),
        },
    ];

    return <>

        <AdminBreadcrumb title="Détails du Lotissement" />
        <section>
            <div className="container">
                <div className="my-6 space-y-6">
                    <div className="grid grid-cols-1">

                        <Card className="mt-8">
                            <Title level={4}>Détail du Lotissement</Title>

                            <Descriptions
                                bordered
                                column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
                                className="mt-4"
                            >
                                <Descriptions.Item label="Date de Création">
                                    {new Date(lotissement.dateCreation).toLocaleDateString()}
                                </Descriptions.Item>
                                <Descriptions.Item label="Nom">{lotissement.nom}</Descriptions.Item>
                                <Descriptions.Item label="Localisation">{lotissement.localisation}</Descriptions.Item>
                                <Descriptions.Item label="Statut">
                                    <Tag color={statusColors[lotissement.statut]}>
                                        {lotissement.statut == "en_cours" ? "En cours" : lotissement.statut == "achevé" ? "Achevé" : "Rejeté"}

                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Coordonnées">
                                    <Space>
                                        {formatCoordinates(lotissement.latitude, lotissement.longitude)}
                                        <Tooltip title="Voir sur la carte">
                                            <Button
                                                type="text"
                                                className="bg-primary text-white"
                                                icon={<EnvironmentOutlined />}
                                                onClick={() => setShowMap(!showMap)}
                                            />
                                        </Tooltip>
                                    </Space>
                                </Descriptions.Item>


                            </Descriptions>
                            <Descriptions
                                bordered
                                column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
                                className="mt-4"
                            >

                                <Descriptions.Item label="Déscription">
                                    <Space>
                                        {lotissement.description}

                                    </Space>
                                </Descriptions.Item>
                            </Descriptions>

                            {showMap && (
                                <div className="mt-4">
                                    <MapCar selectedItem={lotissement} type="lotissement" />
                                </div>
                            )}

                            {lotissement.lots?.length > 0 && (
                                <div className="mt-6">
                                    <Title level={5}>Informations des Lots</Title>
                                    <Table
                                        scroll={{ x: 'max-content' }}
                                        columns={lotColumns}
                                        dataSource={lotissement.lots}
                                        rowKey="id"
                                        pagination={false}
                                        className="mt-4"
                                    />
                                </div>
                            )}

                            {lotissement.planLotissements?.length > 0 && (
                                <div className="mt-6">
                                    <Title level={5}>Plans de Lotissement</Title>
                                    <Table
                                        scroll={{ x: 'max-content' }}
                                        columns={planColumns}
                                        dataSource={lotissement.planLotissements}
                                        rowKey="id"
                                        pagination={false}
                                        className="mt-4"
                                    />
                                </div>
                            )}
                        </Card>

                        <Modal
                            open={isViewerOpen}
                            onCancel={() => setIsViewerOpen(false)}
                            width="80%"
                            footer={null}
                            title="Document"
                        >
                            {fileLoading ? (
                                <div className="flex justify-center items-center h-[600px]">
                                    <Spin size="large" tip="Chargement du document..." />
                                </div>
                            ) : fichier ? (
                                <iframe
                                    src={`data:application/pdf;base64,${fichier}`}
                                    width="100%"
                                    height="600px"
                                    title="Document PDF"
                                    className="border rounded"
                                />
                            ) : (
                                <Result
                                    status="warning"
                                    title="Aucun document disponible"
                                    subTitle="Le document n'a pas pu être chargé"
                                />
                            )}
                        </Modal>
                    </div>
                </div>
            </div>
        </section>
    </>

}