import React, { useState, useEffect } from "react";
import { Table, Input, Card, Tag, Space, Button, Modal, Typography, Descriptions } from "antd";
import { SearchOutlined, FileTextOutlined, FileExcelOutlined, FilePdfOutlined } from "@ant-design/icons";
import { getDocumentDemandeur } from "@/services/documentService";
import { useAuthContext } from "@/context";
import { exportToCSV, exportToPDF } from "@/utils/export_function";

const { Title } = Typography;

const DocumentListe = () => {
    const { user } = useAuthContext();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const res = await getDocumentDemandeur(user.id);
                setDocuments(res);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDocuments();
    }, [user.id]);

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-600">
                Erreur: {error}
            </div>
        );
    }

    const columns = [
        {
            title: "Numéro",
            key: "numero",
            render: (_, record) => (
                record.type === 'PERMIS_OCCUPATION'
                    ? record.contenu.numeroPermis
                    : record.contenu.numeroBail
            ),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => (
                <Tag color={type === 'PERMIS_OCCUPATION' ? 'success' : 'processing'}>
                    {type === 'PERMIS_OCCUPATION' ? 'Permis d\'occuper' : 'Bail communal'}
                </Tag>
            ),
            filters: [
                { text: 'Permis d\'occuper', value: 'PERMIS_OCCUPATION' },
                { text: 'Bail communal', value: 'BAIL_COMMUNAL' },
            ],
            onFilter: (value, record) => record.type === value,
        },
        {
            title: "Date de création",
            dataIndex: "dateCreation",
            key: "dateCreation",
            render: (date) => new Date(date).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            sorter: (a, b) => new Date(a.dateCreation) - new Date(b.dateCreation),
        },
        {
            title: "Localité",
            key: "localite",
            render: (_, record) => record.demande.localite.nom,
            filteredValue: [searchText],
            onFilter: (value, record) => {
                return (
                    record.demande.localite.nom.toLowerCase().includes(value.toLowerCase()) ||
                    (record.type === 'PERMIS_OCCUPATION' ? record.contenu.numeroPermis : record.contenu.numeroBail)
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase())
                );
            },
        },
        {
            title: "Superficie",
            key: "superficie",
            render: (_, record) => `${record.contenu.superficie} m²`,
            sorter: (a, b) => a.contenu.superficie - b.contenu.superficie,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<FileTextOutlined />}
                        onClick={() => {
                            setSelectedDocument(record);
                            setModalVisible(true);
                        }}
                    >
                        Détails
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Card className="shadow-lg rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <Title level={4}>Liste des Documents</Title>
                <Space>
                    <Button
                        icon={<FileExcelOutlined />}
                        onClick={() => exportToCSV(documents)}
                    >
                        Exporter CSV
                    </Button>
                    <Button
                        className="text-primary"
                        icon={<FilePdfOutlined />}
                        onClick={() => exportToPDF(documents)}
                    >
                        Exporter PDF
                    </Button>
                </Space>
            </div>

            <div className="mb-4">
                <Input
                    placeholder="Rechercher par numéro ou localité..."
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full max-w-md"
                />
            </div>

            <Table
                columns={columns}
                dataSource={documents}
                rowKey="id"
                loading={loading}
                pagination={{
                    defaultPageSize: 5,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} documents`,
                }}
            />

            <Modal
                title={selectedDocument?.type === 'PERMIS_OCCUPATION' ? 'Détails du Permis d\'occuper' : 'Détails du Bail communal'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={800}
            >
                {selectedDocument && (
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="Numéro">
                            {selectedDocument.type === 'PERMIS_OCCUPATION'
                                ? selectedDocument.contenu.numeroPermis
                                : selectedDocument.contenu.numeroBail}
                        </Descriptions.Item>
                        <Descriptions.Item label="Type">
                            {selectedDocument.type === 'PERMIS_OCCUPATION' ? 'Permis d\'occuper' : 'Bail communal'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Date de création">
                            {new Date(selectedDocument.dateCreation).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Descriptions.Item>
                        <Descriptions.Item label="Localité">
                            {selectedDocument.demande.localite.nom}
                        </Descriptions.Item>
                        <Descriptions.Item label="Superficie">
                            {selectedDocument.contenu.superficie} m²
                        </Descriptions.Item>
                        <Descriptions.Item label="Statut">
                            <Tag color="success">Actif</Tag>
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </Card>
    );
};

export default DocumentListe;
