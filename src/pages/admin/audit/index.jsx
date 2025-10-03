// src/pages/admin/AdminAuditLogs.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Card,
  Space,
  Typography,
  Input,
  Button,
  Select,
  Tag,
  Drawer,
  Descriptions,
  Tooltip,
  DatePicker,
  message,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { getAuditLogsPaginated } from "@/services/auditLogService";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const EVENT_OPTIONS = [
  "API_CALL",
  "ENTITY_CREATED",
  "ENTITY_UPDATED",
  "ENTITY_DELETED",
  "BUSINESS_ACTION",
  "LOGIN",
  "UNKNOWN",
];

const STATUS_COLORS = {
  SUCCESS: "green",
  ERROR: "red",
  START: "gold",
};

export default function AdminAuditLogs() {
  // dataset paginé
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    size: 10,
    total: 0,
    pages: 0,
    sort: "createdAt,DESC",
  });

  // états UI
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  // filtres / recherche
  const [search, setSearch] = useState(""); // s’appliquera sur event/route/path/actorIdentifier via backend si tu veux (sinon on garde simple)
  const [eventFilter, setEventFilter] = useState(undefined);
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [actorIdFilter, setActorIdFilter] = useState(undefined);
  const [requestIdFilter, setRequestIdFilter] = useState(undefined);
  const [entityClassFilter, setEntityClassFilter] = useState(undefined);
  const [entityIdFilter, setEntityIdFilter] = useState(undefined);
  const [dateRange, setDateRange] = useState([null, null]); // [from, to]

  // détails
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeLog, setActiveLog] = useState(null);

  const fetchPage = async (override = {}) => {
    setLoading(true);
    try {
      const params = {
        page: override.page ?? meta.page,
        size: override.size ?? meta.size,
        sort: override.sort ?? meta.sort,
        event: override.event ?? eventFilter,
        status: override.status ?? statusFilter,
        actorId: override.actorId ?? actorIdFilter,
        requestId: override.requestId ?? requestIdFilter,
        entityClass: override.entityClass ?? entityClassFilter,
        entityId: override.entityId ?? entityIdFilter,
      };

      if (override.from !== undefined || override.to !== undefined) {
        params.from = override.from;
        params.to = override.to;
      } else if (dateRange?.[0] && dateRange?.[1]) {
        params.from = dateRange[0].toISOString();
        params.to = dateRange[1].toISOString();
      }

      // NOTE: le backend que tu as montré ne gère pas un “search global”.
      // On laisse `search` côté front pour l’instant (filtrage client léger)
      const res = await getAuditLogsPaginated(params);
      setRows(res?.data || []);
      setMeta(
        res?.meta || {
          page: 1,
          size: 10,
          total: 0,
          pages: 0,
          sort: "createdAt,DESC",
        }
      );
    } catch (e) {
      console.error(e);
      message.error("Erreur lors du chargement des logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce simple pour les filtres (sauf tri/pagination pilotés par onChange de Table)
  useEffect(() => {
    const t = setTimeout(() => fetchPage({ page: 1 }), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventFilter, statusFilter, actorIdFilter, requestIdFilter, entityClassFilter, entityIdFilter, dateRange]);

  // Tri / pagination Ant Design
  const onTableChange = (pagination, _filters, sorter) => {
    const size = pagination.pageSize;
    const page = pagination.current;
    let sort = meta.sort;

    if (Array.isArray(sorter)) sorter = sorter[0];
    if (sorter && sorter.field) {
      const dir = sorter.order === "ascend" ? "ASC" : "DESC";
      sort = `${sorter.field},${dir}`;
    }
    fetchPage({ page, size, sort });
  };

  const filteredRows = useMemo(() => {
    if (!search) return rows;
    const s = search.toLowerCase();
    return rows.filter((r) => {
      return (
        (r.event || "").toLowerCase().includes(s) ||
        (r.route || "").toLowerCase().includes(s) ||
        (r.path || "").toLowerCase().includes(s) ||
        (r.actor || "").toLowerCase().includes(s) ||
        (r.requestId || "").toLowerCase().includes(s) ||
        (r.entityClass || "").toLowerCase().includes(s) ||
        (r.entityId || "").toLowerCase().includes(s) ||
        (r.status || "").toLowerCase().includes(s) ||
        String(r.actorId || "").includes(s)
      );
    });
  }, [rows, search]);

  const openDetails = async (record) => {
    setDetailLoading(true);
    try {
      setActiveLog(record);
      setDrawerOpen(true);
    } finally {
      setDetailLoading(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setEventFilter(undefined);
    setStatusFilter(undefined);
    setActorIdFilter(undefined);
    setRequestIdFilter(undefined);
    setEntityClassFilter(undefined);
    setEntityIdFilter(undefined);
    setDateRange([null, null]);
    fetchPage({ page: 1, event: undefined, status: undefined, actorId: undefined, requestId: undefined, entityClass: undefined, entityId: undefined, from: undefined, to: undefined });
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      width: 200,
      render: (v) => (v ? new Date(v).toLocaleString() : "—"),
    },
    {
      title: "Événement",
      dataIndex: "event",
      key: "event",
      render: (e) => <Tag>{e || "—"}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => <Tag color={STATUS_COLORS[s] || "default"}>{s || "—"}</Tag>,
    },
    {
      title: "Actor",
      key: "actor",
      render: (_, r) => (
        <div>
          <div><Text strong>ID:</Text> {r.actorId ?? "—"}</div>
          <div><Text type="secondary">{r.actor || "—"}</Text></div>
        </div>
      ),
    },
    {
      title: "HTTP",
      key: "http",
      render: (_, r) => (
        <div style={{ maxWidth: 360 }}>
          <div><Text strong>M:</Text> {r.httpMethod || "—"}</div>
          <div title={r.route || ""}><Text strong>Route:</Text> {r.route || "—"}</div>
          <div title={r.path || ""} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            <Text strong>Path:</Text> {r.path || "—"}
          </div>
        </div>
      ),
    },
    {
      title: "Entity",
      key: "entity",
      render: (_, r) => (
        <div>
          <div><Text strong>Class:</Text> {r.entityClass || "—"}</div>
          <div><Text strong>ID:</Text> {r.entityId || "—"}</div>
        </div>
      ),
    },
    {
      title: "Request",
      key: "request",
      render: (_, r) => (
        <div>
          <div><Text strong>ReqID:</Text> {r.requestId || "—"}</div>
          <div><Text strong>CorrID:</Text> {r.correlationId || "—"}</div>
          <div><Text strong>IP:</Text> {r.ip || "—"}</div>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, r) => (
        <Space>
          <Tooltip title="Détails">
            <Button size="small" icon={<EyeOutlined />} onClick={() => openDetails(r)} loading={detailLoading && activeLog?.id === r.id}>
              Détails
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <section className="container mx-auto px-4">
        <div className="my-6 space-y-6">
          <Card className="shadow-lg rounded-lg">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <Title level={4} style={{ margin: 0 }}>Audit Logs</Title>
              <Space wrap>
                <Button icon={<ReloadOutlined />} onClick={() => fetchPage()}>Rafraîchir</Button>
                <Button icon={<ClearOutlined />} onClick={resetFilters}>Réinitialiser</Button>
              </Space>
            </div>

            {/* Filtres */}
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex flex-col lg:flex-row gap-2">
                <Input
                  placeholder="Rechercher (event/route/path/actor...)"
                  prefix={<SearchOutlined />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full lg:max-w-md"
                />
                <Select
                  placeholder="Événement"
                  allowClear
                  value={eventFilter}
                  style={{ minWidth: 200 }}
                  onChange={setEventFilter}
                >
                  {EVENT_OPTIONS.map((ev) => (
                    <Option key={ev} value={ev}>{ev}</Option>
                  ))}
                </Select>
                <Select
                  placeholder="Status"
                  allowClear
                  value={statusFilter}
                  style={{ minWidth: 160 }}
                  onChange={setStatusFilter}
                  options={[
                    { label: "SUCCESS", value: "SUCCESS" },
                    { label: "ERROR", value: "ERROR" },
                    { label: "START", value: "START" },
                  ]}
                />
              </div>

              <div className="flex flex-col lg:flex-row gap-2">
                <Input
                  placeholder="Actor ID"
                  value={actorIdFilter}
                  onChange={(e) => setActorIdFilter(e.target.value)}
                  style={{ maxWidth: 180 }}
                />
                <Input
                  placeholder="Request ID"
                  value={requestIdFilter}
                  onChange={(e) => setRequestIdFilter(e.target.value)}
                  style={{ maxWidth: 260 }}
                />
                <Input
                  placeholder="Entity Class"
                  value={entityClassFilter}
                  onChange={(e) => setEntityClassFilter(e.target.value)}
                  style={{ maxWidth: 260 }}
                />
                <Input
                  placeholder="Entity ID"
                  value={entityIdFilter}
                  onChange={(e) => setEntityIdFilter(e.target.value)}
                  style={{ maxWidth: 180 }}
                />
                <RangePicker
                  showTime
                  value={dateRange}
                  onChange={(vals) => setDateRange(vals)}
                />
              </div>
            </div>

            {/* Table */}
            <Table
              rowKey="id"
              columns={columns}
              dataSource={filteredRows}
              loading={loading}
              onChange={onTableChange}
              pagination={{
                current: meta.page,
                pageSize: meta.size,
                total: meta.total,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20", "50", "100"],
                showTotal: (t) => `Total ${t} logs`,
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </div>
      </section>

      {/* Drawer détails */}
      <Drawer
        title={`Log #${activeLog?.id ?? ""}`}
        width={720}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        destroyOnClose
      >
        {!activeLog ? (
          <Text type="secondary">Sélectionnez un log…</Text>
        ) : (
          <>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Date">
                {activeLog.createdAt ? new Date(activeLog.createdAt).toLocaleString() : "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Événement">{activeLog.event || "—"}</Descriptions.Item>
              <Descriptions.Item label="Status">{activeLog.status || "—"}</Descriptions.Item>
              <Descriptions.Item label="Actor ID / Ident.">
                {(activeLog.actorId ?? "—") + " / " + (activeLog.actor ?? "—")}
              </Descriptions.Item>
              <Descriptions.Item label="Méthode">{activeLog.httpMethod || "—"}</Descriptions.Item>
              <Descriptions.Item label="Route">{activeLog.route || "—"}</Descriptions.Item>
              <Descriptions.Item label="Path">{activeLog.path || "—"}</Descriptions.Item>
              <Descriptions.Item label="IP">{activeLog.ip || "—"}</Descriptions.Item>
              <Descriptions.Item label="User-Agent">
                <div style={{ whiteSpace: "pre-wrap" }}>{activeLog.userAgent || "—"}</div>
              </Descriptions.Item>
              <Descriptions.Item label="Request ID">{activeLog.requestId || "—"}</Descriptions.Item>
              <Descriptions.Item label="Correlation ID">{activeLog.correlationId || "—"}</Descriptions.Item>
              <Descriptions.Item label="Entity">
                {(activeLog.entityClass || "—") + " / " + (activeLog.entityId || "—")}
              </Descriptions.Item>
              <Descriptions.Item label="Message">
                <div style={{ whiteSpace: "pre-wrap" }}>{activeLog.message || "—"}</div>
              </Descriptions.Item>
            </Descriptions>

            {/* JSON payloads */}
            <div className="mt-4">
              <Title level={5}>Payload</Title>
              <pre className="bg-gray-50 p-3 rounded overflow-auto" style={{ maxHeight: 240 }}>
                {JSON.stringify(activeLog.payload ?? {}, null, 2)}
              </pre>
            </div>
            <div className="mt-4">
              <Title level={5}>Changes</Title>
              <pre className="bg-gray-50 p-3 rounded overflow-auto" style={{ maxHeight: 240 }}>
                {JSON.stringify(activeLog.changes ?? {}, null, 2)}
              </pre>
            </div>
            <div className="mt-4">
              <Title level={5}>Metadata</Title>
              <pre className="bg-gray-50 p-3 rounded overflow-auto" style={{ maxHeight: 240 }}>
                {JSON.stringify(activeLog.metadata ?? {}, null, 2)}
              </pre>
            </div>
          </>
        )}
      </Drawer>
    </>
  );
}
