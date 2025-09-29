
"use client"

import { useEffect, useState } from "react"
import {
  Layout, Card, Tabs, Form, Input, Button, Table, Tag, Select, DatePicker, Typography,
  Spin, Alert, Popover, Space, Modal, InputNumber, Checkbox, Grid, Tooltip, Drawer
} from "antd"
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
  InfoCircleTwoTone,
} from "@ant-design/icons"
import { AdminBreadcrumb } from "@/components"
import { toast } from "sonner"
import { getConfigurations, updateConfiguration } from "@/services/configurationService"
import { getAllAccounts, updateActivatedStatus, createAdminUser, updateUserRole } from "@/services/userService"
import { useAuthContext } from "@/context"
import { getDetaitHabitant } from "../../../services/userService"
import { getLevels, createLevel, updateLevel, deleteLevel } from "@/services/validationService"

const { Content } = Layout
const { TabPane } = Tabs
const { Title } = Typography
const { TextArea } = Input
const { Option } = Select
const { useBreakpoint } = Grid

const SITUATION_OPTIONS = [
  { value: "Célibataire", label: "Célibataire" },
  { value: "Marié(e)", label: "Marié(e)" },
  { value: "Veuf(ve)", label: "Veuf(ve)" },
  { value: "Divorcé(e)", label: "Divorcé(e)" },
]

const AdminConfiguration = () => {
  const { user } = useAuthContext()
  const screens = useBreakpoint() // { xs, sm, md, lg, xl, xxl }

  // ACCÈS: niveaux + historique visibles pour ADMIN et SUPER_ADMIN
  const canSeeValidation = Array.isArray(user?.roles) && (
    user.roles.includes("ROLE_ADMIN") || user.roles.includes("ROLE_SUPER_ADMIN")
  )



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


  const [activeTab, setActiveTab] = useState("config")
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)




  const closeDetails = () => setDetailOpen(false)

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
      const rows = Array.isArray(data) ? data : (data.items || [])
      setLevels(rows)
    } catch (e) {
      toast.error("Erreur lors du chargement des niveaux")
    } finally {
      setLoadingLevels(false)
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
    if (activeTab === "levels" && canSeeValidation) {
      fetchLevels()
    }
  }, [activeTab, canSeeValidation])



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
        situationMatrimoniale: values.situationMatrimoniale || null,
        nombreEnfant: typeof values.nombreEnfant === "number" ? values.nombreEnfant : null,
        isHabitant: !!values.isHabitant,
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
                            <Form.Item name="nom" label="Nom" rules={[{ required: true, message: "Veuillez saisir le nom" }]}>
                              <Input prefix={<UserOutlined />} placeholder="Nom" />
                            </Form.Item>

                            <Form.Item name="prenom" label="Prénom" rules={[{ required: true, message: "Veuillez saisir le prénom" }]}>
                              <Input prefix={<UserOutlined />} placeholder="Prénom" />
                            </Form.Item>

                            <Form.Item
                              name="email"
                              label="Email"
                              rules={[{ required: true, message: "Veuillez saisir l'email" }, { type: "email", message: "Veuillez saisir un email valide" }]}
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

                            <Form.Item name="lieuNaissance" label="Lieu de Naissance" rules={[{ required: true, message: "Veuillez saisir le lieu de naissance" }]}>
                              <Input prefix={<EnvironmentOutlined />} placeholder="Lieu de naissance" />
                            </Form.Item>

                            <Form.Item
                              name="numeroElecteur"
                              label="Numéro d'Identification National"
                              rules={[
                                { required: true, message: "Veuillez saisir le Numéro d'Identification National" },
                                { pattern: /^[0-9A-Za-z]{13,15}$/, message: "Doit contenir 13 à 15 caractères alphanumériques" },
                              ]}
                            >
                              <Input prefix={<UserAddOutlined />} placeholder="Numéro d'Identification National" />
                            </Form.Item>

                            <Form.Item
                              name="telephone"
                              label="Téléphone"
                              rules={[
                                { required: true, message: "Veuillez saisir le numéro de téléphone" },
                                { pattern: /^(70|76|77|78|79)[0-9]{7}$/, message: "9 chiffres, commence par 70/76/77/78/79" },
                              ]}
                            >
                              <Input prefix={<PhoneOutlined />} placeholder="Téléphone" />
                            </Form.Item>

                            <Form.Item name="profession" label="Profession" rules={[{ required: true, message: "Veuillez saisir la profession" }]}>
                              <Input prefix={<BankOutlined />} placeholder="Profession" />
                            </Form.Item>

                            <Form.Item name="adresse" label="Adresse" rules={[{ required: true, message: "Veuillez saisir l'adresse" }]}>
                              <TextArea placeholder="Adresse" autoSize={{ minRows: 2, maxRows: 6 }} />
                            </Form.Item>

                            <Form.Item
                              name="situationMatrimoniale"
                              label="Situation matrimoniale"
                              rules={[{ required: true, message: "Veuillez sélectionner la situation matrimoniale" }]}
                            >
                              <Select placeholder="Sélectionner">
                                {SITUATION_OPTIONS.map(opt => (
                                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                                ))}
                              </Select>
                            </Form.Item>

                            <Form.Item
                              name="nombreEnfant"
                              label="Nombre d'enfants"
                              rules={[{ type: "number", min: 0, message: "Nombre d'enfants invalide" }]}
                            >
                              <InputNumber style={{ width: "100%" }} min={0} placeholder="0" />
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

                  

                  </Tabs>
                </Card>
              </Content>
            </div>
          </div>
        </div>
      </section>

    
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
