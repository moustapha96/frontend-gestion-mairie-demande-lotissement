"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Table, Tag, Space, Button, Typography, message } from "antd";
import { ArrowLeftOutlined, EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { listRequests, listRequestsElecteur } from "@/services/requestService";
import { AdminBreadcrumb } from "@/components";

const { Title, Text } = Typography;

const statusColor = (statut) => {
    const s = (statut || "").toUpperCase();
    if (["ACCEPTEE", "ACCEPTÉE", "VALIDEE", "VALIDÉE"].includes(s)) return "green";
    if (["EN_ATTENTE", "PENDING"].includes(s)) return "gold";
    if (["REFUSEE", "REFUSÉE"].includes(s)) return "red";
    if (["EN_ETUDE", "EN COURS"].includes(s)) return "blue";
    return "default";
};

const tryParseDDMMYYYY = (s) => {
    if (!s) return null;
    // ex: "24/04/1956" → dayjs
    const d = dayjs(s, "DD/MM/YYYY", true);
    return d.isValid() ? d : null;
};
// Corrige les petites corruptions UTF-8 fréquentes ("commerÃ§ant" → "commerçant")
const fixUtf8 = (t) => {
    if (!t) return "";
    try {
        return decodeURIComponent(escape(t));
    } catch {
        return t;
    }
};

const val = (v) => (v !== undefined && v !== null && String(v).trim() !== "" ? String(v) : "—");
const ouiNon = (v) => {
    const s = String(v || "").toLowerCase();
    if (s.startsWith("o")) return "Oui";
    if (s.startsWith("n")) return "Non";
    return v ? "Oui" : v === false ? "Non" : "—";
};
const fmtNaissance = (d, lieu) =>
    d ? `le ${d}${lieu ? ` à ${lieu}` : ""}` : (lieu ? `à ${lieu}` : "—");



export default function ElectorRequests() {
    const navigate = useNavigate();
    const { id: electeurId } = useParams();
    const { state } = useLocation(); // { nom, email, numeroElecteur }
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const electeur = useMemo(() => state?.electeur, state.electeur)
    console.log(electeur)

    const baseFilters = useMemo(() => {
        return `numeroElecteur=${electeur.NIN}`;

    }, [state, location.search]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await listRequestsElecteur(electeur.NIN, {
                page,
                pageSize,
                sortField: "dateCreation",
                sortOrder: "DESC",
            });
            console.log(res);
            if (!res?.success) throw new Error();
            setItems(res.items || []);
            setTotal(res.total || 0);
        } catch (e) {
            message.error("Impossible de charger les demandes liées.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, baseFilters.q, baseFilters.numeroElecteur]);

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
            title: "Quartier",
            dataIndex: "localite",
            width: 180,
            render: (_, r) => r?.localite || "—",
        },
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
            width: 140,
            render: (_, r) => (
                <Space>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/admin/demandes/${r.id}/details`)}
                    />
                </Space>
            ),
        },
    ];

    return <>
        <AdminBreadcrumb title="Demandes liées à l’electeur" />
        <section className="container mx-auto px-4">
            <div className="my-6 space-y-4">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                >
                    Retour
                </Button>

                <Card>
                    <Title level={4} className="mb-0">
                        Demandes liées à l’électeur
                    </Title>
                    {electeur && (
                        <div className="px-4 py-3 mb-4 rounded-lg border bg-blue-50 border-blue-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                {/* Identité */}
                                <div>
                                    <div className="text-gray-500">ID</div>
                                    <div className="font-mono">{val(electeur.ID)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Numéro Électeur</div>
                                    <div className="font-mono">{val(electeur.NIN)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">N° Carte</div>
                                    <div className="font-mono">{val(electeur.NUMERO)}</div>
                                </div>

                                <div className="md:col-span-2">
                                    <div className="text-gray-500">Nom & Prénom</div>
                                    <div className="font-medium">{`${val(electeur.NOM)} ${val(electeur.PRENOM)}`}</div>
                                </div>

                                <div>
                                    <div className="text-gray-500">Naissance</div>
                                    <div className="font-mono">{fmtNaissance(electeur.DATE_NAISS, electeur.LIEU_NAISS)}</div>
                                </div>

                                {/* Contact */}
                                <div>
                                    <div className="text-gray-500">Email</div>
                                    <div className="font-mono">{val(electeur.EMAIL)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Téléphone 1</div>
                                    <div>{val(electeur.TEL1)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Téléphone 2</div>
                                    <div>{val(electeur.TEL2)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">WhatsApp</div>
                                    <div>{val(electeur.WHATSAPP)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Adresse</div>
                                    <div className="font-mono">{val(electeur.ADRESSE)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Quartier</div>
                                    <div className="font-mono">{val(electeur.QUARTIER)}</div>
                                </div>

                                {/* Profession / activité */}
                                <div>
                                    <div className="text-gray-500">Profession</div>
                                    <div className="font-mono">{val(fixUtf8(electeur.PROFESSION))}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">En activité</div>
                                    <div>{ouiNon(electeur.EN_ACTIVITE)}</div>
                                </div>

                                {/* Centre/Bureau */}
                                <div className="md:col-span-2">
                                    <div className="text-gray-500">Centre</div>
                                    <div>{val(electeur.CENTRE)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Bureau</div>
                                    <div>{val(electeur.BUREAU)}</div>
                                </div>

                                {/* Statuts fichier électoral */}
                                <div>
                                    <div className="text-gray-500">Inscrit au fichier</div>
                                    <div>{ouiNon(electeur.INSCRIT_AU_FICHIER)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">A déjà voté</div>
                                    <div>{ouiNon(electeur.DEJA_VOTE)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Parrainage</div>
                                    <div>{ouiNon(electeur.PARRAINAGE)}</div>
                                </div>
                            </div>
                        </div>
                    )}


                    <Table
                        className="mt-4"
                        rowKey="id"
                        columns={columns}
                        dataSource={items}
                        loading={loading}
                        scroll={{ x: "max-content" }}
                        pagination={{
                            current: page,
                            pageSize,
                            total,
                            showSizeChanger: true,
                            showTotal: (t) => `${t} demande(s)`,
                            onChange: (p, ps) => { setPage(p); setPageSize(ps); },
                        }}
                        onRow={(record) => ({
                            onClick: () => navigate(`/admin/demandes/${record.id}/details`),
                            style: { cursor: "pointer" },
                        })}
                    />
                </Card>
            </div>
        </section>

    </>;
}
