

// src/pages/demandeur/DemandeurParcelles.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Table, Input, Select, Typography, Space, Button, Tag, Drawer, Grid, message,
} from "antd";
import {
    SearchOutlined, ReloadOutlined, EyeOutlined, FilterOutlined,
} from "@ant-design/icons";
import { getParcellesByUserPaginated } from "@/services/parcelleService";
import { AdminBreadcrumb } from "@/components";

const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

const statutColor = (s) => {
    // API renvoie "OCCUPE", "DISPONIBLE", etc.
    switch ((s || "").toUpperCase()) {
        case "DISPONIBLE": return "blue";
        case "OCCUPE": return "green";
        case "LITIGE": return "red";
        default: return "default";
    }
};

export default function DemandeurParcelles() {
    const { userId } = useParams(); // /admin/demandeur/:userId/parcelles
    const screens = useBreakpoint();
    const isMdUp = screens.md;

    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [statut, setStatut] = useState();
    const [typeParcelle, setTypeParcelle] = useState();
    const [lotissementId, setLotissementId] = useState();
    const [localiteId, setLocaliteId] = useState();
    const [surfaceMin, setSurfaceMin] = useState();
    const [surfaceMax, setSurfaceMax] = useState();

    const [sorter, setSorter] = useState({ field: "id", order: "descend" });
    const [drawerOpen, setDrawerOpen] = useState(false);

    // map AntD -> API
    const sortField = useMemo(() => {
        const allowed = ["id", "numero", "surface", "statut"];
        return allowed.includes(String(sorter.field)) ? String(sorter.field) : "id";
    }, [sorter]);

    const sortOrder = useMemo(() => {
        return sorter.order === "ascend" ? "ASC" : "DESC";
    }, [sorter]);

    const fetchData = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await getParcellesByUserPaginated(userId, {
                page,
                pageSize,
                sortField,
                sortOrder,
                q: search || undefined,
                statut: statut || undefined,
                typeParcelle: typeParcelle || undefined,
                lotissementId: lotissementId || undefined,
                localiteId: localiteId || undefined,
                surfaceMin: surfaceMin ?? undefined,
                surfaceMax: surfaceMax ?? undefined,
            });
            if (!res?.success) throw new Error("Réponse invalide");
            setRows(res.items || []);
            setTotal(res.total ?? 0);
            // le back renvoie page/pageSize -> on s’aligne
            setPage(res.page || 1);
            setPageSize(res.pageSize || 10);
        } catch (e) {
            console.error(e);
            message.error(e?.message || "Erreur de chargement");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, page, pageSize, sortField, sortOrder]);

    const resetAll = () => {
        setSearch("");
        setStatut(undefined);
        setTypeParcelle(undefined);
        setLotissementId(undefined);
        setLocaliteId(undefined);
        setSurfaceMin(undefined);
        setSurfaceMax(undefined);
        setPage(1);
        setPageSize(10);
        setSorter({ field: "id", order: "descend" });
        fetchData();
    };

    const columns = [
        { title: "Numéro", dataIndex: "numero", key: "numero", sorter: true, ellipsis: true, responsive: ["xs"] },
        {
            title: "Lotissement",
            key: "lotissement",
            ellipsis: true,
            responsive: ["md"],
            render: (_, r) => r?.lotissement?.nom || "—",
        },
        {
            title: "Surface",
            dataIndex: "surface",
            key: "surface",
            sorter: true,
            width: 120,
            responsive: ["md"],
            render: (v) => (v != null ? `${v} m²` : "—"),
        },
        {
            title: "Statut",
            dataIndex: "statut",
            key: "statut",
            sorter: true,
            width: 140,
            responsive: ["sm"],
            render: (s) => <Tag color={statutColor(s)}>{s || "—"}</Tag>,
        },
        {
            title: "Type",
            dataIndex: "typeParcelle",
            key: "typeParcelle",
            sorter: true,
            ellipsis: true,
            responsive: ["lg"],
            render: (v) => v || "—",
        },
        {
            title: "Coordonnées",
            key: "coords",
            responsive: ["lg"],
            render: (_, r) => {
                const lat = r.latitude ?? "—";
                const lng = r.longitude ?? "—";
                return <Text type="secondary">{lat} / {lng}</Text>;
            },
        },
        {
            title: "Actions",
            key: "actions",
            fixed: isMdUp ? "right" : undefined,
            width: 110,
            render: (_, r) => (
                <Space>
                    <Link to={`/admin/parcelles/${r.id}/details`}>
                        <Button icon={<EyeOutlined />} />
                    </Link>
                </Space>
            ),
            responsive: ["xs"],
        },
    ];

    const DesktopFilters = (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Title level={4} className="m-0">Parcelles du compte #{userId}</Title>
            <Space wrap>
                <Input
                    allowClear
                    placeholder="Rechercher (numéro, TF...)"
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 320, maxWidth: "100%" }}
                />
                <Select allowClear placeholder="Statut" value={statut} onChange={setStatut} style={{ width: 180 }}>
                    <Option value="DISPONIBLE">DISPONIBLE</Option>
                    <Option value="OCCUPE">OCCUPE</Option>
                    <Option value="LITIGE">LITIGE</Option>
                </Select>
                <Select allowClear placeholder="Type de parcelle" value={typeParcelle} onChange={setTypeParcelle} style={{ width: 200 }}>
                    <Option value="Habitation">Habitation</Option>
                    <Option value="Commercial">Commercial</Option>
                    <Option value="Industriel">Industriel</Option>
                </Select>
                {/* si tu as des listes en amont, branche-les ici */}
                {/* <Select allowClear placeholder="Lotissement" value={lotissementId} onChange={setLotissementId} style={{ width: 220 }}>
          {lotissements.map(l => <Option key={l.id} value={l.id}>{l.nom}</Option>)}
        </Select>
        <Select allowClear placeholder="Localité" value={localiteId} onChange={setLocaliteId} style={{ width: 220 }}>
          {localites.map(loc => <Option key={loc.id} value={loc.id}>{loc.nom}</Option>)}
        </Select> */}
                <Button type="primary" onClick={() => { setPage(1); fetchData(); }}>Rechercher</Button>
                <Button icon={<ReloadOutlined />} onClick={resetAll}>Réinitialiser</Button>
            </Space>
        </div>
    );

    const MobileHeader = (
        <div className="mb-4 flex items-center justify-between">
            <Title level={4} className="m-0">Parcelles</Title>
            <Space>
                <Button icon={<FilterOutlined />} onClick={() => setDrawerOpen(true)}>Filtres</Button>
                <Button icon={<ReloadOutlined />} onClick={resetAll} />
            </Space>
        </div>
    );

    const DrawerFilters = (
        <Drawer
            title="Filtres"
            placement="right"
            width={screens.xs ? "100%" : 360}
            onClose={() => setDrawerOpen(false)}
            open={drawerOpen}
        >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Input
                    allowClear
                    placeholder="Rechercher (numéro, TF...)"
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
               
                <Space>
                    <Button type="primary" onClick={() => { setPage(1); fetchData(); setDrawerOpen(false); }}>
                        Rechercher
                    </Button>
                    <Button onClick={resetAll} icon={<ReloadOutlined />}>Réinitialiser</Button>
                </Space>
            </Space>
        </Drawer>
    );

    return (
        <>
            <AdminBreadcrumb title="Parcelles de l'utilisateur" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">


                        {isMdUp ? DesktopFilters : MobileHeader}
                        {!isMdUp && DrawerFilters}

                        <Table
                            rowKey="id"
                            loading={loading}
                            columns={columns}
                            dataSource={rows}
                            sticky
                            scroll={{ x: isMdUp ? 900 : undefined }}
                            onChange={(pagination, _filters, sorterArg) => {
                                setPage(pagination.current || 1);
                                setPageSize(pagination.pageSize || 10);

                                let field = sorterArg?.field;
                                let order = sorterArg?.order;
                                if (!order) { field = "id"; order = "descend"; }
                                setSorter({ field, order });
                            }}
                            pagination={{
                                current: page,
                                pageSize,
                                total,
                                showSizeChanger: true,
                                pageSizeOptions: ["5", "10", "20", "50", "100"],
                                showTotal: (t) => `Total ${t} parcelles`,
                            }}
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
