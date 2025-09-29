'use client';

import { useEffect, useMemo, useState } from "react";
import {
  Card, Form, Input, Button, Table, Tag, Select, DatePicker, Typography, Space, message,
  Drawer, Modal, Switch, Divider
} from "antd";
import { SearchOutlined, DownloadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useAuthContext } from "@/context";
import { AdminBreadcrumb } from "@/components";
import { getHistoriques } from "@/services/validationService";

const { Title } = Typography;

/* ===================== Helpers (module scope) ===================== */

const actionTag = (a) => {
  const A = (a || "").toUpperCase();
  const map = {
    "VALIDER": { color: "green", label: "Validé" },
    "VALIDE": { color: "green", label: "Validé" },
    "REJETER": { color: "red", label: "Rejeté" },
    "REJETE": { color: "red", label: "Rejeté" },
    "DECISION": { color: "blue", label: "Décision" },
    "RECOMMANDATION": { color: "geekblue", label: "Recommandation" },
    "RAPPORT_SAISI": { color: "purple", label: "Rapport saisi" },
  };
  const it = map[A] || { color: "default", label: a || "-" };
  return <Tag color={it.color}>{it.label}</Tag>;
};

const statutTag = (s) => {
  const map = {
    "En attente": "default",
    "En cours de traitement": "blue",
    "Rejetée": "red",
    "Approuvée": "green",
  };
  return <Tag color={map[s] || "default"}>{s || "-"}</Tag>;
};

const formatDT = (s) => {
  if (!s) return "-";
  const d = new Date(String(s).replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleString("fr-FR");
};

const toCSV = (rows = []) => {
  const headers = [
    "id","dateAction","action","demandeId","typeDemande","typeDocument","statut","superficie",
    "validateurId","validateurNom","validateurPrenom","validateurEmail","commentaire","motif"
  ];
  const escapeCSV = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
  };
  const lines = rows.map(r => {
    const d = r.demande || {};
    const v = r.validateur || {};
    return [
      r.id,
      r.dateAction,
      r.action,
      d.id,
      d.typeDemande,
      d.typeDocument,
      d.statut,
      d.superficie,
      v.id,
      v.nom,
      v.prenom,
      v.email,
      r.commentaire,
      r.motif
    ].map(escapeCSV).join(";");
  });
  return [headers.join(";"), ...lines].join("\n");
};

// Accès sûrs aux sous-objets pour toute la page + DetailContent
const getD = (r) => r?.demande ?? {};
const getU = (r) => getD(r)?.demandeur ?? {};
const getL = (r) => getD(r)?.localite ?? {};

/* ===================== Page ===================== */

