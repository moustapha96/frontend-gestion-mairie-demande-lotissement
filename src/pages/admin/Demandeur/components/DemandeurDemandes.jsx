
// import React, { useEffect, useMemo, useState } from "react";
// import { Table, Card, Space, Button, Typography, message, Result, Input, Tag } from "antd";
// import { FileTextFilled, EyeOutlined, SearchOutlined } from "@ant-design/icons";
// import { Link, useParams } from "react-router-dom";
// import { AdminBreadcrumb } from "@/components";
// import { getDemandeurDetails } from "@/services/userService";
// import { listRequestsUser } from "@/services/requestService";

// const { Title } = Typography;

// const AdminDemandeurDemandes = () => {
//   const { id } = useParams();

//   // État serveur
//   const [rows, setRows] = useState([]);
//   const [total, setTotal] = useState(0);

//   // État UI
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [demandeur, setDemandeur] = useState(null);
//   const [searchText, setSearchText] = useState("");

//   // État de pagination/tri côté serveur
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [sortField, setSortField] = useState("id");          // id | typeDemande | statut | dateCreation | superficie
//   const [sortOrder, setSortOrder] = useState("DESC");         // ASC | DESC

//   // Filtres optionnels (si tu veux les brancher ensuite depuis l’UI)
//   const [localiteId, setLocaliteId] = useState(null);
//   const [typeDemande, setTypeDemande] = useState(null);
//   const [statut, setStatut] = useState(null);

//   const fetchAll = async ({
//     keepPage = true,
//     nextPage = page,
//     nextPageSize = pageSize,
//     nextSortField = sortField,
//     nextSortOrder = sortOrder,
//     nextQ = searchText,
//     nextLocaliteId = localiteId,
//     nextTypeDemande = typeDemande,
//     nextStatut = statut,
//   } = {}) => {
//     try {
//       setLoading(true);

//       // Demandeur (juste pour le sous-titre ; non bloquant)
//       try {
//         const d = await getDemandeurDetails(id);
//         setDemandeur(d || null);
//       } catch {
//         /* no-op */
//       }

//       const params = {
//         page: keepPage ? page : nextPage,
//         pageSize: nextPageSize,
//         sortField: nextSortField,
//         sortOrder: nextSortOrder,
//       };

//       if (nextQ?.trim()) params.q = nextQ.trim();
//       if (nextLocaliteId) params.localiteId = nextLocaliteId;
//       if (nextTypeDemande) params.typeDemande = nextTypeDemande;
//       if (nextStatut) params.statut = nextStatut;

//       const res = await listRequestsUser(id, params);
//       console.log(res)
//       if (!res?.success) throw new Error("Réponse invalide");

//       setRows(res.items || []);
//       setTotal(res.total || 0);

//       // si on a changé la page/taille depuis l’appel
//       setPage(res.page || nextPage);
//       setPageSize(res.pageSize || nextPageSize);
//     } catch (err) {
//       console.error(err);
//       setError(err?.message || "Erreur de chargement");
//       message.error("Erreur lors du chargement des demandes");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAll({ keepPage: true });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id, page, pageSize, sortField, sortOrder]);

//   // Submit de recherche (envoie q au backend)
//   const onSearch = () => {
//     fetchAll({
//       keepPage: false,
//       nextPage: 1,
//       nextQ: searchText,
//     });
//   };

//   const statutColor = (s) => {
//     switch (s) {
//       case "En attente": return "orange";
//       case "En cours de traitement": return "gold";
//       case "Approuvée": return "green";
//       case "Rejetée": return "red";
//       default: return "default";
//     }
//   };

//   // Filtres de localité (depuis quartier.id pour la table — purement visuel)
//   const localiteFilters = useMemo(() => {
//     const m = new Map();
//     rows.forEach((d) => {
//       if (d?.quartier?.id && !m.has(d.quartier.id)) {
//         m.set(d.quartier.id, { text: d.quartier.nom, value: d.quartier.id });
//       }
//     });
//     return Array.from(m.values());
//   }, [rows]);

