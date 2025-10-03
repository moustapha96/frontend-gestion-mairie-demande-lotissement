// import React, { useState, useEffect } from "react";
// import { Table, Card, Space, Button, Typography, Select, message, Modal, Result, Input, Tag } from "antd";
// import { FileTextFilled, EyeOutlined, SearchOutlined } from "@ant-design/icons";
// import { Link, useParams } from "react-router-dom";
// import { AdminBreadcrumb } from "@/components";
// import { getDemandeurDetails } from "@/services/userService";
// import { updateDemandeStatut } from "@/services/demandeService";
// import { cn } from "@/utils";
// import { getDemandeurDemandes } from "../../../../services/demandeService";
// import { listRequestsUser } from "@/services/requestService";


// const { Title } = Typography;

// const AdminDemandeurDemandes = () => {
//   const { id } = useParams();
//   const [demandeur, setDemandeur] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [demandes, setDemandes] = useState([]);

//   useEffect(() => {
//     const fetchDemandeur = async () => {
//       try {
//         const data = await getDemandeurDetails(id);
//         console.log(data)
//         setDemandeur(data);
//       } catch (err) {
//         setError(err.message);
//         message.error("Erreur lors du chargement des demandes");
//       } finally {
//         setLoading(false);
//       }
//     };
//     const fetchDemandes = async () => {
//       try {
//         const data = await listRequestsUser(id);
//         console.log(" Fetched demandes: ", data);
//         setDemandes(data);
//       } catch (err) {
//         setError(err.message);
//         console.error(err);
//         message.error("Erreur lors du chargement des demandes");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDemandes();
//     fetchDemandeur();
//   }, [id]);


//   const statutColor = (s) => {
//   switch (s) {
//     case "En attente": return "orange";
//     case "En cours de traitement": return "gold";
//     case "Approuvée": return "green";
//     case "Rejetée": return "red";
//     default: return "default";
//   }
// };


//   const columns = [
//     {
//       title: "Localité",
//       key: "localite",
//       dataIndex: "localite",
//       render: (localite) =>
//         // admin / localites /: id/ details
//         localite ? <Link to={`/admin/quartiers/${localite.id}/details`}>{localite.nom}</Link> : "Non spécifiée",
//       sorter: (a, b) => {
//         if (!a.localite && !b.localite) return 0
//         if (!a.localite) return -1
//         if (!b.localite) return 1
//         return a.localite.nom.localeCompare(b.localite.nom)
//       },
//       filters: demandes
//         .filter((d) => d.localite)
//         .map((d) => d.localite)
//         .filter((localite, index, self) => index === self.findIndex((l) => l.id === localite.id))
//         .map((localite) => ({ text: localite.nom, value: localite.id })),
//       onFilter: (value, record) => record.localite && record.localite.id === value,
//     },
//     {
//       title: "Type de Demande",
//       dataIndex: "typeDemande",
//       key: "typeDemande",
//       sorter: (a, b) => a.typeDemande.localeCompare(b.typeDemande),
//     },
//     {
//       title: "Date demande",
//       key: "date_demande",
//       render: (_, record) => new Date(record.dateCreation).toLocaleDateString(),
//     },
//      {
//       title: "Statut",
//       dataIndex: "statut",
//       key: "statut",
//       sorter: true,
//       render: (s) => <Tag color={statutColor(s)}>{s}</Tag>,
//       width: 180,
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <Space>
//           {record.statut === 'VALIDE' && (
//             <Link
//               to={`/admin/demandes/${record.id}/confirmation`}
//               className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors duration-200"
//             >
//               <FileTextFilled className="w-4 h-4 mr-1" />
//               Générer document
//             </Link>
//           )}
//           <Link to={`/admin/demandes/${record.id}/details`}>
//             <Button className="bg-primary text-white" icon={<EyeOutlined />} title="Voir les détails" >Détails</Button>
//           </Link>
//         </Space>
//       ),
//     },
//   ];

//   if (error) {
//     return (
//       <Result
//         status="error"
//         title="Erreur"
//         subTitle={error}
//       />
//     );
//   }

