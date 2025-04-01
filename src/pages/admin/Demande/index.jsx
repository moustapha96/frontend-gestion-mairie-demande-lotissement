
import React, { useState, useEffect } from "react";
import { Table, Input, Card, Space, Button, Typography, Upload, Modal, Select, message } from "antd";
import { SearchOutlined, FileExcelOutlined, FilePdfOutlined, DownloadOutlined, ImportOutlined, EyeOutlined, DeleteOutlined, FileTextFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { AdminBreadcrumb } from "@/components";
import { getDemandes, updateDemandeStatut, getFileDocument, importDemandes, deleteDemande, updateDemandeRefus } from "@/services/demandeService";
import { useAuthContext } from "@/context";
import { exportDemandesToCSV, exportDemandesToPDF } from "@/utils/export_demande";
import { templateDemande } from "../../../utils/export_demandeur";
import { cn } from "@/utils";
import { sendSimpleMailRefus } from "@/services/mailerService";


const { Title } = Typography;
const { Option } = Select;

const AdminDemandeListe = () => {
  const { user } = useAuthContext();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingDemande, setLoadingDemande] = useState(null);

  // États pour le popup d'envoi d'email
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const fetchDemandes = async () => {
    try {
      const data = await getDemandes();
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

  // Modification de la fonction pour récupérer l'objet complet de la demande
  const handleUpdateStatut = async (demande, nouveauStatut) => {
    Modal.confirm({
      title: "Confirmation",
      okButtonProps: { style: { backgroundColor: "#28a745", borderColor: "#28a745" } },
      content: "Voulez-vous vraiment changer le statut de cette demande ?",
      onOk: async () => {
        try {
          await updateDemandeStatut(demande.id, nouveauStatut);
          const updatedDemandes = demandes.map((d) => {
            if (d.id === demande.id) {
              return { ...d, statut: nouveauStatut };
            }
            return d;
          });
          setDemandes(updatedDemandes);
          message.success("Statut mis à jour avec succès");
          // Si le nouveau statut est REJETE, on ouvre le popup pour envoyer un email
          if (nouveauStatut === "REJETE") {
            setSelectedDemande(demande);
            setIsEmailModalVisible(true);
          }
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
    Modal.confirm({
      title: "Confirmation",
      okButtonProps: { style: { backgroundColor: "#28a745", borderColor: "#28a745" } },
      cancelButtonProps: { style: { backgroundColor: "#dc3545", borderColor: "#dc3545", color: "#FFFFFF" } },
      content: "Voulez-vous vraiment supprimer cette demande ?",
      onOk: async () => {
        try {
          await deleteDemande(demandeId);
          const updatedDemandes = demandes.filter((d) => d.id !== demandeId);
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

  // Fonction pour envoyer l'email
  const handleSendEmail = async () => {
    // Remplacez ici par votre logique d'envoi d'email (API, etc.)
    try {
      // Simuler l'envoi d'email
      console.log("Email envoyé pour la demande :", selectedDemande);
      console.log("Sujet :", emailSubject);
      console.log("Message :", emailBody);
      message.success("Email envoyé avec succès");
      const resultat = await updateDemandeRefus(selectedDemande.id, emailBody);
      console.log("Résultat de la mise à jour :", resultat);
      const body = { sujet: emailSubject, email: selectedDemande.demandeur.email, message: emailBody };
      console.log("Body :", body);
      const response = await sendSimpleMailRefus(body);
      console.log("Response :", response);
      setEmailSubject("");
      setEmailBody("");
      setIsEmailModalVisible(false);
    } catch (error) {
      message.error("Erreur lors de l'envoi de l'email");
    }
  };

  const columns = [
    {
      title: "Localité",
      dataIndex: "localite",
      key: "localite",
      render: (_, record) =>
        record.localite ? (
          <Link to={`/admin/localites/${record.localite.id}/details`} className="text-primary hover:text-primary-light transition-colors duration-200 flex items-center gap-1">
            {record.localite.nom}
          </Link>
        ) : (
          "N/A"
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
      render: (_, record) =>
        record.demandeur ? (
          <Link to={`/admin/demandeur/${record.demandeur.id}/details`} className="text-primary hover:text-primary-light transition-colors duration-200 flex items-center gap-1">
            {record.demandeur.nom} {record.demandeur.prenom}
          </Link>
        ) : (
          "N/A"
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
          onChange={(value) => handleUpdateStatut(record, value)}
          style={{ width: 120 }}
          className={cn(
            "text-sm border rounded-md py-1 px-2 focus:ring-2 focus:ring-opacity-50 focus:outline-none",
            {
              "bg-yellow-200 border border-yellow-200": statut === "EN_COURS",
              "bg-yellow-100 text-yellow-800 border border-yellow-500": statut === "EN_TRAITEMENT",
              "bg-green-100 text-green-800 border border-green-500": statut === "VALIDE",
              "bg-red-100 text-red-800 border border-red-500": statut === "REJETE",
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
          {record.statut === "VALIDE" && (
            <Link to={`/admin/demandes/${record.id}/confirmation`} className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors duration-200">
              <FileTextFilled className="w-4 h-4 mr-1" />
              Générer document
            </Link>
          )}
          <Link to={`/admin/demandes/${record.id}/details`}>
            <Button className="bg-primary text-white" icon={<EyeOutlined />} title="Voir les détails">
              Détails
            </Button>
          </Link>
          {user.roles.includes("ROLE_SUPER_ADMIN") && (
            <Button
              className="text-red-500"
              disabled={loadingDemande === record.id}
              onClick={() => handleDelete(record.id)}
              loading={loadingDemande === record.id}
              color="red"
              variant="filled"
            >
              <DeleteOutlined />
            </Button>
          )}
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
                      accept=".xlsx"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        handleImportFile(file);
                        return false;
                      }}
                    >
                      <Button icon={<ImportOutlined />} loading={importLoading}>
                        Importer EXCEL
                      </Button>
                    </Upload>
                    <Button icon={<DownloadOutlined />} onClick={templateDemande}>
                      Télécharger Template
                    </Button>
                    <Button icon={<FileExcelOutlined />} onClick={() => exportDemandesToCSV(demandes)}>
                      Exporter CSV
                    </Button>
                    <Button icon={<FilePdfOutlined />} onClick={() => exportDemandesToPDF(demandes)}>
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
        title={`Document ${isViewerOpen ? "Recto/Verso" : ""}`}
        visible={isViewerOpen}
        onCancel={() => setIsViewerOpen(false)}
        footer={null}
        width={800}
      >
        {fileLoading ? (
          <div className="flex justify-center items-center p-8">Chargement du document...</div>
        ) : (
          activeDocument && (
            <div className="w-full">
              <img src={activeDocument} alt="Document" className="w-full" />
            </div>
          )
        )}
      </Modal>

      {/* Modal d'envoi d'email après refus */}
      <Modal
        title="Envoyer un email"
        visible={isEmailModalVisible}
        onCancel={() => setIsEmailModalVisible(false)}
        onOk={handleSendEmail}
        okButtonProps={{ style: { backgroundColor: "#28a745", borderColor: "#28a745" } }}
        okText="Envoyer"
      >
        <Input
          placeholder="Sujet"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Input.TextArea
          placeholder="Message"
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
          rows={4}
        />
      </Modal>
    </>
  );
};

export default AdminDemandeListe;
