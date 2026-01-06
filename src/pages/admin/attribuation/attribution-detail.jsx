
"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card, Descriptions, Divider, Button, Tag, Space, Skeleton, Result, message,
  Popconfirm, Modal, Form, Input, DatePicker, Alert, Tooltip, Select, Checkbox,
} from "antd";
import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getAttributionParcelle,
  deleteAttributionParcelle,
  validerProvisoire,
  attribuerProvisoire,
  approuverPrefet,
  approuverConseil,
  attribuerDefinitive,
  reopenAttribution
} from "@/services/attributionParcelleService";
import { useAuthContext } from "@/context";

/* ================= Helpers ================= */

function extractDemandeurLocal(d) {
  if (!d) return null;
  const dd = d.demandeur ?? null;
  const u = d.utilisateur ?? null;
  const plain = d ?? null;
  const prenom = dd?.prenom ?? plain?.prenom ?? u?.prenom ?? null;
  const nom = dd?.nom ?? plain?.nom ?? u?.nom ?? null;
  const email = dd?.email ?? plain?.email ?? u?.email ?? null;
  const telephone = dd?.telephone ?? plain?.telephone ?? u?.telephone ?? null;
  const adresse = dd?.adresse ?? u?.adresse ?? null;
  const numeroElecteur = dd?.numeroElecteur ?? u?.numeroElecteur ?? null;
  const profession = dd?.profession ?? u?.profession ?? null;
  const dateNaissance = dd?.dateNaissance ?? u?.dateNaissance ?? null;
  const lieuNaissance = dd?.lieuNaissance ?? u?.lieuNaissance ?? null;
  const situationMatrimoniale = dd?.situationMatrimoniale ?? u?.situationMatrimoniale ?? null;
  const roles = Array.isArray(u?.roles) ? u.roles : null;
  const username = u?.username ?? null;
  const enabled = typeof u?.enabled === "boolean" ? u.enabled : null;
  const isHabitant = typeof u?.isHabitant === "boolean" ? u.isHabitant : null;
  const nombreEnfant = typeof u?.nombreEnfant === "number" ? u.nombreEnfant : dd?.nombreEnfant ?? null;
  const situationDemandeur = u?.situationDemandeur ?? null;

  return {
    id: u?.id ?? dd?.id ?? plain?.id ?? null,
    prenom, nom, email, telephone, adresse, numeroElecteur, profession,
    dateNaissance, lieuNaissance, situationMatrimoniale, roles, username, enabled,
    isHabitant, nombreEnfant, situationDemandeur, localiteTexte: (plain?.quartier?.nom || plain?.localite) ?? null,
  };
}

const canDeleteRoles = ["ROLE_ADMIN", "ROLE_MAIRE", "ROLE_SUPER_ADMIN"];
const fmt = (v) => (v === null || v === undefined || v === "" ? "—" : v);
const fmtDate = (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "—");
const money = (v) => (v || v === 0 ? new Intl.NumberFormat("fr-FR").format(v) : "—");
const statutColor = (s) => {
  switch (s) {
    case "VALIDATION_PROVISOIRE": return "gold";
    case "ATTRIBUTION_PROVISOIRE": return "orange";
    case "APPROBATION_PREFET": return "blue";
    case "APPROBATION_CONSEIL": return "geekblue";
    case "ATTRIBUTION_DEFINITIVE": return "green";
    case "REJETEE": return "red";
    default: return "default";
  }
};

const ACTIONS = {
  validationProvisoire: "VALIDATION_PROVISOIRE",
  attributionProvisoire: "ATTRIBUTION_PROVISOIRE",
  approbationPrefet: "APPROBATION_PREFET",
  approbationConseil: "APPROBATION_CONSEIL",
  attributionDefinitive: "ATTRIBUTION_DEFINITIVE",
};

