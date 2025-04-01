

// "use client"
// import { AdminBreadcrumb, AgentBreadcrumb } from "@/components"
// import { LuSearch, LuChevronLeft, LuChevronRight, LuFileText, LuPlusCircle, LuX, LuFileEdit } from "react-icons/lu"
// import { useState, useEffect } from "react"
// import { cn } from "@/utils"
// import { Loader, Loader2, LucideEdit, Save, SaveIcon } from "lucide-react"
// import { getLotissements } from "@/services/lotissementService"
// import { toast } from "sonner"
// import { createPlanLotissement, getFileDocumentPlan, getPlanLotissements, updatePlanLotissement } from "@/services/planLotissement"
// import { Link } from "react-router-dom"

// const AgentPlan = () => {
//     const [plans, setPlans] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState(null)
//     const [lotissements, setLotissements] = useState([])
//     const [filter, setFilter] = useState("")
//     const [currentPage, setCurrentPage] = useState(1)
//     const [itemsPerPage] = useState(5)
//     const [isViewerOpen, setIsViewerOpen] = useState(false)
//     const [fileLoading, setFileLoading] = useState(false)
//     const [fichier, setFichier] = useState(null)
//     const [modalOpen, setModalOpen] = useState(false)
//     const [editingPlan, setEditingPlan] = useState(null)
//     const [formData, setFormData] = useState({
//         description: "",
//         version: "",
//         url: "",
//         lotissementId: "",
//     })
//     const [file, setFile] = useState(null);

//     const handleFileChange = (event) => {
//         const selectedFile = event.target.files[0];
//         if (selectedFile) {
//             setFile(selectedFile);
//             // Vous pouvez également mettre à jour l'URL dans formData si nécessaire
//             handleInputChange({ target: { name: 'url', value: URL.createObjectURL(selectedFile) } });
//         }
//     };
//     useEffect(() => {
//         fetchLOtissement();
//         fetchPlans()
//     }, [])

//     const fetchLOtissement = () => {
//         getLotissements().then((res) => {
//             setLotissements(res)
//         })
//     }

//     const fetchPlans = async () => {
//         try {
//             const data = await getPlanLotissements()
//             setPlans(data)
//             console.log(data)
//         } catch (err) {
//             setError(err.message)
//             toast.error("Erreur lors du chargement des plans")
//         } finally {
//             setLoading(false)
//         }
//     }

//     const handleViewDocument = async (plan) => {
//         setFileLoading(true)
//         setIsViewerOpen(true)
//         try {
//             const fileContent = await getFileDocumentPlan(plan.id)
//             setFichier(fileContent)
//         } catch (error) {
//             console.error("Erreur lors du chargement du fichier", error)
//             toast.error("Erreur lors du chargement du fichier")
//         } finally {
//             setFileLoading(false)
//         }
//     }

//     const closeViewer = () => {
//         setIsViewerOpen(false)
//         setFichier(null)
//     }

//     const handleOpenModal = (plan = null) => {
//         console.log(plan)
//         setEditingPlan(plan)
//         setFormData(plan || { description: "", version: "", url: "", lotissementId: "" })
//         setModalOpen(true)
//     }

//     const handleCloseModal = () => {
//         setModalOpen(false)
//         setEditingPlan(null)
//         setFormData({ description: "", version: "", url: "", lotissementId: "" })
//     }

//     const handleInputChange = (e) => {
//         const { name, value } = e.target
//         setFormData((prev) => ({ ...prev, [name]: value }))
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         setLoading(true)
//         const formDatas = new FormData()
//         console.log(formData.lotissementId)

//         formDatas.append("description", formData.description)
//         formDatas.append("version", formData.version)
//         formDatas.append("lotissementId", formData.lotissementId)
//         formDatas.append("url", formData.url)
//         formDatas.append("document", file)


//         try {
//             if (editingPlan) {
//                 await updatePlanLotissement(editingPlan.id, formDatas)
//                 toast.success("Plan mis à jour avec succès")
//             } else {
//                 await createPlanLotissement(formDatas)
//                 toast.success("Plan ajouté avec succès")
//             }
//             handleCloseModal()
//             fetchPlans()
//         } catch (error) {
//             console.error("Erreur lors de l'ajout ou de la modification du plan", error)
//             toast.error("Erreur lors de l'ajout ou de la modification du plan")
//         } finally {
//             setLoading(false)
//         }
//     }

