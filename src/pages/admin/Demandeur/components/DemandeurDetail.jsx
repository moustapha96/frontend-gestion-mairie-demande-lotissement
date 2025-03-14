import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AdminBreadcrumb } from "@/components";
import { getDemandeurDetails } from "@/services/userService";
import { UserOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, IdcardOutlined, CalendarOutlined, RightOutlined } from "@ant-design/icons";
import { cn } from "@/utils";
import { formatPhoneNumber } from "@/utils/formatters";
import { Card, Typography, Descriptions, Table, Tag, Skeleton, Result, Space } from "antd";
import { toast } from "sonner";


const { Title, Text } = Typography;

const AdminDemandeurDetails = () => {
    const { id } = useParams();
    const [demandeur, setDemandeur] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDemandeur = async () => {
            try {
                const data = await getDemandeurDetails(id);
                console.log('Demandeur details:', data);
                setDemandeur(data);
            } catch (error) {
                console.error('Error fetching demandeur:', error);
                setError(error.message);
                toast.error("Erreur lors du chargement des détails du demandeur");
            } finally {
                setLoading(false);
            }
        };

        fetchDemandeur();
    }, [id]);

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorDisplay error={error} />;

    const demandesColumns = [
        {
            title: "Type de Demande",
            dataIndex: "typeDemande",
            key: "typeDemande",
        },
        {
            title: "Superficie",
            dataIndex: "superficie",
            key: "superficie",
            render: (superficie) => `${superficie} m²`,
        },
        {
            title: "Usage Prévu",
            dataIndex: "usagePrevu",
            key: "usagePrevu",
        },
        {
            title: "Statut",
            dataIndex: "statut",
            key: "statut",
            render: (statut) => (
                <Tag
                    className={cn({
                        'bg-yellow-200 border-yellow-200': statut === 'EN_COURS',
                        'bg-yellow-100 text-yellow-800 border-yellow-500': statut === 'EN_TRAITEMENT',
                        'bg-green-100 text-green-800 border-green-500': statut === 'VALIDE',
                        'bg-red-100 text-red-800 border-red-500': statut === 'REJETE'
                    })}
                >
                    {statut}
                </Tag>
            ),
        },
        {
            title: "Date de Création",
            dataIndex: "dateCreation",
            key: "dateCreation",
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Link to={`/admin/demandes/${record.id}/details`}>
                    <Space>
                        Détails
                        <RightOutlined />
                    </Space>
                </Link>
            ),
        },
    ];

    return (
        <>
            <AdminBreadcrumb title="Détails Demandeur" SubTitle={`${demandeur?.prenom} ${demandeur?.nom}`} />
            <div className="container my-6">
                <Card className="shadow-lg">
                    <Title level={3}>{`${demandeur.prenom} ${demandeur.nom}`}</Title>
                    
                    <div className="grid gap-8 md:grid-cols-2 mt-6">
                        <Card title="Informations Personnelles" className="bg-gray-50">
                            <Descriptions column={1}>
                                <Descriptions.Item label={<Space><CalendarOutlined /> Date de Naissance</Space>}>
                                    {new Date(demandeur.dateNaissance).toLocaleDateString()}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Space><EnvironmentOutlined /> Lieu de Naissance</Space>}>
                                    {demandeur.lieuNaissance}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Space><IdcardOutlined /> Numéro Électeur</Space>}>
                                    {demandeur.numeroElecteur}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Space><EnvironmentOutlined /> Habitant</Space>}>
                                    <Tag color={demandeur?.isHabitant ? 'success' : 'error'} className="px-4 py-1 text-sm font-medium">
                                        {demandeur?.isHabitant ? 'Oui' : 'Non'}
                                    </Tag>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        <Card title="Contact" className="bg-gray-50">
                            <Descriptions column={1}>
                                <Descriptions.Item label={<Space><PhoneOutlined /> Téléphone</Space>}>
                                    {formatPhoneNumber(demandeur.telephone)}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Space><MailOutlined /> Email</Space>}>
                                    {demandeur.email}
                                </Descriptions.Item>
                                <Descriptions.Item label={<Space><EnvironmentOutlined /> Adresse</Space>}>
                                    {demandeur.adresse}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </div>

                    {demandeur.demandes && demandeur.demandes.length > 0 && (
                        <Card title="Demandes Associées" className="mt-8">
                            <Table
                                columns={demandesColumns}
                                dataSource={demandeur.demandes}
                                rowKey="id"
                                pagination={{ pageSize: 5 }}
                            />
                        </Card>
                    )}
                </Card>
            </div>
        </>
    );
};

const LoadingSkeleton = () => (
    <div className="container my-6">
        <Card>
            <Skeleton active />
            <div className="grid gap-8 md:grid-cols-2 mt-6">
                <Card>
                    <Skeleton active />
                </Card>
                <Card>
                    <Skeleton active />
                </Card>
            </div>
        </Card>
    </div>
);

const ErrorDisplay = ({ error }) => (
    <Result
        status="error"
        title="Une erreur est survenue"
        subTitle={error}
    />
);

export default AdminDemandeurDetails;
