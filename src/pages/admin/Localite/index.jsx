import React, { useEffect, useState } from "react";
import { Table, Input, Card, Space, Button, Typography } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { AdminBreadcrumb } from "@/components";
import { getLocalites } from "@/services/localiteService";
import { formatCoordinates, formatPrice } from "@/utils/formatters";

const { Title } = Typography;

const AdminLocaliteListe = () => {
    const [loading, setLoading] = useState(false);
    const [localites, setLocalites] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocalite = async () => {
            setLoading(true);
            try {
                const resp = await getLocalites();
                setLocalites(resp);
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLocalite();
    }, []);

    const columns = [
        {
            title: "Nom",
            dataIndex: "nom",
            key: "nom",
            sorter: (a, b) => a.nom.localeCompare(b.nom),
        },
        {
            title: "Coordonnées",
            key: "coordonnees",
            render: (_, record) => formatCoordinates(record.latitude, record.longitude),
        },
        {
            title: "Prix",
            key: "prix",
            render: (_, record) => formatPrice(record.prix),
            sorter: (a, b) => a.prix - b.prix,
        },
        {
            title: "Lotissements",
            key: "lotissements",
            render: (_, record) => (
                record.lotissements.length > 0 ? (
                    <Link to={`/admin/localites/${record.id}/lotissements`}  className="text-primary" >
                        {record.lotissements.length} Lotissement(s)
                    </Link>
                ) : (
                    <Link to={`/admin/localites/${record.id}/lotissements/nouveau`}>
                        <Button className="text-primary" icon={<PlusOutlined />}>
                            Ajouter
                        </Button>
                    </Link>
                )
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                   
                    <Link to={`/admin/localites/${record.id}/details`}>
                        <Button 
                            className="text-primary" 
                            icon={<EyeOutlined />}
                            title="Détails"
                        />
                    </Link>

                    <Link to={`/admin/localites/${record.id}/modification`}>
                        <Button 
                            className="text-primary"
                            icon={<EditOutlined />}
                            title="Modifier"
                        />
                    </Link>
                </Space>
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

            </div>
           
            <Card className="shadow-lg rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <Title level={4}>Liste des localités</Title>
                    <Link to="/admin/localites/nouvelle">
                        <Button className="text-primary" icon={<PlusOutlined />}>
                            Ajouter une localité
                        </Button>
                    </Link>
                </div>

                <Input
                    placeholder="Rechercher par nom ou description..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 300, marginBottom: 16 }}
                />

                <Table
                    columns={columns}
                    dataSource={localites.filter(
                        (item) =>
                            item.nom.toLowerCase().includes(searchText.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchText.toLowerCase())
                    )}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        defaultPageSize: 5,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} localités`,
                    }}
                />
            </Card>
            </div>
        </div>
      </section>
        </>
    );
};

export default AdminLocaliteListe;
