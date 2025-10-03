

// "use client"
// import { AdminBreadcrumb, AgentBreadcrumb } from "@/components"
// import { LuSearch, LuPlusCircle, LuFileEdit, LuX } from "react-icons/lu"
// import { useState, useEffect } from "react"
// import { getLotissements, getLotissementLot } from "@/services/lotissementService"
// import { createLot, updateLot, updateLotStatut } from "@/services/lotsService"
// import { toast } from "sonner"
// import { cn } from "@/utils"
// import { createParcelle, getParcelles, getParcellesByLotissement, updateParcelle, updateParcellestatut } from "@/services/parcelleService"
// import { Loader, Loader2 } from "lucide-react"

// const AgentParcelle = () => {
//     const [lotissements, setLotissements] = useState([])
//     const [parcelles, setParcelles] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState(null)
//     const [filter, setFilter] = useState("")
//     const [selectedLotissement, setSelectedLotissement] = useState("")
//     const [modalOpen, setModalOpen] = useState(false)
//     const [editingParcelle, setEditingParcelle] = useState(null)
//     const [formData, setFormData] = useState({
//         numero: "",
//         superface: "",
//         statut: "",
//         lotissementId: "",
//     })

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const lotissementsData = await getLotissements()
//                 setLotissements(lotissementsData)
//                 if (lotissementsData.length > 0) {
//                     setSelectedLotissement(lotissementsData[0].id)
//                     const parcellesData = await getParcelles(lotissementsData[0].id)
//                     setParcelles(parcellesData)
//                 }
//             } catch (err) {
//                 setError(err.message)
//             } finally {
//                 setLoading(false)
//             }
//         }
//         fetchData()
//     }, [])

//     const handleLotissementChange = async (e) => {
//         setLoading(true)
//         const lotissementId = e.target.value
//         setSelectedLotissement(lotissementId)
//         try {
//             const data = await getParcellesByLotissement(lotissementId)
//             console.log(data)
//             setParcelles(data)
//         } catch (err) {
//             setError(err.message)
//         } finally {
//             setLoading(false)
//         }
//     }

//     const handleOpenModal = (parcelle = null) => {
//         setEditingParcelle(parcelle)
//         setFormData(
//             parcelle || { numero: "", superface: "", statut: "", lotissementId: selectedLotissement },
//         )
//         setModalOpen(true)
//     }

//     const handleCloseModal = () => {
//         setModalOpen(false)
//         setEditingParcelle(null)
//         setFormData({ numero: "", superface: "", statut: "", lotissementId: selectedLotissement })
//     }

//     const handleInputChange = (e) => {
//         const { name, value } = e.target
//         setFormData((prev) => ({ ...prev, [name]: value }))
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         setLoading(true)
//         try {
//             console.log(formData)
//             if (editingParcelle) {
//                 await updateParcelle(editingParcelle.id, formData)
//                 toast.success("Parcelle mise à jour avec succès")
//             } else {
//                 await createParcelle(formData)
//                 toast.success("Parcelle ajoutée avec succès")
//             }
//             handleCloseModal()
//             const updatedParcelles = await getParcelles(selectedLotissement)
//             setParcelles(updatedParcelles)
//         } catch (error) {
//             toast.error("Erreur lors de l'ajout ou de la modification de la parcelle")
//         } finally {
//             setLoading(false)
//         }
//     }

//     // if (loading) return <div className="flex justify-center items-center h-screen">Chargement...</div>
//     if (error) return <div className="flex justify-center items-center h-screen text-red-500">Erreur: {error}</div>

//     const filteredParcelles = parcelles.filter(
//         (parcelle) =>
//             parcelle.numero.toLowerCase().includes(filter.toLowerCase()) ||
//             parcelle.statut.toLowerCase().includes(filter.toLowerCase()),
//     )

//     const handleUpdateStatut = async (parcelleId, nouveauStatut) => {
//         try {
//             await updateParcellestatut(parcelleId, nouveauStatut);
//             const updatedParcelles = parcelles.map(parcelle => {
//                 if (parcelle.id === parcelleId) {
//                     return { ...parcelle, statut: nouveauStatut };
//                 }
//                 return parcelle;
//             });
//             setParcelles(updatedParcelles);
//             toast.success("Statut de la parcelle mis à jour avec succès");
//         } catch (error) {
//             toast.error("Erreur lors de la mise à jour du statut");
//         }
//     };

