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
  Row,
  Col,
  DatePicker,
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
import dayjs from "dayjs";

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
import { toast } from "sonner";

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

const SITUATION_DEMANDEUR_OPTIONS = [
  { value: "Propriétaire", label: "Propriétaire" },
  { value: "Locataire", label: "Locataire" },
  { value: "Hébergé(e)", label: "Hébergé(e)" },
]



export default function AdminAccountManagement() {
  // dataset paginé
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({
    page: 1, size: 5, total: 0, pages: 0, sort: "id,DESC",
  });

  // états UI
  const [loading, setLoading] = useState(true);           // charge table
  const [refreshing, setRefreshing] = useState(false);    // bouton "Rafraîchir"
  const [updatingId, setUpdatingId] = useState(null);     // switch/select par ligne
  const [detailLoading, setDetailLoading] = useState(false); // bouton Détails

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

  // loading des modals (OK button)
  const [editSaving, setEditSaving] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [createAdminSaving, setCreateAdminSaving] = useState(false);
  const [createUserSaving, setCreateUserSaving] = useState(false);

  // forms
  const [editForm] = Form.useForm();
  const [pwdForm] = Form.useForm();
  const [createAdminForm] = Form.useForm();
  const [createUserForm] = Form.useForm();

  // ---------- FETCH ----------
  const extractUsers = (res) => {
    // Le service peut renvoyer: Array, {data: []}, {items: []}
    const items = Array.isArray(res)
      ? res
      : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.items)
          ? res.items
          : [];
    const meta = res?.meta ?? {
      page: 1,
      size: items.length,
      total: items.length,
      pages: 1,
      sort: "id,DESC",
    };
    return { items, meta };
  };

  const fetchPage = async (override = {}) => {
    // on affiche loading sur table
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
      const { items, meta: m } = extractUsers(res);
      setRows(items);
      setMeta({
        page: m.page ?? params.page,
        size: m.size ?? params.size,
        total: m.total ?? items.length,
        pages: m.pages ?? Math.ceil((m.total ?? items.length) / ((m.size ?? params.size) || 10)),
        sort: m.sort ?? params.sort,
      });
    } catch (e) {
      console.error(e);
      message.error("Erreur lors du chargement des utilisateurs");
      setRows([]);
      setMeta((s) => ({ ...s, total: 0, pages: 0 }));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchPage(); /* eslint-disable-next-line */ }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchPage({ page: 1 }), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, roleFilter, enabledFilter, activatedFilter]);

  const onTableChange = (pagination, filters, sorterArg) => {
    const size = pagination.pageSize ?? meta.size;
    const page = pagination.current ?? 1;

    // tri
    let sort = meta.sort;
    let s = sorterArg;
    if (Array.isArray(s)) s = s[0];
    if (s && s.field) {
      const dir = s.order === "ascend" ? "ASC" : "DESC";
      sort = `${s.field},${dir}`;
    }

    // filtre via popover de colonne (si tu veux synchroniser)
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
    const body = {
      activated: checked
    }
    setUpdatingId(record.id);
    try {
      await updateActivatedStatus(record.id, body);
      toast.success(checked ? "Compte activé" : "Compte désactivé");
      await fetchPage();
    } catch (error) {
      toast.error(error?.response?.data || "Échec MAJ activation");
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
      dateNaissance: activeUser?.dateNaissance ? dayjs(activeUser.dateNaissance) : null,
      numeroElecteur: activeUser?.numeroElecteur,
      profession: activeUser?.profession,
    });
    setEditModalOpen(true);
  };

  const submitEdit = async () => {
    try {
      const values = await editForm.validateFields();
      // formate date pour l’API si dayjs
      const payload = {
        ...values,
        dateNaissance: values.dateNaissance ? values.dateNaissance.format("YYYY-MM-DD") : undefined,
      };
      setEditSaving(true);
      await updateUserProfile(activeUser.id, payload);
      message.success("Profil mis à jour");
      setEditModalOpen(false);
      await openDetails(activeUser.id);
      await fetchPage();
    } catch (e) {
      if (!e?.errorFields) message.error("Échec mise à jour profil");
    } finally {
      setEditSaving(false);
    }
  };

  const openPwdModal = () => {
    pwdForm.resetFields();
    setPwdModalOpen(true);
  };

  const submitPwd = async () => {
    try {
      const { currentPassword, newPassword } = await pwdForm.validateFields();
      setPwdSaving(true);
      await updatePassword(activeUser.id, { currentPassword, newPassword });
      message.success("Mot de passe mis à jour");
      setPwdModalOpen(false);
    } catch (e) {
      if (!e?.errorFields) message.error("Échec mise à jour mot de passe");
    } finally {
      setPwdSaving(false);
    }
  };

  const uploadAvatar = async ({ file, onSuccess, onError }) => {
    if (!activeUser?.id) {
      message.error("Utilisateur non défini");
      onError?.();
      return;
    }
    const formData = new FormData();
    formData.append("userId", activeUser.id);
    formData.append("image", file);
    try {
      await uploadProfileImage(formData);
      message.success("Avatar mis à jour");
      onSuccess?.("ok");
      await openDetails(activeUser.id);
    } catch {
      message.error("Échec upload avatar");
      onError?.();
    }
  };

  // création admin
  const submitCreateAdmin = async () => {
    try {
      const values = await createAdminForm.validateFields();
      const payload = {
        ...values,
        dateNaissance: values.dateNaissance ? values.dateNaissance.format("YYYY-MM-DD") : undefined,
      };
      setCreateAdminSaving(true);
      await createAdminUser(payload);
      message.success("Administrateur créé");
      setCreateAdminOpen(false);
      createAdminForm.resetFields();
      await fetchPage();
    } catch (e) {
      if (!e?.errorFields) message.error("Échec création admin");
    } finally {
      setCreateAdminSaving(false);
    }
  };

  // création user simple
  const submitCreateUser = async () => {
    try {
      const values = await createUserForm.validateFields();
      const payload = {
        ...values,
        roles: values.roles || "ROLE_DEMANDEUR",
        dateNaissance: values.dateNaissance ? values.dateNaissance.format("YYYY-MM-DD") : undefined,
      };
      setCreateUserSaving(true);
      await createUser(payload);
      message.success("Utilisateur créé");
      setCreateUserOpen(false);
      createUserForm.resetFields();
      await fetchPage();
    } catch (e) {
      if (!e?.errorFields) message.error("Échec création utilisateur");
    } finally {
      setCreateUserSaving(false);
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
        render: (_, record) => {
          const count = Array.isArray(record.demandes) ? record.demandes.length : 0;
          return <Text strong>{count}</Text>;
        },
      },
      {
        title: "Activé",
        dataIndex: "activated",
        key: "activated",
        width: 190,
        render: (_, r) => {
          const isActivated = !!r.activated;
          return (
            <Space>
              <Switch
                checked={isActivated}
                onChange={(checked) => onToggleActivated(r, checked)}
                loading={updatingId === r.id}
                checkedChildren="Oui"
                unCheckedChildren="Non"
              />
              <Tag color={isActivated ? "green" : "red"}>
                {isActivated ? "Activé" : "Désactivé"}
              </Tag>
            </Space>
          );
        },
        filters: [
          { text: "Activé", value: true },
          { text: "Désactivé", value: false },
        ],
        filteredValue: activatedFilter === undefined ? null : [activatedFilter],
      },
      // Si tu dois afficher "enabled", décommente :
      // {
      //   title: "Enabled",
      //   dataIndex: "enabled",
      //   key: "enabled",
      //   width: 190,
      //   render: (_, r) => {
      //     const isEnabled = r.enabled !== false;
      //     return (
      //       <Space>
      //         <Switch
      //           checked={isEnabled}
      //           onChange={(checked) => onToggleEnabled(r, checked)}
      //           loading={updatingId === r.id}
      //           checkedChildren="Actif"
      //           unCheckedChildren="Inactif"
      //         />
      //         <Tag color={isEnabled ? "blue" : "default"}>
      //           {isEnabled ? "Actif" : "Inactif"}
      //         </Tag>
      //       </Space>
      //     );
      //   },
      // },
      {
        title: "Actions",
        key: "actions",
        width: 160,
        render: (_, r) => (
          <Space>
            <Tooltip title="Détails">
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={() => openDetails(r.id)}
                loading={detailLoading && activeUser?.id === r.id}
              >
                Détails
              </Button>
            </Tooltip>
          </Space>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [roleFilter, activatedFilter, enabledFilter, updatingId, detailLoading, activeUser]
  );

  const resetFilters = () => {
    setSearch("");
    setRoleFilter(undefined);
    setEnabledFilter(undefined);
    setActivatedFilter(undefined);
    fetchPage({ page: 1 });
  };

  const filteredRows = useMemo(() => {
    if (!search) return rows;
    const s = search.toLowerCase().trim();
    return rows.filter((r) =>
      [r.nom, r.prenom, r.email, r.username, r.telephone]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(s)
    );
  }, [rows, search]);

  return (
    <>
      <section className="container mx-auto px-4">
        <div className="my-6 space-y-6">
          <Card className="shadow-lg rounded-lg">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <Title level={4} style={{ margin: 0 }}>Gestion des comptes</Title>
              <Space wrap>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => { setRefreshing(true); fetchPage(); }}
                  loading={refreshing || loading}
                >
                  Rafraîchir
                </Button>
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
                allowClear
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
              dataSource={Array.isArray(filteredRows) ? filteredRows : []}
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
              <Descriptions.Item label="Statut logement">{activeUser.situationDemandeur || "—"}</Descriptions.Item>
              <Descriptions.Item label="Compte Activé">{activeUser.activated ? "Activé" : "Désactivé"}</Descriptions.Item>
              <Descriptions.Item label="Habitant">{activeUser.isHabitant ? "Oui" : "Non"}</Descriptions.Item>
              <Descriptions.Item label="Demandes">
                {Array.isArray(activeUser.demandes) ? activeUser.demandes.length : 0}
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
        confirmLoading={editSaving}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical">
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item name="nom" label="Nom" rules={[{ required: true }]}><Input /></Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="prenom" label="Prénom" rules={[{ required: true }]}><Input /></Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}><Input /></Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="telephone" label="Téléphone"><Input /></Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="adresse" label="Adresse"><Input /></Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="lieuNaissance" label="Lieu de naissance"><Input /></Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="dateNaissance" label="Date de naissance">
                <DatePicker className="w-full" format="YYYY-MM-DD" placeholder="1990-01-01" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="numeroElecteur" label="Numéro Électeur"><Input /></Form.Item>
            </Col>

            <Col xs={24} md={24}>
              <Form.Item
                name="situationDemandeur"
                label="Statut logement"
                rules={[{ required: true, message: "Veuillez sélectionner le Statut de logement du demandeur" }]}
              >
                <Select placeholder="Sélectionner">
                  {SITUATION_DEMANDEUR_OPTIONS.map(opt => (
                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                  ))}
                </Select>
              </Form.Item>

            </Col>

            <Col xs={24}>
              <Form.Item name="profession" label="Profession"><Input /></Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Modal mot de passe */}
      <Modal
        title="Changer le mot de passe"
        open={pwdModalOpen}
        onCancel={() => setPwdModalOpen(false)}
        onOk={submitPwd}
        okText="Mettre à jour"
        confirmLoading={pwdSaving}
        destroyOnClose
      >
        <Form form={pwdForm} layout="vertical">
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="currentPassword"
                label="Mot de passe actuel"
                rules={[{ required: true, min: 6 }]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="newPassword"
                label="Nouveau mot de passe"
                rules={[{ required: true, min: 8, message: "Au moins 8 caractères" }]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Modal création admin */}
      <Modal
        title="Créer un administrateur"
        open={createAdminOpen}
        onCancel={() => setCreateAdminOpen(false)}
        onOk={submitCreateAdmin}
        okText="Créer"
        confirmLoading={createAdminSaving}
        destroyOnClose
      >
        <Form form={createAdminForm} layout="vertical">
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item name="nom" label="Nom" rules={[{ required: true }]}><Input /></Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="prenom" label="Prénom" rules={[{ required: true }]}><Input /></Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}><Input /></Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="telephone" label="Téléphone" rules={[{ required: true }]}><Input /></Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="adresse" label="Adresse"><Input /></Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="profession" label="Profession"><Input /></Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="lieuNaissance" label="Lieu de naissance"><Input /></Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="dateNaissance" label="Date de naissance">
                <DatePicker className="w-full" format="YYYY-MM-DD" placeholder="1990-01-01" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item name="numeroElecteur" label="Numéro Électeur"><Input /></Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Modal création utilisateur simple */}
      <Modal
        title="Créer un utilisateur"
        open={createUserOpen}
        onCancel={() => setCreateUserOpen(false)}
        onOk={submitCreateUser}
        okText="Créer"
        confirmLoading={createUserSaving}
        destroyOnClose
      >
        <Form form={createUserForm} layout="vertical">
          <Row gutter={[16, 0]}>

            <Col xs={24} md={12}>
              <Form.Item name="prenom" label="Prénom" rules={[{ required: true }]}><Input /></Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="nom" label="Nom" rules={[{ required: true }]}><Input /></Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="telephone" label="Téléphone"
                rules={[
                  { pattern: /^(70|76|77|78|79)[0-9]{7}$/, message: "9 chiffres, commence par 70/76/77/78/79" },
                ]}
              >
                <Input /></Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="lieuNaissance" label="Lieu de naissance"><Input /></Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="dateNaissance" label="Date de naissance">
                <DatePicker className="w-full" format="YYYY-MM-DD" placeholder="1990-01-01" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="adresse" label="Adresse"><Input /></Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="profession" label="Profession"><Input /></Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="numeroElecteur" label="Numéro Électeur"

                rules={[
                  { required: true, message: "Veuillez saisir le Numéro d'Identification National" },
                  { pattern: /^[0-9A-Za-z]{13,15}$/, message: "Doit contenir 13 à 15 caractères alphanumériques" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>




            <Col xs={24} md={12}>
              <Form.Item
                name="situationDemandeur"
                label="Statut logement"
                rules={[{ required: true, message: "Veuillez sélectionner la situation du demandeur" }]}
              >
                <Select placeholder="Sélectionner">
                  {SITUATION_DEMANDEUR_OPTIONS.map(opt => (
                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                  ))}
                </Select>
              </Form.Item>

            </Col>

            <Col xs={24} md={12} >
              <Form.Item name="roles" label="Rôle" initialValue="ROLE_DEMANDEUR">
                <Select>
                  {ROLE_OPTIONS.map((ro) => <Option key={ro} value={ro}>{ro}</Option>)}
                </Select>
              </Form.Item>
            </Col>

            
            <Col xs={24} md={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}><Input /></Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="password" label="Mot de passe" rules={[{ required: true, min: 8 }]}><Input.Password /></Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
