
// "use client"
// import { AgentBreadcrumb } from "@/components"
// import { LuSearch, LuPlusCircle, LuFileEdit, LuX } from "react-icons/lu"
// import { useState, useEffect } from "react"
// import { getLotissements, getLotissementLot } from "@/services/lotissementService"
// import { createLot, updateLot, updateLotStatut } from "@/services/lotsService"
// import { toast } from "sonner"
// import { cn } from "@/utils"
// import { Loader2 } from "lucide-react"

// const AgentLot = () => {
//     const [lots, setLots] = useState([])
//     const [lotissements, setLotissements] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState(null)
//     const [filter, setFilter] = useState("")
//     const [selectedLotissement, setSelectedLotissement] = useState("")
//     const [modalOpen, setModalOpen] = useState(false)
//     const [editingLot, setEditingLot] = useState(null)
//     const [formData, setFormData] = useState({
//         numeroLot: "",
//         superficie: "",
//         statut: "",
//         prix: "",
//         usage: "",
//         lotissementId: "",
//     })

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const lotissementData = await getLotissements()
//                 setLotissements(lotissementData)
//                 if (lotissementData.length > 0) {
//                     setSelectedLotissement(lotissementData[0].id)
//                     const lotsData = await getLotissementLot(lotissementData[0].id)
//                     setLots(lotsData)
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
//         const lotissementId = e.target.value
//         setSelectedLotissement(lotissementId)
//         try {
//             const data = await getLotissementLot(lotissementId)
//             setLots(data)
//         } catch (err) {
//             setError(err.message)
//         }
//     }

//     const handleOpenModal = (lot = null) => {
//         setEditingLot(lot)
//         setFormData(
//             lot || { numeroLot: "", superficie: "", statut: "", prix: "", usage: "", lotissementId: selectedLotissement },
//         )
//         setModalOpen(true)
//     }

//     const handleCloseModal = () => {
//         setModalOpen(false)
//         setEditingLot(null)
//         setFormData({ numeroLot: "", superficie: "", statut: "", prix: "", usage: "", lotissementId: selectedLotissement })
//     }

