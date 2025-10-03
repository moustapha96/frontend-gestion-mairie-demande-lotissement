// // import React, { useEffect, useState } from "react";
// // import { Card, Form, Input, InputNumber, Select, Button, message } from "antd";
// // import { AdminBreadcrumb } from "@/components";
// // import { useNavigate, useParams } from "react-router-dom";
// // import { createTitre, getTitre, updateTitre } from "@/services/titreFoncierService";
// // import { getLocalites } from "@/services/localiteService";

// // const AdminTitreForm = () => {
// //     const navigate = useNavigate();
// //     const { id } = useParams(); // /admin/titres/:id/edit ou /new
// //     const isEdit = Boolean(id);

// //     const [form] = Form.useForm();
// //     const [loading, setLoading] = useState(false);
// //     const [localites, setLocalites] = useState([]);

// //     useEffect(() => {
// //         (async () => {
// //             const ls = await getLocalites();
// //             setLocalites(ls);
// //             if (isEdit) {
// //                 const { success, item } = await getTitre(id);
// //                 if (success) {
// //                     form.setFieldsValue({
// //                         numero: item.numero || "",
// //                         superficie: item.superficie || null,
// //                         etatDroitReel: item.etatDroitReel || "",
// //                         titreFigure: JSON.stringify(item.titreFigure ?? []),
// //                         quartierId: item.quartier?.id || null,
// //                         type: item?.type || null
// //                     });
// //                 }
// //             }
// //         })();
// //     }, [id, isEdit, form]);

// //     const onFinish = async (values) => {
// //         try {
// //             setLoading(true);
// //             const payload = {
// //                 numero: values.numero || null,
// //                 superficie: parseFloat(values.superficie) ?? null,
// //                 etatDroitReel: values.etatDroitReel || null,
// //                 quartierId: values.quartierId || null,
// //                 type: values.type
// //             };
// //             // parse titreFigure JSON → array
// //             try {
// //                 payload.titreFigure = values.titreFigure ? JSON.parse(values.titreFigure) : null;
// //                 if (payload.titreFigure && !Array.isArray(payload.titreFigure)) {
// //                     throw new Error("titreFigure doit être un tableau");
// //                 }
// //             } catch (e) {
// //                 message.error("Le champ 'titreFigure' doit être un JSON de type tableau.");
// //                 setLoading(false);
// //                 return;
// //             }

// //             if (isEdit) {
// //                 await updateTitre(id, payload);
// //                 message.success("Titre mis à jour.");
// //             } else {
// //                 await createTitre(payload);
// //                 message.success("Titre créé.");
// //             }
// //             navigate("/admin/titres");
// //         } catch (e) {
// //             message.error("Erreur lors de l’enregistrement.");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     return (
// //         <>
// //             <AdminBreadcrumb title={isEdit ? "Éditer un titre" : "Nouveau titre"} />
// //             <section>
// //                 <div className="container mx-auto px-4">
// //                     <div className="my-6 space-y-6">
// //                         <Card title={isEdit ? "Modifier le titre foncier" : "Créer un titre foncier"}>
// //                             <Form form={form} layout="vertical" onFinish={onFinish}>

// //                                 <Form.Item
// //                                     name="type"
// //                                     placeholder="Sélectionner le type de titre"
// //                                     label="Type de titre"
// //                                     rules={[{ required: true, message: "Le type est requis" }]}
// //                                 >
// //                                     <Select>
// //                                         <Option value="Bail">Bail</Option>
// //                                         <Option value="Titre foncier">Titre foncier</Option>
// //                                         <Option value="Place publique">Place publique</Option>
// //                                         <Option value="Domaine état">Domaine état</Option>
// //                                     </Select>
// //                                 </Form.Item>



// //                                 <Form.Item name="numero" label="Numéro">
// //                                     <Input placeholder="TF-2025-001" />
// //                                 </Form.Item>

