
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Calendar, Award, CheckCircle, Building, Mail, Phone, MapPin, User,
    Briefcase, FileText, MapPinCheck, AlertTriangle, Landmark, Layers, ClipboardList,
} from "lucide-react";
import { Button, Modal, Popover, Space, Tooltip, message, Tag, Select } from "antd";
import { EditOutlined, EnvironmentOutlined, InfoCircleOutlined, SaveOutlined, UserAddOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

import { useAuthContext } from "@/context";
import { AdminBreadcrumb as Breadcrumb } from "@/components";
import { cn } from "@/utils";
import { formatCoordinates, formatPhoneNumber, formatPrice } from "@/utils/formatters";

import {
    getDetailsRequest,
    getFileRequest,
    setNiveauRequest,
    updateDecisionCommissionRequest,
    updateRapportRequest,
    updateRecommandationRequest,
    updateRefusRequest,
    updateStatutRequest,
    validateEtapeRequest,
} from "@/services/requestService";
import { createHistorique, getLevels } from "@/services/validationService";
import { getDetaitHabitant } from "@/services/userService";

import MapCar from "../Map/MapCar";

/* ===================== Constantes normalisées (UI) ===================== */

const ACTION = Object.freeze({
    VALIDER: "valide",
    REJETER: "rejete",
    DECISION: "DECISION",
    RECOMMANDATION: "RECOMMANDATION",
    RAPPORT_SAISI: "RAPPORT_SAISI",
});

const STATUT = Object.freeze({
    EN_ATTENTE: "En attente",
    EN_COURS_TRAITEMENT: "En cours de traitement",
    REJETEE: "Rejetée",
    APPROUVEE: "Approuvée",
});

// --- Helpers rôles ---
const CAN_UPDATE_STATUT_ROLES = ["ROLE_MAIRE", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"];
const CAN_SET_RECOMMANDATION_ROLES = ["ROLE_PRESIDENT_COMMISSION", "ROLE_CHEF_SERVICE", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"];
const CAN_SET_RAPPORT_ROLES = ["ROLE_AGENT", "ROLE_CHEF_SERVICE", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"];
const CAN_SET_DECISION_ROLES = ["ROLE_PRESIDENT_COMMISSION", "ROLE_CHEF_SERVICE", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"];

const hasAnyRole = (user, roles) => user?.roles?.some((r) => roles.includes(r));

const STATUT_LABEL = {
    [STATUT.EN_ATTENTE]: "En attente",
    [STATUT.EN_COURS_TRAITEMENT]: "En cours de traitement",
    [STATUT.REJETEE]: "Rejetée",
    [STATUT.APPROUVEE]: "Approuvée",
};
const STATUT_BADGE = {
    [STATUT.EN_ATTENTE]: "bg-yellow-50 text-yellow-800 border border-yellow-300",
    [STATUT.EN_COURS_TRAITEMENT]: "bg-blue-50 text-blue-800 border border-blue-300",
    [STATUT.REJETEE]: "bg-red-50 text-red-800 border border-red-300",
    [STATUT.APPROUVEE]: "bg-green-50 text-green-800 border border-green-300",
};
const STATUT_OPTIONS = Object.keys(STATUT_LABEL).map(v => ({ label: STATUT_LABEL[v], value: v }));

/* ===================== Adapters & helpers (API -> UI) ===================== */

// 1) Statuts API -> UI
const STATUS_MAP_IN = {
    pending: "En attente",
    in_progress: "En cours de traitement",
    rejected: "Rejetée",
    approved: "Approuvée",
    // tolérance si l'API renvoie déjà FR
    "En attente": "En attente",
    "En cours de traitement": "En cours de traitement",
    "Rejetée": "Rejetée",
    "Approuvée": "Approuvée",
};

// 2) Type de demande API -> UI
const TYPE_DEMANDE_MAP_IN = {
    attribution: "Attribution",
    regularization: "Régularisation",
    authentication: "Authentification",
    occupancy_permit: "Attribution", // ajuste si nécessaire
};

// 3) Type de titre API -> UI
const TYPE_TITRE_MAP_IN = {
    occupancy_permit: "Permis d'occuper",
    municipal_lease: "Bail communal",
    final_transfer: "Transfert définitif",
    lease_proposal: "Proposition de bail",
};

function toBool(v) {
    if (v === null || v === undefined) return null;
    if (typeof v === "boolean") return v;
    if (typeof v === "string") return ["true", "1", "oui", "yes"].includes(v.toLowerCase());
    if (typeof v === "number") return v !== 0;
    return null;
}

function safeDateISO(d) {
    if (!d) return null;
    if (typeof d === "string" && (d.startsWith("-0001") || d.startsWith("0000"))) return null; // invalides
    if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(d)) {
        return new Date(d.replace(" ", "T") + "Z").toISOString();
    }
    const t = Date.parse(d);
    return isNaN(t) ? null : new Date(t).toISOString();
}

function pickBase64Maybe(s) {
    if (!s) return null;
    return s; // si le back renvoie déjà base64
}

function normalizeHistorique(items = []) {
    return items.map((h) => ({
        id: h?.id,
        action: String(h?.action || "").toUpperCase(),
        motif: h?.motif ?? null,
        date: safeDateISO(h?.dateAction) ?? null,
        niveauNom: h?.niveauNom ?? null,
        niveauOrdre: h?.niveauOrdre ?? null,
        roleRequis: h?.roleRequis ?? null,
        statutAvant: STATUS_MAP_IN[h?.statutAvant] ?? h?.statutAvant ?? null,
        statutApres: STATUS_MAP_IN[h?.statutApres] ?? h?.statutApres ?? null,
        validateur: h?.validateur
            ? {
                id: h.validateur.id,
                email: h.validateur.email,
                nom: h.validateur.nom,
                prenom: h.validateur.prenom,
            }
            : null,
    }));
}

/** Adapter principal: convertit l’item API -> modèle UI de la page */
function normalizeDemandeFromApi(api) {
    if (!api) return null;

    const statutUI = STATUS_MAP_IN[api.statut] ?? api.statut ?? "En attente";
    const typeDemandeUI = TYPE_DEMANDE_MAP_IN[api.typeDemande] ?? api.typeDemande ?? null;
    const typeTitreUI =
        TYPE_TITRE_MAP_IN[api.typeTitre] ??
        TYPE_TITRE_MAP_IN[api.typeDemande] ??
        api.typeTitre ??
        null;

    const recto = pickBase64Maybe(api.recto);
    const verso = pickBase64Maybe(api.verso);

    const demandeur = api.demandeur
        ? {
            prenom: api.demandeur.prenom ?? api.prenom ?? null,
            nom: api.demandeur.nom ?? api.nom ?? null,
            email: api.demandeur.email ?? api.email ?? null,
            telephone: api.demandeur.telephone ?? api.telephone ?? null,
            adresse: api.demandeur.adresse ?? api.adresse ?? null,
            profession: api.demandeur.profession ?? api.profession ?? null,
            numeroElecteur: api.demandeur.numeroElecteur ?? api.numeroElecteur ?? null,
            dateNaissance: safeDateISO(api.demandeur.dateNaissance) ?? safeDateISO(api.dateNaissance),
            lieuNaissance: api.demandeur.lieuNaissance ?? api.lieuNaissance ?? null,
            situationMatrimoniale: api.demandeur.situationMatrimoniale ?? null,
            statutLogement: api.demandeur.statutLogement ?? null,
            nombreEnfant: api.demandeur.nombreEnfant ?? null,
            isHabitant: toBool(api.demandeur.isHabitant) ?? false,
        }
        : {
            prenom: api.prenom ?? null,
            nom: api.nom ?? null,
            email: api.email ?? null,
            telephone: api.telephone ?? null,
            adresse: api.adresse ?? null,
            profession: api.profession ?? null,
            numeroElecteur: api.numeroElecteur ?? null,
            dateNaissance: safeDateISO(api.dateNaissance),
            lieuNaissance: api.lieuNaissance ?? null,
            situationMatrimoniale: api.situationMatrimoniale ?? null,
            statutLogement: api.statutLogement ?? null,
            nombreEnfant: api.nombreEnfant ?? null,
            isHabitant: toBool(api.isHabitant) ?? false,
        };

    const quartier = api.quartier ?? null;
    const localiteTexte = api.localite ?? quartier?.nom ?? null;

    return {
        id: api.id,
        typeDemande: typeDemandeUI,
        typeDocument: api.typeDocument ?? null,
        typeTitre: typeTitreUI,
        superficie: api.superficie ?? null,
        usagePrevu: api.usagePrevu ?? null,
        possedeAutreTerrain: toBool(api.possedeAutreTerrain) ?? false,
        statut: statutUI,
        dateCreation: safeDateISO(api.dateCreation),
        dateModification: safeDateISO(api.dateModification),
        motifRefus: api.motif_refus ?? api.motifRefus ?? null,
        recto,
        verso,
        rapport: api.rapport ?? null,
        terrainAKaolack: toBool(api.terrainAKaolack),
        terrainAilleurs: toBool(api.terrainAilleurs),
        decisionCommission: api.decisionCommission ?? null,
        recommandation: api.recommandation ?? null,

        localite: localiteTexte,
        quartier,

        historiqueValidations: normalizeHistorique(api.historiqueValidations),
        niveauValidationActuel: api.niveauValidationActuel ?? null,

        // pour cartes d'info
        nom: api.nom ?? demandeur.nom,
        prenom: api.prenom ?? demandeur.prenom,
        email: api.email ?? demandeur.email,
        telephone: api.telephone ?? demandeur.telephone,
        dateNaissance: demandeur.dateNaissance,
        lieuNaissance: demandeur.lieuNaissance,
        adresse: api.adresse ?? demandeur.adresse,
        numeroElecteur: api.numeroElecteur ?? demandeur.numeroElecteur,
        profession: api.profession ?? demandeur.profession,
        isHabitant: toBool(api.isHabitant),
        demandeur,
    };
}

/* ===================== Page ===================== */

export default function ValidationRequest() {
    const { id } = useParams();
    const { user } = useAuthContext();

    const [demande, setDemande] = useState(null);
    const [rectoFile, setRectoFile] = useState(null);
    const [versoFile, setVersoFile] = useState(null);
    const [levels, setLevels] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // États d’édition
    const [editingRefus, setEditingRefus] = useState(false);
    const [motifRefus, setMotifRefus] = useState("");

    const [editingStatut, setEditingStatut] = useState(false);
    const [newStatut, setNewStatut] = useState("");

    const [editingRapport, setEditingRapport] = useState(false);
    const [rapport, setRapport] = useState("");

    const [editingReco, setEditingReco] = useState(false);
    const [recommandation, setRecommandation] = useState("");

    const [editingDecision, setEditingDecision] = useState(false);
    const [decision, setDecision] = useState("");

    // Modal rejet
    const [rejectOpen, setRejectOpen] = useState(false);

    // Loaders par action
    const [loadingValidate, setLoadingValidate] = useState(false);
    const [loadingReject, setLoadingReject] = useState(false);
    const [savingStatut, setSavingStatut] = useState(false);
    const [savingRapport, setSavingRapport] = useState(false);
    const [savingReco, setSavingReco] = useState(false);
    const [savingDecision, setSavingDecision] = useState(false);
    const [savingRefus, setSavingRefus] = useState(false);

    // Initialiser niveau s'il n'y en a pas
    useEffect(() => {
        if (!loading && demande && levels.length > 0 && !demande.niveauValidationActuel) {
            setNiveauRequest(String(id), null).catch(() => {/* silent */ });
            setDemande((prev) => ({ ...prev, niveauValidationActuel: levels[0] }));
        }
    }, [loading, demande?.id, levels.length]);

    // Chargement initial
    useEffect(() => {
        (async () => {
            try {
                const [data, stepRes] = await Promise.all([
                    getDetailsRequest(String(id)),
                    getLevels().catch(() => []),
                ]);

                console.log(data)
                const steps = Array.isArray(stepRes) ? stepRes : (stepRes?.items ?? []);
                setLevels(steps?.sort?.((a, b) => (a?.ordre ?? 0) - (b?.ordre ?? 0)) ?? []);

                const normalized = normalizeDemandeFromApi(data?.item ?? data);
                setDemande(normalized);

                setMotifRefus(normalized?.motifRefus ?? "");
                setRapport(normalized?.rapport || "");
                setRecommandation(normalized?.recommandation || "");
                setDecision(normalized?.decisionCommission || "");

                if (normalized?.recto || normalized?.verso) {
                    setRectoFile(normalized.recto);
                    setVersoFile(normalized.verso);
                } else {
                    try {
                        const doc = await getFileRequest(String(id));
                        if (doc) {
                            setRectoFile(doc?.recto ?? null);
                            setVersoFile(doc?.verso ?? null);
                        }
                    } catch { /* ignore */ }
                }
            } catch (err) {
                setError(err?.message || "Erreur");
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    // Permissions
    const canUpdateStatut = useMemo(() => hasAnyRole(user, CAN_UPDATE_STATUT_ROLES), [user]);
    const canEditReco = useMemo(() => hasAnyRole(user, CAN_SET_RECOMMANDATION_ROLES), [user]);
    const canEditRapport = useMemo(() => hasAnyRole(user, CAN_SET_RAPPORT_ROLES), [user]);
    const canEditDecision = useMemo(() => hasAnyRole(user, CAN_SET_DECISION_ROLES), [user]);
    const canEditRefus = useMemo(() => hasAnyRole(user, CAN_UPDATE_STATUT_ROLES), [user]);

    // -------- Niveau courant --------
    const currentLevelIndex = useMemo(() => {
        if (!levels?.length) return -1;
        const ordreActuel = demande?.niveauValidationActuel?.ordre;
        if (ordreActuel) return Math.max(0, levels.findIndex((l) => l.ordre === ordreActuel));
        return 0;
    }, [levels, demande?.niveauValidationActuel]);

    const currentLevel = levels[currentLevelIndex] || null;
    const isLastLevel = currentLevelIndex >= 0 && currentLevelIndex === levels.length - 1;
    const requiredRole = currentLevel?.roleRequis;

    const canValidateThisLevel = useMemo(() => {
        if (!requiredRole) return hasAnyRole(user, ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]);
        return hasAnyRole(user, [requiredRole, "ROLE_ADMIN", "ROLE_SUPER_ADMIN"]);
    }, [requiredRole, user]);

    /* ===================== Utils centralisés ===================== */

    const logHistorique = async ({
        action,
        motif = null,
        statutAvant,
        statutApres,
        level = currentLevel,
    }) => {
        const payload = {
            demande: String(id),
            validateurId: user?.id,
            action: String(action || "").toUpperCase(), // VALIDER | REJETER | ...
            motif,
            niveauNom: level?.nom ?? null,
            niveauOrdre: level?.ordre ?? null,
            roleRequis: level?.roleRequis ?? null,
            statutAvant,
            statutApres,
        };
        try {
            await createHistorique(payload);
        } catch {
            // noop
        }
    };

    const advanceLocalState = ({ nextStatut, addComment = null, action = ACTION.VALIDER }) => {
        setDemande((prev) => {
            const nextNv = action === ACTION.VALIDER && !isLastLevel && levels[currentLevelIndex + 1]
                ? levels[currentLevelIndex + 1]
                : prev?.niveauValidationActuel;

            const newLine = {
                niveau: { nom: currentLevel?.nom, id: currentLevel?.id, ordre: currentLevel?.ordre },
                acteur: { nom: `${user?.prenom ?? ""} ${user?.nom ?? ""}`.trim(), email: user?.email },
                action,
                date: new Date().toISOString(),
                commentaire: addComment,
                niveauNom: currentLevel?.nom,
                niveauOrdre: currentLevel?.ordre,
            };

            return {
                ...prev,
                statut: nextStatut,
                niveauValidationActuel: nextNv,
                dateModification: new Date().toISOString(),
                historiqueValidations: [...(prev?.historiqueValidations ?? []), newLine],
            };
        });
    };

    /* ===================== Actions ===================== */

    const handleValidate = async () => {
        setLoadingValidate(true);
        const prevStatut = demande?.statut ?? STATUT.EN_ATTENTE;

        try {
            // 1) Appel back : POST /api/requests/:id/valider-etape
            const res = await validateEtapeRequest(String(id));
            // res peut contenir:
            // { ok, message, statut, niveau, item? }

            // 2) Source de vérité pour rafraîchir l’écran
            let fresh;
            if (res?.item) {
                // Le back a renvoyé l’item complet -> on normalise direct
                fresh = normalizeDemandeFromApi(res.item);
            } else {
                // Fallback: on recharge les détails
                const freshRaw = await getDetailsRequest(String(id));
                fresh = normalizeDemandeFromApi(freshRaw?.item ?? freshRaw);
            }
            setDemande(fresh);

            // 3) Log audit (coté front, best effort)
            await logHistorique({
                action: ACTION.VALIDER,
                statutAvant: prevStatut,
                statutApres: fresh?.statut,
                level: fresh?.niveauValidationActuel || currentLevel,
            });

            // 4) Feedback utilisateur
            if (fresh?.statut === STATUT.APPROUVEE) {
                message.success("Demande approuvée");
            } else {
                // si le back a renvoyé res.message, on le privilégie
                message.success(res?.message || "Niveau validé");
            }
        } catch (err) {
            // ==== Gestion d'erreurs friendly ====
            // axios -> err.response?.status / fetch -> err.status custom
            const status = err?.response?.status ?? err?.status;
            const apiMsg =
                err?.response?.data?.message ||
                err?.response?.data?.detail ||
                err?.message;

            if (status === 403) {
                // Rôle requis : le back renvoie le rôle attendu dans le message
                message.error(apiMsg || "Accès refusé : rôle requis pour valider cette étape.");
            } else if (status === 400) {
                // ex: "Aucun niveau de validation configuré"
                message.error(apiMsg || "Requête invalide.");
            } else if (status === 404) {
                message.error("Demande introuvable.");
            } else {
                message.error(apiMsg || "Erreur lors de la validation.");
            }
        } finally {
            setLoadingValidate(false);
        }
    };

    const handleOpenReject = () => {
        if (loadingValidate) return;
        setMotifRefus("");
        setRejectOpen(true);
    };

    const handleReject = async () => {
        if (!motifRefus?.trim()) return message.error("Le motif ne peut pas être vide");
        try {
            setLoadingReject(true);
            const prevStatut = demande?.statut ?? STATUT.EN_ATTENTE;

            // 1 seul appel (le backend met statut=Rejetée + clear niveau + historique)
            await updateRefusRequest(String(id), { motif: motifRefus.trim() });

            await logHistorique({
                action: ACTION.REJETER,
                motif: motifRefus.trim(),
                statutAvant: prevStatut,
                statutApres: STATUT.REJETEE,
            });

            advanceLocalState({
                nextStatut: STATUT.REJETEE,
                addComment: motifRefus.trim(),
                action: ACTION.REJETER,
            });

            message.success("Demande rejetée");
            setRejectOpen(false);
        } catch (e) {
            message.error(e?.message || "Erreur lors du rejet");
        } finally {
            setLoadingReject(false);
        }
    };

    // -------- Sauvegardes --------
    const saveStatut = async () => {
        if (!newStatut) return message.error("Sélectionnez un statut");
        try {
            setSavingStatut(true);
            await updateStatutRequest(String(id), { statut: newStatut });
            setDemande((prev) => ({ ...prev, statut: newStatut, dateModification: new Date().toISOString() }));
            setEditingStatut(false);
            message.success("Statut mis à jour");
        } catch (e) {
            message.error(e?.message || "Erreur MAJ statut");
        } finally {
            setSavingStatut(false);
        }
    };

    const saveRapport = async () => {
        try {
            setSavingRapport(true);
            await updateRapportRequest(String(id), { rapport });
            setDemande((prev) => ({ ...prev, rapport }));
            setEditingRapport(false);
            message.success("Rapport enregistré");
        } catch (e) {
            message.error(e?.message || "Erreur MAJ rapport");
        } finally {
            setSavingRapport(false);
        }
    };

    const saveRecommandation = async () => {
        try {
            setSavingReco(true);
            await updateRecommandationRequest(String(id), { recommandation });
            setDemande((prev) => ({ ...prev, recommandation }));
            setEditingReco(false);
            message.success("Recommandation enregistrée");
        } catch (e) {
            message.error(e?.message || "Erreur MAJ recommandation");
        } finally {
            setSavingReco(false);
        }
    };

    const saveDecision = async () => {
        try {
            setSavingDecision(true);
            await updateDecisionCommissionRequest(String(id), { decisionCommission: decision });
            setDemande((prev) => ({ ...prev, decisionCommission: decision }));
            setEditingDecision(false);
            message.success("Décision enregistrée");
        } catch (e) {
            message.error(e?.message || "Erreur MAJ décision");
        } finally {
            setSavingDecision(false);
        }
    };

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorDisplay error={error} />;
    if (!demande) return null;

    return (
        <>
            <Breadcrumb title="Détails de la demande" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="grid grid-cols-1">
                            <div className="bg-gray-100 min-h-screen pb-10">
                                <header className="bg-white shadow">
                                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                                        <h1 className="text-3xl font-bold text-gray-900">Détail de la demande</h1>
                                    </div>
                                </header>

                                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                                    <div className="px-4 py-6 sm:px-0">
                                        <div className="grid gap-6 lg:grid-cols-2">

                                            <DemandeInfoCard
                                                demande={demande}
                                                canUpdateStatut={canUpdateStatut}
                                                editingStatut={editingStatut}
                                                setEditingStatut={setEditingStatut}
                                                newStatut={newStatut}
                                                setNewStatut={setNewStatut}
                                                saveStatut={saveStatut}
                                                savingStatut={savingStatut}
                                            />

                                            <DemandeurInfoCard demandeur={demande.demandeur} />
                                            <LocaliteInfoCard localite={demande.quartier} />

                                            <ValidationActionCard
                                                currentLevel={currentLevel}
                                                isLastLevel={isLastLevel}
                                                canValidate={canValidateThisLevel && demande.statut !== STATUT.REJETEE && demande.statut !== STATUT.APPROUVEE}
                                                onValidate={handleValidate}
                                                onReject={handleOpenReject}
                                                requiredRole={requiredRole}
                                                statut={demande.statut}
                                                loadingValidate={loadingValidate}
                                                loadingReject={loadingReject}
                                            />

                                            <RoleSection
                                                title="Rapport"
                                                icon={<ClipboardList className="w-5 h-5" />}
                                                value={demande.rapport}
                                                editable={canEditRapport}
                                                editing={editingRapport}
                                                setEditing={setEditingRapport}
                                                onSave={saveRapport}
                                                onChange={setRapport}
                                                editValue={rapport}
                                                placeholder="Saisissez le rapport de l'agent…"
                                                saving={savingRapport}
                                            />

                                            <RoleSection
                                                title="Recommandation"
                                                icon={<Layers className="w-5 h-5" />}
                                                value={demande.recommandation}
                                                editable={canEditReco}
                                                editing={editingReco}
                                                setEditing={setEditingReco}
                                                onSave={saveRecommandation}
                                                onChange={setRecommandation}
                                                editValue={recommandation}
                                                placeholder="Saisissez la recommandation…"
                                                saving={savingReco}
                                            />

                                            <RoleSection
                                                title="Décision de la commission"
                                                icon={<Landmark className="w-5 h-5" />}
                                                value={demande.decisionCommission}
                                                editable={canEditDecision}
                                                editing={editingDecision}
                                                setEditing={setEditingDecision}
                                                onSave={saveDecision}
                                                onChange={setDecision}
                                                editValue={decision}
                                                placeholder="Saisissez la décision de la commission…"
                                                saving={savingDecision}
                                            />

                                            {demande.statut === STATUT.REJETEE && (
                                                <RefusCard
                                                    value={demande.motifRefus}
                                                    editable={canEditRefus}
                                                    editing={editingRefus}
                                                    setEditing={setEditingRefus}
                                                    editValue={motifRefus}
                                                    setEditValue={setMotifRefus}
                                                    onSave={async () => {
                                                        try {
                                                            setSavingRefus(true);
                                                            await updateRefusRequest(String(id), { motif: motifRefus.trim() });
                                                            setDemande((prev) => ({ ...prev, motifRefus: motifRefus.trim() }));
                                                            setEditingRefus(false);
                                                            message.success("Motif actualisé");
                                                        } finally {
                                                            setSavingRefus(false);
                                                        }
                                                    }}
                                                    saving={savingRefus}
                                                />
                                            )}

                                            <ValidationCard demande={demande} levels={levels} currentLevel={currentLevel} />
                                        </div>

                                        {(rectoFile || versoFile) && (
                                            <div className="mt-8">
                                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Documents fournis</h2>
                                                <div className="grid gap-6 md:grid-cols-2">
                                                    {rectoFile && <FilePreview file={rectoFile} title="Recto du document" />}
                                                    {versoFile && <FilePreview file={versoFile} title="Verso du document" />}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </main>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Modal
                title="Rejeter la demande"
                open={rejectOpen}
                onOk={handleReject}
                onCancel={() => !loadingReject && setRejectOpen(false)}
                okText="Rejeter"
                okButtonProps={{ danger: true, loading: loadingReject }}
                confirmLoading={loadingReject}
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

/* ===================== Sous-composants ===================== */

function ValidationActionCard({
    currentLevel, isLastLevel, canValidate, onValidate, onReject, requiredRole, statut,
    loadingValidate = false, loadingReject = false
}) {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-primary">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex items-start justify-between">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Action de validation</h3>
                </div>

                <div className="mt-3 space-y-2">
                    <div className="text-sm text-gray-700">
                        {currentLevel ? (
                            <>
                                Niveau actuel : <Tag color="blue">{currentLevel.nom}</Tag>
                                <span className="ml-2">Rôle requis : <Tag color="geekblue">{requiredRole || "—"}</Tag></span>
                            </>
                        ) : (
                            <span>Aucun niveau courant</span>
                        )}
                    </div>

                    {statut === STATUT.APPROUVEE && <Tag color="green">Demande approuvée</Tag>}
                    {statut === STATUT.REJETEE && <Tag color="red">Demande rejetée</Tag>}

                    {canValidate ? (
                        <Space className="mt-2" wrap>
                            <Button type="primary" onClick={onValidate} loading={loadingValidate} disabled={loadingReject}>
                                {isLastLevel ? "Approuver" : "Valider le niveau"}
                            </Button>
                            <Button danger onClick={onReject} loading={loadingReject} disabled={loadingValidate}>
                                Rejeter
                            </Button>
                        </Space>
                    ) : (
                        <div className="text-xs text-gray-500 mt-2">
                            Vous n’avez pas le rôle requis pour valider à ce niveau.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function DemandeInfoCard({
    demande,
    canUpdateStatut,
    editingStatut,
    setEditingStatut,
    newStatut,
    setNewStatut,
    saveStatut,
    savingStatut = false,
}) {
    const statutClass = STATUT_BADGE[demande.statut] || "bg-gray-100 text-gray-800 border";
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-primary">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex items-start justify-between">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Informations de la demande</h3>
                    <div className="flex gap-2">
                        <Tag className={cn("px-2 py-1 text-xs font-semibold rounded-full", statutClass)}>
                            {STATUT_LABEL[demande.statut] || demande.statut}
                        </Tag>
                    </div>
                </div>

                <div className="mt-4 grid gap-4">
                    <InfoItem icon={<Calendar className="w-5 h-5" />} label="Date de création" value={demande.dateCreation ? new Date(demande.dateCreation).toLocaleDateString("fr-FR") : "—"} />
                    <InfoItem icon={<FileText className="w-5 h-5" />} label="Type de demande" value={demande.typeDemande || "—"} />
                    <InfoItem icon={<FileText className="w-5 h-5" />} label="Type de titre" value={demande.typeTitre || "—"} />
                    <InfoItem icon={<Award className="w-5 h-5" />} label="Superficie" value={demande.superficie ? `${demande.superficie} m²` : "—"} />
                    <InfoItem icon={<FileText className="w-5 h-5" />} label="Usage prévu" value={demande.usagePrevu || "—"} />
                    <InfoItem icon={<FileText className="w-5 h-5" />} label="Type de document" value={demande.typeDocument || "—"} />
                    <InfoItem icon={<CheckCircle className="w-5 h-5" />} label="Possède autre terrain" value={demande.possedeAutreTerrain ? "Oui" : "Non"} />
                    <div className="flex items-center gap-3">
                        <Tag color={demande.terrainAKaolack ? "green" : "red"}>Terrain à Kaolack : {demande.terrainAKaolack ? "Oui" : "Non"}</Tag>
                        <Tag color={demande.terrainAilleurs ? "green" : "red"}>Terrain ailleurs : {demande.terrainAilleurs ? "Oui" : "Non"}</Tag>
                    </div>

                    {canUpdateStatut && (
                        <div className="mt-2">
                            {!editingStatut ? (
                                <Button icon={<EditOutlined />} onClick={() => { setNewStatut(demande.statut); setEditingStatut(true); }}>
                                    Modifier le statut
                                </Button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Select value={newStatut} options={STATUT_OPTIONS} onChange={setNewStatut} style={{ minWidth: 220 }} disabled={savingStatut} />
                                    <Button type="primary" icon={<SaveOutlined />} onClick={saveStatut} loading={savingStatut}>
                                        Enregistrer
                                    </Button>
                                    <Button onClick={() => setEditingStatut(false)} disabled={savingStatut}>Annuler</Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function RefusCard({ value, editable, editing, setEditing, editValue, setEditValue, onSave, saving = false }) {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-red-500">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium leading-6 text-red-700 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Motif du rejet
                    </h3>
                    {editable && !editing && (
                        <Button type="text" icon={<EditOutlined />} onClick={() => setEditing(true)} />
                    )}
                </div>

                {!editing ? (
                    <div className="text-red-700 bg-red-50 p-3 rounded border border-red-200">
                        {value || "Aucun motif spécifié"}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <TextArea rows={4} value={editValue} onChange={(e) => setEditValue(e.target.value)} placeholder="Saisissez le motif de rejet…" disabled={saving} />
                        <div className="flex gap-2 justify-end">
                            <Button onClick={() => setEditing(false)} disabled={saving}>Annuler</Button>
                            <Button type="primary" icon={<SaveOutlined />} onClick={onSave} loading={saving}>Enregistrer</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function RoleSection({
    title, icon, value, editable, editing, setEditing, onSave, onChange, editValue, placeholder, saving = false
}) {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-primary">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2">
                        {icon}{title}
                    </h3>
                    {editable && !editing && (
                        <Button type="text" icon={<EditOutlined />} onClick={() => setEditing(true)} />
                    )}
                </div>

                {!editing ? (
                    <div className="bg-gray-50 p-3 rounded border border-gray-200 min-h-[48px]">
                        {value || <span className="text-gray-400">—</span>}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <TextArea rows={4} value={editValue} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={saving} />
                        <div className="flex gap-2 justify-end">
                            <Button onClick={() => setEditing(false)} disabled={saving}>Annuler</Button>
                            <Button type="primary" icon={<SaveOutlined />} onClick={onSave} loading={saving}>
                                Enregistrer
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function DemandeurInfoCard({ demandeur }) {
    const [loadingHabitant, setLoadingHabitant] = useState(false);
    const [habitantData, setHabitantData] = useState(null);

    useEffect(() => { fetchHabitantInfo(); /* eslint-disable-next-line */ }, [demandeur?.id]);

    const fetchHabitantInfo = async () => {
        if (!demandeur?.id || !demandeur?.isHabitant) return;
        setLoadingHabitant(true);
        try {
            const habitantInfo = await getDetaitHabitant(demandeur.id);
            setHabitantData(habitantInfo);
        } finally {
            setLoadingHabitant(false);
        }
    };

    const renderHabitantContent = () => {
        const data = habitantData;
        if (!data) return <div>Chargement des informations...</div>;
        return (
            <div className="max-w-3xl">
                <div className="grid grid-cols-3 gap-2">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="border-b pb-1">
                            <strong>{key}:</strong> {String(value ?? "-")}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden  border-l-4 border-primary">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Informations du demandeur</h3>
                <div className="space-y-4">
                    <InfoItem icon={<User className="w-5 h-5" />} label="Nom complet" value={`${demandeur?.prenom ?? ""} ${demandeur?.nom ?? ""}`.trim() || "—"} />
                    <InfoItem icon={<Mail className="w-5 h-5" />} label="Email" value={demandeur?.email || "—"} />
                    <InfoItem icon={<Phone className="w-5 h-5" />} label="Téléphone" value={formatPhoneNumber(demandeur?.telephone) || "—"} />
                    <InfoItem icon={<MapPin className="w-5 h-5" />} label="Adresse" value={demandeur?.adresse || "—"} />
                    <InfoItem icon={<Calendar className="w-5 h-5" />} label="Date de Naissance" value={demandeur?.dateNaissance ? new Date(demandeur?.dateNaissance).toLocaleDateString("fr-FR") : "—"} />
                    <InfoItem icon={<MapPin className="w-5 h-5" />} label="Lieu de Naissance" value={demandeur?.lieuNaissance || "—"} />
                    <InfoItem icon={<FileText className="w-5 h-5" />} label="Numéro électeur" value={demandeur?.numeroElecteur || "—"} />
                    <InfoItem icon={<Briefcase className="w-5 h-5" />} label="Profession" value={demandeur?.profession || "—"} />
                    <InfoItem icon={<UserAddOutlined className="w-5 h-5" />} label="Habitant" value={demandeur?.isHabitant ? "Oui" : "Non"} />
                    <InfoItem icon={<UserAddOutlined className="w-5 h-5" />} label="Nombre Enfants" value={demandeur?.nombreEnfant ?? "0"} />
                    <InfoItem icon={<UserAddOutlined className="w-5 h-5" />} label="Situation Matrimoniale" value={demandeur?.situationMatrimoniale || "Non renseigné"} />
                    <InfoItem icon={<UserAddOutlined className="w-5 h-5" />} label="Statut logement" value={demandeur?.statutLogement || "Non renseigné"} />

                    {demandeur?.isHabitant && (
                        <Space>
                            <span>Informations détaillées:</span>
                            <Popover
                                content={renderHabitantContent()}
                                title="Informations détaillées"
                                trigger="click"
                                placement="right"
                                overlayStyle={{ maxWidth: "800px" }}
                            >
                                <Button type="text" icon={<InfoCircleOutlined />} className="text-primary" loading={loadingHabitant} />
                            </Popover>
                        </Space>
                    )}
                </div>
            </div>
        </div>
    );
}

function LocaliteInfoCard({ localite }) {
    const [isMapModalVisible, setIsMapModalVisible] = useState(false);
    const hasValidCoordinates = !!(localite?.latitude && localite?.longitude && !isNaN(+localite.latitude) && !isNaN(+localite.longitude));

    if (!localite) {
        return (
            <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-primary">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Localité</h3>
                    <p className="text-sm text-gray-500">Aucune localité associée</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-primary">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Localité</h3>
                <div className="space-y-3">
                    <InfoItem icon={<Building className="w-5 h-5" />} label="Nom" value={localite.nom} />
                    {"prix" in localite && <InfoItem icon={<FileText className="w-5 h-5" />} label="Prix" value={formatPrice(localite.prix)} />}
                    {localite.description && <InfoItem icon={<FileText className="w-5 h-5" />} label="Description" value={localite.description} />}
                    {hasValidCoordinates && (
                        <InfoItemCoordonnee
                            icon={<MapPinCheck className="w-5 h-5" />}
                            label="Coordonnées"
                            value={formatCoordinates(localite.latitude, localite.longitude)}
                            latitude={localite.latitude}
                            longitude={localite.longitude}
                            setIsMapModalVisible={setIsMapModalVisible}
                            isMapModalVisible={isMapModalVisible}
                        />
                    )}
                </div>
            </div>

            <Modal title="Carte de la Localité" open={isMapModalVisible} onCancel={() => setIsMapModalVisible(false)} width={1000} footer={null}>
                {hasValidCoordinates && <MapCar latitude={localite.latitude} longitude={localite.longitude} selectedItem={localite} type="localite" />}
            </Modal>
        </div>
    );
}

function ValidationCard({ demande, levels = [], currentLevel }) {
    const hist = demande?.historiqueValidations || [];
    const currentId = currentLevel?.id;

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-primary lg:col-span-2">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Circuit de validation</h3>

                <div className="flex flex-wrap gap-2 mb-3">
                    {levels.map((lvl) => {
                        const isCurrent = lvl.id === currentId;
                        const done = hist?.some((h) => (h?.niveau?.id === lvl.id) || (h?.ordre === lvl.ordre) || (h?.niveauOrdre === lvl.ordre));
                        return (
                            <Tag key={lvl.id} color={isCurrent ? "blue" : done ? "green" : "default"}>
                                {lvl.ordre}. {lvl.nom}
                            </Tag>
                        );
                    })}
                    {!levels?.length && <span className="text-sm text-gray-500">Aucune étape configurée.</span>}
                </div>

                <div className="mt-3">
                    <h4 className="font-semibold mb-2">Historique</h4>
                    {hist.length === 0 ? (
                        <p className="text-sm text-gray-500">Aucun historique.</p>
                    ) : (
                        <div className="space-y-2">
                            {hist.map((h, idx) => {
                                const nomNiveau = h?.niveauNom || h?.niveau?.nom || `Niveau #${h?.niveau?.id ?? "?"}`;
                                const ordre = h?.niveauOrdre || h?.niveau?.ordre;
                                const actor = h?.acteur?.nom || h?.acteur?.email || h?.validateur?.email || "acteur";
                                const action = (h?.action || "").toUpperCase();
                                const lineDate = h?.date || h?.dateAction;
                                const commentaire = h?.commentaire || h?.motif;

                                return (
                                    <div key={idx} className="s p-3 rounded border bg-gray-50">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Tag>{ordre ? `${ordre}. ${nomNiveau}` : nomNiveau}</Tag>
                                            <Tag color="purple">par {actor}</Tag>
                                            <Tag color={action === ACTION.REJETER.toUpperCase() ? "red" : "blue"}>{action}</Tag>
                                            {lineDate && <span className="text-xs text-gray-500">{new Date(lineDate).toLocaleString("fr-FR")}</span>}
                                        </div>
                                        {commentaire && <p className="text-sm mt-1">{commentaire}</p>}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon, label, value }) {
    return (
        <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 text-gray-400">{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="mt-1 text-sm text-gray-900">{(value ?? value === 0) ? value : "N/A"}</p>
            </div>
        </div>
    );
}

function InfoItemCoordonnee({ icon, label, value, latitude, longitude, setIsMapModalVisible, isMapModalVisible }) {
    const hasValidCoordinates = !!(latitude && longitude && !isNaN(+latitude) && !isNaN(+longitude));
    return (
        <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 text-gray-400">{icon}</div>
            <div className="flex-grow">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="mt-1 text-sm text-gray-900">{value || "N/A"}</p>
            </div>
            {hasValidCoordinates && (
                <Tooltip title="Voir sur la carte">
                    <Button type="text" className="bg-primary text-white" icon={<EnvironmentOutlined />} onClick={() => setIsMapModalVisible(!isMapModalVisible)} />
                </Tooltip>
            )}
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="bg-gray-100 min-h-screen pb-10">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="h-9 w-64 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid gap-6 md:grid-cols-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-primary">
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                                    {[...Array(5)].map((_, j) => (
                                        <div key={j} className="flex items-center space-x-3 mt-4">
                                            <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                                            <div className="space-y-2">
                                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

function ErrorDisplay({ error }) {
    return (
        <div className="flex justify-center items-center min-h-[60vh] bg-gray-100">
            <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-primary w-full max-w-md">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-red-600 mb-4">Erreur</h3>
                    <p className="text-center">{error}</p>
                </div>
            </div>
        </div>
    );
}

function FilePreview({ file, title }) {
    const fileType = file?.startsWith("/9j/") ? "image/jpeg" : file?.startsWith("iVBORw0KGgo") ? "image/png" : "application/pdf";
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-primary">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
                <div className="bg-gray-200 rounded-lg p-4">
                    {fileType.startsWith("image/") ? (
                        <img src={`data:${fileType};base64,${file}`} alt={title} className="w-full h-auto max-h-[400px] object-contain" />
                    ) : (
                        <iframe src={`data:application/pdf;base64,${file}`} title={title} className="w-full h-[400px]" />
                    )}
                </div>
            </div>
        </div>
    );
}
