// 'use client'

// import React, { useEffect, useState } from 'react';
// import { Save, Building, Phone, Globe, Mail, Link2, Loader, User, MapPin, UserCheck, UserX, UserPlus, Calendar, Briefcase } from 'lucide-react';
// import { AdminBreadcrumb } from "@/components";
// import { toast } from 'sonner';
// import { getConfigurations, updateConfiguration } from '@/services/configurationService';
// import { getAllAccounts, updateActivatedStatus, createAdminUser, updateUserRole } from '@/services/userService';
// import { useAuthContext } from '@/context';
// import { Card, Tabs, Form, Input, Button, Table, Select, DatePicker, Space, Typography, Spin, Alert } from 'antd';
// import dayjs from 'dayjs';

// const { Title } = Typography;

// const AdminConfiguration = () => {
//   const { user } = useAuthContext();
//   const [form] = Form.useForm();
//   const [adminForm] = Form.useForm();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [config, setConfig] = useState({
//     titre: '',
//     adresse: '',
//     telephone: '',
//     siteWeb: '',
//     email: '',
//     nomMaire: ''
//   });

//   const [activeTab, setActiveTab] = useState('1');
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingUser, setLoadingUser] = useState(null);

//   useEffect(() => {
//     const fetchConfigurations = async () => {
//       setLoading(true);
//       try {
//         const response = await getConfigurations();
//         const configObj = {
//           titre: response.titre,
//           nomMaire: response.nomMaire,
//           telephone: response.telephone,
//           email: response.email,
//           siteWeb: response.siteWeb,
//           adresse: response.adresse
//         };
//         setConfig(configObj);
//         form.setFieldsValue(configObj);
//       } catch (error) {
//         setError(error.message);
//         toast.error('Erreur lors de la récupération des configurations');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchConfigurations();
//   }, [form]);

//   useEffect(() => {
//     if (activeTab === '2') {
//       fetchUsers();
//     }
//   }, [activeTab]);

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const data = await getAllAccounts();
//       if (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_SUPER_ADMIN')) {
//         setUsers(data);
//       } else {
//         const filteredUsers = data.filter(u =>
//           !u.roles.includes('ROLE_ADMIN') &&
//           !u.roles.includes('ROLE_SUPER_ADMIN'));
//         setUsers(filteredUsers);
//       }
//     } catch (error) {
//       setError(error.message);
//       toast.error('Erreur lors de la récupération des utilisateurs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleActivateUser = async (userId, currentStatus) => {
//     setLoadingUser(userId);
//     try {
//       await updateActivatedStatus(userId, currentStatus);
//       await fetchUsers();
//       toast.success('Statut de l\'utilisateur mis à jour avec succès');
//     } catch (error) {
//       toast.error('Erreur lors de la mise à jour du statut');
//     } finally {
//       setLoadingUser(null);
//     }
//   };

//   const handleRoleChange = async (userId, newRole) => {
//     if (newRole === 'ROLE_ADMIN' && !user.roles.includes('ROLE_SUPER_ADMIN')) {
//       toast.error('Seul un super administrateur peut attribuer le rôle administrateur');
//       return;
//     }

//     setLoadingUser(userId);
//     try {
//       await updateUserRole(userId, newRole);
//       await fetchUsers();
//       toast.success('Rôle de l\'utilisateur mis à jour avec succès');
//     } catch (error) {
//       toast.error('Erreur lors de la mise à jour du rôle');
//     } finally {
//       setLoadingUser(null);
//     }
//   };

