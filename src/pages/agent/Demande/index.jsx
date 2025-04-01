// "use client"
// import { AgentBreadcrumb } from "@/components"
// import { LuSearch, LuChevronLeft, LuChevronRight, LuExternalLink } from "react-icons/lu"
// import { Link } from "react-router-dom"
// import { useState, useEffect } from "react"
// import { cn } from "@/utils"
// import { getDemandes, updateDemandeStatut } from "@/services/demandeService"
// import { useAuthContext } from "@/context"
// import { toast } from "sonner"
// import { FileDown, FileSpreadsheet, FileText, Loader2 } from "lucide-react"
// import { exportToPDF } from "@/utils/export_function"
// import { exportDemandesToCSV, exportDemandesToPDF } from "@/utils/export_demande"

// const AgentDemandeListe = () => {
//   const { user } = useAuthContext()
//   const [demandes, setDemandes] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [filter, setFilter] = useState("")
//   const [currentPage, setCurrentPage] = useState(1)
//   const [itemsPerPage] = useState(5)

//   useEffect(() => {
//     const fetchDemandes = async () => {
//       try {
//         const data = await getDemandes()
//         setDemandes(data)
//       } catch (err) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchDemandes()
//   }, [])

//   // if (loading) return <div className="flex justify-center items-center h-screen">Chargement des demandes...</div>
//   if (error) return <div className="flex justify-center items-center h-screen text-red-500">Erreur: {error}</div>

//   const filteredDemandes = demandes.filter(
//     (demande) =>
//       demande.typeDemande.toLowerCase().includes(filter.toLowerCase()) ||
//       demande.demandeur.nom.toLowerCase().includes(filter.toLowerCase()) ||
//       demande.demandeur.prenom.toLowerCase().includes(filter.toLowerCase()),
//   )

//   const indexOfLastItem = currentPage * itemsPerPage
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage
//   const currentItems = filteredDemandes.slice(indexOfFirstItem, indexOfLastItem)

//   const paginate = (pageNumber) => setCurrentPage(pageNumber)

//   const handleUpdateStatut = async (demandeId, nouveauStatut) => {
//     const confirm = window.confirm("Voulez-vous vraiment changer le statut de cette demande ?");
//     if (!confirm) return;

//     try {
//       await updateDemandeStatut(demandeId, nouveauStatut);
//       const updatedDemandes = demandes.map(demande => {
//         if (demande.id === demandeId) {
//           return { ...demande, statut: nouveauStatut };
//         }
//         return demande;
//       });
//       setDemandes(updatedDemandes);
//       toast.success("Statut mis à jour avec succès");
//     } catch (error) {
//       toast.error("Erreur lors de la mise à jour du statut");
//     }
//   };

//   return (
//     <>
//       <AgentBreadcrumb title="Liste des demandes" />
//       <section>
//         <div className="container">
//           <div className="my-6 space-y-6">
//             <div className="bg-white dark:bg-default-50 shadow-lg rounded-lg overflow-hidden">

//               <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
//                 <h4 className="text-xl font-semibold text-gray-800 dark:text-white ">Liste des Demandes</h4>
//               </div>

//               <div className="flex items-center justify-end border-b gap-4 border-gray-200 px-6 py-4">

//                 <button
//                   onClick={() => exportDemandesToCSV(demandes)}
//                   className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
//                 >
//                   <FileSpreadsheet className="w-4 h-4" />
//                   Exporter CSV
//                 </button>


//                 <button
//                   onClick={() => exportDemandesToPDF(demandes)}
//                   className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark"
//                 >
//                   <FileDown className="w-4 h-4" />
//                   Exporter PDF
//                 </button>



//               </div>

//               <div className="p-6">
//                 <div className="flex mb-4 justify-center">
//                   <div className="relative w-full max-w-md">
//                     <input
//                       type="text"
//                       placeholder="Rechercher par type de demande ou demandeur..."
//                       value={filter}
//                       onChange={(e) => setFilter(e.target.value)}
//                       className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//                     />
//                     <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   </div>
//                 </div>

