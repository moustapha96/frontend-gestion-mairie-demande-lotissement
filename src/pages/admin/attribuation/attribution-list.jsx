
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Table, Card, Space, Button, Tag, Popconfirm, message, Input } from "antd";
// import { EyeOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
// import dayjs from "dayjs";
// import {
//     listAttributionsParcelles,
//     deleteAttributionParcelle,
//     changeStatePaiement,
// } from "@/services/attributionParcelleService";
// import { useAuthContext } from "@/context";
// import { AdminBreadcrumb } from "@/components";
// import { extractDemandeur } from "@/utils/demandeur";

// const canDeleteRoles = ["ROLE_ADMIN", "ROLE_MAIRE", "ROLE_SUPER_ADMIN", "ROLE_PRESIDENT_COMMISSION", "ROLE_CHEF_SERVICE"];

// const statutColor = (s) => {
//     switch (s) {
//         case "DRAFT": return "default";
//         case "ENREGISTREE": return "processing";
//         case "VALIDATION_PROVISOIRE": return "gold";
//         case "ATTRIBUTION_PROVISOIRE": return "orange";
//         case "APPROBATION_PREFET": return "blue";
//         case "APPROBATION_CONSEIL": return "geekblue";
//         case "ATTRIBUTION_DEFINITIVE": return "green";
//         case "MISE_EN_VALEUR": return "success";
//         case "SUSPENDUE": return "magenta";
//         case "REJETEE": return "red";
//         case "ANNULEE": return "volcano";
//         default: return "default";
//     }
// };

// export default function AttributionList() {
//     const navigate = useNavigate();
//     const { user } = useAuthContext();
//     const canDelete = useMemo(() => !!user?.roles?.some((r) => canDeleteRoles.includes(r)), [user]);

//     const [loading, setLoading] = useState(true);
//     const [items, setItems] = useState([]);
//     const [total, setTotal] = useState(0);
//     const [page, setPage] = useState(1);
//     const [pageSize, setPageSize] = useState(10);
//     const [search, setSearch] = useState("");

//     const fetchData = async (_page = page, _pageSize = pageSize) => {
//         try {
//             setLoading(true);
//             const res = await listAttributionsParcelles({ page: _page, pageSize: _pageSize, q: search || undefined });
//             console.log(res)
//             setItems(res.items || []);
//             setTotal(res.total || (res.items?.length ?? 0));
//             setPage(res.page || _page);
//             setPageSize(res.pageSize || _pageSize);
//         } catch (e) {
//             message.error(e?.response?.data?.message || "Chargement impossible");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData(1, pageSize);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     const filtered = useMemo(() => {
//         if (!search?.trim()) return items;
//         const q = search.trim().toLowerCase();
//         return items.filter((it) => {
//             const d = it?.demande;
//             const p = it?.parcelle;
//             return [
//                 it?.id,
//                 it?.frequence,
//                 it?.montant,
//                 it?.statut,
//                 d?.id,
//                 d?.demandeur?.nom,
//                 d?.demandeur?.prenom,
//                 p?.numero,
//                 p?.statut,
//                 p?.lotissement?.nom,
//                 p?.lotissement?.localite?.nom,
//             ]
//                 .filter(Boolean)
//                 .some((v) => String(v).toLowerCase().includes(q));
//         });
//     }, [items, search]);

//     const onDelete = async (id) => {
//         try {
//             await deleteAttributionParcelle(id, { liberer: true });
//             message.success("Attribution supprimée");
//             fetchData(page, pageSize);
//         } catch (e) {
//             message.error(e?.response?.data?.message || "Suppression impossible");
//         }
//     };

//     const onTogglePaiement = async (record) => {
//         try {
//             await changeStatePaiement(record.id, { etatPaiement: !record.etatPaiement });
//             message.success("Statut paiement mis à jour");
//             fetchData(page, pageSize);
//         } catch (e) {
//             message.error(e?.response?.data?.message || "Mise à jour impossible");
//         }
//     };