// //                                 <Form.Item name="superficie" label="Superficie (m²)">
// //                                     <InputNumber style={{ width: '100%' }} min={0} placeholder="Ex: 300" />
// //                                 </Form.Item>

// //                                 <Form.Item name="quartierId" label="Quartier">
// //                                     <Select
// //                                         allowClear
// //                                         placeholder="Sélectionner"
// //                                         options={localites.map(l => ({ label: l.nom, value: l.id }))}
// //                                     />
// //                                 </Form.Item>

// //                                 <Form.Item name="etatDroitReel" label="État du droit réel">
// //                                     <Input.TextArea rows={4} placeholder="Texte libre..." />
// //                                 </Form.Item>

// //                                 <Form.Item
// //                                     name="titreFigure"
// //                                     label="Titre figure (JSON array)"
// //                                     tooltip="Ex: [ [14.73,-17.44], [14.74,-17.45] ]"
// //                                 >
// //                                     <Input.TextArea rows={3} placeholder='[]' />
// //                                 </Form.Item>

// //                                 <div className="flex gap-2">
// //                                     <Button className="ant-btn-primary" htmlType="submit" loading={loading}>
// //                                         {isEdit ? "Mettre à jour" : "Créer"}
// //                                     </Button>
// //                                     <Button onClick={() => navigate("/admin/titres")}>Annuler</Button>
// //                                 </div>
// //                             </Form>
// //                         </Card>
// //                     </div>
// //                 </div>
// //             </section>
// //         </>
// //     );
// // };

// // export default AdminTitreForm;






// // src/pages/admin/titres/Form.jsx (ta page AdminTitreForm)
// import React, { useEffect, useState } from "react";
// import { Card, Form, Input, InputNumber, Select, Button, message, Upload, Space } from "antd";
// import { InboxOutlined } from "@ant-design/icons";
// import { AdminBreadcrumb } from "@/components";
// import { useNavigate, useParams } from "react-router-dom";
// import { createTitre, getTitre, updateTitre } from "@/services/titreFoncierService";
// import { getLocalites } from "@/services/localiteService";

// const { Option } = Select;
// const { Dragger } = Upload;

// const AdminTitreForm = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEdit = Boolean(id);

//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [localites, setLocalites] = useState([]);
//   const [fileList, setFileList] = useState([]);
//   const [fichierFile, setFichierFile] = useState(null);



//   const onFichierChange = ({ file }) => setFichierFile(file);

//   useEffect(() => {
//     (async () => {
//       try {
//         const ls = await getLocalites();
//         setLocalites(ls || []);
//         if (isEdit) {
//           const { success, item } = await getTitre(id);
//           if (success) {
//             form.setFieldsValue({
//               numero: item.numero || "",
//               superficie: item.superficie ?? null,
//               etatDroitReel: item.etatDroitReel || "",
//               titreFigure: JSON.stringify(item.titreFigure ?? []),
//               quartierId: item.quartier?.id || null,
//               type: item?.type || null,
//               fichierUrl: item.fichier || "",
//             });
//           }
//         }
//       } catch {
//         message.error("Chargement impossible");
//       }
//     })();
//   }, [id, isEdit, form]);

//   const onFinish = async (values) => {
//     try {
//       setLoading(true);

//       // Valide titreFigure JSON (si présent)
//       let titreFigureArr = [];
//       if (values.titreFigure) {
//         try {
//           const parsed = JSON.parse(values.titreFigure);
//           if (parsed && !Array.isArray(parsed)) throw new Error();
//           titreFigureArr = parsed || [];
//         } catch {
//           message.error("Le champ 'Titre figure' doit être un JSON de type tableau.");
//           setLoading(false);
//           return;
//         }
//       }

//       const hasLocalFile = fileList?.[0]?.originFileObj;

