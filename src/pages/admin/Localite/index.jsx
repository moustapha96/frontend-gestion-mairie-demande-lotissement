import React, { useEffect, useState } from "react";
import { Table, Input, Card, Space, Button, Typography, Form, Modal, Select, Popconfirm, message } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { AdminBreadcrumb } from "@/components";
import { getLocalites } from "@/services/localiteService";
import { formatCoordinates, formatPrice } from "@/utils/formatters";
import TextArea from "antd/es/input/TextArea";
import { updateLocalite, createLocalite } from "@/services/localiteService"
import { getLotissements } from "@/services/lotissementService";

const { Title } = Typography;

const AdminLocaliteListe = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [localites, setLocalites] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [error, setError] = useState(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingLocalite, setEditingLocalite] = useState(null);
   
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

    useEffect(() => {
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
                    <Link to={`/admin/localites/${record.id}/lotissements`} className="text-primary" >
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

                    <Button
                        className="text-primary"
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
                    >
                        Modifier
                    </Button>
{/* 
                    <Popconfirm
                        title="Êtes-vous sûr de vouloir supprimer ce localité ?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />} title="Supprimer" />
                    </Popconfirm> */}

                    {/* <Link to={`/admin/localites/${record.id}/modification`}>
                        <Button
                            className="text-primary"
                            icon={<EditOutlined />}
                            title="Modifier"
                        />
                    </Link> */}
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

    const showModal = (localite = null) => {
        // console.log(localite)
        setEditingLocalite(localite);
        if (localite) {
            form.setFieldsValue(localite);
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingLocalite(null);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        setLoadingModal(true);
        try {
            if (editingLocalite) {
                await updateLocalite(editingLocalite.id, values);
                message.success("Localité mise à jour avec succès");
            } else {
                await createLocalite(values);
                message.success("Localité ajoutée avec succès");
            }
            handleCancel();
            fetchLocalite();
        } catch (error) {
            message.error("Erreur lors de l'opération");
        } finally {
            setLoadingModal(false);
        }
    };

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
                               

                                <Button
                                    className="text-primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => showModal()}
                                >
                                    Ajouter une localité
                                </Button>
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
                                        item.lotissements.map(lotissement => lotissement.nom).includes(searchText.toLowerCase())
                                )}
                                rowKey="id"
                                loading={loading}
                                pagination={{
                                    defaultPageSize: 5,
                                    showSizeChanger: true,
                                    showTotal: (total) => `Total ${total} localités`,
                                }}
                            />

                            <Modal
                                title={editingLocalite ? "Modifier la localité" : "Ajouter une localité"}
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
                                        name="nom"
                                        label="Nom"
                                        rules={[{ required: true, message: "Le nom est requis" }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name="longitude"
                                        label="Longitude"
                                        rules={[{ required: true, message: "La longitude est requise" }]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>

                                    <Form.Item
                                        name="latitude"
                                        label="Latitude"
                                        rules={[{ required: true, message: "La latitude est requise" }]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>

                                    <Form.Item
                                        name="prix"
                                        label="Prix"
                                        rules={[{ required: true, message: "Le prix est requis" }]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>

                                    {/* <Form.Item
                                        name="lotissementId"
                                        label="Lotissement"
                                        rules={[{ required: true, message: "Le lotissement est requis" }]}
                                    >
                                        <Select placeholder="Sélectionner un lotissement">
                                            {lotissements.map(lot => (
                                                <Option key={lot.id} value={lot.id} selected={editingLocalite?.lotissement.id === lot.id}>
                                                    {lot.nom}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item> */}

                                    <Form.Item className="flex justify-end">
                                        <Space>
                                            <Button onClick={handleCancel}>Annuler</Button>
                                            <Button className="text-primary" htmlType="submit" loading={loadingModal}>
                                                {editingLocalite ? "Modifier" : "Ajouter"}
                                            </Button>
                                        </Space>
                                    </Form.Item>

                                </Form>
                            </Modal>
                        </Card>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AdminLocaliteListe;