//     return (
//         <>
//             <AgentBreadcrumb title="Liste des Parcelles" />
//             <section>
//                 <div className="container">
//                     <div className="my-6 space-y-6">
//                         <div className="bg-white dark:bg-default-50 shadow-lg rounded-lg overflow-hidden">

//                             <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//                                 <h4 className="text-xl font-semibold text-gray-800 dark:text-white uppercase">Liste des Parcelles</h4>
//                             </div>


//                             <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//                                 <select
//                                     value={selectedLotissement}
//                                     onChange={handleLotissementChange}
//                                     className="mb-4 md:mb-0 p-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary"
//                                 >
//                                     {lotissements.map((lotissement) => (
//                                         <option key={lotissement.id} value={lotissement.id}>
//                                             {lotissement.nom}
//                                         </option>
//                                     ))}
//                                 </select>

//                                 <div className="flex items-center">
//                                     <div className="relative mr-4">
//                                         <input
//                                             type="text"
//                                             placeholder="Rechercher..."
//                                             value={filter}
//                                             onChange={(e) => setFilter(e.target.value)}
//                                             className="pl-10 pr-4 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary"
//                                         />
//                                         <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                                     </div>
//                                 </div>
//                             </div>



//                             <div className="flex items-center justify-end border-b gap-4 border-gray-200 px-6 py-4">
//                                 <button onClick={() => handleOpenModal()} className="text-primary flex items-center gap-2">
//                                     <LuPlusCircle /> Ajouter une Parcelle
//                                 </button>
//                             </div>

