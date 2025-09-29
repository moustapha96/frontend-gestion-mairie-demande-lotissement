// src/pages/admin/AdminAccountManagement.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    Table,
    Card,
    Space,
    Typography,
    Input,
    Button,
    Select,
    Tag,
    Drawer,
    Descriptions,
    Tooltip,
    Modal,
    Form,
    Switch,
    Upload,
    message,
} from "antd";
import {
    SearchOutlined,
    ReloadOutlined,
    EyeOutlined,
    ClearOutlined,
    PlusOutlined,
    UploadOutlined,
    LockOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import {
    getUsersPaginated,
    getUserDetails,
    updateActivatedStatus,
    setCompteEnable,
    updateUserRole,
    updateUserProfile,
    updatePassword,
    uploadProfileImage,
    createAdminUser,
    createUser,
} from "@/services/utilisateurServices";

const { Title, Text } = Typography;
const { Option } = Select;

const ROLE_OPTIONS = [
    "ROLE_DEMANDEUR",
    "ROLE_AGENT",
    "ROLE_ADMIN",
    "ROLE_SUPER_ADMIN",
    "ROLE_MAIRE",
    "ROLE_CHEF_SERVICE",
    "ROLE_PRESIDENT_COMMISSION",
    "ROLE_PERCEPTEUR",
];

const roleColor = (r) => {
    switch (r) {
        case "ROLE_SUPER_ADMIN": return "magenta";
        case "ROLE_ADMIN": return "volcano";
        case "ROLE_AGENT": return "geekblue";
        case "ROLE_DEMANDEUR": return "blue";
        case "ROLE_MAIRE": return "green";
        case "ROLE_CHEF_SERVICE": return "gold";
        case "ROLE_PRESIDENT_COMMISSION": return "purple";
        case "ROLE_PERCEPTEUR": return "cyan";
        default: return "default";
    }
};

export default function AdminAccountManagement() {
    // dataset paginé
    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState({
        page: 1, size: 10, total: 0, pages: 0, sort: "id,DESC",
    });

    // états UI
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    // filtres / recherche
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState(undefined);
    const [enabledFilter, setEnabledFilter] = useState(undefined);
    const [activatedFilter, setActivatedFilter] = useState(undefined);

    // détails
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeUser, setActiveUser] = useState(null);

    // modals
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [pwdModalOpen, setPwdModalOpen] = useState(false);
    const [createAdminOpen, setCreateAdminOpen] = useState(false);
    const [createUserOpen, setCreateUserOpen] = useState(false);

    // forms
    const [editForm] = Form.useForm();
    const [pwdForm] = Form.useForm();
    const [createAdminForm] = Form.useForm();
    const [createUserForm] = Form.useForm();

    // ---------- FETCH ----------
    const fetchPage = async (override = {}) => {
        setLoading(true);
        try {
            const params = {
                page: override.page ?? meta.page,
                size: override.size ?? meta.size,
                search: override.search ?? search,
                role: override.role ?? roleFilter,
                enabled: override.enabled ?? enabledFilter,
                activated: override.activated ?? activatedFilter,
                sort: override.sort ?? meta.sort,
            };
            const res = await getUsersPaginated(params);
            console.log(res)
            setRows(res || []);
            setMeta(
                res?.meta || { page: 1, size: 10, total: 0, pages: 0, sort: "id,DESC" }
            );
        } catch (e) {
            console.error(e);
            message.error("Erreur lors du chargement des utilisateurs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPage(); /* eslint-disable-next-line */ }, []);

    useEffect(() => {
        const t = setTimeout(() => fetchPage({ page: 1 }), 400);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, roleFilter, enabledFilter, activatedFilter]);

    const onTableChange = (pagination, filters, sorter) => {
        const size = pagination.pageSize;
        const page = pagination.current;
        let sort = meta.sort;

        if (Array.isArray(sorter)) sorter = sorter[0];
        if (sorter && sorter.field) {
            const dir = sorter.order === "ascend" ? "ASC" : "DESC";
            sort = `${sorter.field},${dir}`;
        }
        const role = filters?.roles?.[0] || roleFilter;
        fetchPage({ page, size, sort, role });
    };

    // ---------- DÉTAILS ----------
    const openDetails = async (userId) => {
        setDetailLoading(true);
        try {
            const details = await getUserDetails(userId);
            setActiveUser(details);
            setDrawerOpen(true);
        } catch (e) {
            message.error("Impossible de charger les détails");
        } finally {
            setDetailLoading(false);
        }
    };

    // ---------- ACTIONS ----------
    const onToggleActivated = async (record, checked) => {
        setUpdatingId(record.id);
        try {
            await updateActivatedStatus(record.id, checked);
            message.success(checked ? "Compte activé" : "Compte désactivé");
            await fetchPage();
        } catch {
            message.error("Échec MAJ activation");
        } finally { setUpdatingId(null); }
    };

    const onToggleEnabled = async (record, checked) => {
        setUpdatingId(record.id);
        try {
            await setCompteEnable(record.id, checked ? "actif" : "inactif");
            message.success(checked ? "Compte débloqué" : "Compte bloqué");
            await fetchPage();
        } catch {
            message.error("Échec MAJ enabled");
        } finally { setUpdatingId(null); }
    };

    const onChangeRole = async (record, nextRole) => {
        setUpdatingId(record.id);
        console.log(record, nextRole)
        try {
            await updateUserRole(record.id, nextRole);

            message.success("Rôle mis à jour");
            await fetchPage();
        } catch {
            message.error("Échec mise à jour du rôle");
        } finally { setUpdatingId(null); }
    };


    // ---------- MODALS (édition / mdp / création) ----------
    const openEditModal = () => {
        editForm.setFieldsValue({
            nom: activeUser?.nom,
            prenom: activeUser?.prenom,
            email: activeUser?.email,
            telephone: activeUser?.telephone,
            adresse: activeUser?.adresse,
            lieuNaissance: activeUser?.lieuNaissance,
            dateNaissance: activeUser?.dateNaissance?.slice?.(0, 10),
            numeroElecteur: activeUser?.numeroElecteur,
            profession: activeUser?.profession,
        });
        setEditModalOpen(true);
    };

    const submitEdit = async () => {
        const values = await editForm.validateFields();
        console.log("submit edit");
        console.log(values);
        try {
            await updateUserProfile(activeUser.id, values);
            message.success("Profil mis à jour");
            setEditModalOpen(false);
            await openDetails(activeUser.id);
            await fetchPage();
        } catch (e) {
            if (!e?.errorFields) message.error("Échec mise à jour profil");
        }
    };

    const openPwdModal = () => {
        pwdForm.resetFields();
        setPwdModalOpen(true);
    };

    const submitPwd = async () => {
        try {
            const { currentPassword, newPassword } = await pwdForm.validateFields();
            await updatePassword(activeUser.id, { currentPassword, newPassword });
            message.success("Mot de passe mis à jour");
            setPwdModalOpen(false);
        } catch (e) {
            if (!e?.errorFields) message.error("Échec mise à jour mot de passe");
        }
    };

    const uploadAvatar = async ({ file }) => {
        if (!activeUser?.id) return message.error("Utilisateur non défini");
        const formData = new FormData();
        formData.append("userId", activeUser.id);
        formData.append("image", file);
        try {
            await uploadProfileImage(formData);
            message.success("Avatar mis à jour");
            await openDetails(activeUser.id);
        } catch {
            message.error("Échec upload avatar");
        }
    };

    // création admin
    const submitCreateAdmin = async () => {
        try {
            const values = await createAdminForm.validateFields();
            await createAdminUser(values);
            message.success("Administrateur créé");
            setCreateAdminOpen(false);
            createAdminForm.resetFields();
            await fetchPage();
        } catch (e) {
            if (!e?.errorFields) message.error("Échec création admin");
        }
    };

    // création user simple
    const submitCreateUser = async () => {
        try {
            const values = await createUserForm.validateFields();
            // Pour createUser: attend {email, password, ...}
            // On met role par défaut si absent
            if (!values.roles) values.roles = "ROLE_DEMANDEUR";
            await createUser(values);
            message.success("Utilisateur créé");
            setCreateUserOpen(false);
            createUserForm.resetFields();
            await fetchPage();
        } catch (e) {
            if (!e?.errorFields) message.error("Échec création utilisateur");
        }
    };

    // ---------- UI ----------
    const columns = useMemo(
        () => [
            {
                title: "Nom",
                dataIndex: "nom",
                key: "nom",
                sorter: true,
                render: (text, r) => (
                    <Space direction="vertical" size={0}>
                        <Text strong>{r.nom} {r.prenom}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{r.email}</Text>
                    </Space>
                ),
            },
            {
                title: "Rôle",
                dataIndex: "roles",
                key: "roles",
                sorter: false,
                filters: ROLE_OPTIONS.map((ro) => ({ text: ro, value: ro })),
                filteredValue: roleFilter ? [roleFilter] : null,
                render: (_, r) => {
                    const mainRole = Array.isArray(r.roles) ? r.roles[0] : r.roles;
                    return (
                        <Select
                            size="small"
                            value={mainRole}
                            style={{ minWidth: 190 }}
                            onChange={(val) => onChangeRole(r, val)}
                            loading={updatingId === r.id}
                        >
                            {ROLE_OPTIONS.map((ro) => (
                                <Option value={ro} key={ro}>
                                    <Tag color={roleColor(ro)}>{ro}</Tag>
                                </Option>
                            ))}
                        </Select>
                    );
                },
            },
            {
                title: "Demandes",
                dataIndex: "demandes",
                key: "demandes",
                sorter: true,
                width: 110,
                render: (v) => <Tag>{Number(v || 0)}</Tag>,
            },
            
            {
                title: "Activé",
                dataIndex: "activated",
                key: "activated",
                width: 170,
                render: (_, r) => (
                    <Space>
                        <Switch
                            checked={!!r.activated}
                            onChange={(checked) => onToggleActivated(r, checked)}
                            loading={updatingId === r.id}
                            checkedChildren="Oui"
                            unCheckedChildren="Non"
                             rootClassName="enabled-switch"
                           
                        />

                        <Tag color={r.activated ? "green" : "red"}>
                            {r.activated ? "Activé" : "Désactivé"}
                        </Tag>
                    </Space>
                ),
                filters: [
                    { text: "Activé", value: true },
                    { text: "Désactivé", value: false },
                ],
                filteredValue: activatedFilter === undefined ? null : [activatedFilter],
            },

            {
                title: "Actions",
                key: "actions",
                width: 160,
                render: (_, r) => (
                    <Space>
                        <Tooltip title="Détails">
                            <Button size="small" icon={<EyeOutlined />} onClick={() => openDetails(r.id)} loading={detailLoading && activeUser?.id === r.id}>
                                Détails
                            </Button>
                        </Tooltip>
                    </Space>
                ),
            },
        ],
        [roleFilter, activatedFilter, enabledFilter, updatingId, detailLoading, activeUser]
    );

    const resetFilters = () => {
        setSearch("");
        setRoleFilter(undefined);
        setEnabledFilter(undefined);
        setActivatedFilter(undefined);
        fetchPage({ page: 1 });
    };

    return (
        <>
            <section className="container mx-auto px-4">
                <div className="my-6 space-y-6">
                    <Card className="shadow-lg rounded-lg">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                            <Title level={4} style={{ margin: 0 }}>Gestion des comptes</Title>
                            <Space wrap>
                                <Button icon={<ReloadOutlined />} onClick={() => fetchPage()}>Rafraîchir</Button>
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateUserOpen(true)}>
                                    Créer Utilisateur
                                </Button>
                                <Button icon={<PlusOutlined />} onClick={() => setCreateAdminOpen(true)}>
                                    Créer Admin
                                </Button>
                                <Button icon={<ClearOutlined />} onClick={resetFilters}>Réinitialiser</Button>
                            </Space>
                        </div>

                        {/* Filtres */}
                        <div className="flex flex-col lg:flex-row gap-2 mb-4">
                            <Input
                                placeholder="Rechercher (nom, prénom, email, username, téléphone)"
                                prefix={<SearchOutlined />}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full lg:max-w-md"
                            />
                            <Select
                                placeholder="Filtrer par rôle"
                                allowClear
                                value={roleFilter}
                                style={{ minWidth: 220 }}
                                onChange={(v) => setRoleFilter(v)}
                                options={ROLE_OPTIONS.map((r) => ({ label: r, value: r }))}
                            />
                            <Select
                                placeholder="Enabled"
                                allowClear
                                value={enabledFilter}
                                style={{ width: 140 }}
                                onChange={(v) => setEnabledFilter(v)}
                                options={[
                                    { label: "Actif", value: true },
                                    { label: "Inactif", value: false },
                                ]}
                            />
                            <Select
                                placeholder="Activé"
                                allowClear
                                value={activatedFilter}
                                style={{ width: 140 }}
                                onChange={(v) => setActivatedFilter(v)}
                                options={[
                                    { label: "Activé", value: true },
                                    { label: "Désactivé", value: false },
                                ]}
                            />
                        </div>

                        {/* Table */}
                        <Table
                            rowKey="id"
                            columns={columns}
                            dataSource={
                                search
                                    ? rows.filter((r) =>
                                        [
                                            r.nom, r.prenom, r.email, r.username, r.telephone
                                        ].join(" ").toLowerCase().includes(search.toLowerCase())
                                    )
                                    : rows
                            }
                            loading={loading}
                            onChange={onTableChange}
                            pagination={{
                                current: meta.page,
                                pageSize: meta.size,
                                total: meta.total,
                                showSizeChanger: true,
                                pageSizeOptions: ["5", "10", "20", "50", "100"],
                                showTotal: (t) => `Total ${t} utilisateurs`,
                            }}
                            scroll={{ x: 1100 }}
                        />
                    </Card>
                </div>
            </section>

            {/* Drawer détails */}
            <Drawer
                title={`Détails utilisateur${activeUser ? ` — ${activeUser.nom} ${activeUser.prenom}` : ""}`}
                width={720}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                destroyOnClose
                extra={
                    activeUser && (
                        <Space>
                            <Upload accept="image/*" showUploadList={false} customRequest={uploadAvatar}>
                                <Button icon={<UploadOutlined />}>Avatar</Button>
                            </Upload>
                            <Button icon={<LockOutlined />} onClick={openPwdModal}>Mot de passe</Button>
                            <Button type="primary" icon={<SaveOutlined />} onClick={openEditModal}>
                                Modifier
                            </Button>
                        </Space>
                    )
                }
            >
                {!activeUser ? (
                    <Text type="secondary">Sélectionnez un utilisateur…</Text>
                ) : (
                    <>
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="ID">{activeUser.id}</Descriptions.Item>
                            <Descriptions.Item label="Email">{activeUser.email}</Descriptions.Item>
                            <Descriptions.Item label="Nom">{activeUser.nom}</Descriptions.Item>
                            <Descriptions.Item label="Prénom">{activeUser.prenom}</Descriptions.Item>
                            <Descriptions.Item label="Téléphone" span={2}>{activeUser.telephone || "—"}</Descriptions.Item>
                            <Descriptions.Item label="Adresse" span={2}>{activeUser.adresse || "—"}</Descriptions.Item>
                            <Descriptions.Item label="Lieu de naissance">{activeUser.lieuNaissance || "—"}</Descriptions.Item>
                            <Descriptions.Item label="Date de naissance">
                                {activeUser.dateNaissance ? new Date(activeUser.dateNaissance).toLocaleDateString() : "—"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Numéro Électeur">{activeUser.numeroElecteur || "—"}</Descriptions.Item>
                            <Descriptions.Item label="Profession">{activeUser.profession || "—"}</Descriptions.Item>
                            <Descriptions.Item label="Activé">{String(activeUser.activated ?? activeUser.isActive)}</Descriptions.Item>
                            <Descriptions.Item label="Enabled">{String(activeUser.enabled)}</Descriptions.Item>
                            <Descriptions.Item label="Habitant">{String(activeUser.isHabitant)}</Descriptions.Item>
                            <Descriptions.Item label="Demandes">
                                {Array.isArray(activeUser.demandes) ? activeUser.demandes.length : activeUser.demandes ?? 0}
                            </Descriptions.Item>
                        </Descriptions>

                        {Array.isArray(activeUser.demandes) && activeUser.demandes.length > 0 && (
                            <div className="mt-4">
                                <Title level={5}>Aperçu Demandes</Title>
                                <div className="space-y-2">
                                    {activeUser.demandes.slice(0, 5).map((d) => (
                                        <div key={d.id} className="text-sm">
                                            <b>#{d.id}</b> — {d.typeDemande} — {d.statut}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </Drawer>

            {/* Modal édition profil */}
            <Modal
                title="Modifier le profil"
                open={editModalOpen}
                onCancel={() => setEditModalOpen(false)}
                onOk={submitEdit}
                okText="Enregistrer"
            >
                <Form form={editForm} layout="vertical">
                    <Form.Item name="nom" label="Nom" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="prenom" label="Prénom" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}><Input /></Form.Item>
                    <Form.Item name="telephone" label="Téléphone"><Input /></Form.Item>
                    <Form.Item name="adresse" label="Adresse"><Input /></Form.Item>
                    <Form.Item name="lieuNaissance" label="Lieu de naissance"><Input /></Form.Item>
                    <Form.Item name="dateNaissance" label="Date de naissance" tooltip="YYYY-MM-DD">
                        <Input placeholder="1990-01-01" />
                    </Form.Item>
                    <Form.Item name="numeroElecteur" label="Numéro Électeur"><Input /></Form.Item>
                    <Form.Item name="profession" label="Profession"><Input /></Form.Item>
                </Form>
            </Modal>

            {/* Modal mot de passe */}
            <Modal
                title="Changer le mot de passe"
                open={pwdModalOpen}
                onCancel={() => setPwdModalOpen(false)}
                onOk={submitPwd}
                okText="Mettre à jour"
            >
                <Form form={pwdForm} layout="vertical">
                    <Form.Item
                        name="currentPassword"
                        label="Mot de passe actuel"
                        rules={[{ required: true, min: 6 }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        label="Nouveau mot de passe"
                        rules={[{ required: true, min: 8, message: "Au moins 8 caractères" }]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal création admin */}
            <Modal
                title="Créer un administrateur"
                open={createAdminOpen}
                onCancel={() => setCreateAdminOpen(false)}
                onOk={submitCreateAdmin}
                okText="Créer"
            >
                <Form form={createAdminForm} layout="vertical">
                    <Form.Item name="nom" label="Nom" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="prenom" label="Prénom" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}><Input /></Form.Item>
                    <Form.Item name="telephone" label="Téléphone" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="adresse" label="Adresse"><Input /></Form.Item>
                    <Form.Item name="profession" label="Profession"><Input /></Form.Item>
                    <Form.Item name="lieuNaissance" label="Lieu de naissance"><Input /></Form.Item>
                    <Form.Item name="dateNaissance" label="Date de naissance" tooltip="YYYY-MM-DD">
                        <Input placeholder="1990-01-01" />
                    </Form.Item>
                    <Form.Item name="numeroElecteur" label="Numéro Électeur"><Input /></Form.Item>
                </Form>
            </Modal>

            {/* Modal création utilisateur simple */}
            <Modal
                title="Créer un utilisateur"
                open={createUserOpen}
                onCancel={() => setCreateUserOpen(false)}
                onOk={submitCreateUser}
                okText="Créer"
            >
                <Form form={createUserForm} layout="vertical">
                    <Form.Item name="nom" label="Nom" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="prenom" label="Prénom" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}><Input /></Form.Item>
                    <Form.Item name="password" label="Mot de passe" rules={[{ required: true, min: 8 }]}><Input.Password /></Form.Item>
                    <Form.Item name="telephone" label="Téléphone"><Input /></Form.Item>
                    <Form.Item name="adresse" label="Adresse"><Input /></Form.Item>
                    <Form.Item name="profession" label="Profession"><Input /></Form.Item>
                    <Form.Item name="lieuNaissance" label="Lieu de naissance"><Input /></Form.Item>
                    <Form.Item name="dateNaissance" label="Date de naissance" tooltip="YYYY-MM-DD">
                        <Input placeholder="1990-01-01" />
                    </Form.Item>
                    <Form.Item name="numeroElecteur" label="Numéro Électeur"><Input /></Form.Item>
                    <Form.Item name="roles" label="Rôle">
                        <Select defaultValue="ROLE_DEMANDEUR">
                            {ROLE_OPTIONS.map((ro) => <Option key={ro} value={ro}>{ro}</Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