//     const handleInputChange = (e) => {
//         const { name, value } = e.target
//         setFormData((prev) => ({ ...prev, [name]: value }))
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         try {
//             if (editingLot) {
//                 await updateLot(editingLot.id, formData)
//                 toast.success("Lot mis à jour avec succès")
//             } else {
//                 await createLot(formData)
//                 toast.success("Lot ajouté avec succès")
//             }
//             handleCloseModal()
//             const updatedLots = await getLotissementLot(selectedLotissement)
//             setLots(updatedLots)
//         } catch (error) {
//             toast.error("Erreur lors de l'ajout ou de la modification du lot")
//         }
//     }

//     // if (loading) return <div className="flex justify-center items-center h-screen">Chargement...</div>
//     if (error) return <div className="flex justify-center items-center h-screen text-red-500">Erreur: {error}</div>

//     const filteredLots = lots.filter(
//         (lot) =>
//             lot.numeroLot.toLowerCase().includes(filter.toLowerCase()) ||
//             lot.usage.toLowerCase().includes(filter.toLowerCase()),
//     )


//     const handleUpdateStatut = async (lotId, nouveauStatut) => {
//         try {
//             await updateLotStatut(lotId, nouveauStatut);
//             const updatedLots = lots.map(lot => {
//                 if (lot.id === lotId) {
//                     return { ...lot, statut: nouveauStatut };
//                 }
//                 return lot;
//             });
//             setLots(updatedLots);
//             toast.success("Statut du lot mis à jour avec succès");
//         } catch (error) {
//             toast.error("Erreur lors de la mise à jour du statut");
//         }
//     };


//     return (
//         <>
//             <AgentBreadcrumb title="Liste des Lots" />
//             <section>
//                 <div className="container">
//                     <div className="my-6 space-y-6">
//                         <div className="bg-white dark:bg-default-50 shadow-lg rounded-lg overflow-hidden">


//                             <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//                                 <h4 className="text-xl font-semibold text-gray-800 dark:text-white uppercase">Liste des Lots</h4>
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
//                                     <LuPlusCircle /> Ajouter un Lot
//                                 </button>
//                             </div>

//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-50">
//                                         <tr>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Numéro
//                                             </th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Superficie
//                                             </th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Statut
//                                             </th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Prix
//                                             </th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Usage
//                                             </th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                 Actions
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {filteredLots.map((lot) => (
//                                             <tr key={lot.id} className="hover:bg-gray-50">
//                                                 <td className="px-6 py-4 whitespace-nowrap">{lot.numeroLot}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">{lot.superficie} m²</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">

//                                                     <select
//                                                         value={lot.statut}
//                                                         onChange={(e) => handleUpdateStatut(lot.id, e.target.value)}
//                                                         className={cn(
//                                                             "text-sm border rounded-md py-1 px-2 focus:ring-2 focus:ring-opacity-50 focus:outline-none",
//                                                             {
//                                                                 'bg-green-100 text-green-800 border-green-500': lot.statut === 'DISPONIBLE',
//                                                                 'bg-red-100 text-red-800 border-red-500': lot.statut === 'OCCUPE',
//                                                                 'bg-yellow-100 text-yellow-800 border-yellow-500': lot.statut === 'RESERVER',
//                                                                 'bg-gray-100 text-gray-800 border-gray-500': lot.statut === 'VENDU'
//                                                             }
//                                                         )}
//                                                     >
//                                                         <option value="DISPONIBLE">Disponible</option>
//                                                         <option value="OCCUPE">Occupé</option>
//                                                         <option value="RESERVER">Réservé</option>
//                                                         <option value="VENDU">Vendu</option>
//                                                     </select>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">{lot.prix.toLocaleString()} FCFA</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">{lot.usage}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                                     <button onClick={() => handleOpenModal(lot)} className="text-primary hover:text-primary-dark">
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
//                                 {editingLot ? "Modifier le Lot" : "Ajouter un Lot"}
//                             </h3>
//                             <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
//                                 <LuX className="h-6 w-6" />
//                             </button>
//                         </div>



//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div>
//                                 <label htmlFor="numeroLot" className="block text-sm font-medium text-gray-700">
//                                     Numéro du Lot
//                                 </label>
//                                 <input
//                                     type="text"
//                                     id="numeroLot"
//                                     name="numeroLot"
//                                     value={formData.numeroLot}
//                                     onChange={handleInputChange}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
//                                     required
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="superficie" className="block text-sm font-medium text-gray-700">
//                                     Superficie (m²)
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id="superficie"
//                                     name="superficie"
//                                     value={formData.superficie}
//                                     onChange={handleInputChange}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
//                                     required
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="prix" className="block text-sm font-medium text-gray-700">
//                                     Prix (FCFA)
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id="prix"
//                                     name="prix"
//                                     value={formData.prix}
//                                     onChange={handleInputChange}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
//                                     required
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="usage" className="block text-sm font-medium text-gray-700">
//                                     Usage
//                                 </label>
//                                 <input
//                                     type="text"
//                                     id="usage"
//                                     name="usage"
//                                     value={formData.usage}
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
//                             <div className="flex justify-end space-x-3 mt-6">
//                                 <button
//                                     type="button"
//                                     onClick={handleCloseModal}
//                                     className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
//                                 >
//                                     Annuler
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
//                                 >
//                                     {editingLot ? "Modifier" : "Ajouter"}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </>
//     )
// }

// export default AgentLot

import React, { useState, useEffect } from "react";
import { Table, Input, Card, Space, Button, Typography, Select, Modal, Form, InputNumber, message } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { AgentBreadcrumb } from "@/components";
import { getLotissements, getLotissementLot } from "@/services/lotissementService";
import { createLot, updateLot, updateLotStatut } from "@/services/lotsService";
import { formatCoordinates, formatPrice } from "@/utils/formatters";

const { Title } = Typography;
const { Option } = Select;

const AgentLot = () => {
  const [lots, setLots] = useState([]);
  const [lotissements, setLotissements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedLotissement, setSelectedLotissement] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLot, setEditingLot] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lotissementData = await getLotissements();
        setLotissements(lotissementData);
        if (lotissementData.length > 0) {
          setSelectedLotissement(lotissementData[0].id);
          const lotsData = await getLotissementLot(lotissementData[0].id);
          setLots(lotsData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLotissementChange = async (value) => {
    setSelectedLotissement(value);
    try {
      const data = await getLotissementLot(value);
      setLots(data);
    } catch (err) {
      message.error(err.message);
    }
  };

  const showModal = (lot = null) => {
    setEditingLot(lot);
    if (lot) {
      form.setFieldsValue(lot);
    } else {
      form.resetFields();
      form.setFieldValue('lotissementId', selectedLotissement);
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingLot(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (editingLot) {
        await updateLot(editingLot.id, values);
        message.success("Lot mis à jour avec succès");
      } else {
        await createLot(values);
        message.success("Lot ajouté avec succès");
      }
      setIsModalVisible(false);
      const updatedLots = await getLotissementLot(selectedLotissement);
      setLots(updatedLots);
    } catch (error) {
      message.error("Erreur lors de l'ajout ou de la modification du lot");
    }
  };

  const handleUpdateStatut = async (lotId, nouveauStatut) => {
    try {
      await updateLotStatut(lotId, nouveauStatut);
      const updatedLots = lots.map(lot => {
        if (lot.id === lotId) {
          return { ...lot, statut: nouveauStatut };
        }
        return lot;
      });
      setLots(updatedLots);
      message.success("Statut du lot mis à jour avec succès");
    } catch (error) {
      message.error("Erreur lors de la mise à jour du statut");
    }
  };

  const columns = [
    {
      title: "Numéro",
      dataIndex: "numeroLot",
      key: "numeroLot",
      sorter: (a, b) => a.numeroLot.localeCompare(b.numeroLot),
    },
    {
      title: "Superficie",
      dataIndex: "superficie",
      key: "superficie",
      sorter: (a, b) => a.superficie - b.superficie,
      render: (superficie) => `${superficie} m²`,
    },
    {
      title: "Coordonnées",
      key: "coordonnees",
      render: (_, record) => formatCoordinates(record.latitude, record.longitude),
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
        >
          <Option value="disponible">Disponible</Option>
          <Option value="reserve">Réservé</Option>
          <Option value="occupe">Occupé</Option>
        </Select>
      ),
      filters: [
        { text: "Disponible", value: "disponible" },
        { text: "Réservé", value: "reserve" },
        { text: "Occupé", value: "occupe" },
      ],
      onFilter: (value, record) => record.statut === value,
    },
    {
      title: "Prix",
      dataIndex: "prix",
      key: "prix",
      sorter: (a, b) => a.prix - b.prix,
      render: (prix) => formatPrice(prix),
    },
    {
      title: "Usage",
      dataIndex: "usage",
      key: "usage",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
         className="text-primary"
          icon={<EditOutlined />}
          onClick={() => showModal(record)}
        >
          Modifier
        </Button>
      ),
    },
  ];

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Erreur: {error}
      </div>
    );
  }

  return (
    <>
      <AgentBreadcrumb title="Liste des Lots" />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <div className="grid grid-cols-1">
              <Card className="shadow-lg rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <Title level={4}>Liste des Lots</Title>
                  <Button
                    className="text-primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                  >
                    Ajouter un Lot
                  </Button>
                </div>

                <div className="flex justify-between mb-4">
                  <Select
                    style={{ width: 200 }}
                    value={selectedLotissement}
                    onChange={handleLotissementChange}
                  >
                    {lotissements.map((lotissement) => (
                      <Option key={lotissement.id} value={lotissement.id}>
                        {lotissement.nom}
                      </Option>
                    ))}
                  </Select>

                  <Input
                    placeholder="Rechercher par numéro..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                  />
                </div>

                <Table
                  columns={columns}
                  dataSource={lots.filter((lot) =>
                    lot.numeroLot.toLowerCase().includes(searchText.toLowerCase())
                  )}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} lots`,
                  }}
                />
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Modal
        title={editingLot ? "Modifier le lot" : "Ajouter un lot"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ lotissementId: selectedLotissement }}
        >
          <Form.Item
            name="lotissementId"
            hidden
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="numeroLot"
            label="Numéro du lot"
            rules={[{ required: true, message: "Le numéro du lot est requis" }]}
          >
            <Input placeholder="Entrez le numéro du lot" />
          </Form.Item>

          <Form.Item
            name="superficie"
            label="Superficie (m²)"
            rules={[{ required: true, message: "La superficie est requise" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Entrez la superficie"
            />
          </Form.Item>

          <Form.Item
            name="prix"
            label="Prix"
            rules={[{ required: true, message: "Le prix est requis" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Entrez le prix"
            />
          </Form.Item>

          <Form.Item
            name="usage"
            label="Usage"
            rules={[{ required: true, message: "L'usage est requis" }]}
          >
            <Select placeholder="Sélectionnez l'usage">
              <Option value="habitation">Habitation</Option>
              <Option value="commerce">Commerce</Option>
              <Option value="mixte">Mixte</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="statut"
            label="Statut"
            rules={[{ required: true, message: "Le statut est requis" }]}
          >
            <Select placeholder="Sélectionnez le statut">
              <Option value="disponible">Disponible</Option>
              <Option value="reserve">Réservé</Option>
              <Option value="occupe">Occupé</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="latitude"
            label="Latitude"
            rules={[{ required: true, message: "La latitude est requise" }]}
          >
            <Input placeholder="Entrez la latitude" />
          </Form.Item>

          <Form.Item
            name="longitude"
            label="Longitude"
            rules={[{ required: true, message: "La longitude est requise" }]}
          >
            <Input placeholder="Entrez la longitude" />
          </Form.Item>

          <Form.Item className="text-right">
            <Space>
              <Button onClick={handleCancel}>Annuler</Button>
              <Button className="text-primary" htmlType="submit">
                {editingLot ? "Modifier" : "Ajouter"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AgentLot;
