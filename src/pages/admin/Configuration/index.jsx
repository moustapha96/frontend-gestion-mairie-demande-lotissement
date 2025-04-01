
"use client"

import { useEffect, useState } from "react"
import { Layout, Card, Tabs, Form, Input, Button, Table, Tag, Select, DatePicker, Typography, Spin, Alert, Popover, Space } from "antd"
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
} from "@ant-design/icons"
import { AdminBreadcrumb } from "@/components"
import { toast } from "sonner"
import { getConfigurations, updateConfiguration } from "@/services/configurationService"
import { getAllAccounts, updateActivatedStatus, createAdminUser, updateUserRole } from "@/services/userService"
import { useAuthContext } from "@/context"
import { getDetaitHabitant } from "../../../services/userService"

const { Content } = Layout
const { TabPane } = Tabs
const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const AdminConfiguration = () => {
  const { user } = useAuthContext()
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

  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("config")
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    nom: "",
    prenom: "",
    dateNaissance: "",
    lieuNaissance: "",
    numeroElecteur: "",
    telephone: "",
    adresse: "",
    profession: "",
  })
  const [loadingUser, setLoadingUser] = useState(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)


  const [habitantData, setHabitantData] = useState({})
  const [loadingHabitant, setLoadingHabitant] = useState({})

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
  }, [activeTab])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await getAllAccounts()

      if (user.roles.includes("ROLE_ADMIN") || user.roles.includes("ROLE_SUPER_ADMIN")) {
        setUsers(data)
      } else {
        const filteredUsers = data.filter(
          (user) => !user.roles.includes("ROLE_ADMIN") && !user.roles.includes("ROLE_SUPER_ADMIN"),
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
      // Format date to string if it's a dayjs object
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

  const formatRoleDisplay = (role) => {
    const roleMap = {
      ROLE_DEMANDEUR: "Demandeur",
      ROLE_AGENT: "Agent",
      ROLE_ADMIN: "Administrateur",
      ROLE_SUPER_ADMIN: "Super Administrateur",
    }
    return roleMap[role] || role
  }

  const renderHabitantContent = (userId) => {
    const data = habitantData[userId]

    if (!data) {
      return <div>Chargement des informations...</div>
    }

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
    if (habitantData[userId]) return // Already fetched

    setLoadingHabitant((prev) => ({ ...prev, [userId]: true }))

    try {
      const habitantInfo = await getDetaitHabitant(userId)
      console.log("habitante", habitantInfo)
      setHabitantData((prev) => ({ ...prev, [userId]: habitantInfo }))
    } catch (error) {
      console.error("Erreur lors de la récupération des informations du habitant:", error)
    } finally {
      setLoadingHabitant((prev) => ({ ...prev, [userId]: false }))
    }
  }
  // Table columns
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
      // render: (text, record) => record.isHabitant ? "Oui" : "Non",
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
              onVisibleChange={(visible) => {
                if (visible) {
                  fetchHabitantInfo(record.id)
                }
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
      sorter: (a, b) => {
        if (a.activated === b.activated) return 0
        return a.activated ? 1 : -1
      },
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

                    <TabPane tab="Configuration" key="config"  >

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
                              { type: "email", message: "Veuillez saisir un email valide" },
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
                              <DatePicker
                                style={{ width: "100%" }}
                                format="DD/MM/YYYY"
                                placeholder="Sélectionner une date"
                              />
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
                                {
                                  max: 13,
                                  min: 13,
                                  message: "Le Numéro d'Identification National doit contenir 13 chiffres",
                                  pattern: /^[0-9]{13}$/,
                                },

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
                                  message:
                                    "Le numéro de téléphone doit être composé de 9 chiffres et commencer par 70, 76, 77, 78 ou 79",
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
                            <Button
                              className="text-primary"
                              htmlType="submit"
                              loading={isSubmitting}
                              icon={<SaveOutlined />}
                              size="large"
                            >
                              Créer l'administrateur
                            </Button>
                          </Form.Item>
                        </Form>
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

export default AdminConfiguration

