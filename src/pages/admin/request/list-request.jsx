

"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteDemande, listRequests } from "@/services/requestService";
import { getLocalites } from "@/services/localiteService";
import {
  message, Popconfirm, Table, Button, Card, Form, Select, Input, Tag, Space, Tooltip
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined, ReloadOutlined
} from "@ant-design/icons";
import { AdminBreadcrumb, AdminBreadcrumb as Breadcrumb } from "@/components";
import dayjs from "dayjs";

const { Option } = Select;

const TYPE_DEMANDE_OPTIONS = [
  { label: "Attribution", value: "Attribution" },
  { label: "Régularisation", value: "Régularisation" },
  { label: "Authentification", value: "Authentification" },
];

// Couleurs de statut (adaptables à tes valeurs)
const statusColor = (statut) => {
  const s = (statut || "").toUpperCase();
  if (["ACCEPTEE", "ACCEPTÉE", "VALIDEE", "VALIDÉE"].includes(s)) return "green";
  if (["EN_ATTENTE", "PENDING"].includes(s)) return "gold";
  if (["REFUSEE", "REFUSÉE"].includes(s)) return "red";
  if (["EN_ETUDE", "EN COURS"].includes(s)) return "blue";
  return "default";
};

export default function RequestList() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filters, setFilters] = useState({
    typeDemande: undefined,
    localiteId: undefined,
    q: "",
  });

  // Localités (si tu veux filtrer par localité)
  const [localites, setLocalites] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const list = await getLocalites();
        setLocalites(Array.isArray(list) ? list : []);
      } catch { }
    })();
  }, []);

  const fetchData = async (keepPage = true) => {
    try {
      setLoading(true);
      const params = {
        page: keepPage ? page : 1,
        pageSize,
        sortField: "dateCreation",
        sortOrder: "DESC",
        ...filters,
      };
      const res = await listRequests(params);
      console.log(res);
      if (!res?.success) throw new Error();
      setItems(res.items || []);
      setTotal(res.total || 0);
      if (!keepPage) setPage(1);
    } catch (e) {
      message.error("Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(true); }, [page, pageSize]);
  useEffect(() => { fetchData(true); }, []);

  const onDelete = async (id) => {
    try {
      await deleteDemande(id);
      message.success("Demande supprimée");
      fetchData(true);
    } catch {
      message.error("Suppression impossible");
    }
  };

  const resetFilters = () => {
    form.resetFields();
    setFilters({ typeDemande: undefined, localiteId: undefined, q: "" });
    setPage(1);
    fetchData(false);
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 80 },
    {
      title: "Statut",
      dataIndex: "statut",
      width: 130,
      render: (v) => <Tag color={statusColor(v)}>{v || "—"}</Tag>,
    },
    { title: "Type", dataIndex: "typeDemande", width: 160 },
    { title: "Titre", dataIndex: "typeTitre", width: 180 },
    { title: "Superficie (m²)", dataIndex: "superficie", width: 130 },
    {
      title: "Localité",
      dataIndex: "localite",
      width: 180,
      render: (_, r) => r?.localite || "—",
    },
    //  {
    //   title: "Quartier",
    //   dataIndex: ["quartier", "nom"],
    //   width: 180,
    //   render: (_, r) => r?.quartier?.nom || "—",
    // },
    {
      title: "Demandeur",
      width: 220,
      render: (_, r) =>
        `${r?.demandeur?.prenom ?? r?.prenom ?? ""} ${r?.demandeur?.nom ?? r?.nom ?? ""}`.trim() || "—",
    },
    {
      title: "Créée le",
      dataIndex: "dateCreation",
      width: 160,
      render: (d) => (d ? dayjs(d).format("DD/MM/YYYY HH:mm") : "—"),
      sorter: (a, b) =>
        dayjs(a?.dateCreation || 0).valueOf() - dayjs(b?.dateCreation || 0).valueOf(),
      defaultSortOrder: "descend",
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 220,
      render: (_, r) => (
        <Space>
          <Tooltip title="Voir">
            <Button
              icon={<EyeOutlined />}
              onClick={() => navigate(`/admin/demandes/${r.id}/details`)}
            />
          </Tooltip>
          <Tooltip title="Éditer">
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/demandes/${r.id}/edit`)}
            />
          </Tooltip>
          <Popconfirm
            title="Supprimer cette demande ?"
            okText="Oui" cancelText="Non"
            onConfirm={() => onDelete(r.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <AdminBreadcrumb title="Demandes (Liste)" />

      <section>
        <div className="container">
          <div className="my-6 space-y-6">

            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Demandes</h3>
                <Link to="/admin/demandes/nouveau">
                  <Button type="primary" icon={<PlusOutlined />}>Nouvelle demande</Button>
                </Link>
              </div>

              <Form
                form={form}
                layout="inline"
                onFinish={() => fetchData(false)}
                className="flex flex-wrap gap-3 mb-4"
              >
                <Form.Item label="Type" name="typeDemande" initialValue={filters.typeDemande}>
                  <Select
                    allowClear style={{ minWidth: 180 }}
                    placeholder="Tous"
                    value={filters.typeDemande}
                    onChange={(v) => setFilters((s) => ({ ...s, typeDemande: v }))}
                  >
                    {TYPE_DEMANDE_OPTIONS.map(o => (
                      <Option key={o.value} value={o.value}>{o.label}</Option>
                    ))}
                  </Select>
                </Form.Item>

                {/** Filtre Localité (optionnel) */}
                <Form.Item label="Localité" name="localiteId" initialValue={filters.localiteId}>
                  <Select
                    allowClear showSearch optionFilterProp="children"
                    style={{ minWidth: 220 }}
                    placeholder="Toutes"
                    value={filters.localiteId}
                    onChange={(v) => setFilters((s) => ({ ...s, localiteId: v }))}
                  >
                    {localites.map((l) => (
                      <Option key={l.id} value={l.id}>{l.nom}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Recherche" name="q" initialValue={filters.q}>
                  <Input
                    allowClear
                    placeholder="Nom, email, téléphone..."
                    value={filters.q}
                    onChange={(e) => setFilters((s) => ({ ...s, q: e.target.value }))}
                    onPressEnter={() => fetchData(false)}
                  />
                </Form.Item>

                <Space>
                  <Button htmlType="submit" icon={<SearchOutlined />}>Rechercher</Button>
                  <Button onClick={resetFilters} icon={<ReloadOutlined />}>Réinitialiser</Button>
                </Space>
              </Form>

              <Table
                rowKey="id"
                columns={columns}
                dataSource={items}
                loading={loading}
                scroll={{ x: "max-content" }}
                onRow={(record) => ({
                  onClick: () => navigate(`/admin/demandes/${record.id}/details`),
                  style: { cursor: "pointer" },
                })}
                pagination={{
                  current: page,
                  pageSize,
                  total,
                  showSizeChanger: true,
                  showTotal: (t) => `${t} demande(s)`,
                  onChange: (p, ps) => { setPage(p); setPageSize(ps); },
                }}
              />
            </Card>
          
          </div>

        </div>
      </section>
    </>
  );
}
