import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Typography, Descriptions, Space, Button, Table, Tag, Spin, Result, Modal } from "antd";
import { EyeOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { AdminBreadcrumb } from "@/components";
import { getLocaliteDetails } from "@/services/localiteService";
import MapCar from "../../../admin/Map/MapCar";
import { formatPrice } from "@/utils/formatters";

const { Title } = Typography;

export default function AdminLocaliteDetails() {
    const { id } = useParams();
    const [localite, setLocalite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        const fetchLocalite = async () => {
            try {
                const data = await getLocaliteDetails(id);
                setLocalite(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLocalite();
    }, [id]);

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

    const lotissementColumns = [
        {
            title: 'Nom',
            dataIndex: 'nom',
            key: 'nom',
        },
        {
            title: 'Localisation',
            dataIndex: 'localisation',
            key: 'localisation',
        },
        {
            title: 'Statut',
            dataIndex: 'statut',
            key: 'statut',
            render: (statut) => {
                const statusConfig = {
                    acheve: { color: 'success', text: 'Achevé' },
                    rejete: { color: 'error', text: 'Rejeté' },
                    en_cours: { color: 'processing', text: 'En cours' }
                };
                return (
                    <Tag color={statusConfig[statut]?.color || 'default'}>
                        {statusConfig[statut]?.text || statut}
                    </Tag>
                );
            }
        },
        {
            title: 'Date de Création',
            dataIndex: 'dateCreation',
            key: 'dateCreation',
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Link to={`/admin/lotissements/${record.id}/details`}>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        className="text-primary"
                    >
                        Détails
                    </Button>
                </Link>
            )
        }
    ];

    return (
        <>
            <AdminBreadcrumb title="Détail du Quartié" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="grid grid-cols-1">
                            <Card>
                                <Title level={4}>Détail du Quartié</Title>

                                <Descriptions
                                    bordered
                                    column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                                    className="mt-4"
                                >
                                    <Descriptions.Item label="Nom">{localite.nom}</Descriptions.Item>
                                    <Descriptions.Item label="Description">{localite.description}</Descriptions.Item>
                                    <Descriptions.Item label="Prix">{formatPrice(localite.prix)}</Descriptions.Item>
                                    {localite.longitude && localite.latitude && (
                                        <Descriptions.Item label="Coordonnées">
                                            <Space>
                                                {`${localite.longitude}, ${localite.latitude}`}
                                                <Button
                                                    type="text"
                                                    icon={<EnvironmentOutlined />}
                                                    onClick={() => setShowMap(!showMap)}
                                                    className="text-primary"
                                                />
                                            </Space>
                                        </Descriptions.Item>
                                    )}
                                </Descriptions>

                                {showMap && (
                                    <div className="mt-6">
                                        <Card
                                            title="Carte Interactive"
                                            extra={
                                                <Button type="text" onClick={() => setShowMap(false)}>
                                                    Fermer la carte
                                                </Button>
                                            }
                                        >
                                            <div className="h-[400px] rounded-lg overflow-hidden">
                                                <MapCar selectedItem={localite} type="localite" />
                                            </div>
                                        </Card>
                                    </div>
                                )}

                                {localite.lotissements?.length > 0 && (
                                    <div className="mt-6">
                                        <Title level={5}>Lotissements</Title>
                                        <Table
                                            scroll={{ x: 'max-content' }}
                                            columns={lotissementColumns}
                                            dataSource={localite.lotissements}
                                            rowKey="id"
                                            className="mt-4"
                                            pagination={false}
                                        />
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