//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Lotissement
//                                             </th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Numéro
//                                             </th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Surface
//                                             </th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Statut
//                                             </th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Actions
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {filteredParcelles.map((parcelle) => (
//                                             <tr key={parcelle.id} className="hover:bg-gray-50">
//                                                 <td className="px-6 py-4 whitespace-nowrap">{parcelle.lotissement.nom}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">{parcelle.numero}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">{parcelle.superface} m²</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <select
//                                                         value={parcelle.statut}
//                                                         onChange={(e) => handleUpdateStatut(parcelle.id, e.target.value)}
//                                                         className={cn(
//                                                             "text-sm border rounded-md py-1 px-2 focus:ring-2 focus:ring-opacity-50 focus:outline-none",
//                                                             {
//                                                                 'bg-green-100 text-green-800 border-green-500': parcelle.statut === 'DISPONIBLE',
//                                                                 'bg-red-100 text-red-800 border-red-500': parcelle.statut === 'OCCUPE',
//                                                                 'bg-yellow-100 text-yellow-800 border-yellow-500': parcelle.statut === 'RESERVER',
//                                                                 'bg-gray-100 text-gray-800 border-gray-500': parcelle.statut === 'VENDU'
//                                                             }
//                                                         )}
//                                                     >
//                                                         <option value="DISPONIBLE">Disponible</option>
//                                                         <option value="OCCUPE">Occupé</option>
//                                                         <option value="RESERVER">Réservé</option>
//                                                         <option value="VENDU">Vendu</option>
//                                                     </select>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                                     <button onClick={() => handleOpenModal(parcelle)} className="text-primary hover:text-primary-dark">
//                                                         <LuFileEdit className="inline mr-1" /> Modifier
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                     {loading && (
//                                         <tbody className="w-full">
//                                             <tr>
//                                                 <td colSpan="5" className="px-6 py-12">
//                                                     <div className="flex items-center justify-center">
//                                                         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         </tbody>
//                                     )}
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//             {modalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg p-8 max-w-md w-full">
//                         <div className="flex justify-between items-center mb-6">
//                             <h3 className="text-lg font-semibold text-gray-900">
//                                 {editingParcelle ? "Modifier la Parcelle" : "Ajouter une Parcelle"}
//                             </h3>
//                             <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
//                                 <LuX className="h-6 w-6" />
//                             </button>
//                         </div>
//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div>
//                                 <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
//                                     Numéro de la Parcelle
//                                 </label>
//                                 <input
//                                     type="text"
//                                     id="numero"
//                                     name="numero"
//                                     value={formData.numero}
//                                     onChange={handleInputChange}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
//                                     required
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="superface" className="block text-sm font-medium text-gray-700">
//                                     Surface (m²)
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id="superface"
//                                     name="superface"
//                                     value={formData.superface}
//                                     onChange={handleInputChange}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
//                                     required
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="statut" className="block text-sm font-medium text-gray-700">
//                                     Statut
//                                 </label>
//                                 <select
//                                     id="statut"
//                                     name="statut"
//                                     value={formData.statut}
//                                     onChange={handleInputChange}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
//                                     required
//                                 >
//                                     <option value="">Sélectionner un statut</option>
//                                     <option value="DISPONIBLE">Disponible</option>
//                                     <option value="OCCUPE">Occupé</option>
//                                     <option value="RESERVER">Réservé</option>
//                                     <option value="VENDU">Vendu</option>
//                                 </select>
//                             </div>
//                             <div className="flex justify-end space-x-6 mt-6">


//                                 <button type="button"
//                                     onClick={handleCloseModal}
//                                     className="text-primary-dark ">
//                                     Annuler
//                                 </button>

//                                 <button onClick={() => handleOpenModal(parcelle)} className="text-primary  hover:text-primary-dark">
//                                     {loading ? <Loader2 className="animate-spin inline mr-2" size={20} /> : <LuFileEdit className="inline mr-1" />} {editingParcelle ? "Modifier" : "Ajouter"}
//                                 </button>

//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </>
//     )
// }

// export default AgentParcelle


import React, { useState, useEffect } from "react";
import { Table, Card, Space, Button, Typography, Select, Input, Modal, Form, message, Result } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { getLotissements } from "@/services/lotissementService";
import { createParcelle, getParcelles, getParcellesByLotissement, updateParcelle, updateParcellestatut } from "@/services/parcelleService";
import MapCar from "../../admin/Map/MapCar";
import { formatCoordinates } from "@/utils/formatters";
import { AgentBreadcrumb } from "@/components"

const { Title } = Typography;
const { Option } = Select;

const AgentParcelle = () => {
    const [form] = Form.useForm();
    const [lotissements, setLotissements] = useState([]);
    const [parcelles, setParcelles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [selectedLotissement, setSelectedLotissement] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isMapModalVisible, setIsMapModalVisible] = useState(false);
    const [selectedParcelle, setSelectedParcelle] = useState(null);
    const [editingParcelle, setEditingParcelle] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const lotissementsData = await getLotissements();
            setLotissements(lotissementsData);
            if (lotissementsData.length > 0) {
                setSelectedLotissement(lotissementsData[0].id);
                const parcellesData = await getParcelles(lotissementsData[0].id);
                setParcelles(parcellesData);
            }
        } catch (err) {
            message.error("Erreur lors du chargement des données");
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLotissementChange = async (value) => {
        setLoading(true);
        setSelectedLotissement(value);
        try {
            const data = await getParcellesByLotissement(value);
            setParcelles(data);
        } catch (err) {
            message.error("Erreur lors du chargement des parcelles");
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const showMapModal = (parcelle = null) => {
        setSelectedParcelle(parcelle);
        setIsMapModalVisible(true);
    };

    const showModal = (parcelle = null) => {
        setEditingParcelle(parcelle);
        if (parcelle) {
            form.setFieldsValue(parcelle);
        } else {
            form.setFieldsValue({
                numero: "",
                superface: "",
                statut: "DISPONIBLE",
                lotissementId: selectedLotissement,
                longitude: "",
                latitude: ""
            });
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsMapModalVisible(false);
        setSelectedParcelle(null);
        setEditingParcelle(null);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            if (editingParcelle) {
                await updateParcelle(editingParcelle.id, values);
                message.success("Parcelle mise à jour avec succès");
            } else {
                await createParcelle(values);
                message.success("Parcelle créée avec succès");
            }
            handleCancel();
            const updatedParcelles = await getParcelles(selectedLotissement);
            setParcelles(updatedParcelles);
        } catch (error) {
            message.error("Erreur lors de l'opération");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatut = async (parcelleId, nouveauStatut) => {
        try {
            await updateParcellestatut(parcelleId, nouveauStatut);
            const updatedParcelles = parcelles.map(parcelle =>
                parcelle.id === parcelleId
                    ? { ...parcelle, statut: nouveauStatut }
                    : parcelle
            );
            setParcelles(updatedParcelles);
            message.success("Statut mis à jour avec succès");
        } catch (error) {
            message.error("Erreur lors de la mise à jour du statut");
        }
    };

    const columns = [
        {
            title: "Numéro",
            dataIndex: "numero",
            key: "numero",
            sorter: (a, b) => a.numero.localeCompare(b.numero)
        },
        {
            title: "Superficie",
            dataIndex: "superface",
            key: "superface",
            render: (superface) => `${superface} m²`
        },
        {
            title: "Coordonnées",
            key: "coordinates",
            render: (_, record) => (
                // <Button
                //     icon={<EnvironmentOutlined />}
                //     onClick={() => showMapModal(record)}
                // >
                //     Voir sur la carte
                // </Button>
                <Button
                    type="text"
                    className="bg-primary text-white"
                    icon={<EnvironmentOutlined />}
                    onClick={() => showMapModal(record)}
                />
            )
        },
        {
            title: "Statut",
            dataIndex: "statut",
            key: "statut",
            render: (statut, record) => (
                <Select
                    value={statut}
                    onChange={(value) => handleUpdateStatut(record.id, value)}
                    style={{ width: 130 }}
                >
                    <Option value="DISPONIBLE">Disponible</Option>
                    <Option value="OCCUPE">Occupé</Option>
                    <Option value="EN_COURS">En cours</Option>
                </Select>
            ),
            filters: [
                { text: "Disponible", value: "DISPONIBLE" },
                { text: "Occupé", value: "OCCUPE" },
                { text: "En cours", value: "EN_COURS" }
            ],
            onFilter: (value, record) => record.statut === value
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        className="text-primary"
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
                    >
                        Modifier
                    </Button>
                </Space>
            )
        }
    ];

    if (error) {
        return (
            <Result
                status="error"
                title="Erreur"
                subTitle={error}
            />
        );
    }

    const filteredParcelles = parcelles.filter(parcelle =>
        parcelle.numero.toLowerCase().includes(searchText.toLowerCase()) ||
        parcelle.statut.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <>
            <AgentBreadcrumb title="Liste des Parcelles" />
            <div className="container my-6">
                <Card className="shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <Title level={4}>Liste des Parcelles</Title>
                        <Button
                            className="text-primary"
                            icon={<PlusOutlined />}
                            onClick={() => showModal()}
                        >
                            Ajouter une parcelle
                        </Button>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <Select
                            style={{ width: 200 }}
                            value={selectedLotissement}
                            onChange={handleLotissementChange}
                            placeholder="Sélectionner un lotissement"
                        >
                            {lotissements.map(lotissement => (
                                <Option key={lotissement.id} value={lotissement.id}>
                                    {lotissement.nom}
                                </Option>
                            ))}
                        </Select>

                        <Input
                            placeholder="Rechercher..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 200 }}
                        />
                    </div>

                    <Table
                        scroll={{ x: 'max-content' }}
                        columns={columns}
                        dataSource={filteredParcelles}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} parcelles`
                        }}
                    />

                    <Modal
                        title={editingParcelle ? "Modifier la parcelle" : "Ajouter une parcelle"}
                        open={isModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{
                                lotissementId: selectedLotissement,
                                statut: "DISPONIBLE"
                            }}
                        >
                            <Form.Item
                                name="numero"
                                label="Numéro"
                                rules={[{ required: true, message: "Le numéro est requis" }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="superface"
                                label="Superficie (m²)"
                                rules={[{ required: true, message: "La superficie est requise" }]}
                            >
                                <Input type="number" />
                            </Form.Item>

                            <Form.Item
                                name="longitude"
                                label="Longitude"
                                rules={[{ required: true, message: "La longitude est requise" }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="latitude"
                                label="Latitude"
                                rules={[{ required: true, message: "La latitude est requise" }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="statut"
                                label="Statut"
                                rules={[{ required: true, message: "Le statut est requis" }]}
                            >
                                <Select>
                                    <Option value="DISPONIBLE">Disponible</Option>
                                    <Option value="OCCUPE">Occupé</Option>
                                    <Option value="EN_COURS">En cours</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item name="lotissementId" hidden>
                                <Input />
                            </Form.Item>

                            <Form.Item className="flex justify-end">
                                <Space>
                                    <Button onClick={handleCancel}>Annuler</Button>
                                    <Button className="text-primary" htmlType="submit" loading={loading}>
                                        {editingParcelle ? "Modifier" : "Ajouter"}
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title="Carte de la parcelle"
                        open={isMapModalVisible}
                        onCancel={handleCancel}
                        width={800}
                        footer={null}
                    >
                        {selectedParcelle && (
                            <MapCar
                                latitude={selectedParcelle.latitude}
                                longitude={selectedParcelle.longitude}
                            />
                        )}
                    </Modal>
                </Card>
            </div>
        </>
    );
};

export default AgentParcelle;
