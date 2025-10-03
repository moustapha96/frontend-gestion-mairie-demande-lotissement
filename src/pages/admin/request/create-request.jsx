
"use client";

import { useEffect, useState } from "react";
import { Card, Form, Input, InputNumber, Select, Button, DatePicker, Checkbox, Upload, message } from "antd";
import { PlusOutlined, InboxOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { createDemande } from "@/services/requestService";
import { getLocalites } from "@/services/localiteService";
import { AdminBreadcrumb } from "@/components";
const { Option } = Select;
const { Dragger } = Upload;

const TYPE_DEMANDE_OPTIONS = [
  { label: "Attribution", value: "Attribution" },
  { label: "Régularisation", value: "Régularisation" },
  { label: "Authentification", value: "Authentification" },
];
const TYPE_TITRE_OPTIONS = [
  { label: "Permis d'occuper", value: "Permis d'occuper" },
  { label: "Bail communal", value: "Bail communal" },
  { label: "Proposition de bail", value: "Proposition de bail" },
  { label: "Transfert définitif", value: "Transfert définitif" },
];
const TYPE_DOCUMENT_OPTIONS = [{ label: "CNI", value: "CNI" }];
const SITUATION_OPTIONS = [
  { value: "Célibataire", label: "Célibataire" },
  { value: "Marié(e)", label: "Marié(e)" },
  { value: "Divorcé(e)", label: "Divorcé(e)" },
  { value: "Veuf/Veuve", label: "Veuf/Veuve" },
];
const STATUT_LOGEMENT_OPTIONS = [
  { value: "Propriétaire", label: "Propriétaire" },
  { value: "Locataire", label: "Locataire" },
  { value: "Hébergé(e)", label: "Hébergé(e)" },
];

export default function RequestCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [localites, setLocalites] = useState([]);
  const [recto, setRecto] = useState([]);
  const [verso, setVerso] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const list = await getLocalites();
        setLocalites(list || []);
      } catch {
        message.error("Impossible de charger les localités");
      }
    })();
  }, []);

  const beforeUpload = () => false; // AntD Upload en mode contrôlé (pas d’upload auto)

  const onFinish = async (values) => {
    values = { ...values, localite:  localites.find((l) => l.id === values.localiteId)?.nom || "" };
    console.log(values)
    try {
      setSubmitting(true);
      // FormData
      const fd = new FormData();
      // Demandeur
      fd.append("prenom", values.prenom);
      fd.append("nom", values.nom);
      fd.append("email", values.email);
      fd.append("telephone", values.telephone);
      fd.append("adresse", values.adresse);
      fd.append("profession", values.profession);
      fd.append("lieuNaissance", values.lieuNaissance);
      fd.append("dateNaissance", values.dateNaissance.format("YYYY-MM-DD"));
      fd.append("numeroElecteur", values.numeroElecteur);
      fd.append("situationMatrimoniale", values.situationMatrimoniale);
      fd.append("statutLogement", values.statutLogement);
      fd.append("nombreEnfant", String(values.nombreEnfant ?? 0));
      // Demande
      fd.append("typeDemande", values.typeDemande);
      fd.append("typeTitre", values.typeTitre);
      fd.append("typeDocument", values.typeDocument);
      fd.append("localiteId", String(values.localiteId));
      fd.append("superficie", String(values.superficie));
      fd.append("usagePrevu", values.usagePrevu);
      fd.append("possedeAutreTerrain", String(!!values.possedeAutreTerrain));
      fd.append("terrainAKaolack", String(!!values.terrainAKaolack));
      fd.append("terrainAilleurs", String(!!values.terrainAilleurs));
      fd.append("localite",  localites.find((l) => l.id === values.localiteId)?.nom || "");
      // Fichiers
      if (recto[0]?.originFileObj) fd.append("recto", recto[0].originFileObj);
      if (verso[0]?.originFileObj) fd.append("verso", verso[0].originFileObj);

      console.log(fd);
      const res = await createDemande(fd);
      if (!res?.success) throw new Error("Création échouée");
      message.success("Demande créée");
      navigate(`/admin/demandes/${res.item.id}/edit`);
    } catch (e) {
      console.log(e)
      message.error(e?.response?.data?.message || e?.message || "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AdminBreadcrumb title="Nouvelle demande" />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">

            
              <Card title="Nouvelle demande">
                <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{
                  typeDocument: "CNI",
                  possedeAutreTerrain: false, terrainAKaolack: false, terrainAilleurs: false,
                  nombreEnfant: 0
                }}>
                  {/* Demandeur */}
                  <Form.Item label="Prénom" name="prenom" rules={[{ required: true }]}><Input /></Form.Item>
                  <Form.Item label="Nom" name="nom" rules={[{ required: true }]}><Input /></Form.Item>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}><Input /></Form.Item>
                    <Form.Item label="Téléphone" name="telephone" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item label="Adresse" name="adresse" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item label="Profession" name="profession" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item label="Lieu de naissance" name="lieuNaissance" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item
                      label="Date de naissance"
                      name="dateNaissance"
                      rules={[{ required: true }]}
                    >
                      <DatePicker
                        className="w-full"
                        format="YYYY-MM-DD"
                        disabledDate={(d) => d.isAfter(dayjs().subtract(18, "year"))}
                      />
                    </Form.Item>
                    <Form.Item
                      label="N° électeur (13 Caractères)" name="numeroElecteur"
                      rules={[{ required: true }]}>
                      <Input minLength={13} maxLength={15} />
                    </Form.Item>

                    <Form.Item label="Situation matrimoniale" name="situationMatrimoniale" rules={[{ required: true }]}>
                      <Select allowClear placeholder="Sélectionner">
                        {SITUATION_OPTIONS.map(o => <Option key={o.value} value={o.value}>{o.label}</Option>)}
                      </Select>
                    </Form.Item>
                    <Form.Item label="Statut logement" name="statutLogement" rules={[{ required: true }]}>
                      <Select allowClear placeholder="Sélectionner">
                        {STATUT_LOGEMENT_OPTIONS.map(o => <Option key={o.value} value={o.value}>{o.label}</Option>)}
                      </Select>
                    </Form.Item>
                    <Form.Item label="Nombre d'enfants" name="nombreEnfant" rules={[{ type: "number", min: 0 }]}>
                      <InputNumber className="w-full" min={0} />
                    </Form.Item>
                  </div>

                  {/* Demande */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Form.Item label="Type de demande" name="typeDemande" rules={[{ required: true }]}>
                      <Select allowClear placeholder="Sélectionner">
                        {TYPE_DEMANDE_OPTIONS.map(o => <Option key={o.value} value={o.value}>{o.label}</Option>)}
                      </Select>
                    </Form.Item>
                    <Form.Item label="Type de titre" name="typeTitre" rules={[{ required: true }]}>
                      <Select allowClear placeholder="Sélectionner">
                        {TYPE_TITRE_OPTIONS.map(o => <Option key={o.value} value={o.value}>{o.label}</Option>)}
                      </Select>
                    </Form.Item>
                    <Form.Item label="Type de document" name="typeDocument" rules={[{ required: true }]}>
                      <Select allowClear>
                        {TYPE_DOCUMENT_OPTIONS.map(o => <Option key={o.value} value={o.value}>{o.label}</Option>)}
                      </Select>
                    </Form.Item>
                    <Form.Item label="Localité" name="localiteId" rules={[{ required: true }]}>
                      <Select showSearch placeholder="Sélectionner" optionFilterProp="children">
                        {localites.map((l) => <Option key={l.id} value={l.id}>{l.nom}</Option>)}
                      </Select>
                    </Form.Item>
                    <Form.Item label="Superficie (m²)" name="superficie" rules={[{ required: true, type: "number", min: 1 }]}>
                      <InputNumber className="w-full" min={1} />
                    </Form.Item>
                    <Form.Item label="Usage prévu" name="usagePrevu" rules={[{ required: true }]}>
                      <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item name="possedeAutreTerrain" valuePropName="checked">
                      <Checkbox>Possède un autre terrain</Checkbox>
                    </Form.Item>
                    <Form.Item name="terrainAKaolack" valuePropName="checked">
                      <Checkbox>Terrain à Kaolack</Checkbox>
                    </Form.Item>
                    <Form.Item name="terrainAilleurs" valuePropName="checked">
                      <Checkbox>Terrain ailleurs</Checkbox>
                    </Form.Item>
                  </div>

                  {/* Pièces */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Form.Item label="Recto (PDF/JPG/PNG)" required>
                      <Dragger
                        multiple={false}
                        beforeUpload={beforeUpload}
                        fileList={recto}
                        onChange={({ fileList }) => setRecto(fileList.slice(-1))}
                        accept=".pdf,.jpg,.jpeg,.png"
                      >
                        <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                        <p className="ant-upload-text">Glissez-déposez ou cliquez</p>
                      </Dragger>
                    </Form.Item>
                    <Form.Item label="Verso (PDF/JPG/PNG)" required>
                      <Dragger
                        multiple={false}
                        beforeUpload={beforeUpload}
                        fileList={verso}
                        onChange={({ fileList }) => setVerso(fileList.slice(-1))}
                        accept=".pdf,.jpg,.jpeg,.png"
                      >
                        <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                        <p className="ant-upload-text">Glissez-déposez ou cliquez</p>
                      </Dragger>
                    </Form.Item>
                  </div>

                  <div className="flex justify-end">
                    <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={submitting}>
                      Créer la demande
                    </Button>
                  </div>
                </Form>
              </Card>
          

          </div>
        </div>
      </section>

    </>
  );
}