//     // if (loading) return <div className="flex justify-center items-center h-screen">Chargement des plans...</div>
//     if (error) return <div className="flex justify-center items-center h-screen text-red-500">Erreur: {error}</div>

//     const filteredPlans = plans.filter((plan) => plan.description.toLowerCase().includes(filter.toLowerCase()))

//     const indexOfLastItem = currentPage * itemsPerPage
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage
//     const currentItems = filteredPlans.slice(indexOfFirstItem, indexOfLastItem)

//     const paginate = (pageNumber) => setCurrentPage(pageNumber)


//     return (
//         <>
//             <AgentBreadcrumb title="Liste des Plans de Lotissement" />
//             <section>
//                 <div className="container">
//                     <div className="my-6 space-y-6">
//                         <div className="bg-white dark:bg-default-50 shadow-lg rounded-lg overflow-hidden">


//                             <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//                                 <h4 className="text-xl font-semibold text-gray-800 dark:text-white uppercase">Plans de lotissement</h4>
//                             </div>




//                             <div className="flex items-center justify-end border-b gap-4 border-gray-200 px-6 py-4">
//                                 <button onClick={() => handleOpenModal()} className="text-primary flex items-center gap-2">
//                                     <LuPlusCircle /> Ajouter un Plan
//                                 </button>
//                             </div>


