
"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card, Descriptions, Divider, Button, Tag, Space, Skeleton, Result, Image, Typography,
  ConfigProvider, theme as antdTheme, message, Popconfirm, Modal, Form, Input, DatePicker, Select, Row, Col, InputNumber
} from "antd";
import {
  ArrowLeftOutlined, EditOutlined, DeleteOutlined, FilePdfOutlined, UserAddOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getDemande, deleteDemande, getDetailsRequest } from "@/services/requestService";
import { createUserAccount } from "@/services/userService";
import { useAuthContext } from "@/context";

const { Title, Text } = Typography;
const { Option } = Select;

const SITUATION_OPTIONS = [
  { value: "Célibataire", label: "Célibataire" },
  { value: "Marié(e)", label: "Marié(e)" },
  { value: "Divorcé(e)", label: "Divorcé(e)" },
  { value: "Veuf/Veuve", label: "Veuf/Veuve" },
];

export default function RequestDetails() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);

  // --- Création de compte ---
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm();

  const isPdf = (url) => (url || "").toLowerCase().endsWith(".pdf");
  const fmt = (v) => (v === null || v === undefined || v === "" ? "—" : v);
  const fmtDateTime = (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "—");
  const fmtDate = (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "—");

  const demandeur = useMemo(() => {
    // compat: certains contrôleurs renvoient soit "demandeur", soit les champs à plat
    if (item?.demandeur) return item.demandeur;
    return {
      prenom: item?.prenom, nom: item?.nom, email: item?.email, telephone: item?.telephone,
      adresse: item?.adresse, profession: item?.profession, numeroElecteur: item?.numeroElecteur,
      dateNaissance: item?.dateNaissance, lieuNaissance: item?.lieuNaissance,
      situationMatrimoniale: item?.situationMatrimoniale,
      statutLogement: item?.statutLogement,
      nombreEnfant: item?.nombreEnfant,
    };
  }, [item]);

  const localite = item?.localite || item?.quartier || null;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getDetailsRequest(String(id));
        console.log(res.item);
        if (!res?.success) throw new Error("Chargement impossible");
        setItem(res.item);
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    })();
  }, [id,createOpen]);

  const onDelete = async () => {
    try {
      await deleteDemande(String(id));
      message.success("Demande supprimée");
      navigate("/admin/demandes");
    } catch (e) {
      message.error(e?.response?.data?.message || e?.message || "Suppression impossible");
    }
  };

  /** ===================== Création de compte ===================== */

  // Ouvre la modale avec les valeurs pré-remplies
  const openCreateModal = () => {
    const initialValues = {
      prenom: demandeur?.prenom || "",
      nom: demandeur?.nom || "",
      email: demandeur?.email || "",
      telephone: demandeur?.telephone || "",
      adresse: demandeur?.adresse || "",
      profession: demandeur?.profession || "",
      numeroElecteur: demandeur?.numeroElecteur || "",
      lieuNaissance: demandeur?.lieuNaissance || "",
      dateNaissance: demandeur?.dateNaissance ? dayjs(demandeur.dateNaissance) : null,
      // côté back, la propriété attendue est "stuationDemandeur"
      stuationDemandeur: demandeur?.statutLogement || "",
      nombreEnfant: typeof demandeur?.nombreEnfant === "number" ? demandeur.nombreEnfant : (demandeur?.nombreEnfant ? Number(demandeur.nombreEnfant) : 0),
      password: "", // si vide -> back mettra Password123!
      roles: ["ROLE_DEMANDEUR"],
    };
    form.setFieldsValue(initialValues);
    setCreateOpen(true);
  };

  const handleCreateUser = async () => {
    try {
      const values = await form.validateFields();
      setCreating(true);
      console.log("values", values);
      // Payload attendu par /api/user/create
      const payload = {
        prenom: values.prenom,
        nom: values.nom,
        email: values.email,
        password: values.password || undefined, // si vide -> back mettra Password123!
        telephone: values.telephone || null,
        adresse: values.adresse || null,
        profession: values.profession || null,
        numeroElecteur: values.numeroElecteur || null,
        lieuNaissance: values.lieuNaissance || null,
        dateNaissance: values.dateNaissance ? values.dateNaissance.format("YYYY-MM-DD") : null,
        roles: "ROLE_DEMANDEUR",
        stuationDemandeur: values.stuationDemandeur || null, // orthographe côté back
        nombreEnfant: values.nombreEnfant ?? 0,
        situationMatrimoniale: values.situationMatrimoniale || null,
        demandeId: id,
      };

      await createUserAccount(payload);

      message.success("Compte utilisateur? créé avec succès");
      setCreateOpen(false);
    } catch (e) {
      if (e?.errorFields) {

      } else {
        message.error(e?.response?.data?.message || e?.message || "Création impossible");
      }
    } finally {
      setCreating(false);
    }
  };

  // Thème clair garanti pour cette page
  return (
    <ConfigProvider theme={{ algorithm: antdTheme.defaultAlgorithm }}>
      <div className="container mx-auto px-4 my-6 bg-white">
        <Space className="mb-4">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Retour</Button>
          <Title level={4} className="!m-0">Détails de la demande #{id}</Title>
        </Space>

        {loading ? (
          <Card><Skeleton active paragraph={{ rows: 6 }} /></Card>
        ) : error ? (
          <Result
            status="error"
            title="Impossible d’afficher la demande"
            subTitle={error}
            extra={<Button onClick={() => window.location.reload()}>Recharger</Button>}
          />
        ) : (
          <>
            <Card className="mb-6">
              <Space className="w-full justify-between">
                <div>
                  <Title level={5} className="!mb-1">Informations principales</Title>
                  <Space size="small" wrap>
                    {item?.statut && <Tag color="blue">{item.statut}</Tag>}
                    {item?.typeDemande && <Tag color="geekblue">{item.typeDemande}</Tag>}
                    {item?.typeTitre && <Tag color="purple">{item.typeTitre}</Tag>}
                  </Space>
                </div>
                <Space>
                  <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/demandes/${id}/edit`)}>Éditer</Button>
                  {user && user.roles.includes("ROLE_ADMIN") && <>

                    <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/demandes/${id}/validation`)}>Validation</Button>
                    <Popconfirm
                      title="Supprimer cette demande ?"
                      okText="Oui" cancelText="Non"
                      onConfirm={onDelete}
                    >
                      <Button danger icon={<DeleteOutlined />}>Supprimer</Button>
                    </Popconfirm>
                  </>
                  }

                </Space>
              </Space>

              <Divider />

              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="ID">{item?.id}</Descriptions.Item>
                <Descriptions.Item label="Type de demande">{fmt(item?.typeDemande)}</Descriptions.Item>
                <Descriptions.Item label="Type de titre">{fmt(item?.typeTitre)}</Descriptions.Item>
                <Descriptions.Item label="Type de document">{fmt(item?.typeDocument)}</Descriptions.Item>
                <Descriptions.Item label="Localité">{fmt(item?.localite)}</Descriptions.Item>
                <Descriptions.Item label="Usage prévu">{fmt(item?.usagePrevu)}</Descriptions.Item>
                <Descriptions.Item label="Superficie (m²)">{fmt(item?.superficie)}</Descriptions.Item>
                <Descriptions.Item label="Possède autre terrain">{item?.possedeAutreTerrain ? "Oui" : "Non"}</Descriptions.Item>
                <Descriptions.Item label="Terrain à Kaolack">{item?.terrainAKaolack ? "Oui" : "Non"}</Descriptions.Item>
                <Descriptions.Item label="Terrain ailleurs">{item?.terrainAilleurs ? "Oui" : "Non"}</Descriptions.Item>
                <Descriptions.Item label="Date de création">{fmtDateTime(item?.dateCreation)}</Descriptions.Item>
                <Descriptions.Item label="Dernière modification">{fmtDateTime(item?.dateModification)}</Descriptions.Item>
                <Descriptions.Item label="Statut de la demande">{item?.statut}</Descriptions.Item>

                {item?.motif_refus && <Descriptions.Item label="Motif de refus">{item.motif_refus}</Descriptions.Item>}
                {item?.decisionCommission && <Descriptions.Item label="Décision commission">{item.decisionCommission}</Descriptions.Item>}
                {item?.rapport && <Descriptions.Item label="Rapport">{item.rapport}</Descriptions.Item>}
                {item?.recommandation && <Descriptions.Item label="Recommandation">{item.recommandation}</Descriptions.Item>}
              </Descriptions>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">

              <Card
                title="Demandeur"
                extra={
                  item.utilisateur == null && user &&
                  (user.roles.includes("ROLE_ADMIN") ||
                    user.roles.includes("ROLE_SUPER_ADMIN") ||
                    user.roles.includes("ROLE_MAIRE")) && <>
                    <Button type="primary" icon={<UserAddOutlined />} onClick={openCreateModal}>
                      Créer le compte
                    </Button>
                  </>
                }
              >
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="Nom complet">
                    {fmt(item.utilisateur?.prenom ?? demandeur?.prenom)} {fmt(item.utilisateur?.nom ?? demandeur?.nom)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">{fmt(item.utilisateur?.email ?? demandeur?.email)}</Descriptions.Item>
                  <Descriptions.Item label="Téléphone">{fmt(item.utilisateur?.telephone ?? demandeur?.telephone)}</Descriptions.Item>
                  <Descriptions.Item label="Adresse">{fmt(item.utilisateur?.adresse ?? demandeur?.adresse)}</Descriptions.Item>
                  <Descriptions.Item label="Profession">{fmt(item.utilisateur?.profession ?? demandeur?.profession)}</Descriptions.Item>
                  <Descriptions.Item label="N° électeur">{fmt(item.utilisateur?.numeroElecteur ?? demandeur?.numeroElecteur)}</Descriptions.Item>
                  <Descriptions.Item label="Naissance">
                    {fmtDate(item.utilisateur?.dateNaissance ?? demandeur?.dateNaissance)} {demandeur?.lieuNaissance ? `à ${item.utilisateur?.lieuNaissance ?? demandeur.lieuNaissance}` : ""}
                  </Descriptions.Item>
                  <Descriptions.Item label="Situation matrimoniale">{fmt(item.utilisateur?.situationMatrimoniale ?? demandeur?.situationMatrimoniale)}</Descriptions.Item>
                  <Descriptions.Item label="Statut logement">{fmt(item.utilisateur?.statutLogement ?? demandeur?.statutLogement)}</Descriptions.Item>
                  <Descriptions.Item label="Nombre d'enfants">{fmt(item.utilisateur?.nombreEnfant ?? demandeur?.nombreEnfant)}</Descriptions.Item>
                </Descriptions>
              </Card>

              {item.quartier && (
                <Card title="Quartier">
                  <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="Nom">{fmt(item.quartier?.nom)}</Descriptions.Item>
                    {item.quartier?.prix !== undefined && (
                      <Descriptions.Item label="Prix">{String(item.quartier.prix)}</Descriptions.Item>
                    )}
                    {item.quartier?.description && (
                      <Descriptions.Item label="Description">{item.quartier.description}</Descriptions.Item>
                    )}
                  </Descriptions>
                </Card>
              )}


            </div>

            <Card title="Pièces justificatives" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Text strong>Recto</Text>
                  <div className="mt-2">
                    {!item?.recto ? (
                      <Text type="secondary">Aucun fichier</Text>
                    ) : isPdf(item.recto) ? (
                      <Button
                        icon={<FilePdfOutlined />}
                        type="default"
                        onClick={() => window.open(item.recto, "_blank")}
                      >
                        Ouvrir le PDF
                      </Button>
                    ) : (
                      <Image src={item.recto} alt="recto" width={280} />
                    )}
                  </div>
                </div>

                <div>
                  <Text strong>Verso</Text>
                  <div className="mt-2">
                    {!item?.verso ? (
                      <Text type="secondary">Aucun fichier</Text>
                    ) : isPdf(item.verso) ? (
                      <Button
                        icon={<FilePdfOutlined />}
                        type="default"
                        onClick={() => window.open(item.verso, "_blank")}
                      >
                        Ouvrir le PDF
                      </Button>
                    ) : (
                      <Image src={item.verso} alt="verso" width={280} />
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Modale de création de compte */}
            <Modal
              title="Créer le compte utilisateur?"
              open={createOpen}
              onOk={handleCreateUser}
              onCancel={() => !creating && setCreateOpen(false)}
              okText="Créer le compte"
              confirmLoading={creating}
              destroyOnClose
            >
              <Form form={form} layout="vertical">
                <Row gutter={[16, 8]}>
                  <Col xs={24} md={12}>
                    <Form.Item label="Prénom" name="prenom" rules={[{ required: true, message: "Prénom requis" }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Nom" name="nom" rules={[{ required: true, message: "Nom requis" }]}>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Email" name="email" rules={[{ type: "email", required: true, message: "Email invalide" }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Mot de passe" name="password" tooltip="Laisser vide pour utiliser le mot de passe par défaut">
                      <Input.Password placeholder="••••••••" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Téléphone" name="telephone" rules={[{ required: true, message: "Téléphone requis" }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Adresse" name="adresse" rules={[{ required: true, message: "Adresse requise" }]}>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Profession" name="profession" rules={[{ required: true, message: "Profession requise" }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Numéro électeur"
                      name="numeroElecteur"
                      rules={[{ required: true, message: "Numéro électeur requis" }]}
                    >
                      <Input maxLength={20} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Lieu de naissance" name="lieuNaissance" rules={[{ required: true, message: "Lieu de naissance requis" }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Date de naissance" name="dateNaissance" rules={[{ required: true, message: "Date de naissance requise" }]}>
                      <DatePicker className="w-full" format="YYYY-MM-DD" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Situation matrimoniale" name="situationMatrimoniale" rules={[{ required: true }]}>
                      <Select allowClear placeholder="Sélectionner">
                        {SITUATION_OPTIONS.map(o => <Option key={o.value} value={o.value}>{o.label}</Option>)}
                      </Select>
                    </Form.Item>

                  </Col>


                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Statut logement"
                      name="stuationDemandeur"
                      tooltip="Correspond à 'stuationDemandeur' attendu par l'API"
                    >
                      <Select allowClear placeholder="Sélectionner">
                        <Option value="Propriétaire">Propriétaire</Option>
                        <Option value="Locataire">Locataire</Option>
                        <Option value="Hébergé(e)">Hébergé(e)</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Nombre d'enfants" name="nombreEnfant">
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Rôles" name="roles" tooltip="Par défaut ROLE_DEMANDEUR" initialValue={["ROLE_DEMANDEUR"]}>
                      <Select mode="multiple" allowClear>
                        <Option value="ROLE_DEMANDEUR">ROLE_DEMANDEUR</Option>
                        {/* Ajoute d'autres rôles si nécessaire */}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Modal>
          </>
        )}
      </div>
    </ConfigProvider>
  );
}