//       if (hasLocalFile) {
//         // MULTIPART
//         const fd = new FormData();
//         fd.append("type", values.type ?? "");
//         fd.append("numero", values.numero ?? "");
//         if (values.superficie !== undefined && values.superficie !== null) {
//           fd.append("superficie", String(values.superficie));
//         }
//         fd.append("etatDroitReel", values.etatDroitReel ?? "");
//         fd.append("titreFigure", JSON.stringify(titreFigureArr));
//         if (values.quartierId) fd.append("quartierId", String(values.quartierId));

//         if (fichierFile) {
//           formData.append("fichier", fichierFile.originFileObj || rectoFile);
//         }

//         if (isEdit) {
//           await updateTitre(id, fd, true);
//           message.success("Titre mis à jour.");
//         } else {
//           await createTitre(fd, true);
//           message.success("Titre créé.");
//         }
//       } else {
//         // JSON
//         const payload = {
//           type: values.type ?? null,
//           numero: values.numero || null,
//           superficie: (values.superficie ?? null) !== null ? Number(values.superficie) : null,
//           etatDroitReel: values.etatDroitReel || null,
//           titreFigure: titreFigureArr,
//           quartierId: values.quartierId || null,
//           fichier: values.fichierUrl || null, // URL absolue si fournie
//         };

//         if (isEdit) {
//           await updateTitre(id, payload, false);
//           message.success("Titre mis à jour.");
//         } else {
//           await createTitre(payload, false);
//           message.success("Titre créé.");
//         }
//       }

//       navigate("/admin/titres");
//     } catch (e) {
//       console.log(e)
//       message.error(e?.response?.data?.message || e?.message || "Erreur lors de l’enregistrement.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <AdminBreadcrumb title={isEdit ? "Éditer un titre" : "Nouveau titre"} />
//       <section>
//         <div className="container ">
//           <div className="my-6 space-y-6">
//             <Card title={isEdit ? "Modifier le titre foncier" : "Créer un titre foncier"}>
//               <Form form={form} layout="vertical" onFinish={onFinish}>
//                 <Form.Item
//                   name="type"
//                   label="Type de titre"
//                   rules={[{ required: true, message: "Le type est requis" }]}
//                 >
//                   <Select placeholder="Sélectionner le type de titre">
//                     <Option value="Bail">Bail</Option>
//                     <Option value="Titre foncier">Titre foncier</Option>
//                     <Option value="Place publique">Place publique</Option>
//                     <Option value="Domaine état">Domaine état</Option>
//                   </Select>
//                 </Form.Item>

//                 <Form.Item name="numero" label="Numéro">
//                   <Input placeholder="TF-2025-001" />
//                 </Form.Item>

//                 <Form.Item name="superficie" label="Superficie (m²)">
//                   <InputNumber style={{ width: "100%" }} min={0} placeholder="Ex: 300" />
//                 </Form.Item>

//                 <Form.Item name="quartierId" label="Quartier">
//                   <Select
//                     allowClear
//                     placeholder="Sélectionner"
//                     options={localites.map(l => ({ label: l.nom, value: l.id }))}
//                   />
//                 </Form.Item>

//                 <Form.Item name="etatDroitReel" label="État du droit réel">
//                   <Input.TextArea rows={4} placeholder="Texte libre..." />
//                 </Form.Item>

//                 <Form.Item
//                   name="titreFigure"
//                   label="Titre figure (JSON array)"
//                   tooltip="Ex: [ [14.73,-17.44], [14.74,-17.45] ]"
//                 >
//                   <Input.TextArea rows={3} placeholder="[]" />
//                 </Form.Item>

//                 <Card size="small" title="Pièce jointe du titre (au choix)">
//                   <Space direction="vertical" size="large" style={{ width: "100%" }}>
              