//   const handleSubmit = async (values) => {
//     setIsSubmitting(true);
//     try {
//       await Promise.all(
//         Object.entries(values).map(([key, value]) =>
//           updateConfiguration(key, value)
//         )
//       );
//       toast.success('Configurations mises à jour avec succès');
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour des configurations:', error);
//       toast.error('Erreur lors de la mise à jour des configurations');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleAdminSubmit = async (values) => {
//     setIsSubmitting(true);
//     try {
//       const formattedValues = {
//         ...values,
//         dateNaissance: values.dateNaissance.format('YYYY-MM-DD')
//       };
//       await createAdminUser(formattedValues);
//       toast.success('Administrateur créé avec succès');
//       adminForm.resetFields();
//     } catch (error) {
//       toast.error('Erreur lors de la création de l\'administrateur');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const columns = [
//     {
//       title: 'Nom',
//       dataIndex: 'nom',
//       key: 'nom',
//       render: (_, record) => `${record.nom} ${record.prenom}`
//     },
//     {
//       title: 'Email',
//       dataIndex: 'email',
//       key: 'email',
//     },
//     {
//       title: 'Rôle',
//       key: 'role',
//       render: (_, record) => (
//         <Select
//           defaultValue={record.roles[0]}
//           style={{ width: 130 }}
//           onChange={(value) => handleRoleChange(record.id, value)}
//           disabled={!user.roles.includes('ROLE_SUPER_ADMIN')}
//         >
//           <Select.Option value="ROLE_USER">Utilisateur</Select.Option>
//           <Select.Option value="ROLE_ADMIN">Administrateur</Select.Option>
//         </Select>
//       ),
//     },
//     {
//       title: 'Statut',
//       key: 'status',
//       render: (_, record) => (
//         <Button
//           type={record.activated ? 'primary' : 'default'}
//           danger={!record.activated}
//           onClick={() => handleActivateUser(record.id, !record.activated)}
//           loading={loadingUser === record.id}
//         >
//           {record.activated ? 'Actif' : 'Inactif'}
//         </Button>
//       ),
//     },
//   ];

//   const items = [
//     {
//       key: '1',
//       label: 'Configuration',
//       children: (
//         <Card className="shadow-sm">
//           <Form
//             form={form}
//             layout="vertical"
//             onFinish={handleSubmit}
//             initialValues={config}
//             className="max-w-2xl mx-auto"
//           >
//             <Form.Item
//               name="titre"
//               label="Titre"
//               rules={[{ required: true, message: 'Le titre est requis' }]}
//             >
//               <Input prefix={<Building className="h-4 w-4" />} />
//             </Form.Item>

//             <Form.Item
//               name="nomMaire"
//               label="Nom du Maire"
//               rules={[{ required: true, message: 'Le nom du maire est requis' }]}
//             >
//               <Input prefix={<User className="h-4 w-4" />} />
//             </Form.Item>

//             <Form.Item
//               name="adresse"
//               label="Adresse"
//               rules={[{ required: true, message: 'L\'adresse est requise' }]}
//             >
//               <Input prefix={<MapPin className="h-4 w-4" />} />
//             </Form.Item>

//             <Form.Item
//               name="telephone"
//               label="Téléphone"
//               rules={[{ required: true, message: 'Le téléphone est requis' }]}
//             >
//               <Input prefix={<Phone className="h-4 w-4" />} />
//             </Form.Item>

//             <Form.Item
//               name="email"
//               label="Email"
//               rules={[
//                 { required: true, message: 'L\'email est requis' },
//                 { type: 'email', message: 'Email invalide' }
//               ]}
//             >
//               <Input prefix={<Mail className="h-4 w-4" />} />
//             </Form.Item>

//             <Form.Item
//               name="siteWeb"
//               label="Site Web"
//               rules={[{ required: true, message: 'Le site web est requis' }]}
//             >
//               <Input prefix={<Globe className="h-4 w-4" />} />
//             </Form.Item>

//             <Form.Item>
//               <Button 
//                 type="primary" 
//                 htmlType="submit" 
//                 loading={isSubmitting}
//                 icon={<Save className="h-4 w-4" />}
//                 className="w-full md:w-auto"
//               >
//                 Enregistrer
//               </Button>
//             </Form.Item>
//           </Form>
//         </Card>
//       ),
//     },
//     {
//       key: '2',
//       label: 'Gestion des Utilisateurs',
//       children: (
//         <Space direction="vertical" style={{ width: '100%' }} size="large">
//           <Card title="Liste des Utilisateurs" className="shadow-sm">
//             <Table
//               columns={columns}
//               dataSource={users}
//               rowKey="id"
//               loading={loading}
//               pagination={{
//                 defaultPageSize: 5,
//                 showSizeChanger: true,
//                 showTotal: (total) => `Total ${total} utilisateurs`,
//               }}
//             />
//           </Card>