//   const columns = [
//     {
//       title: "Localité",
//       key: "localite",
//       render: (_, record) => {
//         const q = record?.quartier;
//         if (q?.id) return <Link to={`/admin/quartiers/${q.id}/details`}>{q.nom}</Link>;
//         return record?.localite || "Non spécifiée";
//       },
//       sorter: true,
//       filters: localiteFilters,
//       onFilter: (value, record) => record?.quartier?.id === value,
//     },
//     {
//       title: "Type de Demande",
//       dataIndex: "typeDemande",
//       key: "typeDemande",
//       sorter: true,
//     },
//     {
//       title: "Date demande",
//       key: "dateCreation",
//       dataIndex: "dateCreation",
//       sorter: true,
//       render: (v) => (v ? new Date(v).toLocaleDateString() : "—"),
//     },
//     {
//       title: "Statut",
//       dataIndex: "statut",
//       key: "statut",
//       sorter: true,
//       render: (s) => <Tag color={statutColor(s)}>{s || "—"}</Tag>,
//       width: 160,
//     },
//     {
//       title: "Parcelle",
//       key: "parcelleNumero",
//       sorter: false,
//       render: (_, record) => {
//         const numero = record?.attribution?.parcelle?.numero;
//         const idParcelle = record?.attribution?.parcelle?.id;
//         if (!numero) return "—";
//         return idParcelle ? (
//           <Link to={`/admin/parcelles/${idParcelle}/details`}>
//             <Tag>{numero}</Tag>
//           </Link>
//         ) : (
//           <Tag>{numero}</Tag>
//         );
//       },
//       width: 160,
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <Space>
//           {record.statut === "Approuvée" && !record?.attribution && (
//             <Link
//               to={`/admin/demandes/${record.id}/attribution`}
//               className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-900 hover:text-white transition-colors duration-200"
//             >
//               <FileTextFilled className="w-4 h-4 mr-1" />
//               Attribuer une parcelle
//             </Link>
//           )}
//           <Link to={`/admin/demandes/${record.id}/details`}>
//             <Button className="bg-primary text-white" icon={<EyeOutlined />}>
//               Détails
//             </Button>
//           </Link>
//         </Space>
//       ),
//     },
//   ];


//   // Tri/pagination côté serveur
//   const handleTableChange = (pagination, _filters, sorter) => {
//     const nextPage = pagination.current || 1;
//     const nextPageSize = pagination.pageSize || 10;

//     // AntD: sorter.order ∈ {'ascend','descend', undefined}
//     let nextSortField = sortField;
//     let nextSortOrder = sortOrder;

//     if (sorter?.field) {
//       // On ne laisse passer que les champs que l’API autorise
//       const allowed = ["id", "typeDemande", "statut", "dateCreation", "superficie"];
//       nextSortField = allowed.includes(sorter.field) ? sorter.field : "id";
//     } else {
//       nextSortField = "id";
//     }

//     if (sorter?.order === "ascend") nextSortOrder = "ASC";
//     else if (sorter?.order === "descend") nextSortOrder = "DESC";
//     else nextSortOrder = "DESC";

//     setSortField(nextSortField);
//     setSortOrder(nextSortOrder);
//     setPage(nextPage);
//     setPageSize(nextPageSize);

//     fetchAll({
//       keepPage: true,
//       nextPage,
//       nextPageSize,
//       nextSortField,
//       nextSortOrder,
//     });
//   };

//   if (error) {
//     return <Result status="error" title="Erreur" subTitle={error} />;
//   }

//   return (
//     <>
//       <AdminBreadcrumb
//         title="Demandes du Demandeur"
//         SubTitle={demandeur ? `${demandeur.prenom ?? ""} ${demandeur.nom ?? ""}`.trim() : ""}
//       />
//       <div className="container my-6">
//         <Card className="shadow-lg">
//           <div className="flex justify-between items-center mb-4">
//             <Title level={4}>Liste des Demandes</Title>
//             <div className="flex gap-2">
//               <Button className="text-primary" onClick={() => window.history.back()}>
//                 Retour
//               </Button>
//             </div>
//           </div>

