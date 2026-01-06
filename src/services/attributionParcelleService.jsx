// src/services/attributionParcelleService.js
import { HttpClient } from "../helpers";

const urlApi = import.meta.env.VITE_API_URL;
const BASE = `${urlApi}attributions-parcelles`;

const unwrap = (resp) => resp?.data;

/* =========================
   LIST / GET / CREATE / UPDATE / DELETE
========================= */

/**
 * Liste paginée.
 * @param {{ page?: number, pageSize?: number, q?: string, ... }} params
 */
export async function listAttributionsParcelles(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const { data } = await HttpClient.get(qs ? `${BASE}?${qs}` : BASE);
    const payload = unwrap(data);

    if (Array.isArray(payload)) {
        return { items: payload, total: payload.length, page: 1, pageSize: payload.length };
    }
    if (payload?.items) {
        return {
            items: payload.items,
            total: payload.total ?? payload.items.length,
            page: payload.page ?? 1,
            pageSize: payload.pageSize ?? payload.items.length,
        };
    }
    return { items: payload ? [payload] : [], total: payload ? 1 : 0, page: 1, pageSize: payload ? 1 : 0 };
}

/**
 * Création d’une attribution.
 * Attendu côté back: {
 *   demandeId, parcelleId, montant, frequence, dateEffet?, dateFin?,
 *   // Optionnel si tu initialises en attribution provisoire dès la création :
 *   statutAttribution?, pvAttributionProvisoire?
 * }
 */
export async function createAttributionParcelle(payload) {
    const { data } = await HttpClient.post(BASE, payload);
    return unwrap(data);
}

/** Détail par id */
export async function getAttributionParcelle(id) {
    const { data } = await HttpClient.get(`${BASE}/${id}`);
    return unwrap(data);
}

/** Détail par demande */
export async function getAttributionParcelleByDemande(demandeId) {
    const { data } = await HttpClient.get(`${BASE}/by-demande/${demandeId}`);
    return unwrap(data);
}

/** Mise à jour partielle */
export async function updateAttributionParcelle(id, payload) {
    const { data } = await HttpClient.patch(`${BASE}/${id}`, payload);
    return unwrap(data);
}

/** Suppression (option: libérer la parcelle) */
export async function deleteAttributionParcelle(id, { liberer = false } = {}) {
    const qs = liberer ? "?liberer=1" : "";
    const { data } = await HttpClient.delete(`${BASE}/${id}${qs}`);
    return unwrap(data);
}

/* =========================
   PAIEMENT
========================= */

/** Changer le statut de paiement */
export async function changeStatePaiement(id, { etatPaiement }) {
    const { data } = await HttpClient.patch(`${BASE}/${id}/statut-paiement`, { etatPaiement });
    return unwrap(data);
}

/* =========================
   WORKFLOW / TRANSITIONS (avec PVs dédiés)
========================= */

/**
 * Validation provisoire — PV requis.
 * payload: { pv: string }
 */
export async function validerProvisoire(id, { pv }) {
    const { data } = await HttpClient.patch(`${BASE}/${id}/valider-provisoire`, { pv });
    return unwrap(data);
}

/**
 * Attribution provisoire — PV requis.
 * payload: { pv: string }
 */
export async function attribuerProvisoire(id, { pv }) {
    const { data } = await HttpClient.patch(`${BASE}/${id}/attribuer-provisoire`, { pv });
    return unwrap(data);
}

/**
 * Approbation du préfet — PV requis.
 * payload: { pv: string }
 */
export async function approuverPrefet(id, { pv }) {
    const { data } = await HttpClient.patch(`${BASE}/${id}/approuver-prefet`, { pv });
    return unwrap(data);
}

/**
 * Approbation du conseil — Décision + PV requis (date optionnelle).
 * payload: { decisionConseil: string, pv: string, date?: string(ISO) }
 */
export async function approuverConseil(id, { decisionConseil, pv, date }) {
    const { data } = await HttpClient.patch(`${BASE}/${id}/approuver-conseil`, {
        decisionConseil,
        pv,
        date,
    });
    return unwrap(data);
}

/**
 * Attribution définitive — Date d’effet requise.
 * payload: { dateEffet: string(YYYY-MM-DD ou ISO) }
 */
export async function attribuerDefinitive(id, { dateEffet }) {
    const { data } = await HttpClient.patch(`${BASE}/${id}/attribuer-definitive`, { dateEffet });
    return unwrap(data);
}

/* =========================
   ÉTATS ALTERNATIFS (si exposés côté back)
========================= */

/** Mise en valeur (si endpoint présent) */
export async function miseEnValeur(id, payload = {}) {
    const { data } = await HttpClient.patch(`${BASE}/${id}/mise-en-valeur`, payload);
    return unwrap(data);
}

/** Rejeter (si endpoint présent) */
export async function rejeterAttribution(id, payload = {}) {
    const { data } = await HttpClient.patch(`${BASE}/${id}/rejeter`, payload);
    return unwrap(data);
}

/** Annuler (si endpoint présent) */
export async function annulerAttribution(id, payload = {}) {
    const { data } = await HttpClient.patch(`${BASE}/${id}/annuler`, payload);
    return unwrap(data);
}


export async function reopenAttribution(id, {
    to = "VALIDATION_PROVISOIRE", // ou "ATTRIBUTION_PROVISOIRE"
    resetDates = true,
    resetPVs = false,
    resetDecision = false,
} = {}) {
    const { data } = await HttpClient.patch(
        `${BASE}/${id}/reouvrir`,
        { to, resetDates, resetPVs, resetDecision }
    );
    return data?.data;
}