//           {(user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_SUPER_ADMIN')) && (
//             <Card title="Ajouter un Administrateur" className="shadow-sm">
//               <Form
//                 form={adminForm}
//                 layout="vertical"
//                 onFinish={handleAdminSubmit}
//                 className="max-w-2xl mx-auto"
//               >
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Form.Item
//                     name="email"
//                     label="Email"
//                     rules={[
//                       { required: true, message: 'L\'email est requis' },
//                       { type: 'email', message: 'Email invalide' }
//                     ]}
//                   >
//                     <Input prefix={<Mail className="h-4 w-4" />} />
//                   </Form.Item>

//                   <Form.Item
//                     name="nom"
//                     label="Nom"
//                     rules={[{ required: true, message: 'Le nom est requis' }]}
//                   >
//                     <Input prefix={<User className="h-4 w-4" />} />
//                   </Form.Item>

//                   <Form.Item
//                     name="prenom"
//                     label="Prénom"
//                     rules={[{ required: true, message: 'Le prénom est requis' }]}
//                   >
//                     <Input prefix={<User className="h-4 w-4" />} />
//                   </Form.Item>

//                   <Form.Item
//                     name="dateNaissance"
//                     label="Date de Naissance"
//                     rules={[{ required: true, message: 'La date de naissance est requise' }]}
//                   >
//                     <DatePicker style={{ width: '100%' }} />
//                   </Form.Item>

//                   <Form.Item
//                     name="lieuNaissance"
//                     label="Lieu de Naissance"
//                     rules={[{ required: true, message: 'Le lieu de naissance est requis' }]}
//                   >
//                     <Input prefix={<MapPin className="h-4 w-4" />} />
//                   </Form.Item>

//                   <Form.Item
//                     name="numeroElecteur"
//                     label="Numéro Électeur"
//                     rules={[{ required: true, message: 'Le numéro d\'électeur est requis' }]}
//                   >
//                     <Input prefix={<UserCheck className="h-4 w-4" />} />
//                   </Form.Item>

//                   <Form.Item
//                     name="telephone"
//                     label="Téléphone"
//                     rules={[{ required: true, message: 'Le téléphone est requis' }]}
//                   >
//                     <Input prefix={<Phone className="h-4 w-4" />} />
//                   </Form.Item>

//                   <Form.Item
//                     name="adresse"
//                     label="Adresse"
//                     rules={[{ required: true, message: 'L\'adresse est requise' }]}
//                   >
//                     <Input prefix={<MapPin className="h-4 w-4" />} />
//                   </Form.Item>

//                   <Form.Item
//                     name="profession"
//                     label="Profession"
//                     rules={[{ required: true, message: 'La profession est requise' }]}
//                   >
//                     <Input prefix={<Briefcase className="h-4 w-4" />} />
//                   </Form.Item>
//                 </div>

//                 <Form.Item>
//                   <Button 
//                     type="primary" 
//                     htmlType="submit" 
//                     loading={isSubmitting}
//                     icon={<UserPlus className="h-4 w-4" />}
//                     className="w-full md:w-auto"
//                   >
//                     Créer l'Administrateur
//                   </Button>
//                 </Form.Item>
//               </Form>
//             </Card>
//           )}
//         </Space>
//       ),
//     },
//   ];

//   if (error) {
//     return <Alert message="Erreur" description={error} type="error" showIcon />;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <AdminBreadcrumb />
//       <Title level={2} className="mb-6">Configuration du Système</Title>
//       <Tabs 
//         defaultActiveKey="1" 
//         items={items}
//         onChange={(key) => setActiveTab(key)}
//         className="configuration-tabs"
//       />
//     </div>
//   );
// };

// export default AdminConfiguration;
"use client"

import { useEffect, useState } from "react"
import { Layout, Card, Tabs, Form, Input, Button, Table, Tag, Select, DatePicker, Typography, Spin, Alert } from "antd"
import {
  SaveOutlined,
  BuildOutlined,
  PhoneOutlined,
  GlobalOutlined,
  MailOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserAddOutlined,
  BankOutlined,
} from "@ant-design/icons"
import { AdminBreadcrumb } from "@/components"
import { toast } from "sonner"
import { getConfigurations, updateConfiguration } from "@/services/configurationService"
import { getAllAccounts, updateActivatedStatus, createAdminUser, updateUserRole } from "@/services/userService"
import { useAuthContext } from "@/context"

