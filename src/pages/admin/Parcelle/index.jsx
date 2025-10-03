
import React, { useState, useEffect, useMemo } from "react";
import {
  Table, Card, Space, Button, Typography, Select, Input, Modal, Form, message, Result, Drawer, Grid,
  Popconfirm
} from "antd";
import {
  SearchOutlined, PlusOutlined, EditOutlined, EnvironmentOutlined, FilterOutlined, ReloadOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { AdminBreadcrumb } from "@/components";
import { getLotissements } from "@/services/lotissementService";
import { createParcelle, deleteParcelle, getParcelles, updateParcelle, updateParcellestatut } from "@/services/parcelleService";
import MapCar from "../../admin/Map/MapCar";
import { useAuthContext } from "@/context";

const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

const AdminParcelle = () => {
  const { user } = useAuthContext();
  const screens = useBreakpoint();
  const isMdUp = screens.md;

  const [form] = Form.useForm();
  const [lotissements, setLotissements] = useState([]);
  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(true);
  const [fileLoading, setFileLoading] = useState(false);
  const [error, setError] = useState(null);

  // UI état
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedParcelle, setSelectedParcelle] = useState(null);
  const [editingParcelle, setEditingParcelle] = useState(null);

  // Filtres + pagination/tri (serveur)
  const [searchText, setSearchText] = useState("");
  const [statut, setStatut] = useState();
  const [lotissementId, setLotissementId] = useState();

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sorter, setSorter] = useState({ field: "id", order: "descend" });
  const [meta, setMeta] = useState({ page: 1, size: 10, total: 0, pages: 0, sort: "id,DESC" });

  // mapping tri UI -> API
  const sortParam = useMemo(() => {
    const fieldMap = {
      id: "id",
      numero: "numero",
      surface: "surface",        // si ton API est "superface", remplace par "superface"
      statut: "statut",
      lotissement: "lotissement" // côté back : tri sur l.nom par ex.
    };
    const field = fieldMap[sorter.field] ?? "id";
    const dir = sorter.order === "ascend" ? "ASC" : "DESC";
    return `${field},${dir}`;
  }, [sorter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lots, parcellesRes] = await Promise.all([
        lotissements.length ? Promise.resolve(lotissements) : getLotissements(),
        getParcelles({
          page,
          size,
          sort: sortParam,
          search: searchText || undefined,
          statut: statut || undefined,
          lotissementId: lotissementId || undefined,
        }),
      ]);
      if (!lotissements.length) setLotissements(lots);
      setRows(parcellesRes.data || []);
      setMeta(parcellesRes.meta || { page, size, total: 0, pages: 0, sort: sortParam });
    } catch (err) {
      console.error(err);
      setError(err?.message || "Erreur lors du chargement des données");
      message.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [page, size, sortParam]);

  const refetchWithFilters = () => { setPage(1); fetchData(); };

  const resetAll = () => {
    setSearchText("");
    setStatut(undefined);
    setLotissementId(undefined);
    setPage(1);
    setSize(10);
    setSorter({ field: "id", order: "descend" });
    fetchData();
  };

  const handleDelete = async (parcelleId) => {

    try {
      await deleteParcelle(parcelleId);
      const resul = rows.filter(parcelle => parcelle.id !== parcelleId);
      setRows(resul);
      message.success("Parcelle supprimé avec succès");
    } catch (error) {
      console.log(error);
      message.error(error?.response?.data || "Erreur lors de la suppression du lotissement");
    }
  }

  const showMapModal = (parcelle = null) => {
    setSelectedParcelle(parcelle);
    setIsMapModalVisible(true);
  };

  const showModal = (parcelle = null) => {
    setEditingParcelle(parcelle);
    if (parcelle) {
      form.setFieldsValue({
        numero: parcelle.numero,
        // surface ou superface selon ton API :
        surface: parcelle.surface ?? parcelle.superface,
        longitude: parcelle.longitude,
        latitude: parcelle.latitude,
        lotissementId: parcelle?.lotissement?.id,
        statut: parcelle.statut,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        statut: "DISPONIBLE",
      });
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsMapModalVisible(false);
    setSelectedParcelle(null);
    setEditingParcelle(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const payload = {
      numero: values.numero,
      surface: parseFloat(values.surface) || 0,
      longitude: parseFloat(values.longitude),
      latitude: parseFloat(values.latitude),
      lotissementId: values.lotissementId,
      statut: values.statut,
    };
    console.log(payload)
    try {
      // Harmonisation : envoie "surface" (ou adapte si backend attend "superface")


      if (editingParcelle) {
        await updateParcelle(editingParcelle.id, payload);
        message.success("Parcelle mise à jour avec succès");
      } else {
        await createParcelle(payload);
        message.success("Parcelle créée avec succès");
      }
      handleCancel();
      refetchWithFilters();
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de l'opération");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatut = async (parcelleId, nouveauStatut) => {
    try {
      await updateParcellestatut(parcelleId, nouveauStatut);
      // MAJ locale
      setRows((prev) =>
        prev.map((p) => (p.id === parcelleId ? { ...p, statut: nouveauStatut } : p))
      );
      message.success("Statut mis à jour avec succès");
    } catch (error) {
      console.error(error);
      message.error("Erreur lors de la mise à jour du statut");
    }
  };

  const columns = [
    {
      title: "Numéro",
      dataIndex: "numero",
      key: "numero",
      sorter: true,
      ellipsis: true,
      responsive: ["md"],
    },
    {
      title: "Superficie",
      key: "surface",
      sorter: true,
      width: 140,
      render: (_, r) => {
        const v = r.surface ?? r.superface;
        return v != null ? `${v} m²` : "—";
      },
      responsive: ["md"],
    },
    {
      title: "Lotissement",
      key: "lotissement",
      sorter: true,
      ellipsis: true,
      render: (_, record) => <span>{record.lotissement?.nom || "—"}</span>,
    },
    {
      title: "Coordonnées",
      key: "coordinates",
      width: 120,
      render: (_, record) => (
        <Button
          type="text"
          icon={<EnvironmentOutlined />}
          onClick={() => showMapModal(record)}
        />
      ),
      responsive: ["md"],
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      sorter: true,
      width: 170,
      render: (s, record) => (
        <Select
          value={s}
          onChange={(value) => handleUpdateStatut(record.id, value)}
          style={{ width: 150 }}
          size="middle"
        >
          <Option value="DISPONIBLE">Disponible</Option>
          <Option value="OCCUPE">Occupé</Option>
          <Option value="EN_COURS">En cours</Option>
          <Option value="RESERVE">Réservé</Option>
        </Select>
      ),
      filters: [
        { text: "Disponible", value: "DISPONIBLE" },
        { text: "Occupé", value: "OCCUPE" },
        { text: "En cours", value: "EN_COURS" },
        { text: "Réservé", value: "RESERVE" }
      ],
      onFilter: (value, record) => record.statut === value, // filtre client en bonus
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      fixed: isMdUp ? "right" : undefined,
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
      )
    }
  ];

  if (error) {
    return (
      <>
        <AdminBreadcrumb title="Liste des Parcelles" />
        <Result status="error" title="Erreur" subTitle={error} />
      </>
    );
  }

  // Header Desktop
  const DesktopFilters = (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <Title level={4} className="m-0">Liste des Parcelles</Title>
      <Space wrap>
        <Input
          placeholder="Rechercher par numéro/lotissement/statut…"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={refetchWithFilters}
          style={{ width: 320, maxWidth: "100%" }}
          allowClear
        />
        <Select
          allowClear
          placeholder="Statut"
          value={statut}
          onChange={setStatut}
          style={{ width: 180 }}
        >
          <Option value="DISPONIBLE">Disponible</Option>
          <Option value="OCCUPE">Occupé</Option>
          <Option value="EN_COURS">En cours</Option>
          <Option value="RESERVE">Réservé</Option>
        </Select>
        <Select
          allowClear
          placeholder="Lotissement"
          value={lotissementId}
          onChange={setLotissementId}
          style={{ width: 240 }}
          showSearch
          optionFilterProp="children"
        >
          {lotissements.map((l) => (
            <Option key={l.id} value={l.id}>{l.nom}</Option>
          ))}
        </Select>
        <Button type="primary" onClick={refetchWithFilters}>Rechercher</Button>
        <Button icon={<ReloadOutlined />} onClick={resetAll}>Réinitialiser</Button>
        <Button className="text-primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Ajouter une parcelle
        </Button>
      </Space>
    </div>
  );

  // Header Mobile
  const MobileHeader = (
    <div className="mb-4 flex items-center justify-between">
      <Title level={4} className="m-0">Parcelles</Title>
      <Space>
        <Button icon={<FilterOutlined />} onClick={() => setDrawerOpen(true)}>Filtres</Button>
        <Button icon={<ReloadOutlined />} onClick={resetAll} />
        <Button icon={<PlusOutlined />} onClick={() => showModal()} />
      </Space>
    </div>
  );

  const DrawerFilters = (
    <Drawer
      title="Filtres"
      placement="right"
      width={screens.xs ? "100%" : 360}
      onClose={() => setDrawerOpen(false)}
      open={drawerOpen}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Input
          placeholder="Rechercher par numéro/lotissement/statut…"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        <Select
          allowClear
          placeholder="Statut"
          value={statut}
          onChange={setStatut}
          style={{ width: "100%" }}
        >
          <Option value="DISPONIBLE">Disponible</Option>
          <Option value="OCCUPE">Occupé</Option>
          <Option value="EN_COURS">En cours</Option>
          <Option value="RESERVE">Réservé</Option>
        </Select>
        <Select
          allowClear
          placeholder="Lotissement"
          value={lotissementId}
          onChange={setLotissementId}
          style={{ width: "100%" }}
          showSearch
          optionFilterProp="children"
        >
          {lotissements.map((l) => (
            <Option key={l.id} value={l.id}>{l.nom}</Option>
          ))}
        </Select>
        <Space>
          <Button type="primary" onClick={() => { setPage(1); fetchData(); setDrawerOpen(false); }}>
            Rechercher
          </Button>
          <Button onClick={resetAll} icon={<ReloadOutlined />}>Réinitialiser</Button>
        </Space>
      </Space>
    </Drawer>
  );

  return (
    <>
      <AdminBreadcrumb title="Liste des Parcelles" />
      <div className="container mx-auto px-3 sm:px-4 md:px-6 my-6">
        <Card className="shadow-lg">
          {isMdUp ? DesktopFilters : MobileHeader}
          {!isMdUp && DrawerFilters}

          <Table
            rowKey="id"
            columns={columns}
            dataSource={rows}
            loading={loading}
            sticky
            scroll={{ x: isMdUp ? 1000 : undefined }}
            onChange={(pagination, filters, sorterArg) => {
              // pagination
              setPage(pagination.current || 1);
              setSize(pagination.pageSize || 10);

              // tri
              let field = sorterArg.field;
              let order = sorterArg.order;
              if (!order) { field = "id"; order = "descend"; }
              setSorter({ field, order });
            }}
            pagination={{
              current: meta.page || page,
              pageSize: meta.size || size,
              total: meta.total || 0,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50", "100"],
              showTotal: (t) => `Total ${t} parcelles`,
            }}
          />

          {/* MODAL CREATE/EDIT */}
          <Modal
            title={editingParcelle ? "Modifier la parcelle" : "Ajouter une parcelle"}
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            width={600}
            destroyOnClose
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ statut: "DISPONIBLE" }}
            >
              <Form.Item
                name="numero"
                label="Numéro"
                rules={[{ required: true, message: "Le numéro est requis" }]}
              >
                <Input />
              </Form.Item>


              <Form.Item
                name="surface"
                label="Superficie (m²)"
              >
                <Input type="number" step="any" min="0" />
              </Form.Item>


              <Form.Item
                name="longitude"
                label="Longitude"
              >
                <Input type="number" step="0.000001" />
              </Form.Item>
              <Form.Item
                name="latitude"
                label="Latitude"
              >
                <Input type="number" step="0.000001" />
              </Form.Item>


              <Form.Item
                name="lotissementId"
                label="Lotissement"
                rules={[{ required: true, message: "Le lotissement est requis" }]}
              >
                <Select placeholder="Sélectionner un lotissement" showSearch optionFilterProp="children">
                  {lotissements.map((l) => (
                    <Option key={l.id} value={l.id}>{l.nom}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="statut"
                label="Statut"
                rules={[{ required: true, message: "Le statut est requis" }]}
              >
                <Select>
                  <Option value="DISPONIBLE">Disponible</Option>
                  <Option value="OCCUPE">Occupé</Option>
                  <Option value="EN_COURS">En cours</Option>
                  <Option value="RESERVE">Réservé</Option>
                </Select>
              </Form.Item>

              <Form.Item className="flex justify-end">
                <Space>
                  <Button onClick={handleCancel}>Annuler</Button>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    {editingParcelle ? "Modifier" : "Ajouter"}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>

          {/* MODAL MAP */}
          <Modal
            title="Carte de la parcelle"
            open={isMapModalVisible}
            onCancel={handleCancel}
            width={900}
            footer={null}
            destroyOnClose
          >
            {selectedParcelle ? (
              <MapCar latitude={selectedParcelle.latitude} longitude={selectedParcelle.longitude} />
            ) : (
              <div className="p-6 text-center"><Text type="secondary">Aucune coordonnée</Text></div>
            )}
          </Modal>
        </Card>
      </div>
    </>
  );
};

export default AdminParcelle;
