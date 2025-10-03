

"use client"

import { AgentBreadcrumb } from "@/components"
import { useState, useEffect } from "react"
import { Table, Input, Card, Space, Button, Typography, Upload, Modal, Select, message, Popover } from "antd";
import { SearchOutlined, EyeOutlined, InfoCircleOutlined, FileExcelOutlined, FilePdfFilled } from "@ant-design/icons"
import { Link } from "react-router-dom"
import { getDemandeurListe, getDetaitHabitant } from "@/services/userService"
import { formatPhoneNumber } from "@/utils/formatters"
import { exportDemandeurHabitantToCSV, exportDemandeurNonHabitantToCSV, exportDemandeurToPDF } from "@/utils/export_demandeur";

const { Title } = Typography

const AgentDemandeurListe = () => {
  const [demandeurs, setDemandeurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchText, setSearchText] = useState("")
  const [habitantData, setHabitantData] = useState({})
  const [loadingHabitant, setLoadingHabitant] = useState({})

  useEffect(() => {
    const fetchDemandeurs = async () => {
      try {
        const data = await getDemandeurListe()
        console.log("demandeur", data)
        const filteredDemandeurs = data.filter((demandeur) => demandeur.roles.includes("ROLE_DEMANDEUR"));
        setDemandeurs(filteredDemandeurs)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchDemandeurs()
  }, [])

  const fetchHabitantInfo = async (userId) => {
    if (habitantData[userId]) return // Already fetched

    setLoadingHabitant((prev) => ({ ...prev, [userId]: true }))

    try {
      const habitantInfo = await getDetaitHabitant(userId)
      console.log("habitante", habitantInfo)
      setHabitantData((prev) => ({ ...prev, [userId]: habitantInfo }))
    } catch (error) {
      console.error("Erreur lors de la récupération des informations du habitant:", error)
    } finally {
      setLoadingHabitant((prev) => ({ ...prev, [userId]: false }))
    }
  }

  const renderHabitantContent = (userId) => {
    const data = habitantData[userId]

    if (!data) {
      return <div>Chargement des informations...</div>
    }

    return (
      <div className="max-w-3xl">
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="border-b pb-1">
              <strong>{key}:</strong> {value || "-"}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id) => `#${id}`,
    },
    {
      title: "Nom",
      dataIndex: "nom",
      key: "nom",
      sorter: (a, b) => a.nom.localeCompare(b.nom),
    },
    {
      title: "Prénom",
      dataIndex: "prenom",
      key: "prenom",
      sorter: (a, b) => a.prenom.localeCompare(b.prenom),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Téléphone",
      dataIndex: "telephone",
      key: "telephone",
      render: (telephone) => formatPhoneNumber(telephone),
    },
    {
      title: "Habitant",
      dataIndex: "isHabitant",
      key: "isHabitant",
      render: (isHabitant, record) => {
        if (!isHabitant) return "Non"

        return (
          <Space>
            <span>Oui</span>
            <Popover
              content={renderHabitantContent(record.id)}
              title="Informations détaillées"
              trigger="click"
              placement="right"
              overlayStyle={{ maxWidth: "800px" }}
              onVisibleChange={(visible) => {
                if (visible) {
                  fetchHabitantInfo(record.id)
                }
              }}
            >
              <Button
                type="text"
                icon={<InfoCircleOutlined />}
                className="text-primary"
                loading={loadingHabitant[record.id]}
              />
            </Popover>
          </Space>
        )
      },
      filters: [
        { text: "Oui", value: true },
        { text: "Non", value: false },
      ],
      onFilter: (value, record) => record.isHabitant === value,
    },
    // {
    //   title: "Demandes",
    //   dataIndex: "demandes",
    //   key: "demandes",
    //   render: (_, record) => {
    //     return (
    //       <Link to={`/agent/demandeur/${record.id}/details`}>
    //         <Button className="text-primary" icon={<EyeOutlined />}>
    //           {record.demandes.length}
    //         </Button>
    //       </Link>
    //     )
    //   },
    // },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Link to={`/agent/demandeur/${record.id}/details`}>
            <Button className="text-primary" icon={<EyeOutlined />}>
              Détails
            </Button>
          </Link>
        </>
      ),
    },
  ]

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Erreur: {error}</div>
  }

  return (
    <>
      <AgentBreadcrumb title="Liste des demandeurs" />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <div className="grid grid-cols-1">
              <Card className="shadow-lg rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <Title level={4}>Liste des Demandeurs</Title>


                  <Space>


                    <Button
                      icon={<FileExcelOutlined />}
                      onClick={() => exportDemandeurNonHabitantToCSV(demandeurs)}
                    >
                      Exporter Non Habitants
                    </Button>


                    <Button
                      icon={<FileExcelOutlined />}
                      onClick={() => exportDemandeurHabitantToCSV(demandeurs)}
                    >
                      Exporter Habitants
                    </Button>


                    <Button
                      icon={<FilePdfFilled />}
                      onClick={() => exportDemandeurToPDF(demandeurs)}
                    >
                      Exporter Habitants
                    </Button>

                  </Space>
                </div>

                <Input
                  placeholder="Rechercher par nom, prénom ou email..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300, marginBottom: 16 }}
                />

                <Table
                  scroll={{ x: 'max-content' }}
                  columns={columns}
                  dataSource={demandeurs.filter(
                    (item) =>
                      item.nom.toLowerCase().includes(searchText.toLowerCase()) ||
                      item.prenom.toLowerCase().includes(searchText.toLowerCase()) ||
                      item.email.toLowerCase().includes(searchText.toLowerCase()),
                  )}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    defaultPageSize: 5,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} demandeurs`,
                  }}
                />
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default AgentDemandeurListe