//   const filteredDemandes = demandeur?.demandes?.filter(demande =>
//     demande.typeDemande.toLowerCase().includes(searchText.toLowerCase()) ||
//     demande.localite?.nom.toLowerCase().includes(searchText.toLowerCase())
//   ) || [];

//   return (
//     <>
//       <AdminBreadcrumb
//         title="Demandes du Demandeur"
//         SubTitle={demandeur ? `${demandeur.prenom} ${demandeur.nom}` : ''}
//       />
//       <div className="container my-6">
//         <Card className="shadow-lg">
//           <div className="flex justify-between items-center mb-4">
//             <Title level={4}>Liste des Demandes</Title>
//             <div className="flex gap-2">
//               <Button
//                 className="text-primary"
//                 onClick={() => window.history.back()}
//               >
//                 Retour
//               </Button>
//             </div>
//           </div>

//           <Input
//             placeholder="Rechercher par type de demande ou localité..."
//             prefix={<SearchOutlined />}
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             style={{ width: 300, marginBottom: 16 }}
//           />

//           <Table
//             columns={columns}
//             dataSource={filteredDemandes}
//             rowKey="id"
//             loading={loading}
//             pagination={{
//               defaultPageSize: 5,
//               showSizeChanger: true,
//               showTotal: (total) => `Total ${total} demandes`
//             }}
//             scroll={{ x: 'max-content' }}
//           />
//         </Card>
//       </div>
//     </>
//   );
// };

