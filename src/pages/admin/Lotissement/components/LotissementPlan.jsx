import React, { useState, useEffect } from "react";
import { Table, Input, Card, Space, Button, Typography, Modal, message } from "antd";
import { SearchOutlined, FileTextOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { AdminBreadcrumb } from "@/components";
import { getLotissementDetails, getLotissementPlan } from "@/services/lotissementService";
import { useAuthContext } from "@/context";
import { getFileDocumentPlan } from "@/services/planLotissement";

const { Title } = Typography;

const AdminLotissementPlan = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [fichier, setFichier] = useState(null);
  const [lotissement, setLotissement] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansData, lotissementData] = await Promise.all([
          getLotissementPlan(id),
          getLotissementDetails(id)
        ]);
        setPlans(plansData);
        setLotissement(lotissementData);
      } catch (err) {
        setError(err.message);
        message.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user.id]);

  const handleViewDocument = async (plan) => {
    setFileLoading(true);
    setIsViewerOpen(true);
    try {
      const response = await getFileDocumentPlan(plan.id);
      setFichier(response);
    } catch (error) {
      message.error("Erreur lors du chargement du fichier");
    } finally {
      setFileLoading(false);
    }
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    setFichier(null);
  };

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
      sorter: (a, b) => a.version.localeCompare(b.version),
    },
    {
      title: "Date de Création",
      dataIndex: "dateCreation",
      key: "dateCreation",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.dateCreation) - new Date(b.dateCreation),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          className="text-primary"
          icon={<FileTextOutlined />}
          onClick={() => handleViewDocument(record)}
        >
          Voir
        </Button>
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
      <AdminBreadcrumb title="Liste des Plans de Lotissement" />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <div className="grid grid-cols-1">
              <Card className="shadow-lg rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <Space direction="vertical" size="small">
                    <Title level={4}>Plans de lotissement</Title>
                    {lotissement && (
                      <Link to={`/admin/lotissements/${id}/details`}>
                        Lotissement: <span className="text-primary">{lotissement.nom}</span>
                      </Link>
                    )}
                  </Space>
                </div>

                <Input
                  placeholder="Rechercher par description..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300, marginBottom: 16 }}
                />

                <Table
                  columns={columns}
                  dataSource={plans.filter((plan) =>
                    plan.description.toLowerCase().includes(searchText.toLowerCase())
                  )}
                  scroll={{ x: 'max-content' }}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} plans`,
                  }}
                />
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Modal
        title="Document"
        open={isViewerOpen}
        onCancel={closeViewer}
        footer={null}
        width="80%"
        style={{ top: 20 }}
      >
        <div className="bg-gray-200 rounded-lg p-4 min-h-[600px]">
          {fileLoading ? (
            <div className="flex justify-center items-center h-[600px]">
              <div className="ant-spin ant-spin-lg ant-spin-spinning">
                <span className="ant-spin-dot ant-spin-dot-spin">
                  <i className="ant-spin-dot-item"></i>
                  <i className="ant-spin-dot-item"></i>
                  <i className="ant-spin-dot-item"></i>
                  <i className="ant-spin-dot-item"></i>
                </span>
              </div>
            </div>
          ) : (
            fichier && (
              <iframe
                src={`data:application/pdf;base64,${fichier}`}
                width="100%"
                height="600px"
                title="Document Preview"
              />
            )
          )}
        </div>
      </Modal>
    </>
  );
};

export default AdminLotissementPlan;
