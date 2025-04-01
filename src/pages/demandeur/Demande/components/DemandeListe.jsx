import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Input, Card, Tag, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getDemandesDemandeur } from "@/services/demandeService";
import { useAuthContext } from "@/context";

const DemandeListe = () => {
  const { user } = useAuthContext();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const data = await getDemandesDemandeur(user.id);
        setDemandes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDemandes();
  }, [user.id]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Erreur: {error}
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "VALIDE":
        return "success";
      case "REJETE":
        return "error";
      case "EN_COURS":
        return "warning";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (id) => `#${id}`,
    },
    {
      title: "Type de Demande",
      dataIndex: "typeDemande",
      key: "typeDemande",
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          record.typeDemande.toLowerCase().includes(value.toLowerCase()) ||
          (record.demandeur?.nom || "").toLowerCase().includes(value.toLowerCase()) ||
          (record.demandeur?.prenom || "").toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Date de Création",
      dataIndex: "dateCreation",
      key: "dateCreation",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.dateCreation) - new Date(b.dateCreation),
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      render: (statut) => (
        <Tag color={getStatusColor(statut)}>{statut}</Tag>
      ),
      filters: [
        { text: "VALIDE", value: "VALIDE" },
        { text: "REJETE", value: "REJETE" },
        { text: "EN_COURS", value: "EN_COURS" },
        { text: "EN_TRAITEMENT", value: "EN_TRAITEMENT" },
      ],
      onFilter: (value, record) => record.statut === value,
    },
    {
      title: "Localité",
      dataIndex: "localite",
      key: "localite",
      render: (localite) => localite?.nom || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => <>
        <Space>
          <Link
            to={`/demandeur/demandes/${record.id}/details`}
            className="text-primary hover:text-primary-700 transition-colors duration-200"
          >
            Détails
          </Link>

          {record.statut === "REJETE" && (
            <Link
              to={`/demandeur/demandes/${record.id}/modification`}
              className="text-primary hover:text-primary-700 transition-colors duration-200"
            >
              Modifier
            </Link>
          )}
        </Space>
      </>,
    },
  ];

  return (
    <Card className="shadow-lg rounded-lg">
      <div className="mb-4">
        <Input
          placeholder="Rechercher par type de demande ou demandeur..."
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full max-w-md"
        />
      </div>

      <Table
        columns={columns}
        dataSource={demandes}
        rowKey="id"
        loading={loading}
        pagination={{
          defaultPageSize: 5,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} demandes`,
        }}
      />
    </Card>
  );
};

export default DemandeListe;