//                             <div className="p-6">
//                                 <div className="flex mb-4">
//                                     <div className="relative flex-1">
//                                         <input
//                                             type="text"
//                                             placeholder="Rechercher par description ou nom de lotissement..."
//                                             value={filter}
//                                             onChange={(e) => setFilter(e.target.value)}
//                                             className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
//                                         />
//                                         <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                                     </div>
//                                 </div>
//                                 <div className="overflow-x-auto">
//                                     <table className="min-w-full divide-y divide-gray-200">
//                                         <thead className="bg-gray-50">
//                                             <tr>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Version</th>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                                                     Date de Création
//                                                 </th>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lotissement</th>
//                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="bg-white divide-y divide-gray-200">
//                                             {currentItems.map((plan) => (
//                                                 <tr key={plan.id} className="hover:bg-gray-50 transition-colors duration-200">
//                                                     <td className="px-6 py-4 text-sm text-gray-900">{plan.description}</td>
//                                                     <td className="px-6 py-4 text-sm text-gray-500">{plan.version}</td>
//                                                     <td className="px-6 py-4 text-sm text-gray-500">
//                                                         {new Date(plan.dateCreation).toLocaleDateString()}
//                                                     </td>
//                                                     <td className="px-6 py-4 text-sm text-gray-500">
//                                                         <Link to={`/agent/lotissements/${plan.lotissement.id}/details`} >
//                                                             {plan.lotissement.nom}
//                                                         </Link>
//                                                     </td>
//                                                     <td className="px-6 py-4 text-sm font-medium">
//                                                         <div className="flex items-center space-x-4">
//                                                             <button
//                                                                 onClick={() => handleViewDocument(plan)}
//                                                                 className="text-primary hover:text-primary-light flex items-center"
//                                                             >
//                                                                 <LuFileText className="w-5 h-5 mr-1" />
//                                                                 <span>Voir</span>
//                                                             </button>
//                                                             <button
//                                                                 onClick={() => handleOpenModal(plan)}
//                                                                 className="text-primary hover:text-primary-light flex items-center"
//                                                             >
//                                                                 <LuFileEdit className="w-5 h-5 mr-1" />
//                                                                 <span>Modifier</span>
//                                                             </button>
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                         {loading && (
//                                             <tbody className="w-full">
//                                                 <tr>
//                                                     <td colSpan="5" className="px-6 py-12">
//                                                         <div className="flex items-center justify-center">
//                                                             <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             </tbody>
//                                         )}
//                                     </table>
//                                 </div>

//                                 <div className="flex items-center justify-between mt-4">
//                                     <div className="text-sm text-gray-700">
//                                         Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredPlans.length)} sur{" "}
//                                         {filteredPlans.length} entrées
//                                     </div>
//                                     <div className="flex items-center space-x-2">
//                                         <button
//                                             onClick={() => paginate(currentPage - 1)}
//                                             disabled={currentPage === 1}
//                                             className={cn(
//                                                 "px-3 py-1 rounded-md",
//                                                 currentPage === 1
//                                                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                                                     : "bg-white text-gray-700 hover:bg-gray-50",
//                                             )}
//                                         >
//                                             <LuChevronLeft className="h-5 w-5" />
//                                         </button>
//                                         {Array.from({ length: Math.ceil(filteredPlans.length / itemsPerPage) }).map((_, index) => (
//                                             <button
//                                                 key={index}
//                                                 onClick={() => paginate(index + 1)}
//                                                 className={cn(
//                                                     "px-3 py-1 rounded-md",
//                                                     currentPage === index + 1
//                                                         ? "bg-primary text-white"
//                                                         : "bg-white text-gray-700 hover:bg-gray-50",
//                                                 )}
//                                             >
//                                                 {index + 1}
//                                             </button>
//                                         ))}
//                                         <button
//                                             onClick={() => paginate(currentPage + 1)}
//                                             disabled={currentPage === Math.ceil(filteredPlans.length / itemsPerPage)}
//                                             className={cn(
//                                                 "px-3 py-1 rounded-md",
//                                                 currentPage === Math.ceil(filteredPlans.length / itemsPerPage)
//                                                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                                                     : "bg-white text-gray-700 hover:bg-gray-50",
//                                             )}
//                                         >
//                                             <LuChevronRight className="h-5 w-5" />
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section >

//             {isViewerOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//                     <div className="bg-white p-4 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
//                         <div className="flex justify-between items-center mb-4">
//                             <h2 className="text-2xl font-bold text-gray-800">Document</h2>
//                             <button onClick={closeViewer} className="text-gray-500 hover:text-gray-700">
//                                 Fermer
//                             </button>
//                         </div>
//                         <div className="bg-gray-200 rounded-lg p-4">
//                             {fileLoading ? (
//                                 <div className="flex justify-center items-center h-[600px]">
//                                     <Loader className="w-12 h-12 animate-spin text-blue-600" />
//                                     <span className="ml-2 text-lg font-semibold text-gray-700">Chargement du document...</span>
//                                 </div>
//                             ) : fichier ? (
//                                 <iframe
//                                     src={`data:application/pdf;base64,${fichier}`}
//                                     width="100%"
//                                     height="600px"
//                                     title="Document PDF"
//                                     className="border rounded"
//                                 />
//                             ) : (
//                                 <div className="flex justify-center items-center h-[600px]">
//                                     <span className="text-lg font-semibold text-gray-700">Erreur de chargement du document.</span>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )
//             }

//             {
//                 modalOpen && (

//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//                         <div className="bg-white p-8 rounded-lg w-full max-w-md">
//                             <div className="flex justify-between items-center mb-6">
//                                 <h3 className="text-lg font-semibold text-gray-900">
//                                     {editingPlan ? "Modifier le Plan" : "Ajouter un Plan"}
//                                 </h3>
//                                 <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
//                                     <LuX className="h-6 w-6" />
//                                 </button>
//                             </div>
//                             <form onSubmit={handleSubmit} className="space-y-4">
//                                 <div>
//                                     <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//                                         Description
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="description"
//                                         name="description"
//                                         value={formData.description}
//                                         onChange={handleInputChange}
//                                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
//                                         required
//                                     />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="version" className="block text-sm font-medium text-gray-700">
//                                         Version
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="version"
//                                         name="version"
//                                         value={formData.version}
//                                         onChange={handleInputChange}
//                                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
//                                         required
//                                     />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="file" className="block text-sm font-medium text-gray-700">
//                                         Fichier
//                                     </label>
//                                     <input
//                                         type="file"
//                                         id="file"
//                                         name="file"
//                                         onChange={handleFileChange}
//                                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
//                                         required={editingPlan ? false : true}
//                                     />
//                                 </div>
//                                 {/* {formData.url && (
//                                     <div>
//                                         <label htmlFor="url" className="block text-sm font-medium text-gray-700">
//                                             URL du fichier
//                                         </label>
//                                         <input
//                                             type="text"
//                                             id="url"
//                                             name="url"
//                                             value={formData.url}
//                                             onChange={handleInputChange}
//                                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
//                                             readOnly
//                                         />
//                                     </div>
//                                 )} */}
//                                 <div>
//                                     <label htmlFor="lotissementId" className="block text-sm font-medium text-gray-700">
//                                         Lotissement
//                                     </label>
//                                     <select
//                                         id="lotissementId"
//                                         name="lotissementId"
//                                         value={formData.lotissementId}
//                                         onChange={handleInputChange}
//                                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
//                                         required
//                                     >
//                                         <option value="">Sélectionner un lotissement</option>
//                                         {lotissements.map((lotissement) => (
//                                             <option key={lotissement.id} value={lotissement.id} selected={formData.lotissement ? lotissement.id === formData.lotissement.id : false} >
//                                                 {lotissement.nom}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div className="flex justify-end space-x-3 mt-6">
//                                     <button
//                                         type="button"
//                                         onClick={handleCloseModal}
//                                         className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
//                                     >
//                                         Annuler
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         className="flex justify-center  px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark  items-center space-x-4"
//                                     >
//                                         {loading ? <Loader2 className="animate-spin" /> : <SaveIcon className="size-4" />}  {editingPlan ? "Modifier" : "Ajouter"}
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 )
//             }
//         </>
//     )
// }

// export default AgentPlan


import React, { useState, useEffect } from "react";
import { Table, Card, Space, Button, Typography, Input, Modal, Form, message, Result, Upload, Select } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";

import { getLotissements } from "@/services/lotissementService";
import { createPlanLotissement, getFileDocumentPlan, getPlanLotissements, updatePlanLotissement } from "@/services/planLotissement";
import { Link } from "react-router-dom";
import { LucideFileText } from "lucide-react";
import { AdminBreadcrumb, AgentBreadcrumb } from "@/components"

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AgentPlan = () => {
    const [form] = Form.useForm();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lotissements, setLotissements] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isViewerVisible, setIsViewerVisible] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [fileLoading, setFileLoading] = useState(false);
    const [currentDocument, setCurrentDocument] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [lotissementsData, plansData] = await Promise.all([
                getLotissements(),
                getPlanLotissements()
            ]);
            setLotissements(lotissementsData);
            setPlans(plansData);
        } catch (err) {
            message.error("Erreur lors du chargement des données");
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDocument = async (plan) => {
        setFileLoading(true);
        try {
            const fileContent = await getFileDocumentPlan(plan.id);
            setCurrentDocument(fileContent);
            setIsViewerVisible(true);
        } catch (error) {
            message.error("Erreur lors du chargement du fichier");
        } finally {
            setFileLoading(false);
        }
    };

    const showModal = (plan = null) => {
        setEditingPlan(plan);
        if (plan) {
            form.setFieldsValue(plan);
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsViewerVisible(false);
        setEditingPlan(null);
        setSelectedFile(null);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("description", values.description);
        formData.append("version", values.version);
        formData.append("lotissementId", values.lotissementId);
        
        if (selectedFile) {
            formData.append("document", selectedFile);
            formData.append("url", URL.createObjectURL(selectedFile));
        }

        try {
            if (editingPlan) {
                await updatePlanLotissement(editingPlan.id, formData);
                message.success("Plan mis à jour avec succès");
            } else {
                await createPlanLotissement(formData);
                message.success("Plan ajouté avec succès");
            }
            handleCancel();
            fetchData();
        } catch (error) {
            message.error("Erreur lors de l'opération");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            sorter: (a, b) => a.description.localeCompare(b.description),
            ellipsis: true
        },
        {
            title: "Version",
            dataIndex: "version",
            key: "version",
            width: 120
        },
        {
            title: "Date de Création",
            key: "dateCreation",
            width: 150,
            render: (_, record) => new Date(record.dateCreation).toLocaleDateString()
        },
        {
            title: "Lotissement",
            dataIndex: ["lotissement", "nom"],
            key: "lotissement",
            ellipsis: true,
            render: (_, record) =>(
                <Link
                className="text-primary"
                to={`/agent/lotissements/${record.lotissement.id}/details`} >
                {record.lotissement.nom}
            </Link>
            )
        },
        {
            title: "Actions",
            key: "actions",
            width: 200,
            render: (_, record) => (
                <Space>
                    {/* <Button
                        className="text-primary"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDocument(record)}
                        loading={fileLoading && currentDocument?.id === record.id}
                    >
                        Voir
                    </Button> */}

                    <Button
                     icon={<EyeOutlined />}
                        onClick={() => handleViewDocument(record)}
                        className="text-primary hover:text-primary-light flex items-center"
                    >
                        <span>Voir</span>
                    </Button>

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
                title="Erreur lors du chargement"
                subTitle={error}
            />
        );
    }

    const filteredPlans = plans.filter(plan =>
        plan.description.toLowerCase().includes(searchText.toLowerCase()) ||
        plan.lotissement?.nom.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <>
            <AgentBreadcrumb title="Liste des Plans de Lotissement" />
            <div className="container my-6">
                <Card className="shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <Title level={4}>Plans de lotissement</Title>
                        <Button
                            className="text-primary"
                            icon={<PlusOutlined />}
                            onClick={() => showModal()}
                        >
                            Ajouter un Plan
                        </Button>
                    </div>

                    <div className="mb-4">
                        <Input
                            placeholder="Rechercher par description ou lotissement..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 300 }}
                            allowClear
                        />
                    </div>

                    <Table
                        columns={columns}
                        dataSource={filteredPlans}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            defaultPageSize: 5,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} plans`,
                            showQuickJumper: true
                        }}
                    />

                    <Modal
                        title={editingPlan ? "Modifier le plan" : "Ajouter un plan"}
                        open={isModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                        width={600}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{
                                lotissementId: editingPlan ? editingPlan.lotissement.id : "",
                            }}
                        >
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{ required: true, message: "La description est requise" }]}
                            >
                                <TextArea rows={4} />
                            </Form.Item>

                            <Form.Item
                                name="version"
                                label="Version"
                                rules={[{ required: true, message: "La version est requise" }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="lotissementId"
                                label="Lotissement"
                                rules={[{ required: true, message: "Le lotissement est requis" }]}
                            >
                                <Select placeholder="Sélectionner un lotissement">
                                    {lotissements.map(lot => (
                                        <Option key={lot.id} value={lot.id} selected={editingPlan?.lotissement.id === lot.id}>
                                            {lot.nom}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Document"
                                rules={[{ required: !editingPlan, message: "Le document est requis" }]}
                            >
                                <Upload
                                    beforeUpload={(file) => {
                                        setSelectedFile(file);
                                        return false;
                                    }}
                                    maxCount={1}
                                >
                                    <Button icon={<UploadOutlined />}>Sélectionner un fichier</Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item className="flex justify-end">
                                <Space>
                                    <Button onClick={handleCancel}>Annuler</Button>
                                    <Button className="text-primary" htmlType="submit" loading={loading}>
                                        {editingPlan ? "Modifier" : "Ajouter"}
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title="Visualisation du plan"
                        open={isViewerVisible}
                        onCancel={handleCancel}
                        width={800}
                        footer={null}
                    >
                        {fileLoading ? (
                            <div className="flex justify-center items-center p-8">
                                <span>Chargement du document...</span>
                            </div>
                        ) : (
                            currentDocument && (
                                <div className="w-full">
                                    <iframe
                                        src={`data:application/pdf;base64,${currentDocument}`}
                                        width="100%"
                                        height="600px"
                                        title="Document PDF"
                                        className="border rounded"
                                    />
                                </div>
                            )
                        )}
                    </Modal>
                </Card>
            </div>
        </>
    );
};

export default AgentPlan;