//     const columns = [
//         {
//             title: "Statut",
//             dataIndex: "statut",
//             render: (s) => <Tag color={statutColor(s)}>{s ?? "—"}</Tag>,
//         },
//         {
//             title: "Demande",
//             key: "demande",
//             render: (_, r) => {
//                 const d = r.demande;
//                 if (!d) return "—";
//                 const pers = extractDemandeur(d);
//                 const nomAff = [pers?.prenom, pers?.nom].filter(Boolean).join(" ") || "—";
//                 return (
//                     <Space direction="vertical" size={0}>
//                         <span>#{d.id ?? "—"} — {nomAff}</span>
//                         <small style={{ color: "#555" }}>
//                             {pers?.email || "—"} {pers?.telephone ? ` | ${pers.telephone}` : ""}
//                         </small>
//                         {pers?.localiteTexte && <small style={{ color: "#888" }}>{pers.localiteTexte}</small>}
//                     </Space>
//                 );
//             },
//         },
//         {
//             title: "Parcelle",
//             key: "parcelle",
//             render: (_, r) => {
//                 const p = r.parcelle;
//                 if (!p) return "—";
//                 return (
//                     <Space direction="vertical" size={0}>
//                         <span>N° {p.numero ?? "—"} ({p.surface ?? "?"} m²)</span>
//                         <small style={{ color: "#555" }}>
//                             {p?.lotissement?.nom ?? "—"} — {p?.lotissement?.localite?.nom ?? "—"}
//                         </small>
//                     </Space>
//                 );
//             },
//         },
//         {
//             title: "Montant",
//             dataIndex: "montant",
//             render: (v) => (v || v === 0 ? new Intl.NumberFormat("fr-FR").format(v) : "—"),
//         },
//         {
//             title: "Date Attribution",
//             dataIndex: "dateEffet",
//             render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "—"),
//         },
//         {
//             title: "Date Fin",
//             dataIndex: "dateFin",
//             render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "—"),
//         },
//         {
//             title: "Paiement",
//             dataIndex: "etatPaiement",
//             render: (_, r) => (
//                 <Popconfirm
//                     title="Changer l'état de paiement ?"
//                     okText="Oui"
//                     cancelText="Non"
//                     onConfirm={() => onTogglePaiement(r)}
//                 >
//                     <Button type="default">
//                         <span style={{ color: r.etatPaiement ? "#389e0d" : "#cf1322" }}>
//                             {r.etatPaiement ? "Payé" : "Non payé"}
//                         </span>
//                     </Button>
//                 </Popconfirm>
//             ),
//         },
//         {
//             title: "Actions",
//             key: "actions",
//             width: 160,
//             render: (_, r) => (
//                 <Space>
//                     <Button icon={<EyeOutlined />} onClick={() => navigate(`/admin/attributions/${r.id}/détails`)}>
//                         Voir
//                     </Button>
//                     {canDelete && (
//                         <Popconfirm title="Supprimer cette attribution ?" okText="Oui" cancelText="Non" onConfirm={() => onDelete(r.id)}>
//                             <Button danger icon={<DeleteOutlined />} />
//                         </Popconfirm>
//                     )}
//                 </Space>
//             ),
//         },
//     ];

//     return (
//         <>
//             <AdminBreadcrumb title="Liste des Attributions" />
//             <section>
//                 <div className="container">
//                     <div className="my-6 space-y-6">
//                         <Card
//                             title="Attributions de parcelles"
//                             extra={
//                                 <Space>
//                                     <Input.Search
//                                         allowClear
//                                         placeholder="Rechercher (demandeur, parcelle, localité...)"
//                                         value={search}
//                                         onSearch={(v) => {
//                                             setSearch(v);
//                                             fetchData(1, pageSize);
//                                         }}
//                                         onChange={(e) => setSearch(e.target.value)}
//                                         style={{ width: 360 }}
//                                     />
//                                     <Button icon={<ReloadOutlined />} onClick={() => fetchData(page, pageSize)}>
//                                         Rafraîchir
//                                     </Button>
//                                 </Space>
//                             }
//                         >
//                             <Table
//                                 rowKey="id"
//                                 loading={loading}
//                                 dataSource={filtered}
//                                 columns={columns}
//                                 pagination={{
//                                     current: page,
//                                     pageSize,
//                                     total,
//                                     showSizeChanger: true,
//                                     onChange: (p, ps) => {
//                                         setPage(p);
//                                         setPageSize(ps);
//                                         fetchData(p, ps);
//                                     },
//                                 }}
//                             />
//                         </Card>
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// }

