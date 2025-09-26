import React, { useState, useEffect } from "react";
import {
    Table,
    Card,
    Space,
    Button,
    Typography,
    Select,
    Modal,
    Form,
    Input,
    message,
} from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { AdminBreadcrumb } from "@/components";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getArticles,
    createArticle,
    updateArticle,
    deleteArticle,
} from "@/services/articleService";

const { Title } = Typography;
const { Option } = Select;

const AgentArticlePage = () => {
    const [categories, setCategories] = useState([]);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [modalType, setModalType] = useState(""); // 'category' or 'article'
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData);
                const articlesData = await getArticles();
                setArticles(articlesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const showModal = (item = null, type) => {
        setModalType(type);
        setEditingItem(item);
        if (item) {
            form.setFieldsValue(item);
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingItem(null);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        try {
            if (modalType === "category") {
                if (editingItem) {
                    await updateCategory(editingItem.id, values);
                    message.success("Catégorie mise à jour avec succès");
                } else {
                    await createCategory(values);
                    message.success("Catégorie ajoutée avec succès");
                }
            } else if (modalType === "article") {
                if (editingItem) {
                    await updateArticle(editingItem.id, values);
                    message.success("Article mis à jour avec succès");
                } else {
                    await createArticle(values);
                    message.success("Article ajouté avec succès");
                }
            }
            setIsModalVisible(false);
            const updatedCategories = await getCategories();
            setCategories(updatedCategories);
            const updatedArticles = await getArticles();
            setArticles(updatedArticles);
        } catch (error) {
            message.error("Erreur lors de l'ajout ou de la modification");
        }
    };

    const handleDelete = async (id, type) => {
        try {
            if (type === "category") {
                await deleteCategory(id);
                message.success("Catégorie supprimée avec succès");
            } else if (type === "article") {
                await deleteArticle(id);
                message.success("Article supprimé avec succès");
            }
            const updatedCategories = await getCategories();
            setCategories(updatedCategories);
            const updatedArticles = await getArticles();
            setArticles(updatedArticles);
        } catch (error) {
            message.error("Erreur lors de la suppression");
        }
    };

    const categoryColumns = [
        {
            title: "Nom",
            dataIndex: "nom",
            key: "nom",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => showModal(record, "category")}
                    >
                        Modifier
                    </Button>
                    <Button
                        danger
                        onClick={() => handleDelete(record.id, "category")}
                    >
                        Supprimer
                    </Button>
                </Space>
            ),
        },
    ];

    const articleColumns = [
        {
            title: "Titre",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Contenu",
            dataIndex: "content",
            key: "content",
        },
        {
            title: "Catégorie",
            dataIndex: "categorie",
            key: "categorie",
            render: (_, record) => record.categorie.nom,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => showModal(record, "article")}
                    >
                        Modifier
                    </Button>
                    <Button
                        danger
                        onClick={() => handleDelete(record.id, "article")}
                    >
                        Supprimer
                    </Button>
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
            <AdminBreadcrumb title="Gestion des Articles et Catégories" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <Card className="shadow-lg rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <Title level={4}>Catégories</Title>
                                <Button
                                    className="ant-btn-primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => showModal(null, "category")}
                                >
                                    Ajouter une Catégorie
                                </Button>
                            </div>
                            <Table
                                columns={categoryColumns}
                                dataSource={categories.filter((category) =>
                                    category.nom.toLowerCase().includes(searchText.toLowerCase())
                                )}
                                rowKey="id"
                                loading={loading}
                            />
                        </Card>
                        <Card className="shadow-lg rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <Title level={4}>Articles</Title>
                                <Button
                                    className="ant-btn-primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => showModal(null, "article")}
                                >
                                    Ajouter un Article
                                </Button>
                            </div>
                            <Table
                                columns={articleColumns}
                                dataSource={articles.filter((article) =>
                                    article.title.toLowerCase().includes(searchText.toLowerCase())
                                )}
                                rowKey="id"
                                loading={loading}
                            />
                        </Card>
                    </div>
                </div>
            </section>
            <Modal
                title={
                    modalType === "category"
                        ? editingItem
                            ? "Modifier la Catégorie"
                            : "Ajouter une Catégorie"
                        : editingItem
                            ? "Modifier l'Article"
                            : "Ajouter un Article"
                }
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    {modalType === "category" ? (
                        <Form.Item
                            name="nom"
                            label="Nom de la Catégorie"
                            rules={[
                                { required: true, message: "Le nom de la catégorie est requis" },
                            ]}
                        >
                            <Input placeholder="Entrez le nom de la catégorie" />
                        </Form.Item>
                    ) : (
                        <>
                            <Form.Item
                                name="title"
                                label="Titre de l'Article"
                                rules={[
                                    { required: true, message: "Le titre de l'article est requis" },
                                ]}
                            >
                                <Input placeholder="Entrez le titre de l'article" />
                            </Form.Item>
                            <Form.Item
                                name="content"
                                label="Contenu de l'Article"
                                rules={[
                                    { required: true, message: "Le contenu de l'article est requis" },
                                ]}
                            >
                                <Input.TextArea placeholder="Entrez le contenu de l'article" />
                            </Form.Item>
                            <Form.Item
                                name="categorie"
                                label="Catégorie"
                                rules={[
                                    { required: true, message: "La catégorie de l'article est requise" },
                                ]}
                            >
                                <Select placeholder="Sélectionnez une catégorie">
                                    {categories.map((category) => (
                                        <Option key={category.id} value={category.id}>
                                            {category.nom}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </>
                    )}
                    <Form.Item className="text-right">
                        <Space>
                            <Button onClick={handleCancel}>Annuler</Button>
                            <Button className="ant-btn-primary" htmlType="submit">
                                {editingItem ? "Modifier" : "Ajouter"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AgentArticlePage;
