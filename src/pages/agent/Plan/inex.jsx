

import React, { useState, useEffect } from "react";
import { Table, Card, Space, Button, Typography, Input, Modal, Form, message, Result, Upload, Select } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";

import { getLotissements } from "@/services/lotissementService";
import { createPlanLotissement, getFileDocumentPlan, getPlanLotissements, updatePlanLotissement } from "@/services/planLotissement";
import { Link } from "react-router-dom";
import { LucideFileText } from "lucide-react";
import { AdminBreadcrumb, AgentBreadcrumb } from "@/components"

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AgentPlan = () => {
    const [form] = Form.useForm();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lotissements, setLotissements] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isViewerVisible, setIsViewerVisible] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [fileLoading, setFileLoading] = useState(false);
    const [currentDocument, setCurrentDocument] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [lotissementsData, plansData] = await Promise.all([
                getLotissements(),
                getPlanLotissements()
            ]);
            setLotissements(lotissementsData);
            setPlans(plansData);
        } catch (err) {
            message.error("Erreur lors du chargement des données");
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDocument = async (plan) => {
        setFileLoading(true);
        try {
            const fileContent = await getFileDocumentPlan(plan.id);
            setCurrentDocument(fileContent);
            setIsViewerVisible(true);
        } catch (error) {
            message.error("Erreur lors du chargement du fichier");
        } finally {
            setFileLoading(false);
        }
    };

    const showModal = (plan = null) => {
        setEditingPlan(plan);
        if (plan) {
            form.setFieldsValue(plan);
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsViewerVisible(false);
        setEditingPlan(null);
        setSelectedFile(null);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("description", values.description);
        formData.append("version", values.version);
        formData.append("lotissementId", values.lotissementId);

        if (selectedFile) {
            formData.append("document", selectedFile);
            formData.append("url", URL.createObjectURL(selectedFile));
        }

        try {
            if (editingPlan) {
                await updatePlanLotissement(editingPlan.id, formData);
                message.success("Plan mis à jour avec succès");
            } else {
                await createPlanLotissement(formData);
                message.success("Plan ajouté avec succès");
            }
            handleCancel();
            fetchData();
        } catch (error) {
            message.error("Erreur lors de l'opération");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            sorter: (a, b) => a.description.localeCompare(b.description),
            ellipsis: true
        },
        {
            title: "Version",
            dataIndex: "version",
            key: "version",
            width: 120
        },
        {
            title: "Date de Création",
            key: "dateCreation",
            width: 150,
            render: (_, record) => new Date(record.dateCreation).toLocaleDateString()
        },
        {
            title: "Lotissement",
            dataIndex: ["lotissement", "nom"],
            key: "lotissement",
            ellipsis: true,
            render: (_, record) => (
                <Link
                    className="text-primary"
                    to={`/agent/lotissements/${record.lotissement.id}/details`} >
                    {record.lotissement.nom}
                </Link>
            )
        },
        {
            title: "Actions",
            key: "actions",
            width: 200,
            render: (_, record) => (
                <Space>
                    {/* <Button
                        className="text-primary"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDocument(record)}
                        loading={fileLoading && currentDocument?.id === record.id}
                    >
                        Voir
                    </Button> */}

                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDocument(record)}
                        className="text-primary hover:text-primary-light flex items-center"
                    >
                        <span>Voir</span>
                    </Button>

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
                title="Erreur lors du chargement"
                subTitle={error}
            />
        );
    }

    const filteredPlans = plans.filter(plan =>
        plan.description.toLowerCase().includes(searchText.toLowerCase()) ||
        plan.lotissement?.nom.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <>
            <AgentBreadcrumb title="Liste des Plans de Lotissement" />
            <div className="container my-6">
                <Card className="shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <Title level={4}>Plans de lotissement</Title>
                        <Button
                            className="text-primary"
                            icon={<PlusOutlined />}
                            onClick={() => showModal()}
                        >
                            Ajouter un Plan
                        </Button>
                    </div>

                    <div className="mb-4">
                        <Input
                            placeholder="Rechercher par description ou lotissement..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 300 }}
                            allowClear
                        />
                    </div>

                    <Table
                        scroll={{ x: 'max-content' }}
                        columns={columns}
                        dataSource={filteredPlans}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            defaultPageSize: 5,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} plans`,
                            showQuickJumper: true
                        }}
                    />

                    <Modal
                        title={editingPlan ? "Modifier le plan" : "Ajouter un plan"}
                        open={isModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                        width={600}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{
                                lotissementId: editingPlan ? editingPlan.lotissement.id : "",
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
                                <Select placeholder="Sélectionner un lotissement">
                                    {lotissements.map(lot => (
                                        <Option key={lot.id} value={lot.id} selected={editingPlan?.lotissement.id === lot.id}>
                                            {lot.nom}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Document"
                                rules={[{ required: !editingPlan, message: "Le document est requis" }]}
                            >
                                <Upload
                                    beforeUpload={(file) => {
                                        setSelectedFile(file);
                                        return false;
                                    }}
                                    maxCount={1}
                                >
                                    <Button icon={<UploadOutlined />}>Sélectionner un fichier</Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item className="flex justify-end">
                                <Space>
                                    <Button onClick={handleCancel}>Annuler</Button>
                                    <Button className="text-primary" htmlType="submit" loading={loading}>
                                        {editingPlan ? "Modifier" : "Ajouter"}
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title="Visualisation du plan"
                        open={isViewerVisible}
                        onCancel={handleCancel}
                        width={800}
                        footer={null}
                    >
                        {fileLoading ? (
                            <div className="flex justify-center items-center p-8">
                                <span>Chargement du document...</span>
                            </div>
                        ) : (
                            currentDocument && (
                                <div className="w-full">
                                    <iframe
                                        src={`data:application/pdf;base64,${currentDocument}`}
                                        width="100%"
                                        height="600px"
                                        title="Document PDF"
                                        className="border rounded"
                                    />
                                </div>
                            )
                        )}
                    </Modal>
                </Card>
            </div>
        </>
    );
};

export default AgentPlan;







