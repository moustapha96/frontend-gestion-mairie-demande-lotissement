// import React, { useEffect, useState } from "react";
// import { Table, Card, Button, Form, Input, InputNumber, Select, message, Popconfirm } from "antd";
// import { PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
// import { Link, useNavigate } from "react-router-dom";
// import { AdminBreadcrumb } from "@/components";
// import { getTitres, deleteTitre } from "@/services/titreFoncierService";
// import { getLocalites } from "@/services/localiteService";
// import { useAuthContext } from "@/context";

// const AdminTitresList = () => {
//     const [form] = Form.useForm();
//     const { user } = useAuthContext();
//     console.log(user, user.roles.includes("ROLE_SUPER_ADMIN"))
//     const navigate = useNavigate();
//     const [rows, setRows] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [localites, setLocalites] = useState([]);
//     const [page, setPage] = useState(1);
//     const [pageSize, setPageSize] = useState(10);
//     const [total, setTotal] = useState(0);
//     const [q, setQ] = useState({ numero: "",  quartierId: null, superficieMin: null, superficieMax: null });

//     useEffect(() => {
//         (async () => {
//             try {
//                 const ls = await getLocalites();
//                 setLocalites(ls);
//             } catch { }
//         })();
//     }, []);

//     const fetchData = async (keepPage = true) => {
//         try {
//             setLoading(true);
//             const params = {
//                 page: keepPage ? page : 1,
//                 pageSize,
//                 ...q,
//                 sortField: "id",
//                 sortOrder: "DESC",
//             };
//             const { success, items, total: t } = await getTitres(params);
//             if (!success) throw new Error();
//             setRows(items || []);
//             setTotal(t || 0);
//             if (!keepPage) setPage(1);
//         } catch (e) {
//             message.error("Erreur de chargement.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => { fetchData(true); }, [page, pageSize]); // changement de pagination

//     useEffect(() => { fetchData(true); }, []); // initial

//     const columns = [
//         { title: "Type", dataIndex: "type", width: 80 },
//         { title: "Numéro", dataIndex: "numero" },
//         { title: "Superficie (m²)", dataIndex: "superficie", width: 140 },
//         { title: "Quartier", dataIndex: ["quartier", "nom"], render: (_, r) => r.quartier?.nom || "—" },
//         {
//             title: "Actions",
//             key: "actions",
//             fixed: "right",
//             width: 160,
//             render: (_, r) => (
//                 <div className="flex gap-2">
//                     <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/titres/${r.id}/edit`)}>Éditer</Button>

//                     {user && (user.roles.includes("ROLE_ADMIN") || user.roles.includes("ROLE_SUPER_ADMIN") ||
//                         user.roles.includes("ROLE_MAIRE")
//                     ) && (

//                             <Popconfirm
//                                 title="Êtes-vous sûr de vouloir supprimer ?"
//                                 onConfirm={() => onDelete(r.id)}
//                                 okText="Oui"
//                                 cancelText="Non"
//                             >
//                                 <Button danger icon={<DeleteOutlined />} />
//                             </Popconfirm>
//                         )}


//                 </div>
//             ),
//         },
//     ];

//     const onDelete = async (id) => {
//         try {
//             await deleteTitre(id);
//             message.success("Supprimé.");
//             fetchData(true);
//         } catch {
//             message.error("Suppression impossible.");
//         }
//     };

//     return (
//         <>
//             <AdminBreadcrumb title="Titres fonciers" />
//             <section>
//                 <div className="container mx-auto px-4">
//                     <div className="my-6 space-y-6">
//                         <Card>
//                             <div className="flex justify-between items-center mb-4">
//                                 <h3 className="text-lg font-semibold">Patrimoine foncier de la Mairie</h3>
//                                 <Link to="/admin/titres/new">
//                                     <Button className="text-primary" icon={<PlusOutlined />}>Nouveau titre</Button>
//                                 </Link>
//                             </div>

//                             <Form
//                                 form={form}
//                                 layout="inline"
//                                 onFinish={() => fetchData(false)}
//                                 className="flex flex-wrap gap-3 mb-4"
//                             >

//                                 {/* <Form.Item
//                                     name="type"
//                                     label="Type de titre"
//                                     rules={[{ required: true, message: "Le type est requis" }]}
//                                 >
//                                     <Select>
//                                         <Option value="Bail">Bail</Option>
//                                         <Option value="Titre foncier">Titre foncier</Option>
//                                         <Option value="Place publique">Place publique</Option>
//                                         <Option value="Domaine état">Domaine état</Option>
//                                     </Select>
//                                 </Form.Item> */}

//                                 <Form.Item label="Numéro">
//                                     <Input
//                                         allowClear
//                                         placeholder="Ex: TF-2025-001"
//                                         onChange={(e) => setQ(s => ({ ...s, numero: e.target.value }))}
//                                     />
//                                 </Form.Item>

//                                 <Form.Item label="Quartier">
//                                     <Select
//                                         allowClear
//                                         style={{ minWidth: 200 }}
//                                         placeholder="Sélectionner"
//                                         options={localites.map(l => ({ label: l.nom, value: l.id }))}
//                                         onChange={(v) => setQ(s => ({ ...s, quartierId: v || null }))}
//                                     />
//                                 </Form.Item>