// Fabrique une URL absolue à partir d'un chemin relatif retourné par l’API
const API_BASE = (import.meta.env.VITE_API_URL_SIMPLE || "").replace(/\/+$/, "");
const fileUrl = (p) => {
  if (!p) return null;
  if (/^https?:\/\//i.test(p)) return p;
  const rel = p.startsWith("/") ? p : `/${p}`;
  return `${API_BASE}${rel}`;
};

export default function AttributionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const canDelete = useMemo(() => !!user?.roles?.some((r) => canDeleteRoles.includes(r)), [user]);

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);

  // Modals
  const [openReopen, setOpenReopen] = useState(false);
  const [formReopen] = Form.useForm();
  const [openPVValidation, setOpenPVValidation] = useState(false);
  const [openPVAttribution, setOpenPVAttribution] = useState(false);
  const [openPVPrefet, setOpenPVPrefet] = useState(false);
  const [openConseil, setOpenConseil] = useState(false);
  const [openDef, setOpenDef] = useState(false);

  // Forms
  const [formPVValidation] = Form.useForm();
  const [formPVAttribution] = Form.useForm();
  const [formPVPrefet] = Form.useForm();
  const [formConseil] = Form.useForm();
  const [formDef] = Form.useForm();

  // Loaders pour actions (modals / popconfirm)
  const [subPVValidation, setSubPVValidation] = useState(false);
  const [subPVAttribution, setSubPVAttribution] = useState(false);
  const [subPrefet, setSubPrefet] = useState(false);
  const [subConseil, setSubConseil] = useState(false);
  const [subDef, setSubDef] = useState(false);
  const [subReopen, setSubReopen] = useState(false);
  const [subDelete, setSubDelete] = useState(false);

  const canDo = (target) => Array.isArray(item?.nextAllowed) && item.nextAllowed.includes(target);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAttributionParcelle(String(id));
      console.log(data);
      if (!data) throw new Error("Introuvable");
      setItem(data);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [id]);

  const onDelete = async () => {
    try {
      setSubDelete(true);
      await deleteAttributionParcelle(String(id), { liberer: true });
      message.success("Attribution supprimée");
      navigate("/admin/attributions");
    } catch (e) {
      message.error(e?.response?.data?.message || "Suppression impossible");
    } finally {
      setSubDelete(false);
    }
  };

  const statut = item?.statut;

  const actionsBar = (
    <Space wrap>
      {canDo(ACTIONS.validationProvisoire) && (
        <Tooltip title="PV requis">
          <Button onClick={() => setOpenPVValidation(true)}>Validation provisoire</Button>
        </Tooltip>
      )}

      {canDo(ACTIONS.attributionProvisoire) && (
        <Tooltip title="PV requis">
          <Button onClick={() => setOpenPVAttribution(true)}>Attribution provisoire</Button>
        </Tooltip>
      )}

      {canDo(ACTIONS.approbationPrefet) && (
        <Tooltip title="PV requis">
          <Button type="primary" onClick={() => setOpenPVPrefet(true)}>Approb. Préfet</Button>
        </Tooltip>
      )}

      {canDo(ACTIONS.approbationConseil) && (
        <Tooltip title="Décision + PV (date optionnelle)">
          <Button type="primary" onClick={() => setOpenConseil(true)}>Approb. Conseil</Button>
        </Tooltip>
      )}

      {canDo(ACTIONS.attributionDefinitive) && (
        <Tooltip title="Date d’effet requise">
          <Button type="dashed" onClick={() => setOpenDef(true)}>Attribution définitive</Button>
        </Tooltip>
      )}

      {item?.canReopen && (
        <Tooltip title="Repartir au début du circuit de validation">
          <Button onClick={() => setOpenReopen(true)}>Réouvrir le processus</Button>
        </Tooltip>
      )}

      {canDelete && (
        <Popconfirm
          title="Supprimer cette attribution ?"
          okText="Oui"
          cancelText="Non"
          onConfirm={onDelete}
          okButtonProps={{ loading: subDelete }}
        >
          <Button danger icon={<DeleteOutlined />} disabled={subDelete}>
            {subDelete ? "Suppression..." : "Supprimer"}
          </Button>
        </Popconfirm>
      )}
    </Space>
  );

  /* ===== Rendu ===== */
  return (
    <div className="container mx-auto px-4 my-6">
      <Space className="mb-4">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Retour</Button>
      </Space>

      {loading ? (
        <Card><Skeleton active paragraph={{ rows: 6 }} /></Card>
      ) : error ? (
        <Result
          status="error"
          title="Impossible d’afficher l’attribution"
          subTitle={error}
          extra={<Button onClick={fetchData}>Recharger</Button>}
        />
      ) : item ? (
        <>
          <Card
            className="mb-6"
            title={`Attribution #${item.id}`}
            extra={<Tag color={statutColor(statut)}>{statut}</Tag>}
          >
            <Space size="small" wrap>
              <Tag color={item.etatPaiement ? "green" : "red"}>{item.etatPaiement ? "Payé" : "Non payé"}</Tag>
              {item.frequence && <Tag color="geekblue">{item.frequence}</Tag>}
              {statut === "ATTRIBUTION_DEFINITIVE" && <Tag color="green">Définitive</Tag>}
            </Space>

            <Divider />

            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Montant">{money(item.montant)}</Descriptions.Item>
              <Descriptions.Item label="Date d'effet">{fmtDate(item.dateEffet)}</Descriptions.Item>
              <Descriptions.Item label="Date de fin">{fmtDate(item.dateFin)}</Descriptions.Item>
              <Descriptions.Item label="Intervalle de paiement">{fmt(item.frequence)}</Descriptions.Item>
              <Descriptions.Item label="PV Commission">{fmt(item.pvCommision)}</Descriptions.Item>
              <Descriptions.Item label="Décision Conseil">{fmt(item.decisionConseil)}</Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* Étapes */}
            <Descriptions title="Étapes" bordered column={2} size="small">
              {/* <Descriptions.Item label="Validation provisoire">{fmtDate(item.datesEtapes?.validationProvisoire)}</Descriptions.Item> */}
              <Descriptions.Item label="Attribution provisoire">{fmtDate(item.datesEtapes?.attributionProvisoire)}</Descriptions.Item>
              <Descriptions.Item label="Approbation Préfet">{fmtDate(item.datesEtapes?.approbationPrefet)}</Descriptions.Item>
              <Descriptions.Item label="Approbation Conseil">{fmtDate(item.datesEtapes?.approbationConseil)}</Descriptions.Item>
              <Descriptions.Item label="Attribution définitive">{fmtDate(item.datesEtapes?.attributionDefinitive)}</Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* PVs */}
            <Descriptions title="Procès-verbaux (par étape)" bordered column={1} size="small">
              {/* <Descriptions.Item label="PV Validation provisoire">{fmt(item.pvValidationProvisoire)}</Descriptions.Item> */}
              <Descriptions.Item label="PV Attribution provisoire">{fmt(item.pvAttributionProvisoire)}</Descriptions.Item>
              <Descriptions.Item label="PV Approbation Préfet">{fmt(item.pvApprobationPrefet)}</Descriptions.Item>
              <Descriptions.Item label="PV Approbation Conseil">{fmt(item.pvApprobationConseil)}</Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* Demandeur */}
            <Descriptions title="Demandeur / Utilisateur" bordered column={1} size="small">
              {(() => {
                const d =  item.demande;
                const pers = extractDemandeurLocal(d);
                return (
                  <>
                    <Descriptions.Item label="ID demande">{fmt(d?.id)}</Descriptions.Item>
                    <Descriptions.Item label="Nom complet">{fmt([pers?.prenom, pers?.nom].filter(Boolean).join(" "))}</Descriptions.Item>
                    <Descriptions.Item label="Email / Téléphone">
                      {fmt(pers?.email)} {pers?.telephone ? ` | ${pers.telephone}` : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Adresse">{fmt(pers?.adresse)}</Descriptions.Item>
                    <Descriptions.Item label="Quartier (texte)">{fmt(pers?.localiteTexte)}</Descriptions.Item>
                    <Descriptions.Item label="Naissance">
                      {fmtDate(pers?.dateNaissance)} {pers?.lieuNaissance ? `à ${pers.lieuNaissance}` : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Situation familiale">{fmt(pers?.situationMatrimoniale)}</Descriptions.Item>
                    <Descriptions.Item label="Profession">{fmt(pers?.profession)}</Descriptions.Item>
                    <Descriptions.Item label="N° électeur">{fmt(pers?.numeroElecteur)}</Descriptions.Item>
                    <Descriptions.Item label="Nombre d’enfants">{pers?.nombreEnfant ?? "—"}</Descriptions.Item>
                    <Descriptions.Item label="Situation du demandeur">{fmt(pers?.situationDemandeur)}</Descriptions.Item>
                    <Descriptions.Item label="Habitant ?">{pers?.isHabitant === null ? "—" : pers?.isHabitant ? "Oui" : "Non"}</Descriptions.Item>
                  </>
                );
              })()}
            </Descriptions>

            <Divider />

            {/* Parcelle */}
            <Card title="Informations sur la parcelle" className="mb-6">
              <Descriptions title="Parcelle" bordered column={2} size="small">
                <Descriptions.Item label="Numéro Parcelle">
                  {fmt(item.parcelle?.numero ?? item.parcelle?.code)}
                </Descriptions.Item>
                <Descriptions.Item label="Surface (m²)">{fmt(item.parcelle?.surface)}</Descriptions.Item>
                <Descriptions.Item label="Statut">{fmt(item.parcelle?.statut)}</Descriptions.Item>
                <Descriptions.Item label="Latitude">{fmt(item.parcelle?.latitude)}</Descriptions.Item>
                <Descriptions.Item label="Longitude">{fmt(item.parcelle?.longitude)}</Descriptions.Item>
                {"prix" in (item.parcelle || {}) && (
                  <Descriptions.Item label="Prix (indicatif)">{fmt(item.parcelle?.prix)}</Descriptions.Item>
                )}
                {"createdAt" in (item.parcelle || {}) && (
                  <Descriptions.Item label="Créée le">{fmtDate(item.parcelle?.createdAt)}</Descriptions.Item>
                )}
                {"updatedAt" in (item.parcelle || {}) && (
                  <Descriptions.Item label="Modifiée le">{fmtDate(item.parcelle?.updatedAt)}</Descriptions.Item>
                )}
                {"proprietaire" in (item.parcelle || {}) && (
                  <Descriptions.Item label="Propriétaire">
                    {(() => {
                      const p = item.parcelle?.proprietaire;
                      if (!p) return "—";
                      const nom = [p?.prenom, p?.nom].filter(Boolean).join(" ").trim() || p?.nom || p?.username;
                      return nom || "—";
                    })()}
                  </Descriptions.Item>
                )}
              </Descriptions>

              <Divider />

              {/* Lotissement */}
              <Descriptions title="Lotissement" bordered column={2} size="small">
                <Descriptions.Item label="Nom">{fmt(item.parcelle?.lotissement?.nom)}</Descriptions.Item>
                <Descriptions.Item label="Localisation">{fmt(item.parcelle?.lotissement?.localisation)}</Descriptions.Item>
                <Descriptions.Item label="Statut">{fmt(item.parcelle?.lotissement?.statut)}</Descriptions.Item>
                <Descriptions.Item label="Créé le">{fmtDate(item.parcelle?.lotissement?.dateCreation)}</Descriptions.Item>
                <Descriptions.Item label="Latitude">{fmt(item.parcelle?.lotissement?.latitude)}</Descriptions.Item>
                <Descriptions.Item label="Longitude">{fmt(item.parcelle?.lotissement?.longitude)}</Descriptions.Item>
                <Descriptions.Item label="Description" span={2}>{fmt(item.parcelle?.lotissement?.description)}</Descriptions.Item>
              </Descriptions>

              <Divider />

              {/* Documents générés */}
              {Boolean(item.bulletinLiquidationUrl || item.pdfNotificationUrl || item.docNotificationUrl) && (
                <Card type="inner" title="Documents générés" className="mb-4">
                  <Space wrap>
                    {item.pdfNotificationUrl && (
                      <Button
                        type="primary"
                        onClick={() => window.open(fileUrl(item.pdfNotificationUrl), "_blank")}
                      >
                        Voir la notification (PDF)
                      </Button>
                    )}
                    {item.docNotificationUrl && (
                      <Button onClick={() => window.open(fileUrl(item.docNotificationUrl), "_self")}>
                        Télécharger la notification (DOCX)
                      </Button>
                    )}
                    {item.bulletinLiquidationUrl && (
                      <Button
                        onClick={() => window.open(fileUrl(item.bulletinLiquidationUrl), "_blank")}
                      >
                        Voir le bulletin de liquidation (PDF)
                      </Button>
                    )}
                  </Space>
                </Card>
              )}

              <Divider />

              {/* Quartier */}
              <Descriptions title="Quartier" bordered column={2} size="small">
                <Descriptions.Item label="Nom">{fmt(item.parcelle?.lotissement?.localite?.nom)}</Descriptions.Item>
                <Descriptions.Item label="Prix (m²)">{fmt(item.parcelle?.lotissement?.localite?.prix)}</Descriptions.Item>
                <Descriptions.Item label="Coordonnées">
                  {(() => {
                    const loc = item.parcelle?.lotissement?.localite;
                    const lat = loc?.latitude;
                    const lng = loc?.longitude;
                    return lat || lng ? `${fmt(lat)} / ${fmt(lng)}` : "—";
                  })()}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Divider />

            <Space>{actionsBar}</Space>
          </Card>

          {/* ===== Modals ===== */}

          {/* PV Validation provisoire */}
          <Modal
            title="PV — Validation provisoire"
            open={openPVValidation}
            okText={subPVValidation ? "Enregistrement..." : "Enregistrer PV & Valider"}
            cancelText="Annuler"
            confirmLoading={subPVValidation}
            onCancel={() => {
              if (subPVValidation) return;
              setOpenPVValidation(false);
              formPVValidation.resetFields();
            }}
            onOk={() => {
              formPVValidation.validateFields().then(async (vals) => {
                const pv = vals.pv?.trim();
                if (!pv) return;
                setSubPVValidation(true);
                try {
                  await validerProvisoire(id, { pv });
                  message.success("Validation provisoire enregistrée");
                  setOpenPVValidation(false);
                  formPVValidation.resetFields();
                  fetchData();
                } catch (e) {
                  message.error("Une erreur est survenue " + (e?.response?.data?.detail || ""));
                } finally {
                  setSubPVValidation(false);
                }
              });
            }}
          >
            <Form form={formPVValidation} layout="vertical">
              <Form.Item name="pv" label="PV (texte / URL)" rules={[{ required: true, message: "Le PV est requis" }]}>
                <Input.TextArea rows={4} placeholder="Décris ou colle le lien du PV de validation provisoire" />
              </Form.Item>
            </Form>
          </Modal>

          {/* PV Attribution provisoire */}
          <Modal
            title="PV — Attribution provisoire"
            open={openPVAttribution}
            okText={subPVAttribution ? "Enregistrement..." : "Enregistrer PV & Valider"}
            cancelText="Annuler"
            confirmLoading={subPVAttribution}
            onCancel={() => {
              if (subPVAttribution) return;
              setOpenPVAttribution(false);
              formPVAttribution.resetFields();
            }}
            onOk={() => {
              formPVAttribution.validateFields().then(async (vals) => {
                const pv = vals.pv?.trim();
                if (!pv) return;
                setSubPVAttribution(true);
                try {
                  await attribuerProvisoire(id, { pv });
                  message.success("Attribution provisoire enregistrée");
                  setOpenPVAttribution(false);
                  formPVAttribution.resetFields();
                  fetchData();
                } catch (e) {
                  message.error("Une erreur est survenue " + (e?.response?.data?.detail || ""));
                } finally {
                  setSubPVAttribution(false);
                }
              });
            }}
          >
            <Form form={formPVAttribution} layout="vertical">
              <Form.Item name="pv" label="PV (texte / URL)" rules={[{ required: true, message: "Le PV est requis" }]}>
                <Input.TextArea rows={4} placeholder="Décris ou colle le lien du PV d’attribution provisoire" />
              </Form.Item>
            </Form>
          </Modal>

          {/* PV Approbation Préfet */}
          <Modal
            title="PV — Approbation Préfet"
            open={openPVPrefet}
            okText={subPrefet ? "Enregistrement..." : "Enregistrer PV & Approuver"}
            cancelText="Annuler"
            confirmLoading={subPrefet}
            onCancel={() => {
              if (subPrefet) return;
              setOpenPVPrefet(false);
              formPVPrefet.resetFields();
            }}
            onOk={() => {
              formPVPrefet.validateFields().then(async (vals) => {
                const pv = vals.pv?.trim();
                if (!pv) return;
                setSubPrefet(true);
                try {
                  await approuverPrefet(id, { pv });
                  message.success("Approbation du préfet enregistrée");
                  setOpenPVPrefet(false);
                  formPVPrefet.resetFields();
                  fetchData();
                } finally {
                  setSubPrefet(false);
                }
              });
            }}
          >
            <Form form={formPVPrefet} layout="vertical">
              <Form.Item name="pv" label="PV (texte / URL)" rules={[{ required: true, message: "Le PV est requis" }]}>
                <Input.TextArea rows={4} placeholder="Décris ou colle le lien du PV d’approbation du préfet" />
              </Form.Item>
            </Form>
          </Modal>

          {/* Approbation Conseil */}
          <Modal
            title="Approbation du Conseil"
            open={openConseil}
            okText={subConseil ? "Validation..." : "Valider"}
            cancelText="Annuler"
            confirmLoading={subConseil}
            onCancel={() => {
              if (subConseil) return;
              setOpenConseil(false);
            }}
            onOk={() => {
              formConseil.validateFields().then(async (vals) => {
                setSubConseil(true);
                try {
                  await approuverConseil(id, {
                    decisionConseil: vals.decisionConseil,
                    pv: vals.pv,
                    date: vals.date ? dayjs(vals.date).toISOString() : undefined,
                  });
                  message.success("Approbation du conseil enregistrée");
                  setOpenConseil(false);
                  formConseil.resetFields();
                  fetchData();
                } finally {
                  setSubConseil(false);
                }
              });
            }}
          >
            <Form form={formConseil} layout="vertical">
              <Form.Item name="decisionConseil" label="Décision du conseil" rules={[{ required: true, message: "Champ requis" }]}>
                <Input.TextArea rows={3} placeholder="Ex: Délibération n°..., favorable" />
              </Form.Item>
              <Form.Item name="pv" label="PV (texte/URL)" rules={[{ required: true, message: "Le PV est requis" }]}>
                <Input.TextArea rows={3} placeholder="Lien ou contenu du PV du conseil" />
              </Form.Item>
              <Form.Item name="date" label="Date d’approbation (optionnel)">
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Form>
          </Modal>

          {/* Attribution définitive */}
          <Modal
            title="Attribution définitive"
            open={openDef}
            okText={subDef ? "Validation..." : "Valider"}
            cancelText="Annuler"
            confirmLoading={subDef}
            onCancel={() => {
              if (subDef) return;
              setOpenDef(false);
            }}
            onOk={() => {
              formDef.validateFields().then(async (vals) => {
                setSubDef(true);
                try {
                  await attribuerDefinitive(id, {
                    dateEffet: vals.dateEffet ? dayjs(vals.dateEffet).format("YYYY-MM-DD") : undefined,
                  });
                  message.success("Attribution définitive enregistrée");
                  setOpenDef(false);
                  formDef.resetFields();
                  fetchData();
                } finally {
                  setSubDef(false);
                }
              }).catch(() => {});
            }}
          >
            <Form form={formDef} layout="vertical">
              <Form.Item name="dateEffet" label="Date d'effet" rules={[{ required: true, message: "Date d’effet requise" }]}>
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Form>
          </Modal>

          {/* Réouverture */}
          <Modal
            title="Réouvrir le processus de validation"
            open={openReopen}
            okText={subReopen ? "Réouverture..." : "Réouvrir"}
            cancelText="Annuler"
            confirmLoading={subReopen}
            onCancel={() => {
              if (subReopen) return;
              setOpenReopen(false);
            }}
            onOk={() => {
              formReopen.validateFields().then(async (vals) => {
                setSubReopen(true);
                try {
                  await reopenAttribution(id, {
                    to: vals.to,
                    resetDates: vals.resetDates,
                    resetPVs: vals.resetPVs,
                    resetDecision: vals.resetDecision,
                  });
                  message.success("Processus réouvert");
                  setOpenReopen(false);
                  formReopen.resetFields();
                  await fetchData();
                } catch (e) {
                  message.error(e?.response?.data?.message || "Réouverture impossible");
                } finally {
                  setSubReopen(false);
                }
              });
            }}
          >
            <Form
              form={formReopen}
              layout="vertical"
              initialValues={{ to: "VALIDATION_PROVISOIRE", resetDates: true, resetPVs: false, resetDecision: false }}
            >
              <Form.Item name="to" label="Revenir à l’étape" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: "VALIDATION_PROVISOIRE", label: "Validation provisoire" },
                    { value: "ATTRIBUTION_PROVISOIRE", label: "Attribution provisoire" },
                  ]}
                />
              </Form.Item>
              <Form.Item name="resetDates" valuePropName="checked">
                <Checkbox>Réinitialiser toutes les dates d’étapes</Checkbox>
              </Form.Item>
              <Form.Item name="resetPVs" valuePropName="checked">
                <Checkbox>Effacer tous les PVs</Checkbox>
              </Form.Item>
              <Form.Item name="resetDecision" valuePropName="checked">
                <Checkbox>Effacer la décision du Conseil</Checkbox>
              </Form.Item>
              <Alert
                showIcon
                type="warning"
                className="mt-2"
                message="Attention"
                description="La réouverture conserve vos données contractuelles (parcelle, montant, date d’effet…). Cochez les options si vous souhaitez purger les traces de validation."
              />
            </Form>
          </Modal>
        </>
      ) : null}
    </div>
  );
}
