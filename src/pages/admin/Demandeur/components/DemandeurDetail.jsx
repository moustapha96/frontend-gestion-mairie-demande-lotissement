import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AdminBreadcrumb } from "@/components";
import { getDemandeurDetails } from "@/services/userService";
import { UserOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, IdcardOutlined, CalendarOutlined, RightOutlined, InfoCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { cn } from "@/utils";
import { formatPhoneNumber } from "@/utils/formatters";
import { Card, Typography, Descriptions, Table, Tag, Skeleton, Result, Space, Popover, Button } from "antd";
import { toast } from "sonner";
import { getDetaitHabitant } from "../../../../services/userService";


const { Title, Text } = Typography;

const AdminDemandeurDetails = () => {
    const { id } = useParams();
    const [demandeur, setDemandeur] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [loadingHabitant, setLoadingHabitant] = useState(false)
    const [habitantData, setHabitantData] = useState(null)

    useEffect(() => {
        fetchHabitantInfo()
    }, [demandeur])

    const renderHabitantContent = () => {
        const data = habitantData

        if (!data) {
            return <div>Chargement des informations...</div>
        }

        return (
            <div className="max-w-3xl">
                <div className="grid grid-cols-3 gap-2">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="border-b pb-1">
                            <strong>{key}:</strong> {value || "-"}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const fetchHabitantInfo = async () => {
        setLoadingHabitant(true)
        try {
            const habitantInfo = await getDetaitHabitant(demandeur.id)
            console.log("habitante", habitantInfo)
            setHabitantData(habitantInfo)
        } catch (error) {
            console.error("Erreur lors de la récupération des informations du habitant:", error)
        } finally {
            setLoadingHabitant(false)
        }
    }


      const statutColor = (s) => {
  switch (s) {
    case "En attente": return "orange";
    case "En cours de traitement": return "gold";
    case "Approuvée": return "green";
    case "Rejetée": return "red";
    default: return "default";
  }
};


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
      sorter: true,
      render: (statut) => <Tag color={statutColor(statut)}>{statut}</Tag>,
      width: 180,
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

                    <Button className="bg-primary text-white" icon={<EyeOutlined />} >
                        Détails
                    </Button>


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
                                <Descriptions.Item label={<Space><EnvironmentOutlined />Habitant</Space>}>
                                    <Tag color={demandeur?.isHabitant ? 'success' : 'error'} className="px-4 py-1 text-sm font-medium">
                                        {demandeur?.isHabitant ? 'Oui' : 'Non'}
                                    </Tag>


                                    {demandeur.isHabitant && (
                                        <Space>
                                            <span>Informations détaillées:</span>
                                            <Popover
                                                content={renderHabitantContent()}
                                                title="Informations détaillées"
                                                trigger="click"
                                                placement="right"
                                                overlayStyle={{ maxWidth: "800px" }}
                                                onVisibleChange={(visible) => {
                                                    if (visible) {
                                                        fetchHabitantInfo()
                                                    }
                                                }}
                                            >
                                                <Button type="text" icon={<InfoCircleOutlined className="w-5 h-5" />} className="text-primary" loading={loadingHabitant} />
                                            </Popover>
                                        </Space>
                                    )}
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
                                scroll={{ x: 'max-content' }}
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
