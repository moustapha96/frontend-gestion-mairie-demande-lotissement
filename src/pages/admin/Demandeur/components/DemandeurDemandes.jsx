import React, { useState, useEffect } from "react";
import { Table, Card, Space, Button, Typography, Select, message, Modal, Result, Input } from "antd";
import { FileTextFilled, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { AdminBreadcrumb } from "@/components";
import { getDemandeurDetails } from "@/services/userService";
import { updateDemandeStatut } from "@/services/demandeService";
import { cn } from "@/utils";
import { getDemandeurDemandes } from "../../../../services/demandeService";


const { Title } = Typography;

const AdminDemandeurDemandes = () => {
  const { id } = useParams();
  const [demandeur, setDemandeur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [demandes, setDemandes] = useState([]);

  useEffect(() => {
    const fetchDemandeur = async () => {
      try {
        const data = await getDemandeurDetails(id);
        setDemandeur(data);
      } catch (err) {
        setError(err.message);
        message.error("Erreur lors du chargement des demandes");
      } finally {
        setLoading(false);
      }
    };
    const fetchDemandes = async () => {
      try {
        const data = await getDemandeurDemandes(id);
        console.log(data);
        setDemandes(data);
      } catch (err) {
        setError(err.message);
        message.error("Erreur lors du chargement des demandes");
      } finally {
        setLoading(false);
      }
    };
    fetchDemandes();
    fetchDemandeur();
  }, [id]);

  const handleUpdateStatut = (demandeId, nouveauStatut) => {
    Modal.confirm({
      title: "Confirmation",
      content: "Voulez-vous vraiment changer le statut de cette demande ?",
      okButtonProps: { style: { backgroundColor: "#28a745" } },
      onOk: async () => {
        try {
          await updateDemandeStatut(demandeId, nouveauStatut);
          setDemandeur(prev => ({
            ...prev,
            demandes: prev.demandes.map(demande =>
              demande.id === demandeId
                ? { ...demande, statut: nouveauStatut }
                : demande
            )
          }));
          message.success("Statut mis à jour avec succès");
        } catch (error) {
          message.error("Erreur lors de la mise à jour du statut");
        }
      }
    });
  };

  const columns = [
    {
      title: "Localité",
      key: "localite",
      dataIndex: "localite",
      render: (localite) =>
        // admin / localites /: id/ details
        localite ? <Link to={`/admin/localites/${localite.id}/details`}>{localite.nom}</Link> : "Non spécifiée",
      sorter: (a, b) => {
        if (!a.localite && !b.localite) return 0
        if (!a.localite) return -1
        if (!b.localite) return 1
        return a.localite.nom.localeCompare(b.localite.nom)
      },
      filters: demandes
        .filter((d) => d.localite)
        .map((d) => d.localite)
        .filter((localite, index, self) => index === self.findIndex((l) => l.id === localite.id))
        .map((localite) => ({ text: localite.nom, value: localite.id })),
      onFilter: (value, record) => record.localite && record.localite.id === value,
    },
    {
      title: "Type de Demande",
      dataIndex: "typeDemande",
      key: "typeDemande",
      sorter: (a, b) => a.typeDemande.localeCompare(b.typeDemande),
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
      <Result
        status="error"
        title="Erreur"
        subTitle={error}
      />
    );
  }

  const filteredDemandes = demandeur?.demandes?.filter(demande =>
    demande.typeDemande.toLowerCase().includes(searchText.toLowerCase()) ||
    demande.localite?.nom.toLowerCase().includes(searchText.toLowerCase())
  ) || [];

  return (
    <>
      <AdminBreadcrumb
        title="Demandes du Demandeur"
        SubTitle={demandeur ? `${demandeur.prenom} ${demandeur.nom}` : ''}
      />
      <div className="container my-6">
        <Card className="shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <Title level={4}>Liste des Demandes</Title>
            <div className="flex gap-2">
              <Button
                className="text-primary"
                onClick={() => window.history.back()}
              >
                Retour
              </Button>
            </div>
          </div>

          <Input
            placeholder="Rechercher par type de demande ou localité..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300, marginBottom: 16 }}
          />

          <Table
            columns={columns}
            dataSource={filteredDemandes}
            rowKey="id"
            loading={loading}
            pagination={{
              defaultPageSize: 5,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} demandes`
            }}
            scroll={{ x: true }}
          />
        </Card>
      </div>
    </>
  );
};

export default AdminDemandeurDemandes;