//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th
//                           scope="col"
//                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                         >
//                           Demandeur
//                         </th>
//                         <th
//                           scope="col"
//                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                         >
//                           Type de Demande
//                         </th>
//                         <th
//                           scope="col"
//                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                         >
//                           Date de Création
//                         </th>
//                         <th
//                           scope="col"
//                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                         >
//                           Statut
//                         </th>
//                         <th
//                           scope="col"
//                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                         >
//                           Localité
//                         </th>
//                         <th
//                           scope="col"
//                           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                         >
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {currentItems.map((demande) => (
//                         <tr key={demande.id} className="hover:bg-gray-50 transition-colors duration-200">
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                             <Link
//                               to={`/agent/demandeur/${demande.demandeur.id}/details`}
//                               className="text-primary hover:text-primary-dark transition-colors duration-200"
//                             >
//                               {demande.demandeur.prenom + " " + demande.demandeur.nom}
//                             </Link>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{demande.typeDemande}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {new Date(demande.dateCreation).toLocaleDateString()}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">

//                             <span className={cn(
//                               "text-sm border rounded-md py-1 px-2 focus:ring-2 focus:ring-opacity-50 focus:outline-none",
//                               {
//                                 'bg-yellow-200 border border-yellow-200': demande.statut === 'EN_COURS',
//                                 'bg-yellow-100 text-yellow-800 border border-yellow-500': demande.statut === 'EN_TRAITEMENT',
//                                 'bg-green-100 text-green-800 border border-green-500': demande.statut === 'VALIDE',
//                                 'bg-red-100 text-red-800 border border-red-500': demande.statut === 'REJETE'
//                               }
//                             )} >
//                               {demande.statut}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {demande.localite ? (
//                               <Link
//                                 to={`/agent/localites/${demande.localite.id}/details`}
//                                 className="text-primary hover:text-primary-light transition-colors duration-200 flex items-center gap-1"
//                               >
//                                 {demande.localite.nom}
//                                 <LuExternalLink className="h-4 w-4" />
//                               </Link>
//                             ) : (
//                               "N/A"
//                             )}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                             <div className="flex items-center space-x-4">
//                               <Link
//                                 to={`/agent/demandes/${demande.id}/details`}
//                                 className="text-primary hover:text-primary-light transition-colors duration-200"
//                               >
//                                 Détails
//                               </Link>

//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                     {loading && (
//                       <tbody className="w-full">
//                         <tr>
//                           <td colSpan="5" className="px-6 py-12">
//                             <div className="flex items-center justify-center">
//                               <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                             </div>
//                           </td>
//                         </tr>
//                       </tbody>
//                     )}
//                   </table>
//                 </div>

//                 <div className="flex items-center justify-between mt-4">
//                   <div className="text-sm text-gray-700">
//                     Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredDemandes.length)} sur{" "}
//                     {filteredDemandes.length} entrées
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <button
//                       onClick={() => paginate(currentPage - 1)}
//                       disabled={currentPage === 1}
//                       className={cn(
//                         "px-3 py-1 rounded-md",
//                         currentPage === 1
//                           ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                           : "bg-white text-gray-700 hover:bg-gray-50",
//                       )}
//                     >
//                       <LuChevronLeft className="h-5 w-5" />
//                     </button>
//                     {Array.from({ length: Math.ceil(filteredDemandes.length / itemsPerPage) }).map((_, index) => (
//                       <button
//                         key={index}
//                         onClick={() => paginate(index + 1)}
//                         className={cn(
//                           "px-3 py-1 rounded-md",
//                           currentPage === index + 1 ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-50",
//                         )}
//                       >
//                         {index + 1}
//                       </button>
//                     ))}
//                     <button
//                       onClick={() => paginate(currentPage + 1)}
//                       disabled={currentPage === Math.ceil(filteredDemandes.length / itemsPerPage)}
//                       className={cn(
//                         "px-3 py-1 rounded-md",
//                         currentPage === Math.ceil(filteredDemandes.length / itemsPerPage)
//                           ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                           : "bg-white text-gray-700 hover:bg-gray-50",
//                       )}
//                     >
//                       <LuChevronRight className="h-5 w-5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>

//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   )
// }

// export default AgentDemandeListe


import React, { useState, useEffect } from "react";
import { Table, Input, Card, Space, Button, Typography, Upload, Modal, Select, message, Spin } from "antd";
import { SearchOutlined, FileExcelOutlined, FilePdfOutlined, DownloadOutlined, ImportOutlined, EyeOutlined, EditOutlined, FileTextFilled, ExclamationOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { AgentBreadcrumb  } from "@/components";
import { getDemandes, updateDemandeStatut, getFileDocument } from "@/services/demandeService";
import { useAuthContext } from "@/context";
import { exportDemandesToCSV, exportDemandesToPDF } from "@/utils/export_demande";
import { importDemandes } from "@/services/demandeService";
import { cn } from "@/utils";
import { templateDemande } from "../../../utils/export_demandeur";
import { deleteDemande } from "../../../services/demandeService";

const { Title } = Typography;
const { Option } = Select;

const AgentDemandeListe = () => {
  const { user } = useAuthContext();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [viewType, setViewType] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState(null);
  const [demande, setDemande] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingDemande, setLoadingDemande] = useState(null);

  const fetchDemandes = async () => {
    try {
      const data = await getDemandes();
      console.log(data)
      setDemandes(data);
    } catch (err) {
      message.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  const handleUpdateStatut = async (demandeId, nouveauStatut) => {
    Modal.confirm({
      title: "Confirmation",
      okButtonProps: { style: { backgroundColor: "#28a745", borderColor: "#28a745" } }, // Vert
      content: "Voulez-vous vraiment changer le statut de cette demande ?",
      onOk: async () => {
        try {
          await updateDemandeStatut(demandeId, nouveauStatut);
          const updatedDemandes = demandes.map(demande => {
            if (demande.id === demandeId) {
              return { ...demande, statut: nouveauStatut };
            }
            return demande;
          });
          setDemandes(updatedDemandes);
          message.success("Statut mis à jour avec succès");
        } catch (error) {
          message.error("Erreur lors de la mise à jour du statut");
        }
      },
    });
  };



  const handleImportFile = async (file) => {
    try {
      setImportLoading(true);
      await importDemandes(file);
      message.success("Demandes importées avec succès");
      fetchDemandes();
    } catch (error) {
      message.error("Erreur lors de l'importation des demandes");
    } finally {
      setImportLoading(false);
    }
  };

  const handleDelete = async (demandeId) => {
    setDeleting(true);
    setLoadingDemande(demandeId);
    // confirmation 
    Modal.confirm({
      title: "Confirmation",
      okButtonProps: { style: { backgroundColor: "#28a745", borderColor: "#28a745" } },
      cancelButtonProps: { style: { backgroundColor: "#dc3545", borderColor: "#dc3545" , color: "#FFFFFF" } },
      content: "Voulez-vous vraiment supprimer cette demande ?",
      onOk: async () => {
        try {
          await deleteDemande(demandeId);
          const updatedDemandes = demandes.filter(demande => demande.id !== demandeId);
          setDemandes(updatedDemandes);
          message.success("Demande supprimée avec succès");
        } catch (error) {
          message.error("Erreur lors de la suppression de la demande");
        } finally {
          setDeleting(false);
        }
      },
      onCancel: () => {
        setDeleting(false);
        setLoadingDemande(null);
      },
    });
  };

  const columns = [
    {
      title: "Localité",
      dataIndex: "localite",
      key: "localite",
      render: (_, record) => (
        record.localite ? (
          <Link
            to={`/agent/localites/${record.localite.id}/details`}
            className="text-primary hover:text-primary-light transition-colors duration-200 flex items-center gap-1"
          >
            {record.localite.nom}
          </Link>
        ) : (
          "N/A"
        )
      ),
      sorter: (a, b) => a.localite?.nom.localeCompare(b.localite?.nom),
    },
    {
      title: "Type de Demande",
      dataIndex: "typeDemande",
      key: "typeDemande",
      filters: [
        { text: "Permis d'occupation", value: "PERMIS_OCCUPATION" },
        { text: "Proposition de bail", value: "PROPOSITION_BAIL" },
        { text: "Bail communal", value: "BAIL_COMMUNAL" },
      ],
      onFilter: (value, record) => record.typeDemande === value,
    },
    {
      title: "Demandeur",
      key: "demandeur",
      render: (_, record) => (
        record.demandeur ? (
          <Link
          to={`/agent/demandeur/${record.demandeur.id}/details`}
            className="text-primary hover:text-primary-light transition-colors duration-200 flex items-center gap-1"
          >
            {record.demandeur.nom} {record.demandeur.prenom}
          </Link>
        ) : (
          "N/A"
        )
      ),
      sorter: (a, b) => {
        if (!a.demandeur || !b.demandeur) return 0;
        return (a.demandeur.nom + a.demandeur.prenom).localeCompare(b.demandeur.nom + b.demandeur.prenom);
      },
    },
    {
      title: "Date demande",
      key: "date_demande",
      render: (_, record) => new Date(record.dateCreation).toLocaleDateString(),
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      render: (statut, record) => (
        <Select
          value={statut}
          onChange={(value) => handleUpdateStatut(record.id, value)}
          style={{ width: 150 }}
          className={cn(
            "text-sm border rounded-md py-1 px-2 focus:ring-2 focus:ring-opacity-50 focus:outline-none",
            {
              'bg-yellow-200 border border-yellow-200': statut === 'EN_COURS',
              'bg-yellow-100 text-yellow-800 border border-yellow-500': statut === 'EN_TRAITEMENT',
              'bg-green-100 text-green-800 border border-green-500': statut === 'VALIDE',
              'bg-red-100 text-red-800 border border-red-500': statut === 'REJETE'
            }
          )}
        >
          <option value="EN_COURS">Soumission</option>
          <option value="EN_TRAITEMENT">En traitement</option>
          <option value="VALIDE">Validé</option>
          <option value="REJETE">Rejeté</option>
        </Select>
      ),
      filters: [
        { text: "Soumission", value: "EN_COURS" },
        { text: "En traitement", value: "EN_TRAITEMENT" },
        { text: "Validée", value: "VALIDE" },
        { text: "Rejetée", value: "REJETE" },
      ],
      onFilter: (value, record) => record.statut === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {/* {record.statut === 'VALIDE' && (
            <Link
              to={`/agent/demandes/${record.id}/confirmation`}
              className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors duration-200"
            >
              <FileTextFilled className="w-4 h-4 mr-1" />
              Générer document
            </Link>
          )} */}
          <Link  to={`/agent/demandes/${record.id}/details`}>
            <Button className="bg-primary text-white" icon={<EyeOutlined />} title="Voir les détails" >Détails</Button>
          </Link>
          
        </Space>
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
      <AgentBreadcrumb  title="Liste des demandes" />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <div className="grid grid-cols-1">
              <Card className="shadow-lg rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <Title level={4}>Liste des Demandes</Title>
                  <Space>
                    <Upload
                      accept=".xlsx"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        handleImportFile(file);
                        return false;
                      }}
                    >
                      <Button
                        icon={<ImportOutlined />}
                        loading={importLoading}
                      >
                        Importer EXCEL
                      </Button>
                    </Upload>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={templateDemande}
                    >
                      Télécharger Template
                    </Button>
                    <Button
                      icon={<FileExcelOutlined />}
                      onClick={() => exportDemandesToCSV(demandes)}
                    >
                      Exporter CSV
                    </Button>
                    <Button
                      icon={<FilePdfOutlined />}
                      onClick={() => exportDemandesToPDF(demandes)}
                    >
                      Exporter PDF
                    </Button>
                  </Space>
                </div>

                <Input
                  placeholder="Rechercher par type de demande ou demandeur..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300, marginBottom: 16 }}
                />

                <Table
                  columns={columns}
                  dataSource={demandes.filter(
                    (item) =>
                      item.typeDemande.toLowerCase().includes(searchText.toLowerCase()) ||
                      item.demandeur?.nom.toLowerCase().includes(searchText.toLowerCase()) ||
                      item.demandeur?.prenom.toLowerCase().includes(searchText.toLowerCase())
                  )}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    defaultPageSize: 5,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} demandes`,
                  }}
                />
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Modal
        title={`Document ${viewType === 'recto' ? 'Recto' : 'Verso'}`}
        open={isViewerOpen}
        onCancel={() => setIsViewerOpen(false)}
        footer={null}
        width={800}
      >
        {fileLoading ? (
          <div className="flex justify-center items-center p-8">
            Chargement du document...
          </div>
        ) : (
          activeDocument && (
            <div className="w-full">
              <img src={activeDocument} alt="Document" className="w-full" />
            </div>
          )
        )}
      </Modal>
    </>
  );
};

export default AgentDemandeListe;