const { Content } = Layout
const { TabPane } = Tabs
const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const AdminConfiguration = () => {
  const { user } = useAuthContext()
  const [form] = Form.useForm()
  const [adminForm] = Form.useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [config, setConfig] = useState({
    titre: "",
    adresse: "",
    telephone: "",
    siteWeb: "",
    email: "",
    nomMaire: "",
  })

  const [activeTab, setActiveTab] = useState("config")
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    nom: "",
    prenom: "",
    dateNaissance: "",
    lieuNaissance: "",
    numeroElecteur: "",
    telephone: "",
    adresse: "",
    profession: "",
  })
  const [loadingUser, setLoadingUser] = useState(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(5)

  useEffect(() => {
    const fetchConfigurations = async () => {
      setLoading(true)
      try {
        const response = await getConfigurations()
        const configObj = {
          titre: response.titre,
          nomMaire: response.nomMaire,
          telephone: response.telephone,
          email: response.email,
          siteWeb: response.siteWeb,
          adresse: response.adresse,
        }

        setConfig(configObj)
        form.setFieldsValue(configObj)
      } catch (err) {
        setError(err.message)
        toast.error("Erreur lors de la récupération des configurations")
      } finally {
        setLoading(false)
      }
    }

    fetchConfigurations()
  }, [form])

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers()
    }
  }, [activeTab])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await getAllAccounts()

      if (user.roles.includes("ROLE_ADMIN") || user.roles.includes("ROLE_SUPER_ADMIN")) {
        setUsers(data)
      } else {
        const filteredUsers = data.filter(
          (user) => !user.roles.includes("ROLE_ADMIN") && !user.roles.includes("ROLE_SUPER_ADMIN"),
        )
        setUsers(filteredUsers)
      }
    } catch (err) {
      setError(err.message)
      toast.error("Erreur lors de la récupération des utilisateurs")
    } finally {
      setLoading(false)
    }
  }

  const handleActivateUser = async (userId, currentStatus) => {
    setLoadingUser(userId)
    try {
      await updateActivatedStatus(userId, currentStatus)
      await fetchUsers()
      toast.success("Statut de l'utilisateur mis à jour avec succès")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut")
    } finally {
      setLoadingUser(null)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    if (newRole === "ROLE_ADMIN" && !user.roles.includes("ROLE_SUPER_ADMIN")) {
      toast.error("Seul un super administrateur peut attribuer le rôle administrateur")
      return
    }

    setLoadingUser(userId)
    try {
      await updateUserRole(userId, newRole)
      await fetchUsers()
      toast.success("Rôle de l'utilisateur mis à jour avec succès")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du rôle")
    } finally {
      setLoadingUser(null)
    }
  }

  const handleSubmit = async (values) => {
    setIsSubmitting(true)

    try {
      await Promise.all(Object.entries(values).map(([key, value]) => updateConfiguration(key, value)))
      toast.success("Configurations mises à jour avec succès")
    } catch (error) {
      console.error("Erreur lors de la mise à jour des configurations:", error)
      toast.error("Erreur lors de la mise à jour des configurations")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAdminSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      // Format date to string if it's a dayjs object
      const formattedValues = {
        ...values,
        dateNaissance: values.dateNaissance ? values.dateNaissance.format("YYYY-MM-DD") : "",
      }

      await createAdminUser(formattedValues)
      toast.success("Administrateur créé avec succès")
      adminForm.resetFields()
    } catch (error) {
      toast.error("Erreur lors de la création de l'administrateur")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatRoleDisplay = (role) => {
    const roleMap = {
      ROLE_DEMANDEUR: "Demandeur",
      ROLE_AGENT: "Agent",
      ROLE_ADMIN: "Administrateur",
      ROLE_SUPER_ADMIN: "Super Administrateur",
    }
    return roleMap[role] || role
  }

  // Table columns
  const columns = [
    {
      title: "Nom",
      dataIndex: "nom",
      key: "nom",
      render: (text, record) => `${record.nom} ${record.prenom}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Rôle",
      dataIndex: "roles",
      key: "roles",
      render: (roles, record) => (
        <Select
          value={roles[0]}
          onChange={(value) => handleRoleChange(record.id, value)}
          disabled={
            loadingUser === record.id ||
            (roles[0] === "ROLE_ADMIN" && !user.roles.includes("ROLE_SUPER_ADMIN")) ||
            roles.includes("ROLE_SUPER_ADMIN")
          }
          style={{ width: "100%" }}
        >
          <Option value="ROLE_DEMANDEUR">Demandeur</Option>
          <Option value="ROLE_AGENT">Agent</Option>
          <Option value="ROLE_ADMIN">Admin</Option>
          {user.roles.includes("ROLE_SUPER_ADMIN") && <Option value="ROLE_SUPER_ADMIN">Super Admin</Option>}
        </Select>
      ),
    },
    {
      title: "Statut",
      dataIndex: "activated",
      key: "activated",
      render: (activated) => <Tag color={activated ? "success" : "error"}>{activated ? "Activé" : "Désactivé"}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          className={record.activated ? "text-danger" : "text-primary"}
          onClick={() => handleActivateUser(record.id, record.activated)}
          disabled={loadingUser === record.id}
          icon={record.activated ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
          loading={loadingUser === record.id}
        >
          {record.activated ? "Désactiver" : "Activer"}
        </Button>
      ),
    },
  ]

  if (loading && !users.length && !Object.values(config).some((val) => val)) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <ErrorDisplay error={error} />
  }

  return (
    <>
      <AdminBreadcrumb title="Configuration" />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <div className="grid grid-cols-1">
              <Content className="site-layout-background" style={{ padding: 24 }}>
                <Card>
                  <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
                    <TabPane tab="Configuration" key="config">
                      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={config}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                          <Form.Item
                            name="titre"
                            label="Titre de la mairie"
                            rules={[{ required: true, message: "Veuillez saisir le titre de la mairie" }]}
                          >
                            <Input prefix={<BuildOutlined />} placeholder="Titre de la mairie" />
                          </Form.Item>

                          <Form.Item
                            name="nomMaire"
                            label="Nom du maire"
                            rules={[{ required: true, message: "Veuillez saisir le nom du maire" }]}
                          >
                            <Input prefix={<UserOutlined />} placeholder="Nom du maire" />
                          </Form.Item>

                          <Form.Item
                            name="adresse"
                            label="Adresse"
                            rules={[{ required: true, message: "Veuillez saisir l'adresse" }]}
                          >
                            <TextArea
                              prefix={<EnvironmentOutlined />}
                              placeholder="Adresse"
                              autoSize={{ minRows: 2, maxRows: 6 }}
                            />
                          </Form.Item>

                          <Form.Item
                            name="telephone"
                            label="Téléphone"
                            rules={[{ required: true, message: "Veuillez saisir le numéro de téléphone" }]}
                          >
                            <Input prefix={<PhoneOutlined />} placeholder="Téléphone" />
                          </Form.Item>

                          <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                              { required: true, message: "Veuillez saisir l'email" },
                              { type: "email", message: "Veuillez saisir un email valide" },
                            ]}
                          >
                            <Input prefix={<MailOutlined />} placeholder="Email" />
                          </Form.Item>

                          <Form.Item
                            name="siteWeb"
                            label="Site Web"
                            rules={[
                              { required: true, message: "Veuillez saisir le site web" },
                              { type: "url", message: "Veuillez saisir une URL valide" },
                            ]}
                          >
                            <Input prefix={<GlobalOutlined />} placeholder="https://www.example.com" />
                          </Form.Item>
                        </div>

                        <Form.Item style={{ textAlign: "center", marginTop: 24 }}>
                          <Button className="text-primary" htmlType="submit" loading={isSubmitting} icon={<SaveOutlined />} size="large">
                            Enregistrer les modifications
                          </Button>
                        </Form.Item>
                      </Form>
                    </TabPane>

                    <TabPane tab="Utilisateurs" key="users">
                      <Table
                        dataSource={users}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                          current: currentPage,
                          pageSize: usersPerPage,
                          total: users.length,
                          onChange: (page) => setCurrentPage(page),
                          showSizeChanger: false,
                          showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} utilisateurs`,
                        }}
                      />
                    </TabPane>

                    {user.roles.includes("ROLE_SUPER_ADMIN") && (
                      <TabPane tab="Nouvel Admin" key="new-admin">
                        <Form form={adminForm} layout="vertical" onFinish={handleAdminSubmit}>
                          <div
                            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}
                          >
                            <Form.Item name="nom" label="Nom" rules={[{ required: true, message: "Veuillez saisir le nom" }]}>
                              <Input prefix={<UserOutlined />} placeholder="Nom" />
                            </Form.Item>

                            <Form.Item
                              name="prenom"
                              label="Prénom"
                              rules={[{ required: true, message: "Veuillez saisir le prénom" }]}
                            >
                              <Input prefix={<UserOutlined />} placeholder="Prénom" />
                            </Form.Item>

                            <Form.Item
                              name="email"
                              label="Email"
                              rules={[
                                { required: true, message: "Veuillez saisir l'email" },
                                { type: "email", message: "Veuillez saisir un email valide" },
                              ]}
                            >
                              <Input prefix={<MailOutlined />} placeholder="Email" />
                            </Form.Item>

                            <Form.Item
                              name="dateNaissance"
                              label="Date de Naissance"
                              rules={[{ required: true, message: "Veuillez sélectionner la date de naissance" }]}
                            >
                              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="Sélectionner une date" />
                            </Form.Item>

                            <Form.Item
                              name="lieuNaissance"
                              label="Lieu de Naissance"
                              rules={[{ required: true, message: "Veuillez saisir le lieu de naissance" }]}
                            >
                              <Input prefix={<EnvironmentOutlined />} placeholder="Lieu de naissance" />
                            </Form.Item>

                            <Form.Item
                              name="numeroElecteur"
                              label="Numéro d'Électeur"
                              rules={[
                                { required: true, message: "Veuillez saisir le numéro d'électeur" },
                                { pattern: new RegExp("^[0-9]{13}$"), message: "Le numéro d'électeur doit contenir 13 chiffres" },
                              ]}
                            >
                              <Input prefix={<UserAddOutlined />} placeholder="Numéro d'électeur" />
                            </Form.Item>

                            <Form.Item
                              name="telephone"
                              label="Téléphone"
                              rules={[{ required: true, message: "Veuillez saisir le numéro de téléphone" },
                              { pattern: new RegExp("^(70|76|77|78|79)[0-9]{7}$"), message: "Le numéro de téléphone doit être composé de 9 chiffres et commencer par 70, 76, 77, 78 ou 79" },
                              ]}
                            >
                              <Input prefix={<PhoneOutlined />} placeholder="Téléphone" />
                            </Form.Item>

                            <Form.Item
                              name="profession"
                              label="Profession"
                              rules={[{ required: true, message: "Veuillez saisir la profession" }]}
                            >
                              <Input prefix={<BankOutlined />} placeholder="Profession" />
                            </Form.Item>

                            <Form.Item
                              name="adresse"
                              label="Adresse"
                              rules={[{ required: true, message: "Veuillez saisir l'adresse" }]}
                            >
                              <TextArea placeholder="Adresse" autoSize={{ minRows: 2, maxRows: 6 }} />
                            </Form.Item>
                          </div>

                          <Form.Item style={{ textAlign: "center", marginTop: 24 }}>
                            <Button
                              className="text-primary"
                              htmlType="submit"
                              loading={isSubmitting}
                              icon={<SaveOutlined />}
                              size="large"
                            >
                              Créer l'administrateur
                            </Button>
                          </Form.Item>
                        </Form>
                      </TabPane>
                    )}
                  </Tabs>
                </Card>
              </Content>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function LoadingSkeleton() {
  return (
    <div style={{ padding: 24 }}>
      <Spin tip="Chargement..." size="large">
        <div style={{ padding: 50, background: "#f0f2f5", borderRadius: 4 }}>
          <Alert
            message="Chargement des données"
            description="Veuillez patienter pendant le chargement des données..."
            type="info"
          />
        </div>
      </Spin>
    </div>
  )
}

function ErrorDisplay({ error }) {
  return (
    <div style={{ padding: 24 }}>
      <Alert message="Erreur" description={error} type="error" showIcon />
    </div>
  )
}

export default AdminConfiguration