//           <Input
//             placeholder="Rechercher par nom/prénom/tel/email..."
//             prefix={<SearchOutlined />}
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             onPressEnter={onSearch}
//             style={{ width: 360, marginBottom: 16 }}
//             allowClear
//           />
//           <Button onClick={onSearch} className="mb-4">Rechercher</Button>

//           <Table
//             columns={columns}
//             dataSource={rows}
//             rowKey="id"
//             loading={loading}
//             onChange={handleTableChange}
//             scroll={{ x: "max-content" }}
//             pagination={{
//               current: page,
//               pageSize,
//               total,
//               showSizeChanger: true,
//               showTotal: (t) => `Total ${t} demandes`,
//             }}
//           />
//         </Card>
//       </div>
//     </>
//   );
// };

// export default AdminDemandeurDemandes;

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Table, Card, Space, Button, Typography, message, Result, Input, Tag } from "antd";
import { FileTextFilled, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { AdminBreadcrumb } from "@/components";
import { getDemandeurDetails } from "@/services/userService";
import { listRequestsUser } from "@/services/requestService";
import dayjs from "dayjs";

const { Title } = Typography;

/* =========================
   Helpers FR / normalisation
   ========================= */
const norm = (v) =>
  String(v ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

// Types de demande -> FR (couvre: occupancy_permit, communal_lease, definitive_transfer, regularization/regularisation, etc.)
const TYPE_DEMANDE_LABELS = {
  occupancy_permit: "Permis d'occuper",
  communal_lease: "Bail communal",
  definitive_transfer: "Transfert définitif",

  regularization: "Régularisation",
  regularisation: "Régularisation",
  "régularisation": "Régularisation",

  // alias historiques éventuels
  attribution: "Permis d'occuper",
  authentication: "Authentification",
  authentification: "Authentification",
};
const toFrenchDemande = (v) => TYPE_DEMANDE_LABELS[norm(v)] || (v || "—");

// Types de titre -> FR (propage les mêmes codes si ton back renvoie parfois EN)
const TYPE_TITRE_LABELS = {
  occupancy_permit: "Permis d'occuper",
  communal_lease: "Bail communal",
  lease_proposal: "Proposition de bail",
  definitive_transfer: "Transfert définitif",

  // variantes FR sérialisées en snake
  "permis_d'occuper": "Permis d'occuper",
  "permis_d_occuper": "Permis d'occuper",
  "bail_communal": "Bail communal",
  "proposition_de_bail": "Proposition de bail",
  "transfert_definitif": "Transfert définitif",
  "transfert_définitif": "Transfert définitif",
};
const toFrenchTitre = (v) => TYPE_TITRE_LABELS[norm(v)] || (v || "—");

// Statuts -> FR + couleurs (couvre: pending, approuve, processing, en_cours, en_attente, etc.)
const statusColor = (statut) => {
  const s = norm(statut);
  if (["approuve", "approuvee", "approved", "valide", "validee"].includes(s)) return "green";
  if (["pending", "en_attente"].includes(s)) return "gold";
  if (["processing", "en_cours", "en_etude"].includes(s)) return "blue";
  if (["refuse", "refusee", "rejected"].includes(s)) return "red";
  return "default";
};
const statutFr = (s) => {
  if (s == null) return "—";
  const v = norm(s);
  if (v === "pending" || v === "en_attente") return "En attente";
  if (["processing", "en_cours", "en_etude"].includes(v)) return "En cours";
  if (["approuve", "approuvee", "approved", "valide", "validee"].includes(v)) return "Approuvée";
  if (["refuse", "refusee", "rejected"].includes(v)) return "Refusée";
  return s;
};
const isApproved = (s) => {
  const v = norm(s);
  return ["approuve", "approuvee", "approved", "valide", "validee"].includes(v);
};

const fmtDate = (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "—");

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
  const [sortField, setSortField] = useState("id");     // id | typeDemande | statut | dateCreation | superficie
  const [sortOrder, setSortOrder] = useState("DESC");    // ASC | DESC

  // Filtres optionnels (si tu veux les brancher ensuite depuis l’UI)
  const [localiteId, setLocaliteId] = useState(null);
  const [typeDemande, setTypeDemande] = useState(null); // si tu ajoutes un Select FR, pense à mapper FR->API ici
  const [statut, setStatut] = useState(null);

  const fetchAll = useCallback(async ({
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

      // Demandeur (non bloquant)
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
      if (nextTypeDemande) params.typeDemande = nextTypeDemande; // si UI en FR, mappe ici vers EN
      if (nextStatut) params.statut = nextStatut; // idem si tu filtres les statuts

      const res = await listRequestsUser(id, params);
      if (!res?.success) throw new Error("Réponse invalide");

      setRows(res.items || []);
      setTotal(res.total || 0);
      setPage(res.page || nextPage);
      setPageSize(res.pageSize || nextPageSize);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Erreur de chargement");
      message.error("Erreur lors du chargement des demandes");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, page, pageSize, sortField, sortOrder, searchText, localiteId, typeDemande, statut]);

  useEffect(() => {
    fetchAll({ keepPage: true });
  }, [fetchAll]);

  // Submit de recherche
  const onSearch = () => {
    fetchAll({
      keepPage: false,
      nextPage: 1,
      nextQ: searchText,
    });
  };

  // Filtres de localité (UI de table uniquement)
  const localiteFilters = useMemo(() => {
    const m = new Map();
    rows.forEach((d) => {
      const q = d?.quartier;
      if (q?.id && !m.has(q.id)) {
        m.set(q.id, { text: q.nom, value: q.id });
      }
    });
    return Array.from(m.values());
  }, [rows]);

  const columns = [
    {
      title: "Quartier",
      key: "localite",
      render: (_, record) => {
        const q = record?.quartier;
        if (q?.id) return <Link to={`/admin/quartiers/${q.id}/details`}>{q.nom}</Link>;
        return record?.localite || "Non spécifiée";
      },
      sorter: true,
      filters: localiteFilters,
      onFilter: (value, record) => record?.quartier?.id === value,
    },
    {
      title: "Type de Demande",
      dataIndex: "typeDemande",
      key: "typeDemande",
      sorter: true,
      render: (v) => <Tag>{toFrenchDemande(v)}</Tag>,
    },
    {
      title: "Type de Titre",
      dataIndex: "typeTitre",
      key: "typeTitre",
      sorter: true,
      render: (v) => <Tag color="purple">{toFrenchTitre(v)}</Tag>,
    },
    {
      title: "Date demande",
      key: "dateCreation",
      dataIndex: "dateCreation",
      sorter: true,
      render: (v) => (v ? fmtDate(v) : "—"),
      width: 140,
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      sorter: true,
      render: (s) => <Tag color={statusColor(s)}>{statutFr(s)}</Tag>,
      width: 160,
    },
    {
      title: "Parcelle",
      key: "parcelleNumero",
      sorter: false,
      render: (_, record) => {
        const numero = record?.attribution?.parcelle?.numero;
        const idParcelle = record?.attribution?.parcelle?.id;
        if (!numero) return "—";
        return idParcelle ? (
          <Link to={`/admin/parcelles/${idParcelle}/details`}>
            <Tag>{numero}</Tag>
          </Link>
        ) : (
          <Tag>{numero}</Tag>
        );
      },
      width: 160,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {isApproved(record?.statut) && !record?.attribution && (
            <Link
              to={`/admin/demandes/${record.id}/attribution`}
              className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-900 hover:text-white transition-colors duration-200"
            >
              <FileTextFilled className="w-4 h-4 mr-1" />
              Attribuer une parcelle
            </Link>
          )}
          <Link to={`/admin/demandes/${record.id}/details`}>
            <Button className="bg-primary text-white" icon={<EyeOutlined />}>
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

    let nextSortField = sortField;
    let nextSortOrder = sortOrder;

    if (sorter?.field) {
      const allowed = ["id", "typeDemande", "typeTitre", "statut", "dateCreation", "superficie"];
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
            placeholder="Rechercher par nom/prénom/tél/email..."
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