// src/pages/admin/attributions/attribution-list.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Card, Space, Button, Tag, Popconfirm, message, Input } from "antd";
import { EyeOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  listAttributionsParcelles,
  deleteAttributionParcelle,
  changeStatePaiement,
} from "@/services/attributionParcelleService";
import { useAuthContext } from "@/context";
import { AdminBreadcrumb } from "@/components";

// ---- helper local: normalise les infos du demandeur/utilisateur ----
function extractDemandeurLocal(d) {
  if (!d) return null;
  const dd = d.demandeur ?? null;
  const u = d.utilisateur ?? null;
  const plain = d ?? null;

  const prenom = dd?.prenom ?? plain?.prenom ?? u?.prenom ?? null;
  const nom = dd?.nom ?? plain?.nom ?? u?.nom ?? null;
  const email = dd?.email ?? plain?.email ?? u?.email ?? null;
  const telephone = dd?.telephone ?? plain?.telephone ?? u?.telephone ?? null;
  const adresse = dd?.adresse ?? u?.adresse ?? null;
  const numeroElecteur = dd?.numeroElecteur ?? u?.numeroElecteur ?? null;
  const profession = dd?.profession ?? u?.profession ?? null;
  const dateNaissance = dd?.dateNaissance ?? u?.dateNaissance ?? null;
  const lieuNaissance = dd?.lieuNaissance ?? u?.lieuNaissance ?? null;
  const situationMatrimoniale = dd?.situationMatrimoniale ?? u?.situationMatrimoniale ?? null;
  const roles = Array.isArray(u?.roles) ? u.roles : null;
  const username = u?.username ?? null;
  const enabled = typeof u?.enabled === "boolean" ? u.enabled : null;
  const isHabitant = typeof u?.isHabitant === "boolean" ? u.isHabitant : null;
  const nombreEnfant = typeof u?.nombreEnfant === "number" ? u.nombreEnfant : dd?.nombreEnfant ?? null;
  const situationDemandeur = u?.situationDemandeur ?? null;

  return {
    id: u?.id ?? dd?.id ?? plain?.id ?? null,
    prenom,
    nom,
    email,
    telephone,
    adresse,
    numeroElecteur,
    profession,
    dateNaissance,
    lieuNaissance,
    situationMatrimoniale,
    roles,
    username,
    enabled,
    isHabitant,
    nombreEnfant,
    situationDemandeur,
    localiteTexte: plain?.localite ?? null,
  };
}

const canDeleteRoles = ["ROLE_ADMIN", "ROLE_MAIRE", "ROLE_SUPER_ADMIN", "ROLE_PRESIDENT_COMMISSION", "ROLE_CHEF_SERVICE"];

const statutColor = (s) => {
  switch (s) {
    case "DRAFT": return "default";
    case "ENREGISTREE": return "processing";
    case "VALIDATION_PROVISOIRE": return "gold";
    case "ATTRIBUTION_PROVISOIRE": return "orange";
    case "APPROBATION_PREFET": return "blue";
    case "APPROBATION_CONSEIL": return "geekblue";
    case "ATTRIBUTION_DEFINITIVE": return "green";
    case "MISE_EN_VALEUR": return "success";
    case "SUSPENDUE": return "magenta";
    case "REJETEE": return "red";
    case "ANNULEE": return "volcano";
    default: return "default";
  }
};

