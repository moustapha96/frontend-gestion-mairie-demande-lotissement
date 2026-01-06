import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Table, Card, Space, Button, Typography, Input, Tag, message, Result, Select } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, EyeOutlined, FileOutlined } from "@ant-design/icons";
import { AdminBreadcrumb } from "@/components";
import { useAuthContext } from "@/context";
import { getLocaliteDetails, getLocaliteLotissement } from "@/services/localiteService";
import { updateLotissementStatut } from "@/services/lotissementService";
import { cn } from "@/utils";

const { Title } = Typography;

const AdminLocaliteLotissement = () => {
    const { id } = useParams();
    const { user } = useAuthContext();
    const [lotissements, setLotissements] = useState([]);
    const [localite, setLocalite] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [lotissementsData, localiteData] = await Promise.all([
                getLocaliteLotissement(id),
                getLocaliteDetails(id)
            ]);
            setLotissements(lotissementsData);
            setLocalite(localiteData);
        } catch (err) {
            setError(err.message);
            message.error("Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    const handleFileView = (filePath) => {
        window.open(filePath, "_blank");
    };

    const handleUpdateStatut = async (lotissementId, nouveauStatut) => {
        try {
            await updateLotissementStatut(lotissementId, nouveauStatut);
            const updatedLotissements = lotissements.map(lotissement =>
                lotissement.id === lotissementId
                    ? { ...lotissement, statut: nouveauStatut }
                    : lotissement
            );
            setLotissements(updatedLotissements);
            message.success("Statut mis à jour avec succès");
        } catch (error) {
            message.error("Erreur lors de la mise à jour du statut");
        }
    };

    const getStatusTag = (status) => {
        const statusConfig = {
            'en_cours': { color: 'processing', text: 'En cours' },
            'termine': { color: 'success', text: 'Terminé' },
            'suspendu': { color: 'warning', text: 'Suspendu' },
            'annule': { color: 'error', text: 'Annulé' }
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const columns = [
        {
            title: "Nom",
            dataIndex: "nom",
            key: "nom",
            sorter: (a, b) => a.nom.localeCompare(b.nom)
        },
        {
            title: "Localisation",
            dataIndex: "localisation",
            key: "localisation"
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            ellipsis: true
        },
        {
            title: "Statut",
            dataIndex: "statut",
            key: "statut",
            render: (statut, record) => (
                <Select
                    value={statut}
                    onChange={(value) => handleUpdateStatut(record.id, value)}
                    style={{ width: 120 }}
                    bordered={false}
                >
                    <Select.Option value="en_cours">
                        <Tag color="blue">En cours</Tag>
                    </Select.Option>
                    <Select.Option value="acheve">
                        <Tag color="green">Achevé</Tag>
                    </Select.Option>
                    <Select.Option value="rejete">
                        <Tag color="red">Rejeté</Tag>
                    </Select.Option>
                </Select>
            ),
            filters: [
                { text: 'En cours', value: 'en_cours' },
                { text: 'Achevé', value: 'acheve' },
                { text: 'Rejeté', value: 'rejete' }
            ],
            onFilter: (value, record) => record.statut === value
        },
        {
            title: "Date de Création",
            dataIndex: "dateCreation",
            key: "dateCreation",
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: "Lots",
            key: "lots",
            render: (_, record) => (
                <Link to={`/admin/lotissements/${record.id}/lots`} className="text-primary">
                    {record.lots?.length || 0} Lot(s)
                </Link>
            )
        },
        {
            title: "Plans",
            key: "plans",
            render: (_, record) => (
                <Link to={`/admin/lotissements/${record.id}/plans`} className="text-primary">
                    {record.plans?.length || 0} Plan(s)
                </Link>
            )
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Link to={`/admin/lotissements/${record.id}/details`}>
                        <Button
                            className="text-primary"
                            icon={<EyeOutlined />}
                            title="Détails"
                        >
                            Voir
                        </Button>
                    </Link>
                    <Link to={`/admin/lotissements/${record.id}/modification`}>
                        <Button
                            className="text-primary"
                            icon={<EditOutlined />}
                            title="Modifier"
                        >
                            Modifier
                        </Button>
                    </Link>
                    {record.fichier && (
                        <Button
                            className="text-primary"
                            icon={<FileOutlined />}
                            onClick={() => handleFileView(record.fichier)}
                            title="Voir le fichier"
                        >
                            Fichier
                        </Button>
                    )}
                </Space>
            )
        }
    ];

    if (error) {
        return (
            <Result
                status="error"
                title="Erreur lors du chargement"
                subTitle={error}
            />
        );
    }

    const filteredLotissements = lotissements.filter(lotissement =>
        lotissement.nom.toLowerCase().includes(searchText.toLowerCase()) ||
        lotissement.description.toLowerCase().includes(searchText.toLowerCase())
    );

    return <>
        <AdminBreadcrumb title="Liste de Lotissements" />
        <section>
            <div className="container">
                <div className="my-6 space-y-6">
                    <div className="grid grid-cols-1">

                        <Card className="mt-8">
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-6">
                                    <Space direction="vertical" size={4}>
                                        <Title level={4} className="!mb-0">Lotissements du Quartié</Title>
                                        {localite && (
                                            <Link to={`/admin/quartiers/${id}/details`} className="text-primary text-sm">
                                                Quartier: {localite.nom}
                                            </Link>
                                        )}
                                    </Space>
                                    <Link to="/admin/lotissements/nouveau">
                                        <Button
                                            className="text-primary"
                                            icon={<PlusOutlined />}
                                        >
                                            Ajouter un Lotissement
                                        </Button>
                                    </Link>
                                </div>

                                <Input
                                    placeholder="Rechercher par nom ou description..."
                                    prefix={<SearchOutlined className="text-gray-400" />}
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                    style={{ maxWidth: 300 }}
                                    allowClear
                                    className="mb-4"
                                />

                                <Table
                                    columns={columns}
                                    dataSource={filteredLotissements}
                                    rowKey="id"
                                    loading={loading}
                                    pagination={{
                                        defaultPageSize: 10,
                                        showSizeChanger: true,
                                        showTotal: (total) => `Total ${total} lotissements`,
                                        showQuickJumper: true,
                                        className: "!mt-4"
                                    }}
                                    className="!mt-0"
                                    scroll={{ x: 'max-content' }}
                                />
                            </div>
                        </Card>

                    </div>
                </div>
            </div>
        </section>
    </>
};

export default AdminLocaliteLotissement;
