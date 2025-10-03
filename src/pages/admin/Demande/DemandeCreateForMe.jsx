import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card, Form, Input, InputNumber, Select, Switch, Upload, Button, Space, Typography, message,
} from "antd";
import { InboxOutlined, SendOutlined, ReloadOutlined } from "@ant-design/icons";
import { createDemandeForUser } from "@/services/demandeService";
import { useAuthContext } from "@/context";
import { getLocalites } from "@/services/localiteService";
import { AdminBreadcrumb } from "@/components";

const { Title, Text } = Typography;
const { Dragger } = Upload;
const { Option } = Select;

const TYPE_DEMANDE_OPTIONS = [
  { label: "Attribution", value: "Attribution" },
  { label: "Régularisation", value: "Régularisation" },
  { label: "Authentification", value: "Authentification" },
];
const TYPE_DOCUMENT_OPTIONS = [
  { label: "CNI", value: "CNI" },
  { label: "Passeport", value: "PASSEPORT" },
  { label: "Carte Consulaire", value: "CARTE_CONSULAIRE" },
];
const TYPE_TITRE_OPTIONS = [
  { label: "Permis d'occuper", value: "Permis d'occuper" },
  { label: "Bail communal", value: "Bail communal" },
  { label: "Proposition de bail", value: "Proposition de bail" },
  { label: "Transfert définitif", value: "Transfert définitif" },
];

export default function DemandeCreatePaginatedForMe() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [localites, setLocalites] = useState([]);
  const [loadingLocalites, setLoadingLocalites] = useState(true);
  const [rectoFile, setRectoFile] = useState(null);
  const [versoFile, setVersoFile] = useState(null);

  const canSubmit = useMemo(() => !!user?.id, [user?.id]);

  const fetchLocalites = async () => {
    setLoadingLocalites(true);
    try {
      const list = await getLocalites();
      const normalized = list
        .map((l) => ({ id: l.id ?? l?.ID ?? l?.Id, nom: l.nom ?? l?.name ?? l?.label }))
        .filter((x) => !!x.id && !!x.nom);
      setLocalites(normalized);
    } catch (e) {
      message.error("Impossible de charger les localités.");
      console.error(e);
    } finally {
      setLoadingLocalites(false);
    }
  };

  useEffect(() => { fetchLocalites(); }, []);

  const beforeUploadBlock = () => false;
  const onRectoChange = ({ file }) => setRectoFile(file);
  const onVersoChange = ({ file }) => setVersoFile(file);

  const onReset = () => {
    form.resetFields();
    setRectoFile(null);
    setVersoFile(null);
  };

  const onFinish = async (values) => {
    if (!canSubmit) return message.error("Vous devez être connecté.");
    // if (!rectoFile || !versoFile) return message.warning("Ajoutez recto et verso.");
    console.log("values", values);
    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("typeDemande", values.typeDemande);
    formData.append("typeDocument", values.typeDocument ?? null);
    formData.append("typeTitre", values.typeTitre || "");
    formData.append("localiteId", values.localiteId);
    formData.append("superficie", values.superficie ?? 0);
    formData.append("usagePrevu", values.usagePrevu ?? null);
    formData.append("possedeAutreTerrain", values.possedeAutreTerrain ?? false);
    formData.append("terrainAKaolack", values.terrainAKaolack ?? false);
    formData.append("terrainAilleurs", values.terrainAilleurs ?? false);
   
    if( rectoFile && versoFile ){
      formData.append("recto", rectoFile.originFileObj || rectoFile);
      formData.append("verso", versoFile.originFileObj || versoFile);
    }

    setSubmitting(true);
    try {
      await createDemandeForUser(formData); // Assurez-vous que le service accepte FormData
      message.success("Demande créée avec succès !");
      onReset();
      navigate("/admin/demandes");
    } catch (e) {
      console.error(e);
      message.error(e?.response?.data?.message || "Erreur lors de la création.");
    } finally {
      setSubmitting(false);
    }
  };


  return <>
    <AdminBreadcrumb title="Nouvelle demande pour moi" />
    <section className="container mx-auto px-4 py-5">
      <div className="mb-5 flex items-center justify-between">
        <Title level={4} className="!mb-0">Nouvelle demande</Title>
        <Button icon={<ReloadOutlined />} onClick={fetchLocalites} loading={loadingLocalites}>
          Recharger localités
        </Button>
      </div>

      <Card className="shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ possedeAutreTerrain: false, terrainAKaolack: false, terrainAilleurs: false }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item name="typeDemande" label="Type de demande" rules={[{ required: true }]}>
              <Select placeholder="Sélectionner">
                {TYPE_DEMANDE_OPTIONS.map((opt) => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="typeDocument" label="Type de document" rules={[{ required: true }]}>
              <Select placeholder="Sélectionner">
                {TYPE_DOCUMENT_OPTIONS.map((opt) => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="typeTitre" label="Type de titre" required >
              <Select placeholder="Sélectionner (facultatif)" allowClear>
                {TYPE_TITRE_OPTIONS.map((opt) => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="localiteId" label="Localité" rules={[{ required: true }]}>
              <Select placeholder="Sélectionner une localité" loading={loadingLocalites} showSearch optionFilterProp="children">
                {localites.map((l) => (
                  <Option value={l.id} key={l.id}>{l.nom}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="superficie" label="Superficie (m²)" >
              <InputNumber min={1} defaultValue={0} className="w-full" placeholder="Ex: 150" />
            </Form.Item>

            <Form.Item name="usagePrevu" label="Usage prévu" rules={[{ required: true }]}>
              <Input placeholder="Ex: habitation" />
            </Form.Item>

            <Form.Item name="possedeAutreTerrain" label="Possède un autre terrain" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item name="terrainAKaolack" label="Terrain à Kaolack" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item name="terrainAilleurs" label="Terrain ailleurs" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-2">
            <Form.Item label="Pièce d’identité — Recto (PDF/IMG)" >
              <Dragger multiple={false} maxCount={1} beforeUpload={beforeUploadBlock} onChange={onRectoChange}
                accept=".pdf,.jpg,.jpeg,.png" fileList={rectoFile ? [rectoFile] : []} onRemove={() => setRectoFile(null)}>
                <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                <p className="ant-upload-text">Glissez-déposez (recto) ou cliquez</p>
              </Dragger>
            </Form.Item>

            <Form.Item label="Pièce d’identité — Verso (PDF/IMG)" >
              <Dragger multiple={false} maxCount={1} beforeUpload={beforeUploadBlock} onChange={onVersoChange}
                accept=".pdf,.jpg,.jpeg,.png" fileList={versoFile ? [versoFile] : []} onRemove={() => setVersoFile(null)}>
                <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                <p className="ant-upload-text">Glissez-déposez (verso) ou cliquez</p>
              </Dragger>
            </Form.Item>
          </div>

          <Space className="mt-6">
            <Button onClick={onReset}>Réinitialiser</Button>
            <Button type="primary" icon={<SendOutlined />} htmlType="submit" loading={submitting} disabled={!canSubmit}>
              Soumettre ma demande
            </Button>
          </Space>

          {!canSubmit && (
            <div className="mt-3"><Text type="danger">Connectez-vous pour créer une demande.</Text></div>
          )}
        </Form>
      </Card>
    </section>
  </>;
}
