import React, { useState, useEffect } from "react";
import { Table, Input, Card, Space, Button, Typography, Tag, Modal, Descriptions, message } from "antd";
import { SearchOutlined, FileTextOutlined, FileExcelOutlined, FilePdfOutlined } from "@ant-design/icons";
import { getDocumentDemandeur, getDocuments } from "@/services/documentService";
import { useAuthContext } from "@/context";
import { exportToCSV, exportToPDF } from "@/utils/export_function";

const { Title } = Typography;

const DocumentListe = () => {
  const { user } = useAuthContext();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await getDocuments();
        setDocuments(res);
      } catch (err) {
        setError(err.message);
        message.error("Erreur lors du chargement des documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [user.id]);

  const showModal = (document) => {
    setSelectedDocument(document);
    console.log(document);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedDocument(null);
  };

  const columns = [
    {
      title: "Numéro",
      key: "numero",
      render: (_, record) =>
        record.type === "PERMIS_OCCUPATION"
          ? record.contenu.numeroPermis
          : record.contenu === "PROPOSITION_BAIL" ? record.contenu.numeroProposition : record.contenu.numeroBail,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "PERMIS_OCCUPATION" ? "green" : "blue"}>
          {type === "PERMIS_OCCUPATION" ? "Permis d'occuper" : "Bail communal"}
        </Tag>
      ),
      filters: [
        { text: "Permis d'occuper", value: "PERMIS_OCCUPATION" },
        { text: "Bail communal", value: "BAIL_COMMUNAL" },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "Localité",
      key: "localite",
      render: (_, record) => record.demande.localite.nom,
      sorter: (a, b) =>
        a.demande.localite.nom.localeCompare(b.demande.localite.nom),
    },
    {
      title: "Superficie",
      key: "superficie",
      render: (_, record) => `${record.contenu.superficie} m²`,
      sorter: (a, b) => a.contenu.superficie - b.contenu.superficie,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          className="text-primary"
          icon={<FileTextOutlined />}
          onClick={() => showModal(record)}
        >
          Détails
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
    <Card className="shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <Title level={4}>Liste des Documents</Title>
        <div className="flex flex-wrap gap-2">
          <Button
            icon={<FileExcelOutlined />}
            onClick={() => exportToCSV(documents)}
          >
            Exporter CSV
          </Button>
          <Button
            className="text-primary"
            icon={<FilePdfOutlined />}
            onClick={() => exportToPDF(documents)}
          >
            Exporter PDF
          </Button>
        </div>
      </div>

      <Input
        placeholder="Rechercher par type ou localité..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 300, marginBottom: 16 }}
      />

      <Table
        columns={columns}
        dataSource={documents.filter(
          (doc) =>
            doc.type.toLowerCase().includes(searchText.toLowerCase()) ||
            doc.demande.localite.nom
              .toLowerCase()
              .includes(searchText.toLowerCase())
        )}
        rowKey="id"
        loading={loading}
        pagination={{
          defaultPageSize: 5,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} documents`,
        }}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title="Détails du Document"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Fermer
          </Button>,
        ]}
        width={800}
      >
        {selectedDocument && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Type">
              {selectedDocument.type === "PERMIS_OCCUPATION"
                ? "Permis d'occuper"
                : "Bail communal"}
            </Descriptions.Item>
            <Descriptions.Item label="Numéro">
              {selectedDocument.type === "PERMIS_OCCUPATION"
                ? selectedDocument.contenu.numeroPermis
                : selectedDocument.contenu.numeroBail}
            </Descriptions.Item>
            <Descriptions.Item label="Localité">
              {selectedDocument.demande.localite.nom}
            </Descriptions.Item>
            <Descriptions.Item label="Superficie">
              {selectedDocument.contenu.superficie} m²
            </Descriptions.Item>
            <Descriptions.Item label="Date de création">
              {new Date(selectedDocument.dateCreation).toLocaleDateString(
                "fr-FR",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Demandeur">
              {selectedDocument.demandeur.prenom}{" "}
              {selectedDocument.demandeur.nom}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Card>
  );
};

export default DocumentListe;
