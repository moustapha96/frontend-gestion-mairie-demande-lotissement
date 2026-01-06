

"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteDemande, listRequests } from "@/services/requestService";
import { getLocalites } from "@/services/localiteService";
import {
  message, Popconfirm, Table, Button, Card, Form, Select, Input, Tag, Space, Tooltip,
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined, ReloadOutlined,
} from "@ant-design/icons";
import { AdminBreadcrumb } from "@/components";
import dayjs from "dayjs";

const { Option } = Select;

/* =========================
   Helpers libellés FR / normalisation
   ========================= */
const norm = (v) =>
  String(v ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // retire les accents (régularisation -> regularisation)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

// ----- TYPES DE DEMANDE (toujours affichés en FR)
// couvre tes valeurs DB : occupancy_permit, communal_lease, definitive_transfer, Régularisation
const TYPE_DEMANDE_LABELS = {
  // EN -> FR
  occupancy_permit: "Permis d'occuper",
  communal_lease: "Bail communal",
  definitive_transfer: "Transfert définitif",

  // FR -> FR
  regularisation: "Régularisation",
  "régularisation": "Régularisation",

  // alias éventuels historiques
  attribution: "Permis d'occuper",
  authentication: "Authentification",
  authentification: "Authentification",
};

const toFrenchDemande = (v) => TYPE_DEMANDE_LABELS[norm(v)] || (v || "—");

// Si ton **backend attend EN** pour filtrer par typeDemande, map FR -> EN ici
const FR_TO_API_TYPE_DEMANDE = {
  "Permis d'occuper": "occupancy_permit",
  "Bail communal": "communal_lease",
  "Transfert définitif": "definitive_transfer",
  "Régularisation": "regularization", // adapte si ton API veut "regularisation" (sans z)
};

// (optionnel) TYPES DE TITRE si tu en affiches
const TYPE_TITRE_LABELS = {
  // EN -> FR
  occupancy_permit: "Permis d'occuper",
  communal_lease: "Bail communal",
  lease_proposal: "Proposition de bail",
  definitive_transfer: "Transfert définitif",

  // FR -> FR (variantes)
  "permis_d'occuper": "Permis d'occuper",
  "permis_d_occuper": "Permis d'occuper",
  "bail_communal": "Bail communal",
  "proposition_de_bail": "Proposition de bail",
  "transfert_definitif": "Transfert définitif",
  "transfert_définitif": "Transfert définitif",
};
const toFrenchTitre = (v) => TYPE_TITRE_LABELS[norm(v)] || (v || "—");

// ----- STATUTS (toujours affichés en FR)
// couvre tes valeurs DB : pending, approuve, processing, en_cours, en_attente, "En attente", NULL
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
  return s; // fallback si autre chose
};

/* =========================
   Options UI (filtre) — FR uniquement
   ========================= */
const TYPE_DEMANDE_OPTIONS = [
  { label: "Permis d'occuper", value: "Permis d'occuper" },       // occupancy_permit
  { label: "Bail communal", value: "Bail communal" },             // communal_lease
  { label: "Transfert définitif", value: "Transfert définitif" }, // definitive_transfer
  { label: "Régularisation", value: "Régularisation" },           // regularization
];

export default function RequestList() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filters, setFilters] = useState({
    typeDemande: undefined, // UI FR
    localiteId: undefined,
    q: "",
  });

  // Localités pour filtre
  const [localites, setLocalites] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const list = await getLocalites();
        setLocalites(Array.isArray(list) ? list : []);
      } catch {
        // silencieux
      }
    })();
  }, []);

  const fetchData = async (keepPage = true) => {
    try {
      setLoading(true);

      // Si ton backend attend EN : convertir la sélection FR -> EN
      const apiType = filters.typeDemande
        ? (FR_TO_API_TYPE_DEMANDE[filters.typeDemande] || filters.typeDemande)
        : undefined;

      const params = {
        page: keepPage ? page : 1,
        pageSize,
        sortField: "dateCreation",
        sortOrder: "DESC",
        ...filters,
        typeDemande: apiType, // envoie le code API si nécessaire
      };

      const res = await listRequests(params);
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

  // chargements
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
      render: (v) => <Tag color={statusColor(v)}>{statutFr(v)}</Tag>,
    },

    {
      title: "Type",
      dataIndex: "typeDemande",
      width: 180,
      render: (v) => <Tag>{toFrenchDemande(v)}</Tag>,
    },

    {
      title: "Titre",
      dataIndex: "typeTitre",
      width: 200,
      render: (v) => <Tag>{toFrenchTitre(v)}</Tag>,
    },

    { title: "Superficie (m²)", dataIndex: "superficie", width: 130 },

    {
      title: "Quartier",
      dataIndex: "localite",
      width: 180,
      render: (_, r) => r?.localite || "—",
    },

    {
      title: "Demandeur",
      width: 220,
      render: (_, r) =>
        `${r?.demandeur?.prenom ?? r?.prenom ?? ""} ${r?.demandeur?.nom ?? r?.nom ?? ""}`
          .trim() || "—",
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
            okText="Oui"
            cancelText="Non"
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
                  <Button type="primary" icon={<PlusOutlined />}>
                    Nouvelle demande
                  </Button>
                </Link>
              </div>

              <Form
                form={form}
                layout="inline"
                onFinish={() => fetchData(false)}
                className="flex flex-wrap gap-3 mb-4"
              >
                {/* Type de demande (UI FR) */}
                <Form.Item label="Type" name="typeDemande" initialValue={filters.typeDemande}>
                  <Select
                    allowClear
                    style={{ minWidth: 200 }}
                    placeholder="Tous"
                    value={filters.typeDemande}
                    onChange={(v) => setFilters((s) => ({ ...s, typeDemande: v }))}
                  >
                    {TYPE_DEMANDE_OPTIONS.map((o) => (
                      <Option key={o.value} value={o.value}>
                        {o.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Localité */}
                <Form.Item label="Quartier" name="localiteId" initialValue={filters.localiteId}>
                  <Select
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    style={{ minWidth: 240 }}
                    placeholder="Toutes"
                    value={filters.localiteId}
                    onChange={(v) => setFilters((s) => ({ ...s, localiteId: v }))}
                  >
                    {localites.map((l) => (
                      <Option key={l.id} value={l.id}>
                        {l.nom}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Recherche libre */}
                <Form.Item label="Recherche" name="q" initialValue={filters.q}>
                  <Input
                    allowClear
                    placeholder="Nom, email, téléphone..."
                    value={filters.q}
                    onChange={(e) => setFilters((s) => ({ ...s, q: e.target.value }))}
                    onPressEnter={() => fetchData(false)}
                    style={{ minWidth: 260 }}
                  />
                </Form.Item>

                <Space>
                  <Button htmlType="submit" icon={<SearchOutlined />}>
                    Rechercher
                  </Button>
                  <Button onClick={resetFilters} icon={<ReloadOutlined />}>
                    Réinitialiser
                  </Button>
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
                  onChange: (p, ps) => {
                    setPage(p);
                    setPageSize(ps);
                  },
                }}
              />
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
