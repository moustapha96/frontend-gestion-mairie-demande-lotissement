"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Card, Descriptions, Divider, Tag, Button, Select, Space, Typography,
    Skeleton, message, Result, Modal, Input
} from "antd";
import {
    ArrowLeftOutlined, EditOutlined, SaveOutlined, CloseOutlined
} from "@ant-design/icons";

import { AdminBreadcrumb as Breadcrumb } from "@/components";
import { useAuthContext } from "@/context";
import {
    getDetailsRequest,
    updateStatutRequest,
    validateEtapeRequest,
    updateRefusRequest,
} from "@/services/requestService";

const { Title } = Typography;
const { TextArea } = Input;

/* ===================== Statuts (UI) ===================== */

const STATUT = Object.freeze({
    EN_ATTENTE: "En attente",
    EN_COURS_TRAITEMENT: "En cours de traitement",
    REJETEE: "Rejetée",
    APPROUVEE: "Approuvée",
    APPROUVE: "approuve",
});

const STATUT_OPTIONS = [
    { label: STATUT.EN_ATTENTE, value: STATUT.EN_ATTENTE },
    { label: STATUT.EN_COURS_TRAITEMENT, value: STATUT.EN_COURS_TRAITEMENT },
    { label: STATUT.REJETEE, value: STATUT.REJETEE },
    { label: STATUT.APPROUVEE, value: STATUT.APPROUVEE },
];

const STATUT_TAG = {
    [STATUT.EN_ATTENTE]: { color: "gold" },
    [STATUT.EN_COURS_TRAITEMENT]: { color: "processing" },
    [STATUT.REJETEE]: { color: "error" },
    [STATUT.APPROUVEE]: { color: "success" },
    [STATUT.APPROUVE]: { color: "success" },
};

