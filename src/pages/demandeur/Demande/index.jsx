
"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DemandeurBreadcrumb } from "@/components";

import { Tag, Table, Button, Space, Input } from "antd";
import dayjs from "dayjs";
import { useAuthContext } from "@/context";

import {
  getDemandeDemandeur,
} from "@/services/requestService";

const statutColor = (s) => {
  switch (String(s || "").toUpperCase()) {
    case "EN_ATTENTE":
    case "EN_COURS":
      return "processing";
    case "VALIDEE":
    case "APPROBATION_CONSEIL":
    case "APPROBATION_PREFET":
      return "blue";
    case "ATTRIBUTION_PROVISOIRE":
      return "gold";
    case "ATTRIBUTION_DEFINITIVE":
      return "green";
    case "REJETEE":
      return "red";
    case "ANNULEE":
      return "volcano";
    default:
      return "default";
  }
};

export default function DemandeurDemande() {
  const { user } = useAuthContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      // suppose: getMesDemandes() retourne { items: [...] }
      const resp = await getDemandeDemandeur(user.id);
      console.log(resp);
      setItems(resp?.items ?? resp ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const data = useMemo(() => {
    const s = String(q || "").toLowerCase();
    return (items || [])
      .filter((d) => {
        if (!s) return true;
        const slot =
          `${d?.id ?? ""} ${d?.typeDemande ?? ""} ${d?.typeTitre ?? ""} ${d?.usagePrevu ?? ""} ${d?.localite?.nom ?? d?.localite ?? ""} ${d?.statut ?? ""}`.toLowerCase();
        return slot.includes(s);
      })
      .map((d) => ({
        key: String(d.id),
        ...d,
      }));
  }, [items, q]);

  const columns = [
    { title: "N°", dataIndex: "id", key: "id" },
    {
      title: "Type demande",
      dataIndex: "typeDemande",
      key: "typeDemande",
      render: (v) => v || "—",
    },
    {
      title: "Titre",
      dataIndex: "typeTitre",
      key: "typeTitre",
      render: (v) => v || "—",
    },
    {
      title: "Quartier",
      key: "localite",
      render: (_, r) => r?.localite?.nom || r?.localite || "—",
    },
    {
      title: "Superficie (m²)",
      dataIndex: "superficie",
      key: "superficie",
      render: (v) => (v || v === 0 ? v : "—"),
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      render: (s) => <Tag color={statutColor(s)}>{s || "—"}</Tag>,
    },
    {
      title: "Créée le",
      dataIndex: "dateCreation",
      key: "dateCreation",
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "—"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, r) => (
        <Space>
          <Link to={`/demandeur/demandes/${r.id}/details`}>
            <Button size="small" type="primary">Détails</Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <>
      <DemandeurBreadcrumb title="Mes demandes" />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <div className="flex items-center justify-between">
              <Input.Search
                style={{ maxWidth: 360 }}
                placeholder="Rechercher… (id, type, Quartier, statut)"
                allowClear
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <Link to="/demandeur/nouveau-demande">
                <Button type="primary">Nouvelle demande</Button>
              </Link>
            </div>

            <Table
              rowKey="id"
              loading={loading}
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 10, showTotal: (t) => `${t} demande(s)` }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
