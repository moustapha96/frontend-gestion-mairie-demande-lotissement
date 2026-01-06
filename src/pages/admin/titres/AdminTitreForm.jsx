// export default AdminTitreForm;
import React, { useEffect, useState } from "react";
import { Card, Form, Input, InputNumber, Select, Button, message, Upload, Space } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { AdminBreadcrumb } from "@/components";
import { useNavigate, useParams } from "react-router-dom";
import { creationTitre, getTitre, mettreAjour } from "@/services/titreFoncierService";
import { getLocalites } from "@/services/localiteService";

const { Option } = Select;
const { Dragger } = Upload;

const AdminTitreForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [localites, setLocalites] = useState([]);
  const [fichierFile, setFichierFile] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const ls = await getLocalites();
        setLocalites(ls || []);
        if (isEdit) {
          const { success, item } = await getTitre(id);
          if (success) {
            form.setFieldsValue({
              type: item.type || null,
              numero: item.numero || "",
              superficie: item.superficie ?? null,
              etatDroitReel: item.etatDroitReel || "",
              quartierId: item.quartier?.id || null,
              fichierUrl: item.fichierUrl || item.fichier || "",
            });
          }
        }
      } catch {
        message.error("Chargement impossible");
      }
    })();
  }, [id, isEdit, form]);

 const onFinish = async (values) => {
  try {
    setLoading(true);
    const fd = new FormData();
    fd.append("type", values.type);
    fd.append("numero", values.numero || "");
    if (values.superficie !== undefined && values.superficie !== null && values.superficie !== "") {
      fd.append("superficie", String(values.superficie));
    }
    fd.append("etatDroitReel", values.etatDroitReel || "");

    // Gestion du fichier
    if (fichierFile?.originFileObj) {
      fd.append("fichier", fichierFile.originFileObj);
      console.log("Fichier ajouté au FormData :", fichierFile.originFileObj.name);
    } else if (values.fichierUrl) {
      fd.append("fichierUrl", values.fichierUrl);
      console.log("URL/chemin ajouté au FormData :", values.fichierUrl);
    } else {
      console.log("Aucun fichier ou URL fourni.");
    }

    if (values.quartierId) {
      fd.append("quartierId", String(values.quartierId));
    }

    // Affiche TOUT le contenu du FormData (pour débogage)
    for (let [key, value] of fd.entries()) {
      console.log(`${key}:`, value);
    }

    if (isEdit) {
      await mettreAjour(id, fd);
      message.success("Titre mis à jour avec succès.");
    } else {
      await creationTitre(fd);
      message.success("Titre créé avec succès.");
    }
    navigate("/admin/titres");
  } catch (e) {
    console.error("Erreur complète :", e);
    message.error(e?.response?.data?.message || e?.message || "Erreur lors de l’enregistrement.");
  } finally {
    setLoading(false);
  }
};


  const onFichierChange = ({ file }) => {
    setFichierFile(file);
  };

  return (
    <>
      <AdminBreadcrumb title={isEdit ? "Éditer un titre" : "Nouveau titre"} />
      <section>
        <div className="container">
          <div className="my-6 space-y-6">
            <Card title={isEdit ? "Modifier le titre foncier" : "Créer un titre foncier"}>
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                  name="type"
                  label="Type de titre"
                  rules={[{ required: true, message: "Le type est requis" }]}
                >
                  <Select placeholder="Sélectionner le type de titre">
                    <Option value="Bail">Bail</Option>
                    <Option value="Titre foncier">Titre foncier</Option>
                    <Option value="Place publique">Place publique</Option>
                    <Option value="Domaine état">Domaine état</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="numero" label="Numéro">
                  <Input placeholder="TF-2025-001" />
                </Form.Item>
                <Form.Item name="superficie" label="Superficie (m²)">
                  <InputNumber style={{ width: "100%" }} min={0} placeholder="Ex: 300" />
                </Form.Item>
                <Form.Item name="quartierId" label="Quartier">
                  <Select
                    allowClear
                    placeholder="Sélectionner un quartier"
                    options={localites.map((l) => ({ label: l.nom, value: l.id }))}
                  />
                </Form.Item>
                <Form.Item name="etatDroitReel" label="État du droit réel">
                  <Input.TextArea rows={4} placeholder="Texte libre..." />
                </Form.Item>

                <Card size="small" title="Pièce jointe du titre (au choix)">
                  <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <Dragger
                      multiple={false}
                      maxCount={1}
                      onChange={onFichierChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      fileList={fichierFile ? [fichierFile] : []}
                      onRemove={() => setFichierFile(null)}
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">Glissez-déposez ou cliquez pour sélectionner un fichier</p>
                    </Dragger>
                    <Form.Item
                      name="fichierUrl"
                      label="Ou lien vers le fichier (URL absolue ou chemin relatif)"
                      tooltip="Ex: /tfs/titre-20251016120000-12ab.pdf ou https://..."
                    >
                      <Input placeholder="Ex: /tfs/titre-20251016120000-12ab.pdf" />
                    </Form.Item>
                  </Space>
                </Card>

                <div className="flex gap-2 mt-4">
                  <Button type="primary" htmlType="submit" loading={loading}>
                    {isEdit ? "Mettre à jour" : "Créer"}
                  </Button>
                  <Button onClick={() => navigate("/admin/titres")}>Annuler</Button>
                </div>
              </Form>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminTitreForm;
