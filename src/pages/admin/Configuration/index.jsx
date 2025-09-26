

"use client"

import { useEffect, useState } from "react"
import { Layout, Card, Tabs, Form, Input, Button, Table, Tag, Select, DatePicker, Typography, Spin, Alert, Popover, Space, Modal } from "antd"
import {
  SaveOutlined,
  BuildOutlined,
  PhoneOutlined,
  GlobalOutlined,
  MailOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserAddOutlined,
  BankOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons"
import { AdminBreadcrumb } from "@/components"
import { toast } from "sonner"
import { getConfigurations, updateConfiguration } from "@/services/configurationService"
import { getAllAccounts, updateActivatedStatus, createAdminUser, updateUserRole } from "@/services/userService"
import { useAuthContext } from "@/context"
import { getDetaitHabitant } from "../../../services/userService"

import { getLevels, createLevel, updateLevel, deleteLevel, getHistoriques } from "@/services/validationService"

const { Content } = Layout
const { TabPane } = Tabs
const { Title } = Typography
const { TextArea } = Input
const { Option } = Select

const AdminConfiguration = () => {
  const { user } = useAuthContext()

  // ACCÈS: niveaux + historique visibles pour ADMIN et SUPER_ADMIN
  const canSeeValidation = Array.isArray(user?.roles) && (
    user.roles.includes("ROLE_ADMIN") || user.roles.includes("ROLE_SUPER_ADMIN")
  )

  const [levels, setLevels] = useState([])
  const [loadingLevels, setLoadingLevels] = useState(false)
  const [levelModalOpen, setLevelModalOpen] = useState(false)
  const [editingLevel, setEditingLevel] = useState(null)
  const [levelForm] = Form.useForm()

  const [form] = Form.useForm()
  const [adminForm] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [config, setConfig] = useState({
    titre: "",
    adresse: "",
    telephone: "",
    siteWeb: "",
    email: "",
    nomMaire: "",
  })

  const [searchText, setSearchText] = useState("")
  const [activeTab, setActiveTab] = useState("config")
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingUser, setLoadingUser] = useState(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)

  const [habitantData, setHabitantData] = useState({})
  const [loadingHabitant, setLoadingHabitant] = useState({})

  // Redirige si l'utilisateur n'a pas accès aux onglets validation/historique
  useEffect(() => {
    if (!canSeeValidation && (activeTab === "levels" || activeTab === "history")) {
      setActiveTab("config")
    }
  }, [canSeeValidation, activeTab])

  const fetchLevels = async () => {
    setLoadingLevels(true)
    try {
      const data = await getLevels()
      // service retourne { success, items, ... } ou un tableau direct selon ton impl
      const rows = Array.isArray(data) ? data : (data.items || [])
      setLevels(rows)
    } catch (e) {
      toast.error("Erreur lors du chargement des niveaux")
    } finally {
      setLoadingLevels(false)
    }
  }

  const openCreateLevel = () => {
    setEditingLevel(null)
    levelForm.resetFields()
    setLevelModalOpen(true)
  }
  const openEditLevel = (rec) => {
    setEditingLevel(rec)
    levelForm.setFieldsValue({
      nom: rec.nom,
      roleRequis: rec.roleRequis,
      ordre: rec.ordre,
    })
    setLevelModalOpen(true)
  }

  const submitLevel = async () => {
    const values = await levelForm.validateFields()
    try {
      if (editingLevel) {
        await updateLevel(editingLevel.id, values)
        toast.success("Niveau mis à jour")
      } else {
        await createLevel(values)
        toast.success("Niveau créé")
      }
      setLevelModalOpen(false)
      fetchLevels()
    } catch (e) {
      toast.error("Échec enregistrement niveau")
    }
  }
  const confirmDeleteLevel = async (id) => {
    try {
      await deleteLevel(id)
      toast.success("Niveau supprimé")
      fetchLevels()
    } catch (e) {
      toast.error("Suppression impossible (niveau déjà utilisé ?)")
    }
  }

  useEffect(() => {
    const fetchConfigurations = async () => {
      setLoading(true)
      try {
        const response = await getConfigurations()
        const configObj = {
          titre: response.titre,
          nomMaire: response.nomMaire,
          telephone: response.telephone,
          email: response.email,
          siteWeb: response.siteWeb,
          adresse: response.adresse,
        }
        setConfig(configObj)
        form.setFieldsValue(configObj)
      } catch (err) {
        setError(err.message)
        toast.error("Erreur lors de la récupération des configurations")
      } finally {
        setLoading(false)
      }
    }
    fetchConfigurations()
  }, [form])

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers()
    }
    if (activeTab === "levels" && canSeeValidation) {
      fetchLevels()
    }
  }, [activeTab, canSeeValidation])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await getAllAccounts()
      if (user.roles.includes("ROLE_ADMIN") || user.roles.includes("ROLE_SUPER_ADMIN")) {
        setUsers(data)
      } else {
        const filteredUsers = data.filter(
          (u) => !u.roles.includes("ROLE_ADMIN") && !u.roles.includes("ROLE_SUPER_ADMIN"),
        )
        setUsers(filteredUsers)
      }
    } catch (err) {
      setError(err.message)
      toast.error("Erreur lors de la récupération des utilisateurs")
    } finally {
      setLoading(false)
    }
  }

  const handleActivateUser = async (userId, currentStatus) => {
    setLoadingUser(userId)
    try {
      await updateActivatedStatus(userId, currentStatus)
      await fetchUsers()
      toast.success("Statut de l'utilisateur mis à jour avec succès")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut")
    } finally {
      setLoadingUser(null)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    if (newRole === "ROLE_ADMIN" && !user.roles.includes("ROLE_SUPER_ADMIN")) {
      toast.error("Seul un super administrateur peut attribuer le rôle administrateur")
      return
    }

    setLoadingUser(userId)
    try {
      await updateUserRole(userId, newRole)
      await fetchUsers()
      toast.success("Rôle de l'utilisateur mis à jour avec succès")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du rôle")
    } finally {
      setLoadingUser(null)
    }
  }

  const handleSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      await Promise.all(Object.entries(values).map(([key, value]) => updateConfiguration(key, value)))
      toast.success("Configurations mises à jour avec succès")
    } catch (error) {
      console.error("Erreur lors de la mise à jour des configurations:", error)
      toast.error("Erreur lors de la mise à jour des configurations")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAdminSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      const formattedValues = {
        ...values,
        dateNaissance: values.dateNaissance ? values.dateNaissance.format("YYYY-MM-DD") : "",
      }
      await createAdminUser(formattedValues)
      toast.success("Administrateur créé avec succès")
      adminForm.resetFields()
    } catch (error) {
      toast.error("Erreur lors de la création de l'administrateur")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderHabitantContent = (userId) => {
    const data = habitantData[userId]
    if (!data) return <div>Chargement des informations...</div>
    return (
      <div className="max-w-3xl">
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="border-b pb-1">
              <strong>{key}:</strong> {value || "-"}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const fetchHabitantInfo = async (userId) => {
    if (habitantData[userId]) return
    setLoadingHabitant((prev) => ({ ...prev, [userId]: true }))
    try {
      const habitantInfo = await getDetaitHabitant(userId)
      setHabitantData((prev) => ({ ...prev, [userId]: habitantInfo }))
    } catch (error) {
      console.error("Erreur lors de la récupération des informations du habitant:", error)
    } finally {
      setLoadingHabitant((prev) => ({ ...prev, [userId]: false }))
    }
  }

  // Colonnes tableau utilisateurs
  const columns = [
    {
      title: "Nom",
      dataIndex: "nom",
      key: "nom",
      render: (text, record) => `${record.nom} ${record.prenom}`,
      sorter: (a, b) => {
        const nameA = `${a.nom} ${a.prenom}`.toLowerCase()
        const nameB = `${b.nom} ${b.prenom}`.toLowerCase()
        return nameA.localeCompare(nameB)
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.toLowerCase().localeCompare(b.email.toLowerCase()),
    },
    {
      title: "Habitant",
      dataIndex: "isHabitant",
      key: "isHabitant",
      sorter: (a, b) => a.isHabitant - b.isHabitant,
      render: (text, record) => {
        if (!record.isHabitant) return "Non"
        return (
          <Space>
            <span>Oui</span>
            <Popover
              content={renderHabitantContent(record.id)}
              title="Informations détaillées"
              trigger="click"
              placement="right"
              overlayStyle={{ maxWidth: "800px" }}
              onOpenChange={(visible) => {
                if (visible) fetchHabitantInfo(record.id)
              }}
            >
              <Button
                type="text"
                icon={<InfoCircleOutlined />}
                className="text-primary"
                loading={loadingHabitant[record.id]}
              />
            </Popover>
          </Space>
        )
      },
    },
    {
      title: "Rôle",
      dataIndex: "roles",
      key: "roles",
      render: (roles, record) => (
        <Select
          value={roles[0]}
          onChange={(value) => handleRoleChange(record.id, value)}
          disabled={
            loadingUser === record.id ||
            (roles[0] === "ROLE_ADMIN" && !user.roles.includes("ROLE_SUPER_ADMIN")) ||
            roles.includes("ROLE_SUPER_ADMIN")
          }
          style={{ width: "100%" }}
        >
          <Option value="ROLE_DEMANDEUR">Demandeur</Option>
          <Option value="ROLE_AGENT">Agent</Option>
          <Option value="ROLE_ADMIN">Admin</Option>
          {user.roles.includes("ROLE_SUPER_ADMIN") && <Option value="ROLE_SUPER_ADMIN">Super Admin</Option>}
        </Select>
      ),
    },
    {
      title: "Statut",
      dataIndex: "activated",
      key: "activated",
      render: (activated) => <Tag color={activated ? "success" : "error"}>{activated ? "Activé" : "Désactivé"}</Tag>,
      sorter: (a, b) => (a.activated === b.activated ? 0 : a.activated ? 1 : -1),
      filters: [
        { text: "Activé", value: true },
        { text: "Désactivé", value: false },
      ],
      onFilter: (value, record) => record.activated === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          className={record.activated ? "text-danger" : "text-primary"}
          onClick={() => handleActivateUser(record.id, record.activated)}
          disabled={loadingUser === record.id}
          icon={record.activated ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
          loading={loadingUser === record.id}
          shape="round"
        >
          {record.activated ? "Désactiver" : "Activer"}
        </Button>
      ),
    },
  ]

  if (user.roles.includes("ROLE_SUPER_ADMIN")) {
    columns.splice(4, 0, {
      title: "Mot de passe",
      dataIndex: "password",
      key: "password",
      render: (_, record) => (
        <Button
          className="text-primary"
          onClick={() => {
            if (record.passwordClaire) {
              toast.success(`Mot de passe: ${record.passwordClaire}`)
            } else {
              toast.error("Mot de passe non disponible")
            }
          }}
        >
          Voir le mot de passe
        </Button>
      ),
    })
  }

  if (loading && !users.length && !Object.values(config).some((val) => val)) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <ErrorDisplay error={error} />
  }

  return (
    <>
      <AdminBreadcrumb title="Configuration" />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <div className="grid grid-cols-1">
              <Content className="site-layout-background" style={{ padding: 24 }}>
                <Card>
                  <Tabs activeKey={activeTab} onChange={setActiveTab} tabBarStyle={{ color: "primary" }} type="card">

                    <TabPane tab="Configuration" key="config">
                      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={config}>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                            gap: 16,
                          }}
                        >
                          <Form.Item
                            name="titre"
                            label="Titre de la mairie"
                            rules={[{ required: true, message: "Veuillez saisir le titre de la mairie" }]}
                          >
                            <Input prefix={<BuildOutlined />} placeholder="Titre de la mairie" />
                          </Form.Item>

                          <Form.Item
                            name="nomMaire"
                            label="Nom du maire"
                            rules={[{ required: true, message: "Veuillez saisir le nom du maire" }]}
                          >
                            <Input prefix={<UserOutlined />} placeholder="Nom du maire" />
                          </Form.Item>

                          <Form.Item
                            name="adresse"
                            label="Adresse"
                            rules={[{ required: true, message: "Veuillez saisir l'adresse" }]}
                          >
                            <TextArea
                              prefix={<EnvironmentOutlined />}
                              placeholder="Adresse"
                              autoSize={{ minRows: 2, maxRows: 6 }}
                            />
                          </Form.Item>

                          <Form.Item
                            name="telephone"
                            label="Téléphone"
                            rules={[{ required: true, message: "Veuillez saisir le numéro de téléphone" }]}
                          >
                            <Input prefix={<PhoneOutlined />} placeholder="Téléphone" />
                          </Form.Item>

                          <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                              { required: true, message: "Veuillez saisir l'email" },
                              { type: "email, message: 'Veuillez saisir un email valide'" },
                            ]}
                          >
                            <Input prefix={<MailOutlined />} placeholder="Email" />
                          </Form.Item>

                          <Form.Item
                            name="siteWeb"
                            label="Site Web"
                            rules={[
                              { required: true, message: "Veuillez saisir le site web" },
                              { type: "url", message: "Veuillez saisir une URL valide" },
                            ]}
                          >
                            <Input prefix={<GlobalOutlined />} placeholder="https://www.example.com" />
                          </Form.Item>
                        </div>

                        <Form.Item style={{ textAlign: "center", marginTop: 24 }}>
                          <Button
                            className="text-primary"
                            htmlType="submit"
                            loading={isSubmitting}
                            icon={<SaveOutlined />}
                            size="large"
                          >
                            Enregistrer les modifications
                          </Button>
                        </Form.Item>
                      </Form>
                    </TabPane>

                    <TabPane tab="Utilisateurs" key="users">
                      <Input
                        placeholder="Rechercher par nom, prénom ou email..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 350, marginBottom: 16 }}
                      />

                      <Table
                        columns={columns}
                        dataSource={users.filter(
                          (item) =>
                            item.prenom.toLowerCase().includes(searchText.toLowerCase()) ||
                            item.nom.toLowerCase().includes(searchText.toLowerCase()) ||
                            item.email.toLowerCase().includes(searchText.toLowerCase())
                        )}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                          current: currentPage,
                          pageSize: 5,
                          total: users.length,
                          onChange: (page) => setCurrentPage(page),
                          showSizeChanger: false,
                          showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} utilisateurs`,
                        }}
                      />
                    </TabPane>

                    {/* Nouvel Admin: SUPER_ADMIN uniquement */}
                    {user.roles.includes("ROLE_SUPER_ADMIN") && (
                      <TabPane tab="Nouvel Admin" key="new-admin">
                        <Form form={adminForm} layout="vertical" onFinish={handleAdminSubmit}>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                              gap: 16,
                            }}
                          >
                            <Form.Item
                              name="nom"
                              label="Nom"
                              rules={[{ required: true, message: "Veuillez saisir le nom" }]}
                            >
                              <Input prefix={<UserOutlined />} placeholder="Nom" />
                            </Form.Item>

                            <Form.Item
                              name="prenom"
                              label="Prénom"
                              rules={[{ required: true, message: "Veuillez saisir le prénom" }]}
                            >
                              <Input prefix={<UserOutlined />} placeholder="Prénom" />
                            </Form.Item>

                            <Form.Item
                              name="email"
                              label="Email"
                              rules={[
                                { required: true, message: "Veuillez saisir l'email" },
                                { type: "email", message: "Veuillez saisir un email valide" },
                              ]}
                            >
                              <Input prefix={<MailOutlined />} placeholder="Email" />
                            </Form.Item>

                            <Form.Item
                              name="dateNaissance"
                              label="Date de Naissance"
                              rules={[{ required: true, message: "Veuillez sélectionner la date de naissance" }]}
                            >
                              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="Sélectionner une date" />
                            </Form.Item>

                            <Form.Item
                              name="lieuNaissance"
                              label="Lieu de Naissance"
                              rules={[{ required: true, message: "Veuillez saisir le lieu de naissance" }]}
                            >
                              <Input prefix={<EnvironmentOutlined />} placeholder="Lieu de naissance" />
                            </Form.Item>

                            <Form.Item
                              name="numeroElecteur"
                              label="Numéro d'Identification National"
                              rules={[
                                { required: true, message: "Veuillez saisir le Numéro d'Identification National" },
                                { max: 15, min: 13, message: "Doit contenir entre 13 et 15 caratcères", pattern: /^[0-9A-Za-z]{15}$/ },
                              ]}
                            >
                              <Input prefix={<UserAddOutlined />} placeholder="Numéro d'Identification National" />
                            </Form.Item>

                            <Form.Item
                              name="telephone"
                              label="Téléphone"
                              rules={[
                                { required: true, message: "Veuillez saisir le numéro de téléphone" },
                                {
                                  pattern: /^(70|76|77|78|79)[0-9]{7}$/,
                                  message: "9 chiffres, commence par 70/76/77/78/79",
                                },
                              ]}
                            >
                              <Input prefix={<PhoneOutlined />} placeholder="Téléphone" />
                            </Form.Item>

                            <Form.Item
                              name="profession"
                              label="Profession"
                              rules={[{ required: true, message: "Veuillez saisir la profession" }]}
                            >
                              <Input prefix={<BankOutlined />} placeholder="Profession" />
                            </Form.Item>

                            <Form.Item
                              name="adresse"
                              label="Adresse"
                              rules={[{ required: true, message: "Veuillez saisir l'adresse" }]}
                            >
                              <TextArea placeholder="Adresse" autoSize={{ minRows: 2, maxRows: 6 }} />
                            </Form.Item>
                          </div>

                          <Form.Item style={{ textAlign: "center", marginTop: 24 }}>
                            <Button className="text-primary" htmlType="submit" loading={isSubmitting} icon={<SaveOutlined />} size="large">
                              Créer l'administrateur
                            </Button>
                          </Form.Item>
                        </Form>
                      </TabPane>
                    )}

                    {/* Niveaux & Historique: ADMIN + SUPER_ADMIN */}
                    {canSeeValidation && (
                      <TabPane tab="Niveaux de validation" key="levels">
                        <div className="flex items-center justify-between mb-3">
                          <Title level={4} className="!mb-0">Workflow de validation</Title>
                          <Button className="ant-btn-primary" icon={<PlusOutlined />} onClick={openCreateLevel}>
                            Nouveau niveau
                          </Button>
                        </div>

                        <Table
                          rowKey="id"
                          loading={loadingLevels}
                          dataSource={levels}
                          pagination={{ pageSize: 10 }}
                          columns={[
                            { title: "Ordre", dataIndex: "ordre", sorter: (a, b) => a.ordre - b.ordre, width: 90 },
                            { title: "Nom", dataIndex: "nom" },
                            { title: "Rôle requis", dataIndex: "roleRequis" },
                            {
                              title: "Actions",
                              key: "actions",
                              width: 160,
                              render: (_, rec) => (
                                <Space>
                                  <Button icon={<EditOutlined />} onClick={() => openEditLevel(rec)}>Éditer</Button>
                                  <Button danger icon={<DeleteOutlined />} onClick={() => confirmDeleteLevel(rec.id)}>Supprimer</Button>
                                </Space>
                              )
                            }
                          ]}
                        />

                        <Modal
                          title={editingLevel ? "Modifier le niveau" : "Nouveau niveau"}
                          open={levelModalOpen}
                          onCancel={() => setLevelModalOpen(false)}
                          onOk={submitLevel}
                          okText={editingLevel ? "Enregistrer" : "Créer"}
                          confirmLoading={isSubmitting}
                          destroyOnClose
                        >
                          <Form layout="vertical" form={levelForm}>
                            <Form.Item name="nom" label="Nom" rules={[{ required: true, message: "Nom requis" }]}>
                              <Input placeholder="Ex: Chef de service, Maire..." />
                            </Form.Item>
                            <Form.Item name="roleRequis" label="Rôle requis" rules={[{ required: true, message: "Rôle requis" }]}>
                              <Select
                                placeholder="Choisir un rôle"
                                options={[
                                  { value: "ROLE_AGENT", label: "Agent" },
                                  { value: "ROLE_DEMANDEUR", label: "Demandeur" },
                                  { value: "ROLE_ADMIN", label: "Admin" },
                                  { value: "ROLE_SUPER_ADMIN", label: "Super Admin" },
                                  { value: "ROLE_MAIRE", label: "Maire" },
                                  { value: "ROLE_CHEF_SERVICE", label: "Chef de service" },
                                  { value: "ROLE_PRESIDENT_COMMISSION", label: "Président commission" },
                                  { value: "ROLE_PERCEPTEUR", label: "Percepteur" },
                                ]}
                              />
                            </Form.Item>
                            <Form.Item name="ordre" label="Ordre" rules={[{ required: true, message: "Ordre requis" }]}>
                              <Input type="number" min={1} />
                            </Form.Item>
                          </Form>
                        </Modal>
                      </TabPane>
                    )}

                    {canSeeValidation && (
                      <TabPane tab="Historique des validations" key="history">
                        <HistoriqueValidationsTab />
                      </TabPane>
                    )}

                  </Tabs>
                </Card>
              </Content>
            </div>
          </div>
        </div>
      </section >
    </>
  )
}

function LoadingSkeleton() {
  return (
    <div style={{ padding: 24 }}>
      <Spin tip="Chargement..." size="large">
        <div style={{ padding: 50, background: "#f0f2f5", borderRadius: 4 }}>
          <Alert
            message="Chargement des données"
            description="Veuillez patienter pendant le chargement des données..."
            type="info"
          />
        </div>
      </Spin>
    </div>
  )
}

function ErrorDisplay({ error }) {
  return (
    <div style={{ padding: 24 }}>
      <Alert message="Erreur" description={error} type="error" showIcon />
    </div>
  )
}

function HistoriqueValidationsTab() {
  const [form] = Form.useForm()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState({ demandeId: null, validateurId: null, action: null, from: null, to: null })

  const fetchData = async (keepPage = true) => {
    try {
      setLoading(true)
      const params = {
        page: keepPage ? page : 1,
        pageSize,
        ...filters,
        from: filters.from || undefined,
        to: filters.to || undefined,
      }
      const data = await getHistoriques(params)
      const ok = data?.success ?? true
      const items = Array.isArray(data) ? data : (data.items || [])
      const t = typeof data?.total === "number" ? data.total : items.length
      if (!ok) throw new Error()
      setRows(items)
      setTotal(t)
      if (!keepPage) setPage(1)
    } catch {
      // noop
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData(true) }, [page, pageSize])
  useEffect(() => { fetchData(true) }, [])

  const columns = [
    { title: "Date", dataIndex: "dateAction", width: 170 },
    { title: "Action", dataIndex: "action", width: 110, render: (s) => <Tag color={s === "validé" ? "green" : "red"}>{s}</Tag> },
    { title: "Demande", dataIndex: ["demande", "id"], width: 110 },
    { title: "Validateur", dataIndex: ["validateur", "fullName"] },
    { title: "Email", dataIndex: ["validateur", "email"] },
    { title: "Motif", dataIndex: "motif", ellipsis: true },
  ]

  return (
    <>
      <Form form={form} layout="inline" onFinish={() => fetchData(false)} className="flex flex-wrap gap-3 mb-4">
        <Form.Item label="Demande ID">
          <Input placeholder="ex: 123" onChange={(e) => setFilters(s => ({ ...s, demandeId: e.target.value || null }))} />
        </Form.Item>
        <Form.Item label="Validateur ID">
          <Input placeholder="ex: 5" onChange={(e) => setFilters(s => ({ ...s, validateurId: e.target.value || null }))} />
        </Form.Item>
        <Form.Item label="Action">
          <Select allowClear style={{ minWidth: 140 }}
            onChange={(v) => setFilters(s => ({ ...s, action: v || null }))}
            options={[{ value: "validé", label: "validé" }, { value: "rejeté", label: "rejeté" }]}
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
        scroll={{ x: 'max-content' }}
        pagination={{
          current: page, pageSize, total, showSizeChanger: true,
          showTotal: (t) => `Total ${t} enregistrement(s)`,
          onChange: (p, ps) => { setPage(p); setPageSize(ps) }
        }}
      />
    </>
  )
}

export default AdminConfiguration
