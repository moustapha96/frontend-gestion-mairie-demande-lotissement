

import React, { useState, useEffect } from "react";
import { Table, Input, Card, Tag, Space, Button, Modal, Typography, Select, Form, InputNumber, Upload, message } from "antd";
import { SearchOutlined, PlusOutlined, FileTextOutlined, UploadOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getLotissements, updateLotissementStatut } from "@/services/lotissementService";
import { useAuthContext } from "@/context";
import { createLot } from "@/services/lotsService";
import { createPlanLotissement } from "@/services/planLotissement";
import { toast } from "sonner";
import { AgentBreadcrumb } from "@/components";
const { Title, Text } = Typography;
const { TextArea } = Input;

const AgentLotissementListe = () => {
    const { user } = useAuthContext();
    const [lotissements, setLotissements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [planModalVisible, setPlanModalVisible] = useState(false);

    const [selectedLotissement, setSelectedLotissement] = useState(null);
    const [form] = Form.useForm();
    const [planForm] = Form.useForm();
    const [planFile, setPlanFile] = useState(null);

    useEffect(() => {
        fetchLotissements();
    }, [user.id]);

    const fetchLotissements = async () => {
        try {
            const data = await getLotissements();
            console.log(data);
            setLotissements(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatut = async (lotissementId, nouveauStatut) => {
        try {
            await updateLotissementStatut(lotissementId, nouveauStatut);
            const updatedLotissements = lotissements.map(lotissement => {
                if (lotissement.id === lotissementId) {
                    return { ...lotissement, statut: nouveauStatut };
                }
                return lotissement;
            });
            setLotissements(updatedLotissements);
            message.success("Statut mis à jour avec succès");
        } catch (error) {
            message.error("Erreur lors de la mise à jour du statut");
        }
    };

    const handleOpenModal = (lotissement) => {
        setSelectedLotissement(lotissement);
        form.setFieldsValue({
            numeroLot: "",
            superficie: "",
            statut: "DISPONIBLE",
            prix: "",
            usage: "",
            lotissementId: lotissement.id
        });
        setModalVisible(true);
    };

    const handleOpenPlanModal = (lotissement) => {
        setSelectedLotissement(lotissement);
        planForm.setFieldsValue({
            description: "",
            version: "",
            lotissementId: lotissement.id
        });
        setPlanModalVisible(true);
    };



    const handleLotSubmit = async (values) => {
        try {
            await createLot({
                ...values,
                lotissementId: selectedLotissement.id
            });
            message.success("Lot ajouté avec succès");
            fetchLotissements();
            setModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error("Erreur lors de l'ajout du lot");
        }
    };

    const handlePlanSubmit = async (values) => {
        if (!planFile) {
            message.error("Veuillez sélectionner un fichier");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("description", values.description);
            formData.append("version", values.version);
            formData.append("lotissementId", selectedLotissement.id);
            formData.append("document", planFile);

            await createPlanLotissement(formData);
            message.success("Plan ajouté avec succès");
            setPlanModalVisible(false);
            planForm.resetFields();
            setPlanFile(null);
            fetchLotissements();
        } catch (error) {
            message.error("Erreur lors de l'ajout du plan");
        }
    };

    const columns = [
        {
            title: "Localité",
            key: "localite",
            render: (_, record) => (
                <Link to={`/agent/localites/${record.localite.id}/details`}>
                    {record.localite.nom}
                </Link>
            ),
        },
        {
            title: "Nom",
            dataIndex: "nom",
            key: "nom",
            sorter: (a, b) => a.nom.localeCompare(b.nom),
        },
        {
            title: "Localisation",
            dataIndex: "localisation",
            key: "localisation",
        },
        {
            title: "Statut",
            key: "statut",
            render: (_, record) => (
                <Select
                    value={record.statut}
                    onChange={(value) => handleUpdateStatut(record.id, value)}
                    style={{ width: 120 }}
                >
                    <Select.Option value="en_cours">En cours</Select.Option>
                    <Select.Option value="acheve">Achevé</Select.Option>
                    <Select.Option value="rejete">Rejeté</Select.Option>
                </Select>
            ),
        },
        {
            title: "Lots",
            key: "lots",
            render: (_, record) => (
                record.lots.length > 0 ? <>
                    <Link to={`/agent/lotissements/${record.id}/lots`}>
                        {record.lots.length} Lots
                    </Link>
                </> : <>
                    <Button
                        className="text-primary"
                        icon={<PlusOutlined />}
                        onClick={() => handleOpenModal(record)}
                    >
                        Ajouter Lot
                    </Button>
                </>
            ),
        },
        {
            title: "Plans",
            key: "plans",
            render: (_, record) => (
                record.planLotissements.length > 0 ? (
                    <Link to={`/agent/lotissements/${record.id}/plans`}>
                        {record.planLotissements.length} Plans
                    </Link>
                ) : (
                    <Button
                        className="text-primary"
                        icon={<UploadOutlined />}
                        onClick={() => handleOpenPlanModal(record)}
                    >
                        Ajouter Plan
                    </Button>
                )
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Link to={`/agent/lotissements/${record.id}/details`}>
                        <Button className="text-primary" icon={<EyeOutlined />}>
                            Détails
                        </Button>
                    </Link>
                    <Link to={`/agent/lotissements/${record.id}/modification`}>
                        <Button className="text-primary" icon={<EditOutlined />}>
                            Modifier
                        </Button>
                    </Link>
                </Space>
            ),
        },
    ];

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-600">
                Erreur: {error}
            </div>
        );
    }

    return (
        <>
            <AgentBreadcrumb title="Liste des Lotissements" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="grid grid-cols-1">
                            <Card className="shadow-lg rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <Title level={4}>Liste des lotissements</Title>
                                    <Link to="/agent/lotissements/nouveau">
                                        <Button className="text-primary" icon={<PlusOutlined />}>
                                            Ajouter
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
                                    scroll={{ x: 'max-content' }}
                                    columns={columns}
                                    dataSource={lotissements.filter(
                                        (item) =>
                                            item.nom.toLowerCase().includes(searchText.toLowerCase()) ||
                                            item.description.toLowerCase().includes(searchText.toLowerCase())
                                    )}
                                    rowKey="id"
                                    loading={loading}
                                    pagination={{
                                        defaultPageSize: 5,
                                        showSizeChanger: true,
                                        showTotal: (total) => `Total ${total} lotissements`,
                                    }}
                                />

                                <Modal
                                    title={
                                        <div>
                                            <Text strong>Ajouter un iLot</Text>
                                            <Text type="secondary" style={{ display: 'block' }}>
                                                Lotissement: {selectedLotissement?.nom}
                                            </Text>
                                        </div>
                                    }
                                    open={modalVisible}
                                    onCancel={() => setModalVisible(false)}
                                    footer={null}
                                    width={800}
                                >
                                    <Form
                                        form={form}
                                        layout="vertical"
                                        onFinish={handleLotSubmit}
                                    >
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                            <Form.Item
                                                name="numeroLot"
                                                label="Numéro du iLot"
                                                rules={[{ required: true, message: 'Champ requis' }]}
                                            >
                                                <Input />
                                            </Form.Item>

                                            <Form.Item
                                                name="superficie"
                                                label="Superficie (m²)"
                                                rules={[{ required: true, message: 'Champ requis' }]}
                                            >
                                                <InputNumber style={{ width: '100%' }} min={0} />
                                            </Form.Item>

                                            <Form.Item
                                                name="prix"
                                                label="Prix (FCFA)"
                                                rules={[{ required: true, message: 'Champ requis' }]}
                                            >
                                                <InputNumber style={{ width: '100%' }} min={0} />
                                            </Form.Item>

                                            <Form.Item
                                                name="statut"
                                                label="Statut"
                                                rules={[{ required: true, message: 'Champ requis' }]}
                                            >
                                                <Select>
                                                    <Select.Option value="DISPONIBLE">Disponible</Select.Option>
                                                    <Select.Option value="OCCUPE">Occupé</Select.Option>
                                                    <Select.Option value="RESERVER">Réservé</Select.Option>
                                                    <Select.Option value="VENDU">Vendu</Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </div>

                                        <Form.Item
                                            name="usage"
                                            label="Usage prévu"
                                            rules={[{ required: true, message: 'Champ requis' }]}
                                        >
                                            <TextArea rows={3} />
                                        </Form.Item>

                                        <Form.Item>
                                            <Space>
                                                <Button className="text-primary" htmlType="submit">
                                                    Enregistrer
                                                </Button>
                                                <Button onClick={() => setModalVisible(false)}>
                                                    Annuler
                                                </Button>
                                            </Space>
                                        </Form.Item>
                                    </Form>
                                </Modal>

                                <Modal
                                    title={
                                        <div>
                                            <Text strong>Ajouter un Plan</Text>
                                            <Text type="secondary" style={{ display: 'block' }}>
                                                Lotissement: {selectedLotissement?.nom}
                                            </Text>
                                        </div>
                                    }
                                    open={planModalVisible}
                                    onCancel={() => setPlanModalVisible(false)}
                                    footer={null}

                                >
                                    <Form
                                        form={planForm}
                                        layout="vertical"
                                        onFinish={handlePlanSubmit}
                                    >
                                        <Form.Item
                                            name="description"
                                            label="Description"
                                            rules={[{ required: true, message: 'Champ requis' }]}
                                        >
                                            <TextArea rows={3} />
                                        </Form.Item>

                                        <Form.Item
                                            name="version"
                                            label="Version"
                                            rules={[{ required: true, message: 'Champ requis' }]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Form.Item
                                            label="Fichier"
                                            rules={[{ required: true, message: 'Champ requis' }]}
                                        >
                                            <Upload
                                                beforeUpload={(file) => {
                                                    setPlanFile(file);
                                                    return false;
                                                }}
                                                maxCount={1}
                                            >
                                                <Button icon={<UploadOutlined />}>Sélectionner un fichier</Button>
                                            </Upload>
                                        </Form.Item>

                                        <Form.Item>
                                            <Space>
                                                <Button className="text-primary" htmlType="submit">
                                                    Enregistrer
                                                </Button>
                                                <Button onClick={() => setPlanModalVisible(false)}>
                                                    Annuler
                                                </Button>
                                            </Space>
                                        </Form.Item>
                                    </Form>
                                </Modal>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AgentLotissementListe;
