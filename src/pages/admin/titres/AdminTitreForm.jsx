import React, { useEffect, useState } from "react";
import { Card, Form, Input, InputNumber, Select, Button, message } from "antd";
import { AdminBreadcrumb } from "@/components";
import { useNavigate, useParams } from "react-router-dom";
import { createTitre, getTitre, updateTitre } from "@/services/titreFoncierService";
import { getLocalites } from "@/services/localiteService";

const AdminTitreForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // /admin/titres/:id/edit ou /new
    const isEdit = Boolean(id);

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [localites, setLocalites] = useState([]);

    useEffect(() => {
        (async () => {
            const ls = await getLocalites();
            setLocalites(ls);
            if (isEdit) {
                const { success, item } = await getTitre(id);
                if (success) {
                    form.setFieldsValue({
                        numero: item.numero || "",
                        numeroLot: item.numeroLot || "",
                        superficie: item.superficie || null,
                        etatDroitReel: item.etatDroitReel || "",
                        titreFigure: JSON.stringify(item.titreFigure ?? []),
                        quartierId: item.quartier?.id || null,
                        type: item?.type || null
                    });
                }
            }
        })();
    }, [id, isEdit, form]);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const payload = {
                numero: values.numero || null,
                numeroLot: values.numeroLot || null,
                superficie: values.superficie ?? null,
                etatDroitReel: values.etatDroitReel || null,
                quartierId: values.quartierId || null,
                type: values.type
            };
            // parse titreFigure JSON → array
            try {
                payload.titreFigure = values.titreFigure ? JSON.parse(values.titreFigure) : null;
                if (payload.titreFigure && !Array.isArray(payload.titreFigure)) {
                    throw new Error("titreFigure doit être un tableau");
                }
            } catch (e) {
                message.error("Le champ 'titreFigure' doit être un JSON de type tableau.");
                setLoading(false);
                return;
            }

            if (isEdit) {
                await updateTitre(id, payload);
                message.success("Titre mis à jour.");
            } else {
                await createTitre(payload);
                message.success("Titre créé.");
            }
            navigate("/admin/titres");
        } catch (e) {
            message.error("Erreur lors de l’enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AdminBreadcrumb title={isEdit ? "Éditer un titre" : "Nouveau titre"} />
            <section>
                <div className="container mx-auto px-4">
                    <div className="my-6 space-y-6">
                        <Card title={isEdit ? "Modifier le titre foncier" : "Créer un titre foncier"}>
                            <Form form={form} layout="vertical" onFinish={onFinish}>

                                <Form.Item
                                    name="type"
                                    placeholder="Sélectionner le type de titre"
                                    label="Type de titre"
                                    rules={[{ required: true, message: "Le type est requis" }]}
                                >
                                    <Select>
                                        <Option value="Bail">Bail</Option>
                                        <Option value="Titre foncier">Titre foncier</Option>
                                        <Option value="Place publique">Place publique</Option>
                                        <Option value="Domaine état">Domaine état</Option>
                                    </Select>
                                </Form.Item>



                                <Form.Item name="numero" label="Numéro">
                                    <Input placeholder="TF-2025-001" />
                                </Form.Item>




                                <Form.Item name="numeroLot" label="Numéro de lot">
                                    <Input placeholder="L-45" />
                                </Form.Item>

                                <Form.Item name="superficie" label="Superficie (m²)">
                                    <InputNumber style={{ width: '100%' }} min={0} placeholder="Ex: 300" />
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

                                <Form.Item
                                    name="titreFigure"
                                    label="Titre figure (JSON array)"
                                    tooltip="Ex: [ [14.73,-17.44], [14.74,-17.45] ]"
                                >
                                    <Input.TextArea rows={3} placeholder='[]' />
                                </Form.Item>

                                <div className="flex gap-2">
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
