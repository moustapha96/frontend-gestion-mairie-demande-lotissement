import React, { useState, useEffect } from "react";
import { Table, Input, Card, Space, Button, Typography, Upload, Modal, Select, message } from "antd";
import { SearchOutlined, FileExcelOutlined, FilePdfOutlined, DownloadOutlined, ImportOutlined, EyeOutlined, EditOutlined, FileTextFilled, ExclamationOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { AdminBreadcrumb } from "@/components";
import { getDemandes, updateDemandeStatut, getFileDocument } from "@/services/demandeService";
import { useAuthContext } from "@/context";
import { exportDemandesToCSV, exportDemandesToPDF } from "@/utils/export_demande";
import { importDemandes } from "@/services/demandeService";
import { cn } from "@/utils";

const { Title } = Typography;
const { Option } = Select;

const AdminDemandeListe = () => {
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

  const handleViewDocument = async (type, record) => {
    try {
      if (!record?.id) {
        message.error("Impossible de charger le document");
        return;
      }

      setFileLoading(true);
      setViewType(type);
      setIsViewerOpen(true);

      const fileData = await getFileDocument(record.id);

      if (!fileData) {
        message.error("Document non trouvé");
        return;
      }

      const document = type === 'recto' ? fileData.recto : fileData.verso;
      setActiveDocument(document);
    } catch (error) {
      console.error('Erreur lors du chargement du document:', error);
      message.error("Erreur lors du chargement du document");
    } finally {
      setFileLoading(false);
    }
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

  const downloadTemplate = () => {
    const headers = ["CNI", "Email", "Nom", "Prenom", "Telephone", "Adresse", "Lieu de Naissance", "Profession", "Type de demande", "Localite", "Usage prevu", "Date Demande"];
    const csvContent = headers.join(",");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template_import_demandes.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    {
      title: "Localité",
      dataIndex: "localite",
      key: "localite",
      render: (_, record) =>(
        record.localite ? (
          <Link
            to={`/admin/localites/${record.localite.id}/details`}
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
      sorter: (a, b) => a.typeDemande.localeCompare(b.typeDemande),
    },
    {
      title: "Demandeur",
      key: "demandeur",
      render: (_, record) =>(
        record.demandeur ? (
          <Link
            to={`/admin/demandeur/${record.demandeur.id}/details`}
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
          style={{ width: 120 }}
          className={cn  (
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
          {record.statut === 'VALIDE' && (
            <Link
              to={`/admin/demandes/${record.id}/confirmation`}
              className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors duration-200"
            >
              <FileTextFilled className="w-4 h-4 mr-1" />
              Générer document
            </Link>
          )}
          <Link to={`/admin/demandes/${record.id}/details`}>
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
      <AdminBreadcrumb title="Liste des demandes" />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <div className="grid grid-cols-1">
              <Card className="shadow-lg rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <Title level={4}>Liste des Demandes</Title>
                  <Space>
                    <Upload
                      accept=".csv"
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
                        Importer CSV
                      </Button>
                    </Upload>
                    <Button 
                      icon={<DownloadOutlined />}
                      onClick={downloadTemplate}
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
                    defaultPageSize: 10,
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

export default AdminDemandeListe;
