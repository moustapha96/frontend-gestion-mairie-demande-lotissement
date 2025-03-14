import React, { useState, useEffect } from "react";
import { Table, Card, Space, Button, Typography, Select, Input, Modal, Form, message, Result } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { AdminBreadcrumb } from "@/components";
import { getLotissements } from "@/services/lotissementService";
import { createParcelle, getParcelles, getParcellesByLotissement, updateParcelle, updateParcellestatut } from "@/services/parcelleService";
import MapCar from "../../admin/Map/MapCar";
import { formatCoordinates } from "@/utils/formatters";

const { Title } = Typography;
const { Option } = Select;

const AdminParcelle = () => {
    const [form] = Form.useForm();
    const [lotissements, setLotissements] = useState([]);
    const [parcelles, setParcelles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [selectedLotissement, setSelectedLotissement] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isMapModalVisible, setIsMapModalVisible] = useState(false);
    const [selectedParcelle, setSelectedParcelle] = useState(null);
    const [editingParcelle, setEditingParcelle] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const lotissementsData = await getLotissements();
            setLotissements(lotissementsData);
            if (lotissementsData.length > 0) {
                setSelectedLotissement(lotissementsData[0].id);
                const parcellesData = await getParcelles(lotissementsData[0].id);
                setParcelles(parcellesData);
            }
        } catch (err) {
            message.error("Erreur lors du chargement des données");
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLotissementChange = async (value) => {
        setLoading(true);
        setSelectedLotissement(value);
        try {
            const data = await getParcellesByLotissement(value);
            setParcelles(data);
        } catch (err) {
            message.error("Erreur lors du chargement des parcelles");
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const showMapModal = (parcelle = null) => {
        setSelectedParcelle(parcelle);
        setIsMapModalVisible(true);
    };

    const showModal = (parcelle = null) => {
        setEditingParcelle(parcelle);
        if (parcelle) {
            form.setFieldsValue(parcelle);
        } else {
            form.setFieldsValue({
                numero: "",
                superface: "",
                statut: "DISPONIBLE",
                lotissementId: selectedLotissement,
                longitude: "",
                latitude: ""
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
        try {
            if (editingParcelle) {
                await updateParcelle(editingParcelle.id, values);
                message.success("Parcelle mise à jour avec succès");
            } else {
                await createParcelle(values);
                message.success("Parcelle créée avec succès");
            }
            handleCancel();
            const updatedParcelles = await getParcelles(selectedLotissement);
            setParcelles(updatedParcelles);
        } catch (error) {
            message.error("Erreur lors de l'opération");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatut = async (parcelleId, nouveauStatut) => {
        try {
            await updateParcellestatut(parcelleId, nouveauStatut);
            const updatedParcelles = parcelles.map(parcelle => 
                parcelle.id === parcelleId 
                    ? { ...parcelle, statut: nouveauStatut }
                    : parcelle
            );
            setParcelles(updatedParcelles);
            message.success("Statut mis à jour avec succès");
        } catch (error) {
            message.error("Erreur lors de la mise à jour du statut");
        }
    };

    const columns = [
        {
            title: "Numéro",
            dataIndex: "numero",
            key: "numero",
            sorter: (a, b) => a.numero.localeCompare(b.numero)
        },
        {
            title: "Superficie",
            dataIndex: "superface",
            key: "superface",
            render: (superface) => `${superface} m²`
        },
        {
            title: "Coordonnées",
            key: "coordinates",
            render: (_, record) => (
                <Button 
                    icon={<EnvironmentOutlined />}
                    onClick={() => showMapModal(record)}
                >
                    Voir sur la carte
                </Button>
            )
        },
        {
            title: "Statut",
            dataIndex: "statut",
            key: "statut",
            render: (statut, record) => (
                <Select
                    value={statut}
                    onChange={(value) => handleUpdateStatut(record.id, value)}
                    style={{ width: 130 }}
                >
                    <Option value="DISPONIBLE">Disponible</Option>
                    <Option value="OCCUPE">Occupé</Option>
                    <Option value="EN_COURS">En cours</Option>
                </Select>
            ),
            filters: [
                { text: "Disponible", value: "DISPONIBLE" },
                { text: "Occupé", value: "OCCUPE" },
                { text: "En cours", value: "EN_COURS" }
            ],
            onFilter: (value, record) => record.statut === value
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
                </Space>
            )
        }
    ];

    if (error) {
        return (
            <Result
                status="error"
                title="Erreur"
                subTitle={error}
            />
        );
    }

    const filteredParcelles = parcelles.filter(parcelle =>
        parcelle.numero.toLowerCase().includes(searchText.toLowerCase()) ||
        parcelle.statut.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <>
            <AdminBreadcrumb title="Liste des Parcelles" />
            <div className="container my-6">
                <Card className="shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <Title level={4}>Liste des Parcelles</Title>
                        <Button
                            className="text-primary"
                            icon={<PlusOutlined />}
                            onClick={() => showModal()}
                        >
                            Ajouter une parcelle
                        </Button>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <Select
                            style={{ width: 200 }}
                            value={selectedLotissement}
                            onChange={handleLotissementChange}
                            placeholder="Sélectionner un lotissement"
                        >
                            {lotissements.map(lotissement => (
                                <Option key={lotissement.id} value={lotissement.id}>
                                    {lotissement.nom}
                                </Option>
                            ))}
                        </Select>

                        <Input
                            placeholder="Rechercher..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 200 }}
                        />
                    </div>

                    <Table
                        columns={columns}
                        dataSource={filteredParcelles}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} parcelles`
                        }}
                    />

                    <Modal
                        title={editingParcelle ? "Modifier la parcelle" : "Ajouter une parcelle"}
                        open={isModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{
                                lotissementId: selectedLotissement,
                                statut: "DISPONIBLE"
                            }}
                        >
                            <Form.Item
                                name="numero"
                                label="Numéro"
                                rules={[{ required: true, message: "Le numéro est requis" }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="superface"
                                label="Superficie (m²)"
                                rules={[{ required: true, message: "La superficie est requise" }]}
                            >
                                <Input type="number" />
                            </Form.Item>

                            <Form.Item
                                name="longitude"
                                label="Longitude"
                                rules={[{ required: true, message: "La longitude est requise" }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="latitude"
                                label="Latitude"
                                rules={[{ required: true, message: "La latitude est requise" }]}
                            >
                                <Input />
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
                                </Select>
                            </Form.Item>

                            <Form.Item name="lotissementId" hidden>
                                <Input />
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

                    <Modal
                        title="Carte de la parcelle"
                        open={isMapModalVisible}
                        onCancel={handleCancel}
                        width={800}
                        footer={null}
                    >
                        {selectedParcelle && (
                            <MapCar
                                latitude={selectedParcelle.latitude}
                                longitude={selectedParcelle.longitude}
                            />
                        )}
                    </Modal>
                </Card>
            </div>
        </>
    );
};

export default AdminParcelle;
