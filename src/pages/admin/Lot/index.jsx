
import React, { useState, useEffect } from "react";
import { Table, Input, Card, Space, Button, Typography, Select, Modal, Form, InputNumber, message, Row, Col, Popconfirm } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, FilterOutlined, DeleteOutlined } from "@ant-design/icons";
import { AdminBreadcrumb } from "@/components";
import { getLotissements } from "@/services/lotissementService";
import { createLot, deleteLot, getLots, updateLot, updateLotStatut } from "@/services/lotsService";
import { formatCoordinates, formatPrice } from "@/utils/formatters";
import { useAuthContext } from "@/context";

const { Title } = Typography;
const { Option } = Select;

const AdminLot = () => {
  const { user } = useAuthContext()
  const [lots, setLots] = useState([]);
  const [lotissements, setLotissements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLot, setEditingLot] = useState(null);
  const [form] = Form.useForm();

  // États pour les filtres
  const [filters, setFilters] = useState({
    statut: null,
    usage: null,
    lotissementId: null,
    lotissementName: null,
    superficieMin: null,
    superficieMax: null,
    prixMin: null,
    prixMax: null,
  });

  useEffect(() => {
   
    fetchData();
  }, []);
  
  const fetchData = async () => {
      try {
        const [lotissementsData, lotsData] = await Promise.all([
          getLotissements(),
          getLots(),
        ]);
        console.log("lotissementsData", lotsData)
        setLotissements(lotissementsData);
        setLots(lotsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  const handleDelete = async (lotId) => {
    try {
      await deleteLot(lotId);
      message.success("Lot supprimé avec succès");
      fetchData();
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data || "Erreur lors de la suppression du lot");
    }
  }
  const showModal = (lot = null) => {
    setEditingLot(lot);
    if (lot) {
      form.setFieldsValue({
        ...lot,
        lotissementId: lot.lotissement.id,
      });
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
    console.log("values", values)
    const body = {
      usage: values.usage || null,
      prix: values.prix || null,
      numeroLot: values.numeroLot,
      superficie: parseFloat(values.superficie) || null,
      statut: values.statut,
      longitude: parseFloat(values.longitude) || null,
      latitude: parseFloat(values.latitude) || null,
      lotissementId: values.lotissementId,
    }
    setLoading(true);
    try {
      if (editingLot) {
        await updateLot(editingLot.id, body);
        message.success("Lot mis à jour avec succès");
      } else {
        await createLot(body);
        message.success("Lot ajouté avec succès");
      }
      setIsModalVisible(false);
      const updatedLots = await getLots();
      setLots(updatedLots);
    } catch (error) {
      message.error("Erreur lors de l'ajout ou de la modification du lot");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatut = async (lotId, nouveauStatut) => {
    Modal.confirm({
      title: "Confirmation",
      okButtonProps: { style: { backgroundColor: "#28a745", borderColor: "#28a745" } },
      content: "Voulez-vous vraiment changer le statut ?",
      onOk: async () => {
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
      },
    });
  };

  const handleFilterChange = (key, value) => {
    console.log(key, value);
    setFilters({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    setFilters({
      statut: null,
      usage: null,
      lotissementId: null,
      superficieMin: null,
      superficieMax: null,
      prixMin: null,
      prixMax: null,
    });
  };

  const columns = [
    {
      title: "Numéro",
      dataIndex: "numeroLot",
      key: "numeroLot",
      sorter: (a, b) => a.numeroLot.localeCompare(b.numeroLot),
    },
    {
      title: "Lotissement",
      key: "lotissement",
      render: (_, record) => record.lotissement?.nom || "N/A",
      filters: lotissements.map(lotissement => ({
        text: lotissement.nom,
        value: lotissement.id,
      })),
      onFilter: (value, record) => record.lotissement?.id === value,
    },
    {
      title: "Superficie",
      dataIndex: "superficie",
      key: "superficie",
      sorter: (a, b) => a.superficie - b.superficie,
      render: (superficie) => `${superficie ? superficie : "N/A"} m²`,
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
          <Option value="DISPONIBLE">Disponible</Option>
          <Option value="RESERVE">Réservé</Option>
          <Option value="OCCUPE">Occupé</Option>
        </Select>
      ),
      filters: [
        { text: "Disponible", value: "DISPONIBLE" },
        { text: "Réservé", value: "RESERVE" },
        { text: "Occupé", value: "OCCUPE" },
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
      dataIndex: "typeUsage",
      key: "usage",
      filters: [
        { text: "Habitation", value: "habitation" },
        { text: "Commerce", value: "commerce" },
        { text: "Mixte", value: "mixte" },
      ],
      onFilter: (value, record) => record.typeUsage === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            className="text-primary"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Modifier
          </Button>
          {user && (user.roles.includes("ROLE_ADMIN") || user.roles.includes("ROLE_SUPER_ADMIN") ||
            user.roles.includes("ROLE_MAIRE")
          ) && (

              <Popconfirm
                title="Êtes-vous sûr de vouloir supprimer ?"
                onConfirm={() => handleDelete(record.id)}
                okText="Oui"
                cancelText="Non"
              >
                <Button type="link" danger icon={<DeleteOutlined />} title="Supprimer" />
              </Popconfirm>
            )}
        </Space>
      ),
    },
  ];

  const filteredLots = lots.filter((lot) => {
    const matchesSearchText =
      lot.numeroLot.toLowerCase().includes(searchText.toLowerCase()) ||
      (lot.lotissement?.nom.toLowerCase().includes(searchText.toLowerCase())) ||
      lot.statut.toLowerCase().includes(searchText.toLowerCase()) ||
      lot.typeUsage?.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatut = !filters.statut || lot.statut === filters.statut;
    const matchesUsage = !filters.usage || lot.typeUsage === filters.usage;

    const matchesLotissement =
      !filters.lotissementId || lot.lotissement?.id === Number(filters.lotissementId);


    const matchesSuperficie =
      (!filters.superficieMin || lot.superficie >= parseFloat(filters.superficieMin)) &&
      (!filters.superficieMax || lot.superficie <= parseFloat(filters.superficieMax));
    const matchesPrix =
      (!filters.prixMin || lot.prix >= parseFloat(filters.prixMin)) &&
      (!filters.prixMax || lot.prix <= parseFloat(filters.prixMax));

    return (
      matchesSearchText &&
      matchesStatut &&
      matchesUsage &&
      matchesLotissement &&
      matchesSuperficie &&
      matchesPrix
    );
  });


  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Erreur: {error}
      </div>
    );
  }

  return (
    <>
      <AdminBreadcrumb title="Liste des iLots" />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <div className="grid grid-cols-1">
              <Card className="shadow-lg rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <Title level={4}>Liste des iLots</Title>
                  <Button
                    className="text-primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                  >
                    Ajouter un iLot
                  </Button>
                </div>

                {/* Section des filtres */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <Row gutter={16}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Select
                        placeholder="Filtrer par statut"
                        allowClear
                        style={{ width: "100%" }}
                        value={filters.statut}
                        onChange={(value) => handleFilterChange("statut", value)}
                      >
                        <Option value="DISPONIBLE">Disponible</Option>
                        <Option value="RESERVE">Réservé</Option>
                        <Option value="OCCUPE">Occupé</Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Select
                        placeholder="Filtrer par usage"
                        allowClear
                        style={{ width: "100%" }}
                        value={filters.usage}
                        onChange={(value) => handleFilterChange("usage", value)}
                      >
                        <Option value="habitation">Habitation</Option>
                        <Option value="commerce">Commerce</Option>
                        <Option value="mixte">Mixte</Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Select
                        placeholder="Filtrer par lotissement"
                        allowClear
                        style={{ width: "100%" }}
                        value={filters.lotissementId}
                        onChange={(value) => handleFilterChange("lotissementId", value)}
                      >
                        {lotissements.map((lotissement) => (
                          <Option key={lotissement.id} value={lotissement.id}>
                            {lotissement.nom}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Button
                        icon={<FilterOutlined />}
                        onClick={resetFilters}
                        style={{ width: "100%" }}
                      >
                        Réinitialiser
                      </Button>
                    </Col>
                  </Row>
                  <Row gutter={16} className="mt-4">
                    {/* <Col xs={24} sm={12} md={6} lg={6}>
                      <Input
                        placeholder="Superficie min (m²)"
                        type="number"
                        value={filters.superficieMin}
                        onChange={(e) => handleFilterChange("superficieMin", e.target.value)}
                        style={{ width: "100%" }}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={6} lg={6}>
                      <Input
                        placeholder="Superficie max (m²)"
                        type="number"
                        value={filters.superficieMax}
                        onChange={(e) => handleFilterChange("superficieMax", e.target.value)}
                        style={{ width: "100%" }}
                      />
                    </Col> */}
                    {/* <Col xs={24} sm={12} md={6} lg={6}>
                      <Input
                        placeholder="Prix min (FCFA)"
                        type="number"
                        value={filters.prixMin}
                        onChange={(e) => handleFilterChange("prixMin", e.target.value)}
                        style={{ width: "100%" }}
                      />
                    </Col> */}
                    {/* <Col xs={24} sm={12} md={6} lg={6}>
                      <Input
                        placeholder="Prix max (FCFA)"
                        type="number"
                        value={filters.prixMax}
                        onChange={(e) => handleFilterChange("prixMax", e.target.value)}
                        style={{ width: "100%" }}
                      />
                    </Col> */}
                  </Row>
                </div>

                <div className="flex justify-end mb-4">
                  <Input
                    placeholder="Rechercher par numéro, lotissement, statut ou usage..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                  />
                </div>

                <Table
                  columns={columns}
                  dataSource={filteredLots}
                  scroll={{ x: 'max-content' }}
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
        title={editingLot ? "Modifier le lot" : "Ajouter un iLot"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="lotissementId"
            label="Lotissement"
            rules={[{ required: true, message: "Le lotissement est requis" }]}
          >
            <Select placeholder="Sélectionnez un lotissement">
              {lotissements.map((lotissement) => (
                <Option key={lotissement.id} value={lotissement.id}>
                  {lotissement.nom}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="numeroLot"
            label="Numéro du iLot"
            rules={[{ required: true, message: "Le Numéro du iLot est requis" }]}
          >
            <Input placeholder="Entrez le Numéro du iLot" />
          </Form.Item>
          <Form.Item
            name="superficie"
            label="Superficie (m²)"
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
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Entrez le prix"
            />
          </Form.Item>
          <Form.Item
            name="typeUsage"
            label="Usage"
          >
            <Select placeholder="Sélectionnez l'usage">
              <Option value="habitation">Habitation</Option>
              <Option value="commerce">Commerce</Option>
              <Option value="mixte">Mixte</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="latitude"
            label="Latitude"
          >
            <Input placeholder="Entrez la latitude" />
          </Form.Item>
          <Form.Item
            name="longitude"
            label="Longitude"
          >
            <Input placeholder="Entrez la longitude" />
          </Form.Item>

          <Form.Item
            name="statut"
            label="Statut"
            rules={[{ required: true, message: "Le statut est requis" }]}
          >
            <Select placeholder="Sélectionnez le statut">
              <Option value="DISPONIBLE">Disponible</Option>
              <Option value="RESERVE">Réservé</Option>
              <Option value="OCCUPE">Occupé</Option>
            </Select>
          </Form.Item>

          <Form.Item className="text-right">
            <Space>
              <Button onClick={handleCancel}>Annuler</Button>
              <Button className="text-primary" htmlType="submit" loading={loading}>
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
