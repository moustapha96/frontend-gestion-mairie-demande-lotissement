
// "use client";

// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import {
//     Calendar,
//     CheckCircle,
//     MapPin,
//     FileText,
//     File,
//     Loader
// } from "lucide-react";
// import { getLocaliteDetails } from "@/services/localiteService";
// import { AgentBreadcrumb } from "@/components";
// import { LuEye } from "react-icons/lu";
// import { cn } from "@/utils";
// import { formatPrice } from "@/utils/formatters";

// export default function AgentLocaliteDetails() {
//     const { id } = useParams();
//     const [localite, setLocalite] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchLocalite = async () => {
//             try {
//                 const data = await getLocaliteDetails(id);
//                 setLocalite(data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchLocalite();
//     }, [id]);

//     // if (loading) return <p>Chargement...</p>;
//     // if (error) return <p className="text-red-500">Erreur: {error}</p>;

//     if (loading) return <LoadingSkeleton />
//     if (error) return <ErrorDisplay error={error} />


//     return (
//         <>
//             <AgentBreadcrumb title="Détails de la Localité" />
//             <section>
//                 <div className="container">
//                     <div className="my-6 space-y-6">
//                         <div className="bg-white shadow-lg rounded-lg overflow-hidden">


//                             <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//                                 <h1 className="text-2xl font-bold mb-4">Détail de la Localité</h1>

//                             </div>
//                             <LocaliteInfoCard localite={localite} />
//                             {localite.lotissements?.length > 0 && <LotissementTable lotissements={localite.lotissements} />}


//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// }

// function LocaliteInfoCard({ localite }) {
//     return (
//         <div className="bg-gray-50 shadow rounded-lg p-4 mb-6">
//             <h3 className="text-lg font-medium mb-4">Informations de la Localité</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <InfoItem icon={<FileText className="w-5 h-5" />} label="Nom" value={localite.nom} />
//                 <InfoItem icon={<FileText className="w-5 h-5" />} label="Description" value={localite.description} />
//                 <InfoItem icon={<FileText className="w-5 h-5" />} label="Prix" value={formatPrice(localite.prix)} />
//             </div>
//         </div>
//     );
// }

// function LotissementTable({ lotissements }) {
//     return (
//         <TableComponent title="Lotissements" columns={["Nom", "Localisation", "Statut", "Date de Création", "Option"]}>
//             {lotissements.map((lotissement) => (
//                 <tr key={lotissement.id} className="border-b">
//                     <td className="p-4">{lotissement.nom}</td>
//                     <td className="p-4">{lotissement.localisation}</td>
//                     <td className="p-4">
//                         <span className={cn(
//                             "text-sm border rounded-md py-1 px-2 focus:ring-2 focus:ring-opacity-50 focus:outline-none",
//                             {
//                                 'bg-green-100 text-green-800 border border-green-500': lotissement.statut === 'acheve',
//                                 'bg-red-100 text-red-800 border border-red-500': lotissement.statut === 'rejete',
//                                 'bg-yellow-100 text-yellow-500 border border-yellow-500': lotissement.statut === 'en_cours',
//                                 'bg-gray-100 text-gray-500 border border-gray-500': !lotissement.statut
//                             }
//                         )}>
//                             {lotissement.statut}
//                         </span>
//                     </td>
//                     <td className="p-4">{new Date(lotissement.dateCreation).toLocaleDateString()}</td>
//                     <td className="p-4">
//                         <Link
//                             to={`/agent/lotissements/${lotissement.id}/details`}
//                             className="text-primary hover:text-primary-700 transition-colors duration-200 flex items-center"
//                         >
//                             <LuEye className="mr-1" /> Détails
//                         </Link>

//                     </td>
//                 </tr>
//             ))
//             }
//         </TableComponent >
//     );
// }

// function TableComponent({ title, columns, children }) {
//     return (
//         <div className="bg-gray-50 shadow rounded-lg p-4 mb-6 overflow-x-auto">
//             <h3 className="text-lg font-medium mb-4">{title}</h3>
//             <table className="w-full text-left border-collapse">
//                 <thead className="bg-gray-100">
//                     <tr>
//                         {columns.map((col, index) => (
//                             <th key={index} className="p-4 border-b text-gray-600 uppercase text-sm">{col}</th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody>{children}</tbody>
//             </table>
//         </div>
//     );
// }

// function InfoItem({ icon, label, value }) {
//     return (
//         <div className="flex items-center space-x-3 bg-white shadow-sm p-3 rounded-lg">
//             <div className="text-gray-500">{icon}</div>
//             <div>
//                 <p className="text-sm font-medium text-gray-500">{label}</p>
//                 <p className="text-sm text-gray-900">{value || "N/A"}</p>
//             </div>
//         </div>
//     );
// }

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
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Typography, Descriptions, Space, Button, Table, Tag, Spin, Result, Modal } from "antd";
import { EyeOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { AgentBreadcrumb } from "@/components";
import { getLocaliteDetails } from "@/services/localiteService";

import { formatPrice } from "@/utils/formatters";
import MapCar from "../../../admin/Map/MapCar";

const { Title } = Typography;

export default function AgentLocaliteDetails() {
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
                <Link to={`/agent/lotissements/${record.id}/details`}>
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
            <AgentBreadcrumb title="Détails de la Localité" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="grid grid-cols-1">
                            <Card>
                                <Title level={4}>Détail de la Localité</Title>

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