//                                 <Button htmlType="submit" loading={loading} className="text-primary" icon={<SearchOutlined />}>Rechercher</Button>
//                             </Form>

//                             <Table
//                                 rowKey="id"
//                                 columns={columns}
//                                 dataSource={rows}
//                                 loading={loading}
//                                 scroll={{ x: 'max-content' }}
//                                 pagination={{
//                                     current: page,
//                                     pageSize,
//                                     total,
//                                     showSizeChanger: true,
//                                     showTotal: (t) => `Total ${t} titre(s)`,
//                                     onChange: (p, ps) => { setPage(p); setPageSize(ps); },
//                                 }}
//                             />
//                         </Card>
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// };

// export default AdminTitresList;







import React, { useEffect, useState } from "react";
import { Table, Card, Button, Form, Input, InputNumber, Select, message, Popconfirm } from "antd";
import { PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined, LinkOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { AdminBreadcrumb } from "@/components";
import { getTitres, deleteTitre } from "@/services/titreFoncierService";
import { getLocalites } from "@/services/localiteService";
import { useAuthContext } from "@/context";

const { Option } = Select;

const AdminTitresList = () => {
  const [form] = Form.useForm();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localites, setLocalites] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [q, setQ] = useState({
    numero: "",
    quartierId: null,
    superficieMin: null,
    superficieMax: null,
    type: undefined,
  });

  useEffect(() => {
    (async () => {
      try {
        const ls = await getLocalites();
        setLocalites(ls);
      } catch { }
    })();
  }, []);

  const fetchData = async (keepPage = true) => {
    try {
      setLoading(true);
      const params = {
        page: keepPage ? page : 1,
        pageSize,
        ...q,
        sortField: "id",
        sortOrder: "DESC",
      };
      const { success, items, total: t } = await getTitres(params);
      console.log(items);
      if (!success) throw new Error();
      setRows(items || []);
      setTotal(t || 0);
      if (!keepPage) setPage(1);
    } catch (e) {
      message.error("Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(true); }, [page, pageSize]); // pagination
  useEffect(() => { fetchData(true); }, []); // initial

  const onDelete = async (id) => {
    try {
      await deleteTitre(id);
      message.success("Supprimé.");
      fetchData(true);
    } catch {
      message.error("Suppression impossible.");
    }
  };

  const columns = [
    { title: "Type", dataIndex: "type", width: 140 },
    { title: "Numéro", dataIndex: "numero" },
    { title: "Superficie (m²)", dataIndex: "superficie", width: 140 },
    { title: "Quartier", dataIndex: ["quartier", "nom"], render: (_, r) => r.quartier?.nom || "—" },
    {
      title: "Fichier",
      dataIndex: "fichier",
      width: 140,
      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noreferrer">
            <Button size="small" icon={<LinkOutlined />}>Ouvrir</Button>
          </a>
        ) : "—",
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 170,
      render: (_, r) => (
        <div className="flex gap-2">
          <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/titres/${r.id}/edit`)}>Éditer</Button>

          {user && (user.roles?.includes("ROLE_ADMIN") || user.roles?.includes("ROLE_SUPER_ADMIN") || user.roles?.includes("ROLE_MAIRE")) && (
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer ?"
              onConfirm={() => onDelete(r.id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminBreadcrumb title="Titres fonciers" />
      <section>
        <div className="container ">
          <div className="my-6 space-y-6">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Patrimoine foncier de la Mairie</h3>
                <Link to="/admin/titres/new">
                  <Button className="text-primary" icon={<PlusOutlined />}>Nouveau titre</Button>
                </Link>
              </div>

              <Form form={form} layout="inline" onFinish={() => fetchData(false)} className="flex flex-wrap gap-3 mb-4">
                <Form.Item label="Type">
                  <Select
                    allowClear
                    style={{ minWidth: 180 }}
                    placeholder="Tous"
                    value={q.type}
                    onChange={(v) => setQ(s => ({ ...s, type: v }))}
                  >
                    <Option value="Bail">Bail</Option>
                    <Option value="Titre foncier">Titre foncier</Option>
                    <Option value="Place publique">Place publique</Option>
                    <Option value="Domaine état">Domaine état</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Numéro">
                  <Input
                    allowClear
                    placeholder="Ex: TF-2025-001"
                    onChange={(e) => setQ(s => ({ ...s, numero: e.target.value }))}
                  />
                </Form.Item>

                <Form.Item label="Quartier">
                  <Select
                    allowClear
                    style={{ minWidth: 200 }}
                    placeholder="Sélectionner"
                    options={localites.map(l => ({ label: l.nom, value: l.id }))}
                    onChange={(v) => setQ(s => ({ ...s, quartierId: v || null }))}
                  />
                </Form.Item>

                <Button htmlType="submit" loading={loading} className="text-primary" icon={<SearchOutlined />}>Rechercher</Button>
              </Form>

              <Table
                rowKey="id"
                columns={columns}
                dataSource={rows}
                loading={loading}
                scroll={{ x: "max-content" }}
                pagination={{
                  current: page,
                  pageSize,
                  total,
                  showSizeChanger: true,
                  showTotal: (t) => `Total ${t} titre(s)`,
                  onChange: (p, ps) => { setPage(p); setPageSize(ps); },
                }}
              />
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminTitresList;
