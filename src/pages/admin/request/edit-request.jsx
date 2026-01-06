

"use client";

import { useEffect, useState } from "react";
import { Card, Form, InputNumber, Select, Button, Upload, message, Alert } from "antd";
import { InboxOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { getLocalites } from "@/services/localiteService";
import { getDemande, getDetailsRequest, updateDemande } from "@/services/requestService";
import { AdminBreadcrumb } from "@/components";

const { Option } = Select;
const { Dragger } = Upload;

/* ======= Options normalisées ======= */
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

export default function RequestEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [localites, setLocalites] = useState([]);
    const [recto, setRecto] = useState([]);
    const [verso, setVerso] = useState([]);
    const [item, setItem] = useState(null);
    const [matchInfo, setMatchInfo] = useState(null);

    const beforeUpload = () => false;

    const norm = (s) =>
        (s || "")
            .toString()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toLowerCase();

    useEffect(() => {
        (async () => {
            try {
                const loc = await getLocalites();
                setLocalites(Array.isArray(loc) ? loc : []);
            } catch {
                /* noop */
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const res = await getDetailsRequest(String(id));
                if (!res?.success) throw new Error();
                setItem(res.item);

                form.setFieldsValue({
                    typeDemande: res.item.typeDemande ?? undefined,
                    typeTitre: res.item.typeTitre ?? undefined,
                    typeDocument: res.item.typeDocument ?? "CNI",
                    superficie: res.item.superficie ?? undefined,
                    usagePrevu: res.item.usagePrevu ?? undefined,
                    statut: res.item.statut ?? undefined,
                    // localiteId rempli après matching
                });
            } catch {
                message.error("Impossible de charger la demande");
            }
        })();
    }, [id, form]);

    // auto-match du champ texte "localite" vers la liste des localités
    useEffect(() => {
        if (!item || !localites?.length) return;

        // si backend fournit déjà l’objet quartier, on le garde
        if (item?.quartier?.id) {
            form.setFieldsValue({ localiteId: item.quartier.id });
            setMatchInfo(null);
            return;
        }

        const txt = item?.localite;
        if (!txt) {
            setMatchInfo(null);
            return;
        }

        const nTxt = norm(txt);
        let found = localites.find((l) => norm(l.nom) === nTxt);
        if (!found) {
            found = localites.find(
                (l) => norm(l.nom).startsWith(nTxt) || nTxt.startsWith(norm(l.nom))
            );
        }

        if (found) {
            form.setFieldsValue({ localiteId: found.id });
            setMatchInfo({
                type: "success",
                text: `Quartier détectée automatiquement : « ${found.nom} ».`,
            });
        } else {
            setMatchInfo({
                type: "warning",
                text: `Localité « ${txt} » non trouvée dans la liste. Sélectionnez-la manuellement.`,
            });
        }
    }, [item, localites, form]);

    const onFinish = async (values) => {
        console.log(recto, verso)
        console.log(values);
         const payload = {
                typeDemande: values.typeDemande ?? null,
                typeTitre: values.typeTitre ?? null,
                typeDocument: values.typeDocument ?? null,
                localiteId: values.localiteId ?? null,
                superficie: values.superficie ?? null,
                usagePrevu: values.usagePrevu ?? null,
                statut: values.statut ?? null,
            };
            if (recto[0]?.originFileObj) payload.recto = recto[0].originFileObj;
            if (verso[0]?.originFileObj) payload.verso = verso[0].originFileObj;

            console.log(payload);
        try {
            setLoading(true);
           

            const res = await updateDemande(String(id), payload);
            if (!res?.success) throw new Error();
            message.success("Demande mise à jour");
            navigate(`/admin/demandes/${id}/details`);
        } catch (e) {
            console.log(e)
            message.error(e?.response?.data?.detail || e?.message || "Erreur");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AdminBreadcrumb title="Éditer demande" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <Card title={`Éditer demande #${id}`}>
                            <Form form={form} layout="vertical" onFinish={onFinish}>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Type de demande */}
                                    <Form.Item label="Type de demande" name="typeDemande">
                                        <Select allowClear placeholder="Sélectionner">
                                            {TYPE_DEMANDE_OPTIONS.map((o) => (
                                                <Option key={o.value} value={o.value}>
                                                    {o.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    {/* Type de titre */}
                                    <Form.Item label="Type de titre" name="typeTitre">
                                        <Select allowClear placeholder="Sélectionner">
                                            {TYPE_TITRE_OPTIONS.map((o) => (
                                                <Option key={o.value} value={o.value}>
                                                    {o.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    {/* Type de document */}
                                    <Form.Item label="Type de document" name="typeDocument">
                                        <Select allowClear placeholder="Sélectionner">
                                            {TYPE_DOCUMENT_OPTIONS.map((o) => (
                                                <Option key={o.value} value={o.value}>
                                                    {o.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    {/* Localité (relation quartier) */}
                                    <Form.Item
                                        label={
                                            <div className="flex flex-col">
                                                <span>Localité (quartier)</span>
                                                {item?.localite && (
                                                    <small className="text-gray-500">
                                                        Valeur de la demande : « {item.localite} »
                                                    </small>
                                                )}
                                            </div>
                                        }
                                        name="localiteId"
                                    >
                                        <Select
                                            allowClear
                                            placeholder="Sélectionner"
                                            showSearch
                                            optionFilterProp="children"
                                        >
                                            {localites.map((l) => (
                                                <Option key={l.id} value={l.id}>
                                                    {l.nom}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    {/* Superficie */}
                                    <Form.Item label="Superficie (m²)" name="superficie">
                                        <InputNumber className="w-full" min={0} />
                                    </Form.Item>

                                    {/* Usage prévu */}
                                    <Form.Item label="Usage prévu" name="usagePrevu">
                                        <textarea className="ant-input" rows={3} />
                                    </Form.Item>

                                   
                                    {/* <Form.Item label="Statut" name="statut">
                                        <textarea className="ant-input" rows={1} />
                                    </Form.Item> */}


                                   
                                </div>

                                {matchInfo && (
                                    <Alert className="mb-4" type={matchInfo.type} message={matchInfo.text} showIcon />
                                )}

                                <h4 className="font-semibold mb-2">Remplacer les pièces (optionnel)</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Form.Item label="Recto (PDF/JPG/PNG)">
                                        <Dragger
                                            multiple={false}
                                            beforeUpload={beforeUpload}
                                            fileList={recto}
                                            onChange={({ fileList }) => setRecto(fileList.slice(-1))}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        >
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">Glissez-déposez ou cliquez</p>
                                        </Dragger>
                                        {item?.recto && (
                                            <div className="mt-2">
                                                <a href={item.recto} target="_blank" rel="noreferrer" className="text-primary">
                                                    Voir recto actuel
                                                </a>
                                            </div>
                                        )}
                                    </Form.Item>

                                    <Form.Item label="Verso (PDF/JPG/PNG)">
                                        <Dragger
                                            multiple={false}
                                            beforeUpload={beforeUpload}
                                            fileList={verso}
                                            onChange={({ fileList }) => setVerso(fileList.slice(-1))}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        >
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">Glissez-déposez ou cliquez</p>
                                        </Dragger>
                                        {item?.verso && (
                                            <div className="mt-2">
                                                <a href={item.verso} target="_blank" rel="noreferrer" className="text-primary">
                                                    Voir verso actuel
                                                </a>
                                            </div>
                                        )}
                                    </Form.Item>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                                        Enregistrer
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