//                     <Dragger multiple={false} maxCount={1}  onChange={onFichierChange}
//                       accept=".pdf,.jpg,.jpeg,.png" fileList={fichierFile ? [fichierFile] : []} onRemove={() => setFichierFile(null)}>
//                       <p className="ant-upload-drag-icon"><InboxOutlined /></p>
//                       <p className="ant-upload-text">Glissez-déposez (recto) ou cliquez</p>
//                     </Dragger>

                  
//                     <Form.Item
//                       name="fichierUrl"
//                       label="Ou lien CDN (absolu)"
//                       tooltip='Ex: https://cdn.exemple.com/tfs/TF-2025-0001.pdf'
//                     >
//                       <Input placeholder="https://cdn.exemple.com/tfs/mon-fichier.pdf" />
//                     </Form.Item>
//                   </Space>
//                 </Card>

//                 <div className="flex gap-2 mt-4">
//                   <Button className="ant-btn-primary" htmlType="submit" loading={loading}>
//                     {isEdit ? "Mettre à jour" : "Créer"}
//                   </Button>
//                   <Button onClick={() => navigate("/admin/titres")}>Annuler</Button>
//                 </div>
//               </Form>
//             </Card>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default AdminTitreForm;


import React, { useEffect, useState } from "react";
import { Card, Form, Input, InputNumber, Select, Button, message, Upload, Space } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { AdminBreadcrumb } from "@/components";
import { useNavigate, useParams } from "react-router-dom";
import { createTitre, creationTitre, getTitre, mettreAjour, updateTitre } from "@/services/titreFoncierService";
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
  const [fileList, setFileList] = useState([]);
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
              numero: item.numero || "",
              superficie: item.superficie ?? null,
              etatDroitReel: item.etatDroitReel || "",
              quartierId: item.quartier?.id || null,
              type: item?.type || null,
              fichierUrl: item.fichier || "",
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
        let titreFigureArr = [];
        if (values.titreFigure) {
            try {
                const parsed = JSON.parse(values.titreFigure);
                if (parsed && !Array.isArray(parsed)) throw new Error();
                titreFigureArr = parsed || [];
            } catch {
                message.error("Le champ 'Titre figure' doit être un JSON de type tableau.");
                setLoading(false);
                return;
            }
        }

        const fd = new FormData();
        fd.append("type", values.type ?? "");
        fd.append("numero", values.numero ?? "");
        if (values.superficie !== undefined && values.superficie !== null) {
            fd.append("superficie", String(values.superficie));
        }
        fd.append("etatDroitReel", values.etatDroitReel ?? "");

        if (values.quartierId) fd.append("quartierId", String(values.quartierId));

        // Gestion du fichier
        if (fichierFile?.originFileObj) {
            fd.append("fichier", fichierFile.originFileObj);
        } else if (values.fichierUrl) {
            fd.append("fichier", values.fichierUrl); // Champ "fichier" attend une URL ou un fichier
        }
        
        if (isEdit) {
            await mettreAjour(id, fd);
            message.success("Titre mis à jour.");
        } else {
            await creationTitre(fd);
            message.success("Titre créé.");
        }
        navigate("/admin/titres");
    } catch (e) {
        console.error(e);
        message.error(e?.response?.data?.message || e?.message || "Erreur lors de l’enregistrement.");
    } finally {
        setLoading(false);
    }
};

  const onFichierChange = ({ file }) => {
    console.log(file);
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
                    placeholder="Sélectionner"
                    options={localites.map(l => ({ label: l.nom, value: l.id }))}
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
                      <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                      <p className="ant-upload-text">Glissez-déposez ou cliquez pour sélectionner un fichier</p>
                    </Dragger>

                    <Form.Item
                      name="fichierUrl"
                      label="Ou lien CDN (absolu)"
                      tooltip='Ex: https://cdn.exemple.com/tfs/titres/TF-2025-0001.pdf'
                    >
                      <Input placeholder="https://cdn.exemple.com/tfs/titres/mon-fichier.pdf" />
                    </Form.Item>
                  </Space>
                </Card>
                <div className="flex gap-2 mt-4">
                  <Button className="ant-btn-primary" htmlType="submit" loading={loading}>
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