export default function AttributionList() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const canDelete = useMemo(() => !!user?.roles?.some((r) => canDeleteRoles.includes(r)), [user]);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const fetchData = async (_page = page, _pageSize = pageSize) => {
    try {
      setLoading(true);
      const res = await listAttributionsParcelles({ page: _page, pageSize: _pageSize, q: search || undefined });
      setItems(res.items || []);
      setTotal(res.total || (res.items?.length ?? 0));
      setPage(res.page || _page);
      setPageSize(res.pageSize || _pageSize);
    } catch (e) {
      message.error(e?.response?.data?.message || "Chargement impossible");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!search?.trim()) return items;
    const q = search.trim().toLowerCase();
    return items.filter((it) => {
      const d = it?.demande;
      const p = it?.parcelle;
      const pers = extractDemandeurLocal(d);
      return [
        it?.id,
        it?.frequence,
        it?.montant,
        it?.statut,
        d?.id,
        pers?.nom,
        pers?.prenom,
        p?.numero,
        p?.statut,
        p?.lotissement?.nom,
        p?.lotissement?.localite?.nom,
        pers?.localiteTexte,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [items, search]);

  const onDelete = async (id) => {
    try {
      await deleteAttributionParcelle(id, { liberer: true });
      message.success("Attribution supprimée");
      fetchData(page, pageSize);
    } catch (e) {
      message.error(e?.response?.data?.message || "Suppression impossible");
    }
  };

  const onTogglePaiement = async (record) => {
    try {
      await changeStatePaiement(record.id, { etatPaiement: !record.etatPaiement });
      message.success("Statut paiement mis à jour");
      fetchData(page, pageSize);
    } catch (e) {
      message.error(e?.response?.data?.message || "Mise à jour impossible");
    }
  };

  const columns = [
    {
      title: "Statut",
      dataIndex: "statut",
      render: (s) => <Tag color={statutColor(s)}>{s ?? "—"}</Tag>,
    },
    {
      title: "Demande",
      key: "demande",
      render: (_, r) => {
        const d = r.demande;
        if (!d) return "—";
        const pers = extractDemandeurLocal(d);
        const nomAff = [pers?.prenom, pers?.nom].filter(Boolean).join(" ") || "—";
        return (
          <Space direction="vertical" size={0}>
            <span>#{d.id ?? "—"} — {nomAff}</span>
            <small style={{ color: "#555" }}>
              {pers?.email || "—"} {pers?.telephone ? ` | ${pers.telephone}` : ""}
            </small>
            {pers?.localiteTexte && <small style={{ color: "#888" }}>{pers.localiteTexte}</small>}
          </Space>
        );
      },
    },
    {
      title: "Parcelle",
      key: "parcelle",
      render: (_, r) => {
        const p = r.parcelle;
        if (!p) return "—";
        return (
          <Space direction="vertical" size={0}>
            <span>N° {p.numero ?? "—"} ({p.surface ?? "?"} m²)</span>
            <small style={{ color: "#555" }}>
              {p?.lotissement?.nom ?? "—"} — {p?.lotissement?.localite?.nom ?? "—"}
            </small>
          </Space>
        );
      },
    },
    {
      title: "Montant",
      dataIndex: "montant",
      render: (v) => (v || v === 0 ? new Intl.NumberFormat("fr-FR").format(v) : "—"),
    },
    {
      title: "Date Attribution",
      dataIndex: "dateEffet",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "—"),
    },
    {
      title: "Date Fin",
      dataIndex: "dateFin",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "—"),
    },
    {
      title: "Paiement",
      dataIndex: "etatPaiement",
      render: (_, r) => (
        <Popconfirm
          title="Changer l'état de paiement ?"
          okText="Oui"
          cancelText="Non"
          onConfirm={() => onTogglePaiement(r)}
        >
          <Button type="default">
            <span style={{ color: r.etatPaiement ? "#389e0d" : "#cf1322" }}>
              {r.etatPaiement ? "Payé" : "Non payé"}
            </span>
          </Button>
        </Popconfirm>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (_, r) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => navigate(`/admin/attributions/${r.id}/détails`)}>
            Voir
          </Button>
          {canDelete && (
            <Popconfirm title="Supprimer cette attribution ?" okText="Oui" cancelText="Non" onConfirm={() => onDelete(r.id)}>
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <AdminBreadcrumb title="Liste des Attributions" />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <Card
              title="Attributions de parcelles"
              extra={
                <Space>
                  <Input.Search
                    allowClear
                    placeholder="Rechercher (demandeur, parcelle, Quartier...)"
                    value={search}
                    onSearch={(v) => {
                      setSearch(v);
                      fetchData(1, pageSize);
                    }}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 360 }}
                  />
                  <Button icon={<ReloadOutlined />} onClick={() => fetchData(page, pageSize)}>
                    Rafraîchir
                  </Button>
                </Space>
              }
            >
              <Table
                rowKey="id"
                loading={loading}
                dataSource={filtered}
                columns={columns}
                pagination={{
                  current: page,
                  pageSize,
                  total,
                  showSizeChanger: true,
                  onChange: (p, ps) => {
                    setPage(p);
                    setPageSize(ps);
                    fetchData(p, ps);
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
