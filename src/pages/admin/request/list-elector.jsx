
// pages/AdminElecteurRecherche.jsx
import React, { useEffect, useState } from "react";
import { Table, Input, Card, Button, Typography, message, Form, Tooltip } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { AdminBreadcrumb } from "@/components";
import { rechercheElecteur } from "@/services/rechercheElecteur";
import { Link } from "react-router-dom";
import { Space } from "lucide-react";
import { useAuthContext } from "@/context";

const { Title } = Typography;

const RequestListElector = () => {
    const { user } = useAuthContext();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [q, setQ] = useState({ nom: "", prenom: "", nin: "", telephone: "" });

    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);


    useEffect(() => {
        onSearch({ keepPage: true });
    }, []);

    const columns = [
        { title: "ID", dataIndex: "ID", key: "ID", width: 90 },
        { title: "Nom", dataIndex: "NOM", key: "NOM" },
        { title: "Prénom", dataIndex: "PRENOM", key: "PRENOM" },
        { title: "NIN", dataIndex: "NIN", key: "NIN", render: (v) => <code>{v}</code> },
        { title: "Téléphone", key: "TEL", render: (_, r) => r.TEL1 || r.TEL2 || r.WHATSAPP || "" },
        { title: "Numéro électeur", dataIndex: "NUMERO", key: "NUMERO" },
        { title: "Date de naissance", dataIndex: "DATE_NAISS", key: "DATE_NAISS" },
        { title: "Lieu de naissance", dataIndex: "LIEU_NAISS", key: "LIEU_NAISS" },
        { title: "Centre", dataIndex: "CENTRE", key: "CENTRE" },
        { title: "Bureau", dataIndex: "BUREAU", key: "BUREAU", width: 90 },
        { title: "Inscrit fichier", dataIndex: "INSCRIT_AU_FICHIER", key: "INSCRIT_AU_FICHIER", width: 130 },

        // {
        //     title: "Demandes",
        //     key: "demandes",
        //     fixed: "right",
        //     width: 160,
        //     render: (_, record) => <>
        //         <div>
        //             <Link
        //                 to={`/admin/electeurs/${record.ID}/demandes`}
        //                 state={{ electeur: record }}
        //                 className="inline-flex items-center gap-2 text-white bg-primary hover:bg-primary-light px-3 py-1 rounded"
        //             >
        //                 <SearchOutlined />
        //                 Demandes liées
        //             </Link>

        //             <Link
        //                 to={`/admin/electeurs/${record.ID}/nouveau-demande`}
        //                 state={{ electeur: record }}
        //                 className="inline-flex items-center gap-2 text-white bg-primary hover:bg-primary-light px-3 py-1 rounded"
        //             >
        //                 <PlusOutlined />
        //                 Créer une demande
        //             </Link>
        //         </div>


        //     </>
        // },

        {
            title: "Actions",
            key: "actions",
            fixed: "right",
            width: 160,
            render: (_, record) => <>
                <div  className="flex gap-2" >
                    {user && user.roles.includes("ROLE_SUPER_ADMIN") && (

                        <Link
                            to={`/admin/electeurs/${record.ID}/demandes`}
                            state={{ electeur: record }}
                            className="inline-flex items-center gap-2 text-white bg-primary hover:bg-primary-light px-3 py-1 rounded"
                        >
                            <SearchOutlined />
                            Demandes liées
                        </Link>
                    )}

                    <Link
                        to={`/admin/electeurs/${record.ID}/nouveau-demande`}
                        state={{ electeur: record }}
                        className="inline-flex items-center gap-2 text-white bg-primary hover:bg-primary-light px-3 py-1 rounded"
                    >
                        <PlusOutlined />
                        Créer une demande
                    </Link>
                </div>
            </>

        },
    ];
    const buildFilters = () => {
        const payload = {};
        if (q.prenom) payload.prenom = q.prenom;
        if (q.nom) payload.nom = q.nom;
        if (q.telephone) payload.telephone = q.telephone;
        if (q.nin) payload.numeroElecteur = q.nin; // backend lit numeroElecteur
        return payload;
    };

    const onSearch = async ({ keepPage = false } = {}) => {
        try {
            setLoading(true);

            // si nouvelle recherche => on repart page 1
            const effectivePage = keepPage ? page : 1;
            if (!keepPage && page !== 1) setPage(1); // on remet l'état visuel

            const payload = {
                page: effectivePage,
                pageSize,
                ...buildFilters(),
            };


            const data = await rechercheElecteur(payload);

            if (!data?.success) throw new Error("Requête non aboutie");

            const items = Array.isArray(data.items) ? data.items : data.resultats || [];
            const t = typeof data.total === "number" ? data.total : items.length;

            setRows(items);
            setTotal(t);

            if (!items.length) message.info("Aucun résultat trouvé.");
        } catch (e) {
            message.error("Erreur pendant la recherche.");
        } finally {
            setLoading(false);
        }
    };

    const onReset = () => {
        form.resetFields();
        setQ({ nom: "", prenom: "", nin: "", telephone: "" });
        setPage(1);
        setRows([]);
        setTotal(0);
    };

    return (
        <>
            <AdminBreadcrumb title="Recherche électeurs" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="grid grid-cols-1">
                            <Card className="shadow-lg rounded-lg">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                                    <Title level={4}>Recherche</Title>
                                </div>

                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={() => onSearch({ keepPage: false })}
                                    initialValues={q}
                                    className="grid grid-cols-1 md:grid-cols-4 gap-4"
                                >
                                    <Form.Item name="nom" label="Nom">
                                        <Input
                                            placeholder="Nom"
                                            allowClear
                                            onChange={(e) => setQ((s) => ({ ...s, nom: e.target.value }))}
                                        />
                                    </Form.Item>
                                    <Form.Item name="prenom" label="Prénom">
                                        <Input
                                            placeholder="Prénom"
                                            allowClear
                                            onChange={(e) => setQ((s) => ({ ...s, prenom: e.target.value }))}
                                        />
                                    </Form.Item>
                                    <Form.Item name="nin" label="NIN / N° électeur">
                                        <Input
                                            placeholder="1136..."
                                            allowClear
                                            onChange={(e) => setQ((s) => ({ ...s, nin: e.target.value }))}
                                        />
                                    </Form.Item>
                                    <Form.Item name="telephone" label="Téléphone">
                                        <Input
                                            placeholder="77..."
                                            allowClear
                                            onChange={(e) => setQ((s) => ({ ...s, telephone: e.target.value }))}
                                        />
                                    </Form.Item>

                                    <div className="col-span-1 md:col-span-4 flex gap-2">
                                        <Button htmlType="submit" icon={<SearchOutlined />} loading={loading}>
                                            Rechercher
                                        </Button>
                                        <Button onClick={onReset}>Réinitialiser</Button>
                                    </div>
                                </Form>

                                <div className="mt-6">
                                    <Table
                                        rowKey="ID"
                                        scroll={{ x: "max-content" }}
                                        columns={columns}
                                        dataSource={rows}
                                        loading={loading}
                                        pagination={{
                                            current: page,
                                            pageSize,
                                            total,
                                            showSizeChanger: true,
                                            showTotal: (t) => `Total ${t} électeur(s)`,
                                            onChange: (p, ps) => {
                                                // On met à jour l'état, PUIS on fetch explicitement
                                                setPage(p);
                                                setPageSize(ps);
                                                // important: on garde la page demandée
                                                setTimeout(() => onSearch({ keepPage: true }), 0);
                                            },
                                        }}
                                    />
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default RequestListElector;