export default function AdminHistoriqueValidation() {
  const { user } = useAuthContext();

  // ADMIN / SUPER_ADMIN / MAIRE autorisés
  const canSee = useMemo(
    () =>
      Array.isArray(user?.roles) &&
      (user.roles.includes("ROLE_ADMIN") ||
        user.roles.includes("ROLE_SUPER_ADMIN") ||
        user.roles.includes("ROLE_MAIRE")),
    [user]
  );

  const [form] = Form.useForm();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    demandeId: null, validateurId: null, action: null, from: null, to: null
  });

  // Détails (Drawer/Modal)
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);
  const [useModal, setUseModal] = useState(false);

  const openDetails = (rec) => { setDetailRecord(rec); setDetailOpen(true); };
  const closeDetails = () => { setDetailOpen(false); setTimeout(() => setDetailRecord(null), 200); };

  const fetchData = async (keepPage = true) => {
    try {
      setLoading(true);
      const params = {
        page: keepPage ? page : 1,
        pageSize,
        ...filters,
        from: filters.from || undefined,
        to: filters.to || undefined,
      };
      const data = await getHistoriques(params);
      const ok = data?.success ?? true;
      const items = Array.isArray(data) ? data : (data.items || []);
      const t = typeof data?.total === "number" ? data.total : items.length;
      if (!ok) throw new Error();
      setRows(items);
      setTotal(t);
      if (!keepPage) setPage(1);
    } catch (e) {
      message.error("Erreur lors du chargement de l'historique");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(true); /* eslint-disable-next-line */ }, [page, pageSize]);
  useEffect(() => { fetchData(true); /* eslint-disable-next-line */ }, []);

  const exportCSV = () => {
    const csv = toCSV(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `historique_validations_p${page}.csv`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  if (!canSee) {
    return (
      <>
        <AdminBreadcrumb title="Historique des validations" />
        <Card>
          <Title level={4}>Accès refusé</Title>
          <p>Vous n’avez pas les permissions nécessaires pour consulter cette page.</p>
        </Card>
      </>
    );
  }

  const columns = [
    {
      title: "Date",
      dataIndex: "dateAction",
      width: 180,
      sorter: (a, b) => new Date(a.dateAction) - new Date(b.dateAction),
      render: (v) => formatDT(v),
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 150,
      render: (s) => actionTag(s),
      filters: [
        { text: "Validé", value: "VALIDER" },
        { text: "Rejeté", value: "REJETER" },
        { text: "Décision", value: "DECISION" },
        { text: "Recommandation", value: "RECOMMANDATION" },
        { text: "Rapport saisi", value: "RAPPORT_SAISI" },
      ],
      onFilter: (val, rec) => (rec.action || "").toUpperCase() === val,
    },
    {
      title: "Demande",
      key: "demande",
      width: 300,
      render: (_, r) => {
        const d = getD(r);
        return (
          <Space direction="vertical" size={0}>
            <Space wrap>
              <Tag>{d.typeDemande || "-"}</Tag>
              <Tag>{d.typeTitre || "-"}</Tag>
            </Space>
            <Space wrap>
              {statutTag(d.statut)}
              {typeof d.superficie === "number" && <Tag>{d.superficie} m²</Tag>}
             
            </Space>
          </Space>
        );
      },
    },
    {
      title: "Validateur",
      key: "validateur",
      width: 260,
      render: (_, r) => {
        const v = r.validateur || {};
        return (
          <Space direction="vertical" size={0}>
            <span><strong>{v.prenom} {v.nom}</strong></span>
            <span style={{ color: "#666" }}>{v.email}</span>
          </Space>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, rec) => (
        <Button icon={<InfoCircleOutlined />} onClick={() => openDetails(rec)}>
          Détails
        </Button>
      ),
    }
  ];

  return (
    <>
      <AdminBreadcrumb title="Historique des validations" />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <Title level={4} className="!mb-0">Historique des validations</Title>
                <Space>
                  <Button icon={<DownloadOutlined />} onClick={exportCSV}>Export CSV</Button>
                  <span>Afficher en modal</span>
                  <Switch checked={useModal} className="bg-black"  onChange={setUseModal} />
                </Space>
              </div>

              <Form
                form={form}
                layout="inline"
                onFinish={() => fetchData(false)}
                className="flex flex-wrap gap-3 mb-4"
              >
                <Form.Item label="Demande ID">
                  <Input
                    placeholder="ex: 123"
                    onChange={(e) => setFilters(s => ({ ...s, demandeId: e.target.value || null }))}
                  />
                </Form.Item>
                <Form.Item label="Validateur ID">
                  <Input
                    placeholder="ex: 5"
                    onChange={(e) => setFilters(s => ({ ...s, validateurId: e.target.value || null }))}
                  />
                </Form.Item>
                <Form.Item label="Action">
                  <Select
                    allowClear
                    style={{ minWidth: 200 }}
                    onChange={(v) => setFilters(s => ({ ...s, action: v || null }))}
                    options={[
                      { value: "VALIDER", label: "Validé" },
                      { value: "REJETER", label: "Rejeté" },
                      { value: "DECISION", label: "Décision" },
                      { value: "RECOMMANDATION", label: "Recommandation" },
                      { value: "RAPPORT_SAISI", label: "Rapport saisi" },
                    ]}
                  />
                </Form.Item>
                <Form.Item label="Du">
                  <DatePicker onChange={(d) => setFilters(s => ({ ...s, from: d ? d.format("YYYY-MM-DD") : null }))} />
                </Form.Item>
                <Form.Item label="Au">
                  <DatePicker onChange={(d) => setFilters(s => ({ ...s, to: d ? d.format("YYYY-MM-DD") : null }))} />
                </Form.Item>
                <Button icon={<SearchOutlined />} htmlType="submit">Rechercher</Button>
              </Form>

              <Table
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={rows}
                onRow={(record) => ({
                  onDoubleClick: () => openDetails(record),
                })}
                scroll={{ x: "max-content" }}
                expandable={{
                  expandedRowRender: (r) => {
                    const d = getD(r);
                    const u = getU(r);
                    const loc = getL(r);
                    return (
                      <div style={{ padding: 12 }}>
                        <div style={{ marginBottom: 6 }}>
                          <strong>Détails demande</strong>
                          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 6 }}>
                            <Tag>Type: {d.typeDemande || "-"}</Tag>
                            <Tag>Document: {d.typeDocument || "-"}</Tag>
                            {d.typeTitre && <Tag>Titre: {d.typeTitre}</Tag>}
                            {typeof d.superficie === "number" && <Tag>Superficie: {d.superficie} m²</Tag>}
                            <Tag>Statut: {d.statut || "-"}</Tag>
                            <Tag>Créée: {formatDT(d.dateCreation)}</Tag>
                            <Tag>MAJ: {formatDT(d.dateModification)}</Tag>
                          </div>
                        </div>

                        <div style={{ marginBottom: 6 }}>
                          <strong>Demandeur</strong>
                          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 6 }}>
                          
                            <Tag>{[u.prenom, u.nom].filter(Boolean).join(" ") || "-"}</Tag>
                            {u.email && <Tag>{u.email}</Tag>}
                            {u.telephone && <Tag>{u.telephone}</Tag>}
                            {u.profession && <Tag>{u.profession}</Tag>}
                          </div>
                        </div>

                        <div style={{ marginBottom: 6 }}>
                          <strong>Localité</strong>
                          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 6 }}>
                           
                            <Tag>{loc.nom || "-"}</Tag>
                            {typeof loc.prix === "number" && <Tag>Prix: {loc.prix}</Tag>}
                            {(typeof loc.latitude === "number" && typeof loc.longitude === "number") && (
                              <Tag>Coord: {loc.latitude}, {loc.longitude}</Tag>
                            )}
                          </div>
                        </div>

                        {(r.commentaire || r.motif) && (
                          <div style={{ marginTop: 8 }}>
                            {r.commentaire && (
                              <>
                                <strong>Commentaire</strong>
                                <div style={{ marginTop: 6 }}>{r.commentaire}</div>
                              </>
                            )}
                            {r.motif && (
                              <>
                                <strong style={{ display: "block", marginTop: 8 }}>Motif</strong>
                                <div style={{ marginTop: 6 }}>{r.motif}</div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }
                }}
                pagination={{
                  current: page,
                  pageSize,
                  total,
                  showSizeChanger: true,
                  showTotal: (t) => `Total ${t} enregistrement(s)`,
                  onChange: (p, ps) => { setPage(p); setPageSize(ps); }
                }}
              />

              {/* Drawer latéral */}
              <Drawer
                title={`Détail validation ${detailRecord ? `#${getD(detailRecord).id ?? ""}` : ""}`}
                open={detailOpen && !useModal}
                onClose={closeDetails}
                width={520}
                destroyOnClose
              >
                <DetailContent rec={detailRecord} />
              </Drawer>

              {/* Modal central */}
              <Modal
                title={`Détail validation ${detailRecord ? `#${getD(detailRecord).id ?? ""}` : ""}`}
                open={detailOpen && useModal}
                onCancel={closeDetails}
                onOk={closeDetails}
                okText="Fermer"
                cancelButtonProps={{ style: { display: "none" } }}
                width={800}
                destroyOnClose
              >
                <DetailContent rec={detailRecord} />
              </Modal>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

/* ===================== Détail (Drawer/Modal) ===================== */

const DetailContent = ({ rec }) => {
  if (!rec) return null;
  const d = getD(rec), u = getU(rec), loc = getL(rec);

  return (
    <div style={{ paddingRight: 4 }}>
      <Title level={5} className="!mt-0">Action</Title>
      <Space size={[8, 8]} wrap>
        {actionTag(rec.action)}
        <Tag>Le {formatDT(rec.dateAction)}</Tag>
        {rec.validateur && (
          <>
            <Tag>Par: {rec.validateur.prenom} {rec.validateur.nom}</Tag>
            <Tag>{rec.validateur.email}</Tag>
          </>
        )}
      </Space>

      <Divider />

      <Title level={5} className="!mt-0">Demande</Title>
      <Space size={[8, 8]} wrap>
        <Tag>#{d.id ?? "-"}</Tag>
        <Tag>Type: {d.typeDemande || "-"}</Tag>
        <Tag>Doc: {d.typeDocument || "-"}</Tag>
        {d.typeTitre && <Tag>Titre: {d.typeTitre}</Tag>}
        {typeof d.superficie === "number" && <Tag>Superficie: {d.superficie} m²</Tag>}
        <Tag>Statut: {d.statut || "-"}</Tag>
        <Tag>Créée: {formatDT(d.dateCreation)}</Tag>
        <Tag>MAJ: {formatDT(d.dateModification)}</Tag>
      </Space>

      <Divider />

      <Title level={5} className="!mt-0">Demandeur</Title>
      <Space size={[8, 8]} wrap>
        <Tag>#{u.id ?? "-"}</Tag>
        <Tag>{[u.prenom, u.nom].filter(Boolean).join(" ") || "-"}</Tag>
        {u.email && <Tag>{u.email}</Tag>}
        {u.telephone && <Tag>{u.telephone}</Tag>}
        {u.profession && <Tag>{u.profession}</Tag>}
        {u.adresse && <Tag>{u.adresse}</Tag>}
      </Space>

      <Divider />

      <Title level={5} className="!mt-0">Localité</Title>
      <Space size={[8, 8]} wrap>
        <Tag>#{loc.id ?? "-"}</Tag>
        <Tag>{loc.nom || "-"}</Tag>
        {typeof loc.prix === "number" && <Tag>Prix: {loc.prix}</Tag>}
        {(typeof loc.latitude === "number" && typeof loc.longitude === "number") && (
          <Tag>Coord: {loc.latitude}, {loc.longitude}</Tag>
        )}
      </Space>

      {(rec.commentaire || rec.motif) && (
        <>
          <Divider />
          {rec.commentaire && (
            <>
              <Title level={5} className="!mt-0">Commentaire</Title>
              <div style={{ whiteSpace: "pre-wrap" }}>{rec.commentaire}</div>
            </>
          )}
          {rec.motif && (
            <>
              <Title level={5} className="!mt-0" style={{ marginTop: 12 }}>Motif</Title>
              <div style={{ whiteSpace: "pre-wrap" }}>{rec.motif}</div>
            </>
          )}
        </>
      )}
    </div>
  );
};