// rôles autorisés à changer le statut/valider
const CAN_UPDATE_STATUT_ROLES = ["ROLE_MAIRE", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"];
const hasAnyRole = (user, roles) => user?.roles?.some((r) => roles.includes(r));

/* ===================== Utils ===================== */

const fmt = (v) => (v === null || v === undefined || v === "" ? "—" : v);
const fmtDate = (v) => (v ? new Date(String(v).replace(" ", "T")).toLocaleString("fr-FR") : "—");

const isFilled = (v) => !(v === null || v === undefined || (typeof v === "string" && v.trim() === ""));
const pick = (...vals) => vals.find(isFilled) ?? null;
const fmtDateISO = (v) => (v ? new Date(String(v).replace(" ", "T")).toISOString() : null);

const normalizeItem = (raw) => {
    const d = raw?.item ?? raw ?? null;
    if (!d) return null;

    const dem = d.demandeur || {};
    const uti = d.utilisateur || {};
    // fusion champ par champ (demandeur > utilisateur > champs plats)
    const demandeurMerged = {
        id: pick(dem.id, uti.id, null),
        prenom: pick(dem.prenom, uti.prenom, d.prenom),
        nom: pick(dem.nom, uti.nom, d.nom),
        email: pick(dem.email, uti.email, d.email),
        telephone: pick(dem.telephone, uti.telephone, d.telephone),
        adresse: pick(dem.adresse, uti.adresse, d.adresse),
        profession: pick(dem.profession, uti.profession, d.profession),
        numeroElecteur: pick(dem.numeroElecteur, uti.numeroElecteur, d.numeroElecteur),
        dateNaissance: pick(
            fmtDateISO(dem.dateNaissance),
            fmtDateISO(uti.dateNaissance),
            fmtDateISO(d.dateNaissance)
        ),
        lieuNaissance: pick(dem.lieuNaissance, uti.lieuNaissance, d.lieuNaissance),
        situationMatrimoniale: pick(dem.situationMatrimoniale, uti.situationMatrimoniale, d.situationMatrimoniale),
        statutLogement: pick(dem.statutLogement, uti.statutLogement, d.statutLogement),
        nombreEnfant: pick(dem.nombreEnfant, uti.nombreEnfant, d.nombreEnfant),
        isHabitant: pick(dem.isHabitant, uti.isHabitant, d.isHabitant, false),
        // pour savoir d’où viennent majoritairement les données
        __source: isFilled(dem?.prenom) || isFilled(dem?.nom) || Object.values(dem).some(isFilled)
            ? "demandeur"
            : isFilled(uti?.prenom) || isFilled(uti?.nom) || Object.values(uti).some(isFilled)
                ? "utilisateur"
                : "inconnu",
    };

    return {
        id: d.id,
        typeDemande: d.typeDemande,
        typeTitre: d.typeTitre,
        typeDocument: d.typeDocument,
        superficie: d.superficie,
        usagePrevu: d.usagePrevu,
        possedeAutreTerrain: !!d.possedeAutreTerrain,
        terrainAKaolack: !!d.terrainAKaolack,
        terrainAilleurs: !!d.terrainAilleurs,
        localite: d.localite ?? d?.quartier?.nom ?? null,

        statut: d.statut,
        dateCreation: d.dateCreation,
        dateModification: d.dateModification,

        recto: d.recto ?? null,
        verso: d.verso ?? null,

        demandeur: demandeurMerged,
        quartier: d.quartier ?? null,
    };
};

/* ===================== Page ===================== */

export default function DemandeDetailsAdmin() {
    const { id } = useParams();
    const { user } = useAuthContext();

    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [demande, setDemande] = useState(null);

    // édition statut
    const [editing, setEditing] = useState(false);
    const [newStatut, setNewStatut] = useState("");
    const [saving, setSaving] = useState(false);

    // actions validation / rejet
    const [loadingValidate, setLoadingValidate] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [motifRefus, setMotifRefus] = useState("");
    const [loadingReject, setLoadingReject] = useState(false);

    const canUpdateStatut = useMemo(() => hasAnyRole(user, CAN_UPDATE_STATUT_ROLES), [user]);

    const load = async () => {
        try {
            setLoading(true);
            setErr("");
            const data = await getDetailsRequest(String(id));
            console.log(data)
            const norm = normalizeItem(data);
            setDemande(norm);
            setNewStatut(norm?.statut || "");
        } catch (e) {
            setErr(e?.message || "Erreur lors du chargement.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const saveStatut = async () => {
        if (!newStatut) return message.error("Sélectionnez un statut");
        try {
            setSaving(true);
            await updateStatutRequest(String(id), { statut: newStatut });
            setDemande((prev) => ({ ...prev, statut: newStatut, dateModification: new Date().toISOString() }));
            setEditing(false);
            message.success("Statut mis à jour");
        } catch (e) {
            message.error(e?.message || "Échec de la mise à jour du statut");
        } finally {
            setSaving(false);
        }
    };

    const handleValidate = async () => {
        try {
            setLoadingValidate(true);
            await validateEtapeRequest(String(id)); // le backend avance l’étape / met à jour le statut si besoin
            await load();
            message.success("Étape validée");
        } catch (e) {
            message.error(e?.response?.data?.message || e?.message || "Erreur lors de la validation");
        } finally {
            setLoadingValidate(false);
        }
    };

    const handleReject = async () => {
        if (!motifRefus.trim()) return message.error("Le motif ne peut pas être vide");
        try {
            setLoadingReject(true);
            await updateRefusRequest(String(id), { motif: motifRefus.trim() }); // backend: statut=Rejetée
            setRejectOpen(false);
            setMotifRefus("");
            await load();
            message.success("Demande rejetée");
        } catch (e) {
            message.error(e?.response?.data?.message || e?.message || "Erreur lors du rejet");
        } finally {
            setLoadingReject(false);
        }
    };

    if (loading) {
        return (
            <>
                <Breadcrumb title={`Demande #${id}`} />
                <div className="container my-6">
                    <Card>
                        <Skeleton active paragraph={{ rows: 6 }} />
                    </Card>
                </div>
            </>
        );
    }

    if (err || !demande) {
        return (
            <>
                <Breadcrumb title={`Demande #${id}`} />
                <div className="container my-6">
                    <Result
                        status="error"
                        title="Impossible de charger les détails"
                        subTitle={err || "Veuillez réessayer."}
                        extra={<Button onClick={load}>Réessayer</Button>}
                    />
                </div>
            </>
        );
    }

    const statutTagProps = STATUT_TAG[demande.statut] || { color: "default" };
    const disableActions = demande.statut === STATUT.REJETEE ;

    return (
        <>
            <Breadcrumb title={`Demande #${demande.id}`} />
            <section>
                <div className="container">
                    <div className="my-6 space-y-16">

                        <Space style={{ marginBottom: 8 }}>
                            <Link to="/admin/demandes">
                                <Button icon={<ArrowLeftOutlined />}>Retour</Button>
                            </Link>
                        </Space>

                        {/* ====== NOUVEAU : Actions de validation / Attribution ====== */}
                        <Card
                            title={<Title level={4} style={{ margin: 0 }}>Actions de validation / Attribution</Title>}
                            extra={<Tag {...statutTagProps}>{demande.statut}</Tag>}
                        >

                        </Card>

                        {/* ====== Infos de la demande + changement de statut ====== */}
                        <Card
                            title={<Title level={4} style={{ margin: 0 }}>Informations de la demande</Title>}
                            extra={
                                <Space>
                                    {!editing ? (
                                        <>
                                            <Tag {...statutTagProps}>{demande.statut}</Tag>
                                            {canUpdateStatut && (
                                                <Button icon={<EditOutlined />} onClick={() => { setNewStatut(demande.statut); setEditing(true); }}>
                                                    Modifier le statut
                                                </Button>
                                            )}
                                        </>
                                    ) : (
                                        <Space.Compact>
                                            <Select
                                                style={{ minWidth: 220 }}
                                                value={newStatut}
                                                onChange={setNewStatut}
                                                options={STATUT_OPTIONS}
                                                disabled={saving}
                                            />
                                            <Button type="primary" icon={<SaveOutlined />} onClick={saveStatut} loading={saving}>
                                                Enregistrer
                                            </Button>
                                            <Button icon={<CloseOutlined />} onClick={() => setEditing(false)} disabled={saving}>
                                                Annuler
                                            </Button>
                                        </Space.Compact>
                                    )}
                                    <Button
                                        danger
                                        onClick={() => setRejectOpen(true)}
                                        disabled={!canUpdateStatut || disableActions}
                                        loading={loadingReject}
                                    >
                                        Rejeter
                                    </Button>

                                    {(demande.statut === STATUT.APPROUVEE || demande.statut === STATUT.APPROUVE )  && (
                                        <Link to={`/admin/demandes/${demande.id}/attribution`}>
                                            <Button type="default">
                                                Attribuer une parcelle
                                            </Button>
                                        </Link>
                                    )}
                                </Space>
                            }
                        >
                            <Descriptions bordered column={2} size="middle">
                                <Descriptions.Item label="Créée le">{fmtDate(demande.dateCreation)}</Descriptions.Item>
                                <Descriptions.Item label="Dernière modification">{fmtDate(demande.dateModification)}</Descriptions.Item>

                                <Descriptions.Item label="Type de demande">{fmt(demande.typeDemande)}</Descriptions.Item>
                                <Descriptions.Item label="Type de titre">{fmt(demande.typeTitre)}</Descriptions.Item>

                                <Descriptions.Item label="Superficie (m²)">{fmt(demande.superficie)}</Descriptions.Item>
                                <Descriptions.Item label="Type de document">{fmt(demande.typeDocument)}</Descriptions.Item>

                                <Descriptions.Item label="Usage prévu" span={2}>{fmt(demande.usagePrevu)}</Descriptions.Item>

                                <Descriptions.Item label="Localité">{fmt(demande.localite)}</Descriptions.Item>
                                <Descriptions.Item label="Autre terrain ?">
                                    <Space size={8}>
                                        <Tag color={demande.possedeAutreTerrain ? "green" : "default"}>
                                            Possède autre terrain : {demande.possedeAutreTerrain ? "Oui" : "Non"}
                                        </Tag>
                                        <Tag color={demande.terrainAKaolack ? "green" : "default"}>
                                            À Kaolack : {demande.terrainAKaolack ? "Oui" : "Non"}
                                        </Tag>
                                        <Tag color={demande.terrainAilleurs ? "green" : "default"}>
                                            Ailleurs : {demande.terrainAilleurs ? "Oui" : "Non"}
                                        </Tag>
                                    </Space>
                                </Descriptions.Item>
                            </Descriptions>

                            <Divider />

                            <Descriptions title="Documents fournis" bordered column={2} size="middle">
                                <Descriptions.Item label="Recto">
                                    {demande.recto ? (
                                        <a href={demande.recto} target="_blank" rel="noreferrer">Ouvrir le recto</a>
                                    ) : "—"}
                                </Descriptions.Item>
                                <Descriptions.Item label="Verso">
                                    {demande.verso ? (
                                        <a href={demande.verso} target="_blank" rel="noreferrer">Ouvrir le verso</a>
                                    ) : "—"}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>


                        {/* <Card title={<Title level={4} style={{ margin: 0 }}>Informations du demandeur</Title>}
                            extra={demande.demandeur?.__source === "utilisateur" ? <Tag color="blue">Données utilisateur</Tag> : null}>
                            <Descriptions bordered column={2} size="middle">
                                <Descriptions.Item label="Nom">
                                    {fmt(`${demande.demandeur?.prenom ?? ""} ${demande.demandeur?.nom ?? ""}`.trim())}
                                </Descriptions.Item>
                                <Descriptions.Item label="Email">{fmt(demande.demandeur?.email)}</Descriptions.Item>
                                <Descriptions.Item label="Téléphone">{fmt(demande.demandeur?.telephone)}</Descriptions.Item>
                                <Descriptions.Item label="Adresse">{fmt(demande.demandeur?.adresse)}</Descriptions.Item>
                                <Descriptions.Item label="Profession">{fmt(demande.demandeur?.profession)}</Descriptions.Item>
                                <Descriptions.Item label="N° électeur">{fmt(demande.demandeur?.numeroElecteur)}</Descriptions.Item>
                                <Descriptions.Item label="Date de naissance">
                                    {fmtDate(demande.demandeur?.dateNaissance)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Lieu de naissance">{fmt(demande.demandeur?.lieuNaissance)}</Descriptions.Item>
                                <Descriptions.Item label="Situation matrimoniale">{fmt(demande.demandeur?.situationMatrimoniale)}</Descriptions.Item>
                                <Descriptions.Item label="Statut logement">{fmt(demande.demandeur?.statutLogement)}</Descriptions.Item>
                                <Descriptions.Item label="Nombre d’enfants">{fmt(demande.demandeur?.nombreEnfant)}</Descriptions.Item>
                            </Descriptions>
                        </Card> */}


                        {/* Demandeur */}
                        <Card title={<Title level={4} style={{ margin: 0 }}>Informations du demandeur</Title>}>
                            <Descriptions bordered column={2} size="middle">
                                <Descriptions.Item label="Nom">
                                    {fmt(`${demande.demandeur?.prenom ?? ""} ${demande.demandeur?.nom ?? ""}`.trim())}
                                </Descriptions.Item>
                                <Descriptions.Item label="Email">{fmt(demande.demandeur?.email)}</Descriptions.Item>
                                <Descriptions.Item label="Téléphone">{fmt(demande.demandeur?.telephone)}</Descriptions.Item>
                                <Descriptions.Item label="Adresse">{fmt(demande.demandeur?.adresse)}</Descriptions.Item>
                                <Descriptions.Item label="Profession">{fmt(demande.demandeur?.profession)}</Descriptions.Item>
                                <Descriptions.Item label="N° électeur">{fmt(demande.demandeur?.numeroElecteur)}</Descriptions.Item>
                                <Descriptions.Item label="Date de naissance">{fmtDate(demande.demandeur?.dateNaissance)}</Descriptions.Item>
                                <Descriptions.Item label="Lieu de naissance">{fmt(demande.demandeur?.lieuNaissance)}</Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* Localité */}
                        {demande.quartier && (
                            <Card title={<Title level={5} style={{ margin: 0 }}>Localité</Title>}>
                                <Descriptions bordered column={2} size="small">
                                    <Descriptions.Item label="Nom">{fmt(demande.quartier?.nom)}</Descriptions.Item>
                                    {"prix" in (demande.quartier || {}) && (
                                        <Descriptions.Item label="Prix estimé">{fmt(demande.quartier?.prix)}</Descriptions.Item>
                                    )}
                                    {demande.quartier?.description && (
                                        <Descriptions.Item label="Description" span={2}>{fmt(demande.quartier?.description)}</Descriptions.Item>
                                    )}
                                </Descriptions>
                            </Card>
                        )}
                    </div>
                </div>
            </section>

            {/* Modal REJET */}
            <Modal
                title="Rejeter la demande"
                open={rejectOpen}
                onOk={handleReject}
                okText="Rejeter"
                okButtonProps={{ danger: true, loading: loadingReject }}
                onCancel={() => !loadingReject && setRejectOpen(false)}
                destroyOnClose
            >
                <TextArea
                    rows={4}
                    value={motifRefus}
                    onChange={(e) => setMotifRefus(e.target.value)}
                    placeholder="Motif du rejet…"
                    disabled={loadingReject}
                />
            </Modal>
        </>
    );
}
