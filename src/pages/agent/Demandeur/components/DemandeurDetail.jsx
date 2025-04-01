
// import { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import { AgentBreadcrumb } from "@/components";
// import { getDemandeurDetails } from "@/services/userService";
// import { User, Phone, Mail, MapPin, Briefcase, Calendar, MapPinned, CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react";
// import { cn } from "@/utils";
// import { formatPhoneNumber } from "@/utils/formatters";

// const AgentDemandeurDetails = () => {
//     const { id } = useParams();
//     const [demandeur, setDemandeur] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchDemandeur = async () => {
//             try {
//                 const data = await getDemandeurDetails(id);
//                 setDemandeur(data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDemandeur();
//     }, [id]);

//     // if (loading) return <div className="flex justify-center items-center h-screen">Chargement des détails du Demandeur...</div>;
//     // if (error) return <div className="flex justify-center items-center h-screen text-red-600">Erreur: {error}</div>;


//     if (loading) return <LoadingSkeleton />
//     if (error) return <ErrorDisplay error={error} />


//     return (
//         <>
//             <AgentBreadcrumb title="Détails Demandeur" SubTitle={`${demandeur?.prenom} ${demandeur?.nom}`} />
//             <section>
//                 <div className="container">
//                     <div className="my-6 space-y-6">
//                         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//                             <div className="p-6 sm:p-10">
//                                 <h1 className="text-3xl font-bold text-gray-800 mb-6">{`${demandeur.prenom} ${demandeur.nom}`}</h1>
//                                 <div className="grid gap-8 md:grid-cols-2">
//                                     <InfoCard title="Informations Personnelles">
//                                         <InfoItem icon={<Calendar className="w-5 h-5" />} label="Date de Naissance" value={new Date(demandeur.dateNaissance).toLocaleDateString()} />
//                                         <InfoItem icon={<MapPinned className="w-5 h-5" />} label="Lieu de Naissance" value={demandeur.lieuNaissance} />
//                                         <InfoItem icon={<Briefcase className="w-5 h-5" />} label="Numéro Électeur" value={demandeur.numeroElecteur} />
//                                     </InfoCard>

//                                     <InfoCard title="Contact">
//                                         <InfoItem icon={<Phone className="w-5 h-5" />} label="Téléphone" value={formatPhoneNumber(demandeur.telephone)} />
//                                         <InfoItem icon={<Mail className="w-5 h-5" />} label="Email" value={demandeur.email} />
//                                         <InfoItem icon={<MapPin className="w-5 h-5" />} label="Adresse" value={demandeur.adresse} />
//                                     </InfoCard>
//                                 </div>

//                                 {demandeur.demandes && demandeur.demandes.length > 0 && (
//                                     <div className="mt-8">
//                                         <h3 className="text-xl font-semibold text-gray-800 mb-4">Demandes Associées</h3>
//                                         <div className="overflow-x-auto">
//                                             <table className="min-w-full bg-white rounded-lg overflow-hidden">
//                                                 <thead className="bg-gray-100">
//                                                     <tr>
//                                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type de Demande</th>
//                                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Superficie</th>
//                                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage Prévu</th>
//                                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
//                                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de Création</th>
//                                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody className="divide-y divide-gray-200">
//                                                     {demandeur.demandes.map((demande) => (
//                                                         <tr key={demande.id} className="hover:bg-gray-50 transition duration-300">
//                                                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{demande.typeDemande}</td>
//                                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{demande.superficie} m²</td>
//                                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{demande.usagePrevu}</td>
//                                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                                 <span

//                                                                     className={cn(
//                                                                         "text-sm border rounded-md py-1 px-2 focus:ring-2 focus:ring-opacity-50 focus:outline-none",
//                                                                         {
//                                                                             'bg-yellow-200 border border-yellow-200': demande.statut === 'EN_COURS',
//                                                                             'bg-yellow-100 text-yellow-800 border border-yellow-500': demande.statut === 'EN_TRAITEMENT',
//                                                                             'bg-green-100 text-green-800 border border-green-500': demande.statut === 'VALIDE',
//                                                                             'bg-red-100 text-red-800 border border-red-500': demande.statut === 'REJETE'
//                                                                         }
//                                                                     )}
//                                                                 >
//                                                                     {demande.statut}
//                                                                 </span>
//                                                             </td>
//                                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(demande.dateCreation).toLocaleDateString()}</td>
//                                                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                                                 <Link to={`/agent/demandes/${demande.id}/details`} className="text-primary hover:text-blue-900 flex items-center">
//                                                                     Détails
//                                                                     <ChevronRight className="w-4 h-4 ml-1" />
//                                                                 </Link>
//                                                             </td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// };

// const InfoCard = ({ title, children }) => (
//     <div className="bg-gray-50 rounded-lg p-6">
//         <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
//         <div className="space-y-3">
//             {children}
//         </div>
//     </div>
// );

// const InfoItem = ({ icon, label, value }) => (
//     <div className="flex items-center space-x-3">
//         <div className="flex-shrink-0 text-blue-500">{icon}</div>
//         <div>
//             <p className="text-sm font-medium text-gray-500">{label}</p>
//             <p className="text-sm text-gray-800">{value || "N/A"}</p>
//         </div>
//     </div>
// );

// function LoadingSkeleton() {
//     return (
//         <div className="bg-gray-100 min-h-screen pb-10">
//             <header className="bg-white shadow">
//                 <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//                     <div className="h-9 w-64 bg-gray-200 rounded animate-pulse"></div>
//                 </div>
//             </header>
//             <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//                 <div className="px-4 py-6 sm:px-0">
//                     <div className="grid gap-6 md:grid-cols-2">
//                         {[...Array(4)].map((_, i) => (
//                             <div key={i} className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary">
//                                 <div className="px-4 py-5 sm:p-6">
//                                     <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
//                                     {[...Array(5)].map((_, j) => (
//                                         <div key={j} className="flex items-center space-x-3 mt-4">
//                                             <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
//                                             <div className="space-y-2">
//                                                 <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
//                                                 <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </main>
//         </div>
//     )
// }

// function ErrorDisplay({ error }) {
//     return (
//         <div className="flex justify-center items-center h-screen bg-gray-100">
//             <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary w-full max-w-md">
//                 <div className="px-4 py-5 sm:p-6">
//                     <h3 className="text-lg font-medium leading-6 text-red-600 mb-4">Erreur</h3>
//                     <p className="text-center">{error}</p>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default AgentDemandeurDetails;


import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AgentBreadcrumb } from "@/components";
import { getDemandeurDetails } from "@/services/userService";
import { UserOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, IdcardOutlined, CalendarOutlined, RightOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { cn } from "@/utils";
import { formatPhoneNumber } from "@/utils/formatters";
import { Card, Typography, Descriptions, Table, Tag, Skeleton, Result, Space, Popover, Button } from "antd";
import { toast } from "sonner";
import { getDetaitHabitant } from "../../../../services/userService";


const { Title, Text } = Typography;

const AgentDemandeurDetails = () => {
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
                <Link to={`/agent/demandes/${record.id}/details`}>
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
            <AgentBreadcrumb title="Détails Demandeur" SubTitle={`${demandeur?.prenom} ${demandeur?.nom}`} />
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

export default AgentDemandeurDetails;
