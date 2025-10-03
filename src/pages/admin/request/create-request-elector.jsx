"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Form, Input, InputNumber, Select, Button, DatePicker, Checkbox, Upload, message } from "antd";
import { InboxOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { AdminBreadcrumb, DemandeurBreadcrumb as Breadcrumb } from "@/components";
import { useAuthContext } from "@/context";
import { getLocalites } from "@/services/localiteService";
import { createDemandeFromElecteur } from "@/services/demandeService";
import MapCar from "../Map/MapCar";

dayjs.extend(customParseFormat);

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

// Petites aides
const tryParseDDMMYYYY = (s) => {
    if (!s) return null;
    // ex: "24/04/1956" → dayjs
    const d = dayjs(s, "DD/MM/YYYY", true);
    return d.isValid() ? d : null;
};
// Corrige les petites corruptions UTF-8 fréquentes ("commerÃ§ant" → "commerçant")
const fixUtf8 = (t) => {
    if (!t) return "";
    try {
        return decodeURIComponent(escape(t));
    } catch {
        return t;
    }
};

const val = (v) => (v !== undefined && v !== null && String(v).trim() !== "" ? String(v) : "—");
const ouiNon = (v) => {
    const s = String(v || "").toLowerCase();
    if (s.startsWith("o")) return "Oui";
    if (s.startsWith("n")) return "Non";
    return v ? "Oui" : v === false ? "Non" : "—";
};
const fmtNaissance = (d, lieu) =>
    d ? `le ${d}${lieu ? ` à ${lieu}` : ""}` : (lieu ? `à ${lieu}` : "—");


export default function RequestCreateFromElector() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthContext();
    const electeurFromState = location?.state?.electeur || null;
    const electeur = useMemo(() => electeurFromState, [electeurFromState]);

    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [localites, setLocalites] = useState([]);
    const [recto, setRecto] = useState([]);
    const [verso, setVerso] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [selectedLocalite, setSelectedLocalite] = useState(null);

    // Redirection si accès direct
    useEffect(() => {
        if (!electeur) navigate("/admin/electeurs");
    }, [electeur, navigate]);

    // Charger localités
    useEffect(() => {
        (async () => {
            try {
                const list = await getLocalites();
                setLocalites((list || []).map((l) => ({
                    id: l.id ?? l?.ID ?? l?.Id,
                    nom: l.nom ?? l?.name ?? l?.label,
                    lat: l.lat ?? l?.latitude,
                    lng: l.lng ?? l?.longitude,
                })));
            } catch {
                message.error("Impossible de charger les localités");
            }
        })();
    }, []);

    // Initial values (pré-remplissage électeur)
    const initialDate = tryParseDDMMYYYY(electeur?.DATE_NAISS);
    const initialValues = {
        // Identité
        prenom: electeur?.PRENOM || "",
        nom: electeur?.NOM || "",
        email: electeur?.EMAIL || "",
        telephone: electeur?.TEL1 || electeur?.TEL2 || electeur?.WHATSAPP || "",
        profession: fixUtf8(electeur?.PROFESSION) || "",
        adresse: electeur?.ADRESSE || "",
        lieuNaissance: electeur?.LIEU_NAISS || "",
        dateNaissance: initialDate || null, // Dayjs pour DatePicker
        numeroElecteur: electeur?.NIN || "",

        // Demande
        typeDemande: undefined,
        typeTitre: undefined,
        typeDocument: "CNI",
        localiteId: undefined,
        superficie: undefined,
        usagePrevu: "",
        possedeAutreTerrain: false,
        terrainAKaolack: false,
        terrainAilleurs: false,

        // Optionnel (si tu veux exposer ces champs comme dans ton modèle 1)
        situationMatrimoniale: undefined,
        statutLogement: undefined,
        nombreEnfant: 0,
    };

    const beforeUpload = () => false;

    const onLocaliteChange = (id) => {
        const loc = localites.find((l) => String(l.id) === String(id));
        setSelectedLocalite(loc || null);
        setShowMap(!!loc);
    };

    const onFinish = async (values) => {
        try {
            setSubmitting(true);

            // Contrainte 18 ans min (comme ta page modèle)
            const isUnder18 = values?.dateNaissance && dayjs(values.dateNaissance).isAfter(dayjs().subtract(18, "year"));
            if (isUnder18) {
                return message.error("Le demandeur doit avoir au moins 18 ans");
            }

            const fd = new FormData();

            // Identité (backend /nouvelle-demande exige ces champs)
            fd.append("prenom", values.prenom);
            fd.append("nom", values.nom);
            fd.append("email", values.email);
            fd.append("telephone", values.telephone);
            fd.append("profession", values.profession);
            fd.append("adresse", values.adresse);
            fd.append("lieuNaissance", values.lieuNaissance);
            fd.append("dateNaissance", values.dateNaissance ? dayjs(values.dateNaissance).format("YYYY-MM-DD") : "");
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

            // Fichiers (comme ton modèle)
            if (recto[0]?.originFileObj) fd.append("recto", recto[0].originFileObj);
            if (verso[0]?.originFileObj) fd.append("verso", verso[0].originFileObj);

            // Pour l’audit si besoin
            if (user?.email) fd.append("adminEmail", user.email);

            const res = await createDemandeFromElecteur(fd);
            if (!res?.success && !res?.demande?.id) throw new Error(res?.message || "Création échouée");

            message.success("Demande créée avec succès");
            navigate(`/admin/demandes/${res?.demande?.id || res?.item?.id}/details`);
        } catch (e) {
            message.error(e?.response?.data?.message || e?.message || "Erreur lors de la création");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <AdminBreadcrumb title="Créer une demande pour un électeur" />
            <div className="container mx-auto px-4 my-6">
                <Card
                    title={
                        <div>
                            <div className="text-xl font-semibold">Nouvelle demande de terrain</div>
                            <div className="text-sm text-gray-500">Électeur sélectionné depuis la recherche</div>
                        </div>
                    }
                >
                    {/* Bandeau infos électeur */}
                    {electeur && (
                        <div className="px-4 py-3 mb-4 rounded-lg border bg-blue-50 border-blue-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                {/* Identité */}
                                <div>
                                    <div className="text-gray-500">ID</div>
                                    <div className="font-mono">{val(electeur.ID)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Numéro Électeur</div>
                                    <div className="font-mono">{val(electeur.NIN)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">N° Carte</div>
                                    <div className="font-mono">{val(electeur.NUMERO)}</div>
                                </div>

                                <div className="md:col-span-2">
                                    <div className="text-gray-500">Nom & Prénom</div>
                                    <div className="font-medium">{`${val(electeur.NOM)} ${val(electeur.PRENOM)}`}</div>
                                </div>

                                <div>
                                    <div className="text-gray-500">Naissance</div>
                                    <div className="font-mono">{fmtNaissance(electeur.DATE_NAISS, electeur.LIEU_NAISS)}</div>
                                </div>

                                {/* Contact */}
                                <div>
                                    <div className="text-gray-500">Email</div>
                                    <div className="font-mono">{val(electeur.EMAIL)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Téléphone 1</div>
                                    <div>{val(electeur.TEL1)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Téléphone 2</div>
                                    <div>{val(electeur.TEL2)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">WhatsApp</div>
                                    <div>{val(electeur.WHATSAPP)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Adresse</div>
                                    <div className="font-mono">{val(electeur.ADRESSE)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Quartier</div>
                                    <div className="font-mono">{val(electeur.QUARTIER)}</div>
                                </div>

                                {/* Profession / activité */}
                                <div>
                                    <div className="text-gray-500">Profession</div>
                                    <div className="font-mono">{val(fixUtf8(electeur.PROFESSION))}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">En activité</div>
                                    <div>{ouiNon(electeur.EN_ACTIVITE)}</div>
                                </div>

                                {/* Centre/Bureau */}
                                <div className="md:col-span-2">
                                    <div className="text-gray-500">Centre</div>
                                    <div>{val(electeur.CENTRE)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Bureau</div>
                                    <div>{val(electeur.BUREAU)}</div>
                                </div>

                                {/* Statuts fichier électoral */}
                                <div>
                                    <div className="text-gray-500">Inscrit au fichier</div>
                                    <div>{ouiNon(electeur.INSCRIT_AU_FICHIER)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">A déjà voté</div>
                                    <div>{ouiNon(electeur.DEJA_VOTE)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Parrainage</div>
                                    <div>{ouiNon(electeur.PARRAINAGE)}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={initialValues}
                        onFinish={onFinish}
                    >
                        <div className="grid md:grid-cols-2 gap-4">
                            <Form.Item label="Prénom" name="prenom" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Nom" name="nom" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
                                <Input placeholder="ex: nom@example.com" />
                            </Form.Item>
                            <Form.Item label="Téléphone" name="telephone" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Profession" name="profession" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Adresse" name="adresse" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Lieu de naissance" name="lieuNaissance" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Date de naissance"
                                name="dateNaissance"
                                rules={[{ required: true, message: "Date de naissance requise" }]}
                            >
                                <DatePicker
                                    className="w-full"
                                    format="YYYY-MM-DD"
                                    disabledDate={(d) => d && d.isAfter(dayjs().subtract(18, "year"))}
                                />
                            </Form.Item>

                            <Form.Item
                                label="N° électeur (13 chiffres)"
                                name="numeroElecteur"
                                minLength={13}
                                maxLength={15}
                                rules={[
                                    { required: true },
                                    { len: 13, message: "Le NIN doit comporter 13 Caractères" },
                                ]}
                            >
                                <Input maxLength={13} />
                            </Form.Item>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <Form.Item label="Situation matrimoniale" name="situationMatrimoniale">
                                <Select allowClear placeholder="Sélectionner">
                                    {SITUATION_OPTIONS.map(o => <Option key={o.value} value={o.value}>{o.label}</Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Statut logement" name="statutLogement">
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
                                    {TYPE_DEMANDE_OPTIONS.map((o) => (
                                        <Option key={o.value} value={o.value}>{o.label}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item label="Type de titre" name="typeTitre" rules={[{ required: true }]}>
                                <Select allowClear placeholder="Sélectionner">
                                    {TYPE_TITRE_OPTIONS.map((o) => (
                                        <Option key={o.value} value={o.value}>{o.label}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item label="Type de document" name="typeDocument" rules={[{ required: true }]}>
                                <Select allowClear>
                                    {TYPE_DOCUMENT_OPTIONS.map((o) => (
                                        <Option key={o.value} value={o.value}>{o.label}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item label="Localité" name="localiteId" rules={[{ required: true }]}>
                                <Select
                                    showSearch
                                    placeholder="Sélectionner"
                                    optionFilterProp="children"
                                    onChange={onLocaliteChange}
                                >
                                    {localites.map((l) => (
                                        <Option key={l.id} value={l.id}>{l.nom}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Superficie (m²)"
                                name="superficie"
                                rules={[{ required: true, type: "number", min: 1 }]}
                            >
                                <InputNumber className="w-full" min={1} />
                            </Form.Item>

                            <Form.Item label="Usage prévu" name="usagePrevu" rules={[{ required: true }]}>
                                <Input.TextArea rows={3} placeholder="Décrivez l'usage prévu" />
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

                        {/* (Optionnel — si tu les exposes côté UI citoyen) */}


                        {/* Pièces */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <Form.Item
                                label="Recto (PDF/JPG/PNG)"
                                required
                            >
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

                            <Form.Item
                                label="Verso (PDF/JPG/PNG)"
                                required
                            >
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

                        <div className="flex justify-center">
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                                loading={submitting}
                                className="w-1/2"
                            >
                                {submitting ? "Envoi en cours..." : "Soumettre la demande"}
                            </Button>
                        </div>
                    </Form>

                    {/* Carte optionnelle de la localité */}
                    {showMap && selectedLocalite && (
                        <div className="mt-6">
                            <div className="border rounded-lg overflow-hidden">
                                <div className="h-[400px] flex items-center justify-center text-gray-400">
                                    {selectedLocalite.longitude && selectedLocalite.latitude &&
                                        <MapCar selectedItem={selectedLocalite} type="localite" />
                                    }
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </>
    );
}
