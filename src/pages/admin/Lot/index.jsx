import React, { useState, useEffect } from "react";
import { Table, Input, Card, Space, Button, Typography, Select, Modal, Form, InputNumber, message } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { AdminBreadcrumb } from "@/components";
import { getLotissements, getLotissementLot } from "@/services/lotissementService";
import { createLot, updateLot, updateLotStatut } from "@/services/lotsService";
import { formatCoordinates, formatPrice } from "@/utils/formatters";

const { Title } = Typography;
const { Option } = Select;

const AdminLot = () => {
  const [lots, setLots] = useState([]);
  const [lotissements, setLotissements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedLotissement, setSelectedLotissement] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLot, setEditingLot] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lotissementData = await getLotissements();
        setLotissements(lotissementData);
        if (lotissementData.length > 0) {
          setSelectedLotissement(lotissementData[0].id);
          const lotsData = await getLotissementLot(lotissementData[0].id);
          setLots(lotsData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLotissementChange = async (value) => {
    setSelectedLotissement(value);
    try {
      const data = await getLotissementLot(value);
      setLots(data);
    } catch (err) {
      message.error(err.message);
    }
  };

  const showModal = (lot = null) => {
    setEditingLot(lot);
    if (lot) {
      form.setFieldsValue(lot);
    } else {
      form.resetFields();
      form.setFieldValue('lotissementId', selectedLotissement);
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
        await createLot(values);
        message.success("Lot ajouté avec succès");
      }
      setIsModalVisible(false);
      const updatedLots = await getLotissementLot(selectedLotissement);
      setLots(updatedLots);
    } catch (error) {
      message.error("Erreur lors de l'ajout ou de la modification du lot");
    }
  };

  const handleUpdateStatut = async (lotId, nouveauStatut) => {
    try {
      await updateLotStatut(lotId, nouveauStatut);
      const updatedLots = lots.map(lot => {
        if (lot.id === lotId) {
          return { ...lot, statut: nouveauStatut };
        }
        return lot;
      });
      setLots(updatedLots);
      message.success("Statut du lot mis à jour avec succès");
    } catch (error) {
      message.error("Erreur lors de la mise à jour du statut");
    }
  };

  const columns = [
    {
      title: "Numéro",
      dataIndex: "numeroLot",
      key: "numeroLot",
      sorter: (a, b) => a.numeroLot.localeCompare(b.numeroLot),
    },
    {
      title: "Superficie",
      dataIndex: "superficie",
      key: "superficie",
      sorter: (a, b) => a.superficie - b.superficie,
      render: (superficie) => `${superficie} m²`,
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
      render: (statut, record) => (
        <Select
          value={statut}
          onChange={(value) => handleUpdateStatut(record.id, value)}
          style={{ width: 120 }}
        >
          <Option value="disponible">Disponible</Option>
          <Option value="reserve">Réservé</Option>
          <Option value="occupe">Occupé</Option>
        </Select>
      ),
      filters: [
        { text: "Disponible", value: "disponible" },
        { text: "Réservé", value: "reserve" },
        { text: "Occupé", value: "occupe" },
      ],
      onFilter: (value, record) => record.statut === value,
    },
    {
      title: "Prix",
      dataIndex: "prix",
      key: "prix",
      sorter: (a, b) => a.prix - b.prix,
      render: (prix) => formatPrice(prix),
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
                  <Title level={4}>Liste des Lots</Title>
                  <Button
                    className="text-primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                  >
                    Ajouter un Lot
                  </Button>
                </div>

                <div className="flex justify-between mb-4">
                  <Select
                    style={{ width: 200 }}
                    value={selectedLotissement}
                    onChange={handleLotissementChange}
                  >
                    {lotissements.map((lotissement) => (
                      <Option key={lotissement.id} value={lotissement.id}>
                        {lotissement.nom}
                      </Option>
                    ))}
                  </Select>

                  <Input
                    placeholder="Rechercher par numéro..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                  />
                </div>

                <Table
                  columns={columns}
                  dataSource={lots.filter((lot) =>
                    lot.numeroLot.toLowerCase().includes(searchText.toLowerCase())
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
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ lotissementId: selectedLotissement }}
        >
          <Form.Item
            name="lotissementId"
            hidden
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="numeroLot"
            label="Numéro du lot"
            rules={[{ required: true, message: "Le numéro du lot est requis" }]}
          >
            <Input placeholder="Entrez le numéro du lot" />
          </Form.Item>

          <Form.Item
            name="superficie"
            label="Superficie (m²)"
            rules={[{ required: true, message: "La superficie est requise" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Entrez la superficie"
            />
          </Form.Item>

          <Form.Item
            name="prix"
            label="Prix"
            rules={[{ required: true, message: "Le prix est requis" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Entrez le prix"
            />
          </Form.Item>

          <Form.Item
            name="usage"
            label="Usage"
            rules={[{ required: true, message: "L'usage est requis" }]}
          >
            <Select placeholder="Sélectionnez l'usage">
              <Option value="habitation">Habitation</Option>
              <Option value="commerce">Commerce</Option>
              <Option value="mixte">Mixte</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="statut"
            label="Statut"
            rules={[{ required: true, message: "Le statut est requis" }]}
          >
            <Select placeholder="Sélectionnez le statut">
              <Option value="disponible">Disponible</Option>
              <Option value="reserve">Réservé</Option>
              <Option value="occupe">Occupé</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="latitude"
            label="Latitude"
            rules={[{ required: true, message: "La latitude est requise" }]}
          >
            <Input placeholder="Entrez la latitude" />
          </Form.Item>

          <Form.Item
            name="longitude"
            label="Longitude"
            rules={[{ required: true, message: "La longitude est requise" }]}
          >
            <Input placeholder="Entrez la longitude" />
          </Form.Item>

          <Form.Item className="text-right">
            <Space>
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

export default AdminLot;
