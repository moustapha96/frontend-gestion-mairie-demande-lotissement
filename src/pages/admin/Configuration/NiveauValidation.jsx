"use client"

import { useEffect, useState, useMemo } from "react"
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  Space,
  Grid,
  Popconfirm,
  Empty,
  message,
} from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { useAuthContext } from "@/context"
import { AdminBreadcrumb } from "@/components"
import { getLevels, createLevel, updateLevel, deleteLevel } from "@/services/validationService"

const { Title, Text } = Typography
const { useBreakpoint } = Grid

export default function NiveauxValidation() {
  const screens = useBreakpoint()
  const { user } = useAuthContext()

  const canSee = Array.isArray(user?.roles) && (
    user.roles.includes("ROLE_ADMIN") || user.roles.includes("ROLE_SUPER_ADMIN") || user.roles.includes("ROLE_MAIRE")
  )

  const [levels, setLevels] = useState([])
  const [loading, setLoading] = useState(false)

  // Modal état
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const fetchLevels = async () => {
    setLoading(true)
    try {
      const data = await getLevels()
      console.log(data)
      setLevels(Array.isArray(data) ? data : (data.items || []))
    } catch (e) {
      message.error("Erreur lors du chargement des niveaux")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (canSee) fetchLevels() }, [canSee])

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setOpen(true)
  }

  const openEdit = (rec) => {
    setEditing(rec)
    form.setFieldsValue({
      nom: rec.nom,
      roleRequis: rec.roleRequis,
      ordre: rec.ordre,
    })
    setOpen(true)
  }

  const submit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)
      if (editing) {
        await updateLevel(editing.id, values)
        message.success("Niveau mis à jour")
      } else {
        await createLevel(values)
        message.success("Niveau créé")
      }
      setOpen(false)
      setEditing(null)
      fetchLevels()
    } catch (e) {
      if (!e?.errorFields) message.error("Échec de l'enregistrement")
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDelete = async (id) => {
    try {
      await deleteLevel(id)
      message.success("Niveau supprimé")
      fetchLevels()
    } catch {
      message.error("Suppression impossible (niveau utilisé ?)")
    }
  }

  const columns = useMemo(() => ([
    { title: "Ordre", dataIndex: "ordre", width: 90, sorter: (a, b) => a.ordre - b.ordre, responsive: ["xs","sm","md","lg","xl"] },
    { title: "Nom", dataIndex: "nom", ellipsis: true, responsive: ["xs","sm","md","lg","xl"] },
    { title: "Rôle requis", dataIndex: "roleRequis", width: 220, responsive: ["sm","md","lg","xl"] },
    {
      title: screens.md ? "Actions" : "",
      key: "actions",
      width: screens.md ? 170 : 120,
      fixed: screens.lg ? "right" : undefined,
      render: (_, rec) => (
        <Space>
          <Button
            size={screens.md ? "middle" : "small"}
            icon={<EditOutlined />}
            onClick={() => openEdit(rec)}
          >
            {screens.md ? "Éditer" : null}
          </Button>
          <Popconfirm
            title="Supprimer ce niveau ?"
            okText="Oui"
            cancelText="Non"
            onConfirm={() => confirmDelete(rec.id)}
          >
            <Button
              danger
              size={screens.md ? "middle" : "small"}
              icon={<DeleteOutlined />}
            >
              {screens.md ? "Supprimer" : null}
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]), [screens.md, screens.lg])

  if (!canSee) {
    return (
      <>
        <AdminBreadcrumb title="Niveaux de validation" />
        <Card>
          <Title level={4}>Accès refusé</Title>
          <Text>Vous n’avez pas les permissions nécessaires pour consulter cette page.</Text>
        </Card>
      </>
    )
  }

  return (
    <>
      <AdminBreadcrumb title="Niveaux de validation" />
      <section className="container">
        <div className="my-6 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
              <Title level={4} className="!mb-0">Workflow de validation</Title>
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                Nouveau niveau
              </Button>
            </div>

            <Table
              rowKey="id"
              loading={loading}
              dataSource={levels}
              columns={columns}
              size={screens.md ? "middle" : "small"}
              locale={{ emptyText: <Empty description="Aucun niveau" /> }}
              pagination={{ pageSize: screens.md ? 10 : 6, responsive: true }}
              scroll={{ x: screens.md ? undefined : 700 }}
            />
          </Card>
        </div>
      </section>

      <Modal
        title={editing ? "Modifier le niveau" : "Nouveau niveau"}
        open={open}
        onCancel={() => { setOpen(false); setEditing(null) }}
        onOk={submit}
        okText={editing ? "Enregistrer" : "Créer"}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
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
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.Item name="ordre" label="Ordre" rules={[{ required: true, message: "Ordre requis" }]}>
            <Input type="number" min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
