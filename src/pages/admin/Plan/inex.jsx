

// src/pages/admin/AdminPlan.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Table, Card, Space, Button, Typography, Input, Modal, Form, message, Result,
  Upload, Select, Drawer, Grid
} from "antd";
import {
  SearchOutlined, PlusOutlined, EditOutlined, EyeOutlined, UploadOutlined, FilterOutlined, ReloadOutlined
} from "@ant-design/icons";
import { AdminBreadcrumb } from "@/components";
import { getLotissements } from "@/services/lotissementService";
import {
  createPlanLotissement, getFileDocumentPlan, getPlanLotissements, updatePlanLotissement
} from "@/services/planLotissement";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;

const AdminPlan = () => {
  const screens = useBreakpoint();
  const isMdUp = screens.md;

  const [form] = Form.useForm();
  const [plans, setPlans] = useState([]);
  const [lotissements, setLotissements] = useState([]);

  // chargements / erreurs
  const [tableLoading, setTableLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [viewerLoading, setViewerLoading] = useState(false);
  const [error, setError] = useState(null);

  // UI états
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // édition / visualisation
  const [editingPlan, setEditingPlan] = useState(null);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewingId, setViewingId] = useState(null); // id du plan en cours de visualisation

  // Filtres & pagination (serveur)
  const [searchText, setSearchText] = useState("");
  const [lotissementId, setLotissementId] = useState();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sorter, setSorter] = useState({ field: "dateCreation", order: "descend" });
  const [meta, setMeta] = useState({ page: 1, size: 10, total: 0, pages: 0, sort: "dateCreation,DESC" });

  // mapping champ UI -> champ API
  const sortParam = useMemo(() => {
    const fieldMap = {
      description: "description",
      version: "version",
      dateCreation: "dateCreation",
      lotissement: "lotissement", // côté back, trier sur l.nom si dispo
    };
    const field = fieldMap[sorter.field] ?? "dateCreation";
    const dir = sorter.order === "ascend" ? "ASC" : "DESC";
    return `${field},${dir}`;
  }, [sorter]);

  // fetch combiné
  const fetchData = async () => {
    setTableLoading(true);
    try {
      const [lotissementsData, plansRes] = await Promise.all([
        lotissements.length ? Promise.resolve(lotissements) : getLotissements(),
        getPlanLotissements({
          page,
          size,
          sort: sortParam,
          search: searchText || undefined,
          lotissementId: lotissementId || undefined,
        }),
      ]);

      if (!lotissements.length) setLotissements(lotissementsData);
      const items = Array.isArray(plansRes)
        ? plansRes
        : Array.isArray(plansRes?.data)
          ? plansRes.data
          : Array.isArray(plansRes?.items)
            ? plansRes.items
            : [];

      const m = plansRes?.meta ?? {
        page,
        size,
        total: items.length,
        pages: Math.ceil((items.length || 1) / (size || 10)),
        sort: sortParam
      };
      setPlans(items);
      setMeta(m);
      setError(null);
    } catch (err) {
      setError(err?.message || "Erreur lors du chargement des données");
      message.error("Erreur lors du chargement des données");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, sortParam]);

  const refetchWithFilters = () => {
    // recommencer à la page 1 si on change les filtres
    setPage(1);
    fetchData();
  };

  const resetAll = () => {
    setSearchText("");
    setLotissementId(undefined);
    setPage(1);
    setSize(10);
    setSorter({ field: "dateCreation", order: "descend" });
    fetchData();
  };

  const handleViewDocument = async (plan) => {
    setViewerLoading(true);
    setViewingId(plan?.id || null);
    setCurrentDocument(null);
    try {
      const fileContentBase64 = await getFileDocumentPlan(plan.id);
      setCurrentDocument(fileContentBase64);
      setIsViewerVisible(true);
    } catch (err) {
      message.error("Erreur lors du chargement du fichier");
    } finally {
      setViewerLoading(false);
      setViewingId(null);
    }
  };

  const showModal = (plan = null) => {
    setEditingPlan(plan);
    if (plan) {
      form.setFieldsValue({
        description: plan.description,
        version: plan.version,
        lotissementId: plan?.lotissement?.id,
        // pas d'upload ici: on garde l'existant
      });
    } else {
      // form.resetFields();
    }
    setSelectedFile(null);
    setIsModalVisible(true);
  };

  const closeAllModals = () => {
    setIsModalVisible(false);
    setIsViewerVisible(false);
    setEditingPlan(null);
    setSelectedFile(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setSubmitLoading(true);

    const formData = new FormData();
    formData.append("description", values.description);
    formData.append("version", values.version);
    formData.append("lotissementId", values.lotissementId);

    // fichier requis seulement en création
    if (!editingPlan) {
      if (!selectedFile) {
        setSubmitLoading(false);
        return message.error("Le document est requis");
      }
      formData.append("document", selectedFile);
    } else if (selectedFile) {
      // si on a remplacé le fichier en édition
      formData.append("document", selectedFile);
    }

    try {
      if (editingPlan) {
        await updatePlanLotissement(editingPlan.id, formData);
        message.success("Plan mis à jour avec succès");
      } else {
        await createPlanLotissement(formData);
        message.success("Plan ajouté avec succès");
      }
      closeAllModals();
      refetchWithFilters();
    } catch (err) {
      message.error("Erreur lors de l'opération");
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: true,
      ellipsis: true,
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
      width: 120,
      sorter: true,
      ellipsis: true,
    },
    {
      title: "Date de création",
      key: "dateCreation",
      width: 170,
      sorter: true,
      render: (_, record) =>
        record?.dateCreation
          ? new Date(record.dateCreation).toLocaleString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
          : "—",
      responsive: ["sm"],
    },
    {
      title: "Lotissement",
      dataIndex: ["lotissement", "nom"],
      key: "lotissement",
      sorter: true,
      ellipsis: true,
      render: (_, record) =>
        record?.lotissement ? (
          <Link className="text-primary" to={`/admin/lotissements/${record.lotissement.id}/details`}>
            {record.lotissement.nom}
          </Link>
        ) : (
          "—"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      fixed: isMdUp ? "right" : undefined,
      render: (_, record) => (
        <Space wrap>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDocument(record)}
            loading={viewerLoading && viewingId === record.id}
            className="text-primary hover:text-primary-light"
          >
            Voir
          </Button>

          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            className="text-primary"
          >
            Modifier
          </Button>
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <>
        <AdminBreadcrumb title="Liste des Plans de Lotissement" />
        <Result status="error" title="Erreur lors du chargement" subTitle={error} />
      </>
    );
  }

  // Header Desktop
  const DesktopFilters = (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <Title level={4} className="m-0">Plans de lotissement</Title>
      <Space wrap>
        <Input
          placeholder="Rechercher par description ou lotissement..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={refetchWithFilters}
          style={{ width: 320, maxWidth: "100%" }}
          allowClear
        />
        <Select
          placeholder="Lotissement"
          allowClear
          value={lotissementId}
          onChange={setLotissementId}
          style={{ width: 240 }}
          showSearch
          optionFilterProp="children"
        >
          {lotissements.map((lot) => (
            <Option key={lot.id} value={lot.id}>
              {lot.nom}
            </Option>
          ))}
        </Select>

        <Button type="primary" onClick={refetchWithFilters} icon={<SearchOutlined />}>
          Rechercher
        </Button>
        <Button icon={<ReloadOutlined />} onClick={resetAll}>
          Réinitialiser
        </Button>
        <Button icon={<PlusOutlined />} onClick={() => showModal()}>
          Ajouter un Plan
        </Button>
      </Space>
    </div>
  );

  // Header Mobile
  const MobileHeader = (
    <div className="mb-4 flex items-center justify-between">
      <Title level={4} className="m-0">Plans</Title>
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
      destroyOnClose
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Input
          placeholder="Rechercher par description ou lotissement..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        <Select
          placeholder="Lotissement"
          allowClear
          value={lotissementId}
          onChange={setLotissementId}
          style={{ width: "100%" }}
          showSearch
          optionFilterProp="children"
        >
          {lotissements.map((lot) => (
            <Option key={lot.id} value={lot.id}>
              {lot.nom}
            </Option>
          ))}
        </Select>
        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => { setPage(1); fetchData(); setDrawerOpen(false); }}
          >
            Rechercher
          </Button>
          <Button onClick={resetAll} icon={<ReloadOutlined />}>
            Réinitialiser
          </Button>
        </Space>
      </Space>
    </Drawer>
  );

  return (
    <>
      <AdminBreadcrumb title="Liste des Plans de Lotissement" />
      <div className="container mx-auto px-3 sm:px-4 md:px-6 my-6">
        <Card className="shadow-lg">
          {isMdUp ? DesktopFilters : MobileHeader}
          {!isMdUp && DrawerFilters}

          <Table
            columns={columns}
            dataSource={plans}
            rowKey="id"
            loading={tableLoading}
            sticky
            scroll={{ x: isMdUp ? 1000 : undefined }}
            onChange={(pagination, filters, sorterArg = {}) => {
              // pagination
              setPage(pagination.current || 1);
              setSize(pagination.pageSize || 10);

              // tri (fallback défaut si reset)
              let field = sorterArg.field;
              let order = sorterArg.order;
              if (!order) { field = "dateCreation"; order = "descend"; }
              setSorter({ field, order });
            }}
            pagination={{
              current: meta.page || page,
              pageSize: meta.size || size,
              total: meta.total || 0,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50", "100"],
              showTotal: (t) => `Total ${t} plan${t > 1 ? "s" : ""}`,
            }}
          />

          {/* MODAL CREATE/EDIT */}
          <Modal
            title={editingPlan ? "Modifier le plan" : "Ajouter un plan"}
            open={isModalVisible}
            onCancel={closeAllModals}
            footer={null}
            width={600}
            destroyOnClose
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                description: editingPlan?.description,
                version: editingPlan?.version,
                lotissementId: editingPlan?.lotissement?.id,
              }}
            >
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: "La description est requise" }]}
              >
                <TextArea rows={4} />
              </Form.Item>

              <Form.Item
                name="version"
                label="Version"
                rules={[{ required: true, message: "La version est requise" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="lotissementId"
                label="Lotissement"
                rules={[{ required: true, message: "Le lotissement est requis" }]}
              >
                <Select placeholder="Sélectionner un lotissement" showSearch optionFilterProp="children">
                  {lotissements.map((lot) => (
                    <Option key={lot.id} value={lot.id}>
                      {lot.nom}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label={`Document (PDF) ${editingPlan ? "(optionnel)" : "(requis)"}`}
                required={!editingPlan}
                tooltip={!editingPlan ? "Obligatoire lors de la création" : "Laissez vide pour conserver le document actuel"}
              >
                <Upload
                  accept=".pdf"
                  beforeUpload={(file) => { setSelectedFile(file); return false; }}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Sélectionner un fichier</Button>
                </Upload>
                {editingPlan?.documentUrl && (
                  <div className="mt-2">
                    <Text type="secondary">Document actuel : </Text>
                    <a href={editingPlan.documentUrl} target="_blank" rel="noreferrer">ouvrir</a>
                  </div>
                )}
              </Form.Item>

              <Form.Item className="flex justify-end">
                <Space>
                  <Button onClick={closeAllModals} disabled={submitLoading}>Annuler</Button>
                  <Button type="primary" htmlType="submit" loading={submitLoading}>
                    {editingPlan ? "Modifier" : "Ajouter"}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>

          {/* MODAL VIEWER */}
          <Modal
            title="Visualisation du plan"
            open={isViewerVisible}
            onCancel={closeAllModals}
            width={900}
            footer={null}
            destroyOnClose
          >
            {viewerLoading ? (
              <div className="flex justify-center items-center p-8">
                <span>Chargement du document...</span>
              </div>
            ) : currentDocument ? (
              <div className="w-full">
                <iframe
                  src={`data:application/pdf;base64,${currentDocument}`}
                  width="100%"
                  height="70vh"
                  title="Document PDF"
                  className="border rounded"
                />
              </div>
            ) : (
              <Result status="warning" subTitle="Aucun document à afficher" />
            )}
          </Modal>
        </Card>
      </div>
    </>
  );
};

export default AdminPlan;
