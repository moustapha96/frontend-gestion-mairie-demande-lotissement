import React, { useState, useEffect } from "react";
import { AdminBreadcrumb } from "@/components";
import { Card, Button, Table, Modal, Form, Input, message, Popconfirm, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { documentModelService } from "@/services/documentModelService";
import { useAuthContext } from "@/context/useAuthContext";

const AdminDocumentModel = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const { user } = useAuthContext();

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await documentModelService.getAllModels();
      if (response.success) {
        setModels(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Erreur lors du chargement des modèles de documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setModalVisible(true);
  };

  const handleEdit = async (record) => {
    try {
      const response = await documentModelService.getModelById(record.id);
      if (response.success) {
        form.setFieldsValue(response.data);
        setEditingId(record.id);
        setModalVisible(true);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Erreur lors du chargement du modèle");
    }
  };

  const handleDelete = async (id) => {
    try {
      // Vérifier si le modèle est utilisé
      const usageResponse = await documentModelService.checkModelUsage(id);
      if (usageResponse.success && usageResponse.data.isUsed) {
        Modal.confirm({
          title: "Attention",
          icon: <ExclamationCircleOutlined />,
          content: "Ce modèle est utilisé par des documents existants. La suppression pourrait affecter ces documents. Voulez-vous continuer ?",
          okText: "Oui",
          cancelText: "Non",
          onOk: async () => {
            await performDelete(id);
          },
        });
      } else {
        await performDelete(id);
      }
    } catch (error) {
      message.error("Erreur lors de la vérification de l'utilisation du modèle");
    }
  };

  const performDelete = async (id) => {
    const response = await documentModelService.deleteModel(id);
    if (response.success) {
      message.success(response.message);
      fetchModels();
    } else {
      message.error(response.message);
    }
  };

  const handleSubmit = async (values) => {
    try {
      let response;
      if (editingId) {
        response = await documentModelService.updateModel(editingId, values);
      } else {
        response = await documentModelService.createModel(values);
      }

      if (response.success) {
        message.success(response.message);
        setModalVisible(false);
        fetchModels();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Erreur lors de l'enregistrement");
    }
  };

  const columns = [
    {
      title: "Nom",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Format",
      dataIndex: "format",
      key: "format",
      filters: [
        { text: "PDF", value: "pdf" },
        { text: "Word", value: "docx" },
        { text: "Excel", value: "xlsx" },
      ],
      onFilter: (value, record) => record.format.toLowerCase() === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Modifier"
          />
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce modèle ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button type="link" danger icon={<DeleteOutlined />} title="Supprimer" />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <AdminBreadcrumb
        title="Gestion des Modèles de Documents"
      />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <div className="grid grid-cols-1">
              <Card
                title="Gestion des Modèles de Documents"
                extra={
                  <Button
                    className="text-base font-medium text-primary transition-all duration-200 hover:text-primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                  >
                    Nouveau Modèle
                  </Button>
                }
              >
                <Table
                  columns={columns}
                  dataSource={models}
                  loading={loading}
                  rowKey="id"
                  pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} modèles`,
                  }}
                />
              </Card>

              <Modal
                title={editingId ? "Modifier le modèle" : "Nouveau modèle"}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                destroyOnClose
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  initialValues={{ format: "pdf" }}
                >
                  <Form.Item
                    name="name"
                    label="Nom"
                    rules={[{ required: true, message: "Le nom est requis" }]}
                  >
                    <Input placeholder="Nom du modèle" />
                  </Form.Item>
                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: "La description est requise" }]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Description détaillée du modèle"
                    />
                  </Form.Item>
                  <Form.Item
                    name="format"
                    label="Format"
                    rules={[{ required: true, message: "Le format est requis" }]}
                  >
                    <Select>
                      <Select.Option value="pdf">PDF</Select.Option>
                      <Select.Option value="docx">Word (DOCX)</Select.Option>
                      <Select.Option value="xlsx">Excel (XLSX)</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item className="text-right">
                    <Button type="default" onClick={() => setModalVisible(false)} className="mr-2">
                      Annuler
                    </Button>
                    <Button className="text-base font-medium text-primary transition-all duration-200 hover:text-primary" htmlType="submit">
                      {editingId ? "Mettre à jour" : "Créer"}
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </div>
        </div>
      </section>



    </div>
  );
};

export default AdminDocumentModel;
