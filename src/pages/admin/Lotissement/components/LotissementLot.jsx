import React, { useState, useEffect } from "react";
import { Table, Input, Card, Space, Button, Typography, Select, Modal, Form, InputNumber, message } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { AdminBreadcrumb } from "@/components";
import { getLotissementDetails, getLotissementLot } from "@/services/lotissementService";
import { createLot, updateLot } from "@/services/lotsService";
import { formatCoordinates, formatPrice } from "@/utils/formatters";

const { Title } = Typography;
const { Option } = Select;

const AdminLotissementLot = () => {
  const { id } = useParams();
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLot, setEditingLot] = useState(null);
  const [lotissement, setLotissement] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lotsData, lotissementData] = await Promise.all([
          getLotissementLot(id),
          getLotissementDetails(id)
        ]);
        setLots(lotsData);
        setLotissement(lotissementData);
      } catch (err) {
        setError(err.message);
        message.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const showModal = (lot = null) => {
    setEditingLot(lot);
    if (lot) {
      form.setFieldsValue(lot);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingLot(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (editingLot) {
        await updateLot(editingLot.id, values);
        message.success("Lot mis à jour avec succès");
      } else {
        await createLot({ ...values, lotissementId: id });
        message.success("Lot ajouté avec succès");
      }
      setIsModalVisible(false);
      const updatedLots = await getLotissementLot(id);
      setLots(updatedLots);
    } catch (error) {
      message.error("Erreur lors de l'ajout ou de la modification du lot");
    }
  };

  const columns = [
    {
      title: "Numéro Lot",
      dataIndex: "numeroLot",
      key: "numeroLot",
      sorter: (a, b) => a.numeroLot.localeCompare(b.numeroLot),
    },
    {
      title: "Superficie",
      dataIndex: "superficie",
      key: "superficie",
      render: (superficie) => `${superficie} m²`,
      sorter: (a, b) => a.superficie - b.superficie,
    },
    {
      title: "Coordonnées",
      key: "coordonnees",
      render: (_, record) => formatCoordinates(record.latitude, record.longitude),
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      filters: [
        { text: "Disponible", value: "DISPONIBLE" },
        { text: "Occupé", value: "OCCUPE" },
        { text: "Réservé", value: "RESERVE" },
      ],
      onFilter: (value, record) => record.statut === value,
    },
    {
      title: "Prix",
      dataIndex: "prix",
      key: "prix",
      render: (prix) => formatPrice(prix),
      sorter: (a, b) => a.prix - b.prix,
    },
    {
      title: "Usage",
      dataIndex: "usage",
      key: "usage",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          className="text-primary"
          icon={<EditOutlined />}
          onClick={() => showModal(record)}
        >
          Modifier
        </Button>
      ),
    },
  ];

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Erreur: {error}
      </div>
    );
  }

  return (
    <>
      <AdminBreadcrumb title="Liste des Lots" />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <div className="grid grid-cols-1">
              <Card className="shadow-lg rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <Space direction="vertical" size="small">
                    <Title level={4}>Liste des Lots</Title>
                    {lotissement && (
                      <Link to={`/admin/lotissements/${id}/details`}>
                        Lotissement: <span className="text-primary">{lotissement.nom}</span>
                      </Link>
                    )}
                  </Space>
                  <Button
                    className="text-primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                  >
                    Ajouter un Lot
                  </Button>
                </div>

                <Input
                  placeholder="Rechercher par numéro ou usage..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300, marginBottom: 16 }}
                />

                <Table
                  columns={columns}
                  dataSource={lots.filter(
                    (lot) =>
                      lot.numeroLot.toLowerCase().includes(searchText.toLowerCase()) ||
                      lot.usage.toLowerCase().includes(searchText.toLowerCase())
                  )}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} lots`,
                  }}
                />
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Modal
        title={editingLot ? "Modifier le lot" : "Ajouter un lot"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="numeroLot"
            label="Numéro du lot"
            rules={[{ required: true, message: "Le numéro du lot est requis" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="superficie"
            label="Superficie (m²)"
            rules={[{ required: true, message: "La superficie est requise" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            name="prix"
            label="Prix"
            rules={[{ required: true, message: "Le prix est requis" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="usage"
            label="Usage"
            rules={[{ required: true, message: "L'usage est requis" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="statut"
            label="Statut"
            rules={[{ required: true, message: "Le statut est requis" }]}
          >
            <Select>
              <Option value="DISPONIBLE">Disponible</Option>
              <Option value="OCCUPE">Occupé</Option>
              <Option value="RESERVE">Réservé</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="latitude"
            label="Latitude"
            rules={[{ required: true, message: "La latitude est requise" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="longitude"
            label="Longitude"
            rules={[{ required: true, message: "La longitude est requise" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={handleCancel}>Annuler</Button>
              <Button className="text-primary" htmlType="submit">
                {editingLot ? "Modifier" : "Ajouter"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminLotissementLot;
