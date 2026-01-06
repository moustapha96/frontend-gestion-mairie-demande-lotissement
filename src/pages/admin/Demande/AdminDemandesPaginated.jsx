// src/pages/admin/AdminDemandesPaginated.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Table,
  Input,
  Select,
  Tag,
  Typography,
  Space,
  Button,
  Drawer,
  Grid,
  List,
  Card,
  Popover,
  message,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  ImportOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getDemandesPaginated, importDemandes } from "@/services/demandeService";
import { AdminBreadcrumb } from "@/components";
import { getDetaitHabitant } from "@/services/userService";
import { Import, Upload } from "lucide-react";
import { templateDemande } from "@/utils/export_demandeur";
import { exportDemandesToCSV, exportDemandesToPDF } from "@/utils/export_demande";

const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

const statutColor = (s) => {
  switch (s) {
    case "En attente":
      return "orange";
    case "En cours de traitement":
      return "gold";
    case "Approuvée":
      return "green";
    case "Rejetée":
      return "red";
    default:
      return "default";
  }
};

export default function AdminDemandesPaginated() {
  const screens = useBreakpoint();
  const isMdUp = screens.md; // ≥ md → table, < md → vue cartes + drawer filtres

  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    size: 10,
    total: 0,
    pages: 0,
    sort: "id,DESC",
  });
  const [loading, setLoading] = useState(false);

  // Filtres/état UI
  const [search, setSearch] = useState("");
  const [statut, setStatut] = useState();
  const [typeDemande, setTypeDemande] = useState();
  const [typeDocument, setTypeDocument] = useState();
  const [importLoading, setImportLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sorter, setSorter] = useState({ field: "id", order: "descend" });
  const [habitantData, setHabitantData] = useState({})
  const [loadingHabitant, setLoadingHabitant] = useState({})
  const [drawerOpen, setDrawerOpen] = useState(false);
  const fileInputRef = useRef(null);

  const sortParam = useMemo(() => {
    const fieldMap = {
      id: "id",
      dateCreation: "dateCreation",
      dateModification: "dateModification",
      typeDemande: "typeDemande",
      statut: "statut",
      superficie: "superficie",
      demandeur: "demandeur",
      localite: "localite",
    };
    const field = fieldMap[sorter.field] ?? "id";
    const dir = sorter.order === "ascend" ? "ASC" : "DESC";
    return `${field},${dir}`;
  }, [sorter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getDemandesPaginated({
        page,
        size,
        sort: sortParam,
        search: search || undefined,
        statut: statut || undefined,
        typeDemande: typeDemande || undefined,
        typeDocument: typeDocument || undefined,
        includeActor: true,
      });
      console.log(res);
      setRows(res.data || []);
      setMeta(res.meta || {});
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchHabitantInfo = async (userId) => {
    if (habitantData[userId]) return
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

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setImportLoading(true);
      const response = await importDemandes(formData);
      console.log(response)
      message.success("Demandes importées avec succès");
      fetchData();
    } catch (error) {
      console.error("Erreur lors de l'importation : ", error);
      message.error("Erreur lors de l'importation des demandes : " + error.message);
    } finally {
      setImportLoading(false);
      event.target.value = ''; // Réinitialise l'input file
    }
  };

  const handleImport = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setImportLoading(true);
      const response = await importDemandes(formData);

      if (response.success) {
        message.success("Demandes importées avec succès");
        fetchData(); // Rafraîchir les données après import
        onSuccess(); // Indiquer à Ant Design que l'upload est réussi
      } else {
        message.error(response.message || "Erreur lors de l'importation des demandes");
        onError(); // Indiquer à Ant Design que l'upload a échoué
      }
    } catch (error) {
      console.error("Erreur lors de l'importation : ", error);
      message.error("Erreur lors de l'importation des demandes : " + error.message);
      onError(); // Indiquer à Ant Design que l'upload a échoué
    } finally {
      setImportLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, [page, size, sortParam]);

  const resetAll = () => {
    setSearch("");
    setStatut(undefined);
    setTypeDemande(undefined);
    setTypeDocument(undefined);
    setPage(1);
    setSize(10);
    setSorter({ field: "id", order: "descend" });
    fetchData();
  };

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

  // Colonnes responsives (certaines visibles seulement ≥ md/≥ lg)
  const columns = [
    {
      title: "Habitant",
      dataIndex: "isHabitant",
      key: "isHabitant",
      render: (_, record) => {
        if (!record.isHabitant) return "Non"
        return (

          <div className="flex flex-wrap gap-2">
            <span>Oui</span>
            <Popover
              content={renderHabitantContent(record.demandeur.id)}
              title="Informations détaillées"
              trigger="click"
              placement="right"
              overlayStyle={{ maxWidth: "800px" }}
              onVisibleChange={(visible) => {
                if (visible) {
                  fetchHabitantInfo(record.demandeur.id)
                }
              }}
            >
              <Button
                type="text"
                icon={<InfoCircleOutlined />}
                className="text-primary"
                loading={loadingHabitant[record.demandeur.id]}
              />
            </Popover>
          </div>
        )
      },
      filters: [
        { text: "Oui", value: true },
        { text: "Non", value: false },
      ],
      onFilter: (value, record) => record.isHabitant === value,
    },
    {
      title: "Demandeur",
      key: "demandeur",
      sorter: true,
      render: (_, r) =>
        r.demandeur ? (
          <Link
            to={`/admin/demandeur/${r.demandeur.id}/details`}
            className="text-primary"
          >
            {r.demandeur.nom} {r.demandeur.prenom} — {r.demandeur.email}
          </Link>
        ) : (
          "—"
        ),
      ellipsis: true,
      responsive: ["md"],
    },
    {
      title: "Type de demande",
      dataIndex: "typeDemande",
      key: "typeDemande",
      sorter: true,
      filters: [
        { text: "Attribution", value: "Attribution" },
        { text: "Régularisation", value: "Régularisation" },
        { text: "Authentification", value: "Authentification" },
      ],
      onFilter: (val, record) => record.typeDemande === val,
      ellipsis: true,
      responsive: ["md"],
    },
    {
      title: "Superficie",
      dataIndex: "superficie",
      key: "superficie",
      sorter: true,
      width: 120,
      render: (v) => (v != null ? `${v} m²` : "-"),
      responsive: ["md"],
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      sorter: true,
      render: (s) => <Tag color={statutColor(s)}>{s}</Tag>,
      width: 180,
      responsive: ["md"],
    },
    {
      title: "Créé le",
      dataIndex: "dateCreation",
      key: "dateCreation",
      sorter: true,
      width: 180,
      render: (d) =>
        d
          ? new Date(d).toLocaleString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
          : "—",
      responsive: ["md"],
    },
    {
      title: "Actions",
      key: "actions",
      fixed: isMdUp ? "right" : undefined,
      width: 110,
      render: (_, r) => (
        <Space>
          <Link to={`/admin/demandes/${r.id}/details`}>
            <Button icon={<EyeOutlined />} />
          </Link>
        </Space>
      ),
      responsive: ["md"],
    },
  ];

  // Barre filtres (desktop)
  const DesktopFilters = (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <Title level={4} className="m-0">
        Demandes
      </Title>
      <Space wrap>
        <Input
          allowClear
          placeholder="Rechercher (type, usage, demandeur, Quartier...)"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 320, maxWidth: "100%" }}
        />
        <Select
          allowClear
          placeholder="Statut"
          style={{ width: 180 }}
          value={statut}
          onChange={setStatut}
        >
          <Option value="En attente">En attente</Option>
          <Option value="En cours de traitement">En cours de traitement</Option>
          <Option value="Approuvée">Approuvée</Option>
          <Option value="Rejetée">Rejetée</Option>
        </Select>
        <Select
          allowClear
          placeholder="Type de demande"
          style={{ width: 200 }}
          value={typeDemande}
          onChange={setTypeDemande}
        >
          <Option value="Attribution">Attribution</Option>
          <Option value="Régularisation">Régularisation</Option>
          <Option value="Authentification">Authentification</Option>
        </Select>
        <Select
          allowClear
          placeholder="Type document"
          style={{ width: 200 }}
          value={typeDocument}
          onChange={setTypeDocument}
        >
          <Option value="CNI">CNI</Option>
          <Option value="Passeport">Passeport</Option>
          <Option value="Autre">Autre</Option>
        </Select>
        <Button
          type="primary"
          onClick={() => {
            setPage(1);
            fetchData();
          }}
        >
          Rechercher
        </Button>
        <Button icon={<ReloadOutlined />} onClick={resetAll}>
          Réinitialiser
        </Button>
      </Space>
    </div>
  );

  // Déclencheur mobile
  const MobileHeader = (
    <div className="mb-4 flex items-center justify-between">
      <Title level={4} className="m-0">
        Demandes
      </Title>
      <Space>
        <Button
          icon={<FilterOutlined />}
          onClick={() => setDrawerOpen(true)}
          type="default"
        >
          Filtres
        </Button>
        <Button icon={<ReloadOutlined />} onClick={resetAll} />
      </Space>
    </div>
  );

  // Contenu drawer mobile
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
          allowClear
          placeholder="Rechercher (type, usage, demandeur, Quartier...)"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          allowClear
          placeholder="Statut"
          value={statut}
          onChange={setStatut}
          style={{ width: "100%" }}
        >
          <Option value="En attente">En attente</Option>
          <Option value="En cours de traitement">En cours de traitement</Option>
          <Option value="Approuvée">Approuvée</Option>
          <Option value="Rejetée">Rejetée</Option>
        </Select>
        <Select
          allowClear
          placeholder="Type de demande"
          value={typeDemande}
          onChange={setTypeDemande}
          style={{ width: "100%" }}
        >
          <Option value="Attribution">Attribution</Option>
          <Option value="Régularisation">Régularisation</Option>
          <Option value="Authentification">Authentification</Option>
        </Select>
        <Select
          allowClear
          placeholder="Type document"
          value={typeDocument}
          onChange={setTypeDocument}
          style={{ width: "100%" }}
        >
          <Option value="CNI">CNI</Option>
          <Option value="Passeport">Passeport</Option>
          <Option value="Autre">Autre</Option>
        </Select>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setPage(1);
              fetchData();
              setDrawerOpen(false);
            }}
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

  // Vue "cards" pour mobile (< md)
  const MobileCards = (
    <List
      loading={loading}
      dataSource={rows}
      pagination={{
        current: meta.page || page,
        pageSize: meta.size || size,
        total: meta.total || 0,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20", "50", "100"],
        showTotal: (t) => `Total ${t} demandes`,
        onChange: (p, ps) => {
          setPage(p || 1);
          setSize(ps || 10);
        },
      }}
      renderItem={(r) => (
        <List.Item key={r.id}>
          <Card
            size="small"
            className="w-full"
            title={
              <div className="flex items-center justify-between gap-2">
                <span>
                  <Text type="secondary">N°</Text> <Text strong>{r.id}</Text>
                </span>
                <Tag color={statutColor(r.statut)}>{r.statut || "—"}</Tag>
              </div>
            }
            extra={
              <Link to={`/admin/demandes/${r.id}/details`}>
                <Button icon={<EyeOutlined />} size="small">
                  Voir
                </Button>
              </Link>
            }
          >
            <div className="grid grid-cols-1 gap-2">
              <div>
                <Text type="secondary">Type de demande : </Text>
                <Text>{r.typeDemande || "—"}</Text>
              </div>
              <div>
                <Text type="secondary">Type document : </Text>
                <Text>{r.typeDocument || "—"}</Text>
              </div>
              <div>
                <Text type="secondary">Demandeur : </Text>
                {r.demandeur ? (
                  <Link
                    to={`/admin/demandeur/${r.demandeur.id}/details`}
                    className="text-primary"
                  >
                    {r.demandeur.nom} {r.demandeur.prenom} —{" "}
                    {r.demandeur.email}
                  </Link>
                ) : (
                  <Text>—</Text>
                )}
              </div>
              <div>
                <Text type="secondary">Quartier : </Text>
                <Text>{r.localite?.nom || "—"}</Text>
              </div>
              <div>
                <Text type="secondary">Superficie : </Text>
                <Text>{r.superficie != null ? `${r.superficie} m²` : "—"}</Text>
              </div>
              <div>
                <Text type="secondary">Créé le : </Text>
                <Text>
                  {r.dateCreation
                    ? new Date(r.dateCreation).toLocaleString()
                    : "—"}
                </Text>
              </div>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );

  return (
    <>
      <AdminBreadcrumb title="Liste des demandes" />


      <section className="container mx-auto px-3 sm:px-4 md:px-6 py-4">
        {isMdUp ? DesktopFilters : MobileHeader}
        {!isMdUp && DrawerFilters}


        <div className="flex flex-wrap gap-2">

          <Button icon={<DownloadOutlined />} onClick={templateDemande}>
            Télécharger Template
          </Button>
          <Button icon={<FileExcelOutlined />} onClick={() => exportDemandesToCSV(rows)}>
            Exporter CSV
          </Button>
          <Button icon={<FilePdfOutlined />} onClick={() => exportDemandesToPDF(rows)}>
            Exporter PDF
          </Button>

          <div className="flex items-center justify-center">

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
            />
            <Button
              type="primary"
              icon={importLoading ? <LoadingOutlined /> : <ImportOutlined />}
              loading={importLoading}
              onClick={() => fileInputRef.current.click()}
            >
              {importLoading ? 'Importation en cours...' : 'Importer Excel'}
            </Button>

          </div>


        </div>



        {isMdUp ? (
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={rows}
            sticky
            // Scroll horizontal uniquement si nécessaire
            scroll={{ x: isMdUp ? 1000 : undefined }}
            onChange={(pagination, filters, sorterArg) => {
              // pagination
              setPage(pagination.current || 1);
              setSize(pagination.pageSize || 10);

              // tri
              let field = sorterArg.field;
              let order = sorterArg.order;
              if (!order) {
                field = "id";
                order = "descend";
              }
              setSorter({ field, order });
            }}
            pagination={{
              current: meta.page || page,
              pageSize: meta.size || size,
              total: meta.total || 0,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50", "100"],
              showTotal: (t) => `Total ${t} demandes`,
            }}
          />
        ) : (
          MobileCards
        )}
      </section>
    </>
  );
}