// export default AdminDemandeurDemandes;
import React, { useEffect, useMemo, useState } from "react";
import { Table, Card, Space, Button, Typography, message, Result, Input, Tag } from "antd";
import { FileTextFilled, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { AdminBreadcrumb } from "@/components";
import { getDemandeurDetails } from "@/services/userService";
import { listRequestsUser } from "@/services/requestService";

const { Title } = Typography;

const AdminDemandeurDemandes = () => {
  const { id } = useParams();

  // État serveur
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  // État UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [demandeur, setDemandeur] = useState(null);
  const [searchText, setSearchText] = useState("");

  // État de pagination/tri côté serveur
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState("id");          // id | typeDemande | statut | dateCreation | superficie
  const [sortOrder, setSortOrder] = useState("DESC");         // ASC | DESC

  // Filtres optionnels (si tu veux les brancher ensuite depuis l’UI)
  const [localiteId, setLocaliteId] = useState(null);
  const [typeDemande, setTypeDemande] = useState(null);
  const [statut, setStatut] = useState(null);

  const fetchAll = async ({
    keepPage = true,
    nextPage = page,
    nextPageSize = pageSize,
    nextSortField = sortField,
    nextSortOrder = sortOrder,
    nextQ = searchText,
    nextLocaliteId = localiteId,
    nextTypeDemande = typeDemande,
    nextStatut = statut,
  } = {}) => {
    try {
      setLoading(true);

      // Demandeur (juste pour le sous-titre ; non bloquant)
      try {
        const d = await getDemandeurDetails(id);
        setDemandeur(d || null);
      } catch {
        /* no-op */
      }

      const params = {
        page: keepPage ? page : nextPage,
        pageSize: nextPageSize,
        sortField: nextSortField,
        sortOrder: nextSortOrder,
      };

      if (nextQ?.trim()) params.q = nextQ.trim();
      if (nextLocaliteId) params.localiteId = nextLocaliteId;
      if (nextTypeDemande) params.typeDemande = nextTypeDemande;
      if (nextStatut) params.statut = nextStatut;

      const res = await listRequestsUser(id, params);
      if (!res?.success) throw new Error("Réponse invalide");

      setRows(res.items || []);
      setTotal(res.total || 0);

      // si on a changé la page/taille depuis l’appel
      setPage(res.page || nextPage);
      setPageSize(res.pageSize || nextPageSize);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Erreur de chargement");
      message.error("Erreur lors du chargement des demandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll({ keepPage: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, page, pageSize, sortField, sortOrder]);

  // Submit de recherche (envoie q au backend)
  const onSearch = () => {
    fetchAll({
      keepPage: false,
      nextPage: 1,
      nextQ: searchText,
    });
  };

  const statutColor = (s) => {
    switch (s) {
      case "En attente": return "orange";
      case "En cours de traitement": return "gold";
      case "Approuvée": return "green";
      case "Rejetée": return "red";
      default: return "default";
    }
  };

  // Filtres de localité (depuis quartier.id pour la table — purement visuel)
  const localiteFilters = useMemo(() => {
    const m = new Map();
    rows.forEach((d) => {
      if (d?.quartier?.id && !m.has(d.quartier.id)) {
        m.set(d.quartier.id, { text: d.quartier.nom, value: d.quartier.id });
      }
    });
    return Array.from(m.values());
  }, [rows]);

  const columns = [
    {
      title: "Localité",
      key: "localite",
      render: (_, record) => {
        const q = record?.quartier;
        if (q?.id) return <Link to={`/admin/quartiers/${q.id}/details`}>{q.nom}</Link>;
        return record?.localite || "Non spécifiée";
      },
      sorter: true, // mappé sur dateCreation/superficie/etc. via onChange
      filters: localiteFilters,
      onFilter: (value, record) => record?.quartier?.id === value,
    },
    {
      title: "Type de Demande",
      dataIndex: "typeDemande",
      key: "typeDemande",
      sorter: true,
    },
    {
      title: "Date demande",
      key: "dateCreation",
      dataIndex: "dateCreation",
      sorter: true,
      render: (v) => (v ? new Date(v).toLocaleDateString() : "—"),
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      sorter: true,
      render: (s) => <Tag color={statutColor(s)}>{s || "—"}</Tag>,
      width: 180,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {record.statut === "Approuvée" && (
            <Link
              to={`/admin/demandes/${record.id}/confirmation`}
              className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors duration-200"
            >
              <FileTextFilled className="w-4 h-4 mr-1" />
              Générer document
            </Link>
          )}
          <Link to={`/admin/demandes/${record.id}/details`}>
            <Button className="bg-primary text-white" icon={<EyeOutlined />} title="Voir les détails">
              Détails
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  // Tri/pagination côté serveur
  const handleTableChange = (pagination, _filters, sorter) => {
    const nextPage = pagination.current || 1;
    const nextPageSize = pagination.pageSize || 10;

    // AntD: sorter.order ∈ {'ascend','descend', undefined}
    let nextSortField = sortField;
    let nextSortOrder = sortOrder;

    if (sorter?.field) {
      // On ne laisse passer que les champs que l’API autorise
      const allowed = ["id", "typeDemande", "statut", "dateCreation", "superficie"];
      nextSortField = allowed.includes(sorter.field) ? sorter.field : "id";
    } else {
      nextSortField = "id";
    }

    if (sorter?.order === "ascend") nextSortOrder = "ASC";
    else if (sorter?.order === "descend") nextSortOrder = "DESC";
    else nextSortOrder = "DESC";

    setSortField(nextSortField);
    setSortOrder(nextSortOrder);
    setPage(nextPage);
    setPageSize(nextPageSize);

    fetchAll({
      keepPage: true,
      nextPage,
      nextPageSize,
      nextSortField,
      nextSortOrder,
    });
  };

  if (error) {
    return <Result status="error" title="Erreur" subTitle={error} />;
  }

  return (
    <>
      <AdminBreadcrumb
        title="Demandes du Demandeur"
        SubTitle={demandeur ? `${demandeur.prenom ?? ""} ${demandeur.nom ?? ""}`.trim() : ""}
      />
      <div className="container my-6">
        <Card className="shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <Title level={4}>Liste des Demandes</Title>
            <div className="flex gap-2">
              <Button className="text-primary" onClick={() => window.history.back()}>
                Retour
              </Button>
            </div>
          </div>

          <Input
            placeholder="Rechercher par nom/prénom/tel/email (backend) ou par type/localité (via q)…"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={onSearch}
            style={{ width: 360, marginBottom: 16 }}
            allowClear
          />
          <Button onClick={onSearch} className="mb-4">Rechercher</Button>

          <Table
            columns={columns}
            dataSource={rows}
            rowKey="id"
            loading={loading}
            onChange={handleTableChange}
            scroll={{ x: "max-content" }}
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: true,
              showTotal: (t) => `Total ${t} demandes`,
            }}
          />
        </Card>
      </div>
    </>
  );
};

export default AdminDemandeurDemandes;
