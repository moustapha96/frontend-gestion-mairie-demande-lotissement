import React, { useEffect, useMemo, useState } from "react";
import { Card, Table, Button, Form, Input, Select, Tag, message } from "antd";
import { SearchOutlined, ReloadOutlined, PaperClipOutlined, EyeOutlined } from "@ant-design/icons";
import { AdminBreadcrumb } from "@/components";
import { fetchContacts } from "@/services/contactService";

const CATEGORY_COLORS = {
  DEMANDE_PARCELLE: "green",
  SUIVI_DOSSIER: "blue",
  LITIGE_FONCIER: "volcano",
  PAIEMENT: "geekblue",
  ATTESTATION_QUITUS: "purple",
  CORRECTION_DONNEES: "gold",
  AUTRE: "default",
};

const CATEGORY_OPTIONS = [
  { label: "Demande de parcelle", value: "DEMANDE_PARCELLE" },
  { label: "Suivi de dossier", value: "SUIVI_DOSSIER" },
  { label: "Litige foncier", value: "LITIGE_FONCIER" },
  { label: "Paiement / reçu", value: "PAIEMENT" },
  { label: "Attestation / Quitus", value: "ATTESTATION_QUITUS" },
  { label: "Correction de données", value: "CORRECTION_DONNEES" },
  { label: "Autre", value: "AUTRE" },
];

const fmt = (v) => (v === null || v === undefined || v === "" ? "—" : v);
const fmtDateTime = (iso) => {
  try {
    return new Date(iso).toLocaleString("fr-FR");
  } catch { return iso || "—"; }
};

const AdminContactsList = () => {
  const [form] = Form.useForm();
  const [rows, setRows] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState({
    search: "",
    categorie: undefined,
    email: "",
    reference: "",
  });

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchContacts();
      if (!res?.success) throw new Error();
      setRows(res.items || []);
    } catch (e) {
      message.error("Impossible de charger les messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Filtrage côté client (le contrôleur GET /api/contact ne prend pas de query)
  useEffect(() => {
    const search = (q.search || "").toLowerCase().trim();
    const email = (q.email || "").toLowerCase().trim();
    const ref = (q.reference || "").toLowerCase().trim();
    const cat = q.categorie;

    const out = rows.filter((r) => {
      const hitSearch =
        !search ||
        (r.nom?.toLowerCase().includes(search)) ||
        (r.message?.toLowerCase().includes(search)) ||
        (r.telephone?.toLowerCase().includes(search));
      const hitEmail = !email || r.email?.toLowerCase().includes(email);
      const hitRef = !ref || (r.reference || "").toLowerCase().includes(ref);
      const hitCat = !cat || r.categorie === cat;
      return hitSearch && hitEmail && hitRef && hitCat;
    });
    setFiltered(out);
  }, [rows, q]);

  const columns = useMemo(() => [
    { title: "Date", dataIndex: "createdAt", width: 170, render: (v) => fmtDateTime(v) },
    {
      title: "Catégorie",
      dataIndex: "categorie",
      width: 180,
      render: (v) => <Tag color={CATEGORY_COLORS[v] || "default"}>{v || "—"}</Tag>,
    },
    { title: "Nom", dataIndex: "nom", width: 200 },
    { title: "Email", dataIndex: "email", width: 220 },
    { title: "Téléphone", dataIndex: "telephone", width: 150 },
    { title: "Référence", dataIndex: "reference", width: 160, render: fmt },
    {
      title: "Pièce jointe",
      dataIndex: "pieceJointeUrl",
      width: 140,
      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noreferrer">
            <Button size="small" icon={<PaperClipOutlined />}>Ouvrir</Button>
          </a>
        ) : "—",
    },
  ], []);

  return (
    <>
      <AdminBreadcrumb title="Messages de contact" />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Boîte de contact (site public)</h3>
                <Button icon={<ReloadOutlined />} onClick={load} loading={loading}>
                  Rafraîchir
                </Button>
              </div>

              <Form
                form={form}
                layout="inline"
                onFinish={() => {}}
                className="flex flex-wrap gap-3 mb-4"
              >
                <Form.Item label="Recherche">
                  <Input
                    allowClear
                    prefix={<SearchOutlined />}
                    placeholder="Nom / message / téléphone…"
                    onChange={(e) => setQ((s) => ({ ...s, search: e.target.value }))}
                    style={{ minWidth: 260 }}
                  />
                </Form.Item>

                <Form.Item label="Catégorie">
                  <Select
                    allowClear
                    placeholder="Toutes"
                    options={CATEGORY_OPTIONS}
                    style={{ minWidth: 220 }}
                    onChange={(v) => setQ((s) => ({ ...s, categorie: v }))}
                  />
                </Form.Item>

                <Form.Item label="Email">
                  <Input
                    allowClear
                    placeholder="ex: nom@mail.com"
                    onChange={(e) => setQ((s) => ({ ...s, email: e.target.value }))}
                  />
                </Form.Item>

                <Form.Item label="Référence">
                  <Input
                    allowClear
                    placeholder="ex: KLK-2025-0001"
                    onChange={(e) => setQ((s) => ({ ...s, reference: e.target.value }))}
                  />
                </Form.Item>
              </Form>

              <Table
                rowKey="id"
                columns={[
                  ...columns,
                  {
                    title: "Message (aperçu)",
                    dataIndex: "message",
                    render: (v) => (v?.length > 120 ? v.slice(0, 120) + "…" : v || "—"),
                  },
                ]}
                dataSource={filtered}
                loading={loading}
                expandable={{
                  expandedRowRender: (record) => (
                    <div className="px-2 py-2">
                      <div className="font-medium mb-1">Message complet</div>
                      <div style={{ whiteSpace: "pre-wrap" }}>{record.message || "—"}</div>
                      <div className="mt-3 text-sm text-gray-600">
                        <span className="mr-4"><strong>Créé le :</strong> {fmtDateTime(record.createdAt)}</span>
                        <span className="mr-4"><strong>Référence :</strong> {fmt(record.reference)}</span>
                        {record.pieceJointeUrl ? (
                          <a href={record.pieceJointeUrl} target="_blank" rel="noreferrer">
                            <Button size="small" icon={<EyeOutlined />}>Ouvrir la pièce jointe</Button>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ),
                }}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (t) => `Total ${t} message(s)`,
                }}
                scroll={{ x: "max-content" }}
              />
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminContactsList;
