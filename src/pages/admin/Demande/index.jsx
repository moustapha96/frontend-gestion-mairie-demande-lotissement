// src/pages/admin/AdminDemandesPaginated.jsx
import { useEffect, useMemo, useState } from "react";
import { Table, Input, Select, Tag, Typography, Space, Button } from "antd";
import { SearchOutlined, ReloadOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getDemandesPaginated } from "@/services/demandeService";
import { AdminBreadcrumb } from "@/components";

const { Title } = Typography;
const { Option } = Select;

const statutColor = (s) => {
  switch (s) {
    case "En attente": return "orange";
    case "En cours de traitement": return "gold";
    case "Approuvée": return "green";
    case "Rejetée": return "red";
    default: return "default";
  }
};

export default function AdminDemandesPaginated() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, size: 10, total: 0, pages: 0, sort: "id,DESC" });
  const [loading, setLoading] = useState(false);

  // Filtres/état UI
  const [search, setSearch] = useState("");
  const [statut, setStatut] = useState();
  const [typeDemande, setTypeDemande] = useState();
  const [typeDocument, setTypeDocument] = useState();

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sorter, setSorter] = useState({ field: "id", order: "descend" });

  const sortParam = useMemo(() => {
    const fieldMap = {
      id: "id",
      dateCreation: "dateCreation",
      dateModification: "dateModification",
      typeDemande: "typeDemande",
      statut: "statut",
      superficie: "superficie",
      demandeur: "demandeur",
      localite: "localite",
    };
    const field = fieldMap[sorter.field] ?? "id";
    const dir = sorter.order === "ascend" ? "ASC" : "DESC";
    return `${field},${dir}`;
  }, [sorter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getDemandesPaginated({
        page, size,
        sort: sortParam,
        search: search || undefined,
        statut: statut || undefined,
        typeDemande: typeDemande || undefined,
        typeDocument: typeDocument || undefined,
        includeActor: true,
      });
      console.log(res);
      setRows(res.data || []);
      setMeta(res.meta || {});
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, size, sortParam]); // charge à chaque pagination/tri
  // Bouton "Rechercher" déclenchera un refetch manuel

  const columns = [
    {
      title: "Habitant",
      dataIndex: "id",
      key: "id",
      sorter: true,
      width: 90,
    },
    {
      title: "Type de demande",
      dataIndex: "typeDemande",
      key: "typeDemande",
      sorter: true,
      filters: [
        { text: "Attribution", value: "Attribution" },
        { text: "Régularisation", value: "Régularisation" },
        { text: "Authentification", value: "Authentification" },
      ],
      onFilter: (val, record) => record.typeDemande === val,
    },
    {
      title: "Type document",
      dataIndex: "typeDocument",
      key: "typeDocument",
    },
    {
      title: "Superficie",
      dataIndex: "superficie",
      key: "superficie",
      sorter: true,
      width: 120,
      render: (v) => v != null ? `${v} m²` : "-",
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      sorter: true,
      render: (s) => <Tag color={statutColor(s)}>{s}</Tag>,
      width: 180,
    },
    {
      title: "Demandeur",
      key: "demandeur",
      sorter: true,
      render: (_, r) =>
        r.demandeur ? (
          <Link to={`/admin/demandeur/${r.demandeur.id}/details`} className="text-primary">
            {r.demandeur.nom} {r.demandeur.prenom} — {r.demandeur.email}
          </Link>
        ) : "—",
    },
    {
      title: "Quartié",
      key: "localite",
      sorter: true,
      render: (_, r) => r.localite?.nom || "—",
      width: 180,
    },
    {
      title: "Créé le",
      dataIndex: "dateCreation",
      key: "dateCreation",
      sorter: true,
      width: 160,
      render: (d) => (d ? new Date(d).toLocaleString() : "—"),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 110,
      render: (_, r) => (
        <Space>
          <Link to={`/admin/demandes/${r.id}/details`}>
            <Button icon={<EyeOutlined />} />
          </Link>
        </Space>
      ),
    },
  ];

  return <>
   <AdminBreadcrumb title="Liste des demandes" />
           
    <section className="container mx-auto px-4 py-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Title level={4} className="m-0">Demandes</Title>
        <Space wrap>
          <Input
            allowClear
            placeholder="Rechercher (type, usage, demandeur, localité...)"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 320 }}
          />
          <Select
            allowClear
            placeholder="Statut"
            style={{ width: 180 }}
            value={statut}
            onChange={setStatut}
          >
            <Option value="En attente">En attente</Option>
            <Option value="En cours de traitement">En cours de traitement</Option>
            <Option value="Approuvée">Approuvée</Option>
            <Option value="Rejetée">Rejetée</Option>
          </Select>
          <Select
            allowClear
            placeholder="Type de demande"
            style={{ width: 200 }}
            value={typeDemande}
            onChange={setTypeDemande}
          >
            <Option value="Attribution">Attribution</Option>
            <Option value="Régularisation">Régularisation</Option>
            <Option value="Authentification">Authentification</Option>
          </Select>
          <Select
            allowClear
            placeholder="Type document"
            style={{ width: 200 }}
            value={typeDocument}
            onChange={setTypeDocument}
          >
            <Option value="CNI">CNI</Option>
            <Option value="Passeport">Passeport</Option>
            <Option value="Autre">Autre</Option>
          </Select>
          <Button type="primary" onClick={() => { setPage(1); fetchData(); }}>
            Rechercher
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => {
            setSearch(""); setStatut(undefined); setTypeDemande(undefined); setTypeDocument(undefined);
            setPage(1); setSize(10); setSorter({ field: "id", order: "descend" });
            fetchData();
          }}>
            Réinitialiser
          </Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={rows}
        scroll={{ x: 1100 }}
        onChange={(pagination, filters, sorterArg) => {
          // pagination
          setPage(pagination.current || 1);
          setSize(pagination.pageSize || 10);

          // tri
          let field = sorterArg.field;
          let order = sorterArg.order;
          if (!order) {
            field = "id"; order = "descend";
          }
          setSorter({ field, order });
        }}
        pagination={{
          current: meta.page || page,
          pageSize: meta.size || size,
          total: meta.total || 0,
          showSizeChanger: true,
          pageSizeOptions: ['5','10','20','50','100'],
          showTotal: (t) => `Total ${t} demandes`,
        }}
      />
    </section>
  </>
  
}
