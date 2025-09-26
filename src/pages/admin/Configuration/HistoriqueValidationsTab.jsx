function HistoriqueValidationsTab() {
    const [form] = Form.useForm();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({ demandeId: null, validateurId: null, action: null, from: null, to: null });

    const fetchData = async (keepPage = true) => {
        try {
            setLoading(true);
            const params = {
                page: keepPage ? page : 1,
                pageSize,
                ...filters,
                from: filters.from || undefined,
                to: filters.to || undefined,
            };
            const { success, items, total: t } = await getHistoriques(params);
            if (!success) throw new Error();
            setRows(items || []);
            setTotal(t || 0);
            if (!keepPage) setPage(1);
        } catch {
            // ignore toast central ici
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(true); }, [page, pageSize]);
    useEffect(() => { fetchData(true); }, []);

    const columns = [
        { title: "Date", dataIndex: "dateAction", width: 170 },
        {
            title: "Action", dataIndex: "action", width: 110,
            render: (s) => <Tag color={s === "validé" ? "green" : "red"}>{s}</Tag>
        },
        { title: "Demande", dataIndex: ["demande", "id"], width: 110 },
        { title: "Validateur", dataIndex: ["validateur", "fullName"] },
        { title: "Email", dataIndex: ["validateur", "email"] },
        { title: "Motif", dataIndex: "motif", ellipsis: true },
    ];

    return (
        <>
            <Form
                form={form}
                layout="inline"
                onFinish={() => fetchData(false)}
                className="flex flex-wrap gap-3 mb-4"
            >
                <Form.Item label="Demande ID">
                    <Input placeholder="ex: 123" onChange={(e) => setFilters(s => ({ ...s, demandeId: e.target.value || null }))} />
                </Form.Item>
                <Form.Item label="Validateur ID">
                    <Input placeholder="ex: 5" onChange={(e) => setFilters(s => ({ ...s, validateurId: e.target.value || null }))} />
                </Form.Item>
                <Form.Item label="Action">
                    <Select allowClear style={{ minWidth: 140 }}
                        onChange={(v) => setFilters(s => ({ ...s, action: v || null }))}
                        options={[{ value: "validé", label: "validé" }, { value: "rejeté", label: "rejeté" }]}
                    />
                </Form.Item>
                <Form.Item label="Du">
                    <DatePicker onChange={(d) => setFilters(s => ({ ...s, from: d ? d.format("YYYY-MM-DD") : null }))} />
                </Form.Item>
                <Form.Item label="Au">
                    <DatePicker onChange={(d) => setFilters(s => ({ ...s, to: d ? d.format("YYYY-MM-DD") : null }))} />
                </Form.Item>
                <Button icon={<SearchOutlined />} htmlType="submit">Rechercher</Button>
            </Form>

            <Table
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={rows}
                scroll={{ x: 'max-content' }}
                pagination={{
                    current: page, pageSize, total, showSizeChanger: true,
                    showTotal: (t) => `Total ${t} enregistrement(s)`,
                    onChange: (p, ps) => { setPage(p); setPageSize(ps); }
                }}
            />
        </>
    );
}
