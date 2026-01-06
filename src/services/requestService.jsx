
// src/services/requestService.js
import { HttpClient } from "../helpers";

const urlApi = import.meta.env.VITE_API_URL;

// Petit util pour accepter FormData ou JSON
function makeBodyAndHeaders(payload) {
  const isFD = (typeof FormData !== "undefined") && payload instanceof FormData;

  if (isFD) return { body: payload, headers: {} };

  const hasFile =
    (payload && typeof File !== "undefined" && (
      payload?.recto instanceof File ||
      payload?.verso instanceof File
    ));

  if (!hasFile) {
    return { body: JSON.stringify(payload ?? {}), headers: { "Content-Type": "application/json" } };
  }

  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (typeof File !== "undefined" && v instanceof File) fd.append(k, v);
    else if (typeof v === "boolean") fd.append(k, String(v));
    else fd.append(k, String(v));
  });
  return { body: fd, headers: {} };
}

/* ========================= CRUD DEMANDES ========================= */

// CREATE (supporte FormData et JSON)
export async function createDemande(payload) {
  const { body, headers } = makeBodyAndHeaders(payload);
  const { data } = await HttpClient.post(`${urlApi}nouveau-demandes`, body, {
    headers: {
      ...headers,
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
    },
  });
  return data; // { success, item }
}

// LIST (admin ou générique)
export async function listRequests(params) {
  const { data } = await HttpClient.get(`${urlApi}nouveau-demandes`, { params });
  return data; // { success, items, total, page, pageSize }
}

// LIST (par id de demandeur)
export async function listRequestsUser(id, params) {
  const { data } = await HttpClient.get(`${urlApi}nouveau-demandes/demandeur/${id}`, { params });
  return data;
}

// LIST (par NIN/num électeur)
export async function listRequestsElecteur(nin, params) {
  const { data } = await HttpClient.get(`${urlApi}nouveau-demandes/electeur/${nin}`, { params });
  return data;
}

// LIST (mes demandes) — à utiliser côté “demandeur”
export async function getMesDemandes(params = {}) {
  // Variante 1 (si ton back propose mine=1)
  // const { data } = await HttpClient.get(`${urlApi}nouveau-demandes`, { params: { ...params, mine: 1 } });
  // return data;

  // Variante 2 (si pas de mine=1, on passe par l’id du user connecté côté front)
  // -> à appeler depuis la page avec l’id utilisateur, ou expose une route back /me
  const userRaw = localStorage.getItem("user");
  const me = userRaw ? JSON.parse(userRaw) : null;
  if (!me?.id) throw new Error("Utilisateur non identifié pour getMesDemandes.");
  const { data } = await HttpClient.get(`${urlApi}nouveau-demandes/demandeur/${me.id}`, { params });
  return data;
}

// ALIAS explicite (si tu préfères passer l’id)
export async function getMesDemandesByUser(userId, params = {}) {
  return listRequestsUser(userId, params);
}

// GET ONE
export async function getDemande(id) {
  const { data } = await HttpClient.get(`${urlApi}nouveau-demandes/${id}`);
  return data; // { success, item }
}

export async function getDemandeDemandeur(id) {
  const { data } = await HttpClient.get(`${urlApi}nouveau-demandes/demandeur/${id}`);
  return data; // { success, item }
}
/** Détails enrichis */
export async function getDetailsRequest(id) {
  const { data } = await HttpClient.get(`${urlApi}nouveau-demandes/${id}/details`);
  return data; // { success, item } ou la forme que renvoie ton back
}

// Fichiers/documents d’une demande (recto/verso)
export async function getFileRequest(id) {
  const { data } = await HttpClient.get(`${urlApi}nouveau-demandes/${id}/documents`);
  return data; // { recto, verso }
}

// UPDATE (PATCH)
export async function updateDemande(id, payload) {
  const { body, headers } = makeBodyAndHeaders(payload);
  const { data } = await HttpClient.patch(`${urlApi}nouveau-demandes/${id}`, body, { headers });
  return data; // { success, item }
}

// DELETE
export async function deleteDemande(id) {
  const { data } = await HttpClient.delete(`${urlApi}nouveau-demandes/${id}`);
  return data; // { success:true }
}

/* ========================= OUTILS / ADJACENT ========================= */

export async function retirerAttribution(id) {
  const { data } = await HttpClient.put(`${urlApi}nouveau-demandes/${id}/retirer-attribution`);
  return data;
}

export async function getAdjacentDemande(id)  {
  const { data } = await HttpClient.get(`${urlApi}nouveau-demandes/${id}/adjacent`);
  return data;
}

/* ========================= WORKFLOW (si ton back expose /requests/...) =========================
   ⚠️ Si ton backend n’a PAS ces routes, remplace-les par l’équivalent /nouveau-demandes/…
   Exemple: `${urlApi}nouveau-demandes/${id}/statut` etc.
====================================================================== */






// MAJ statut (PATCH)
export async function updateStatutRequest(id, body) {
  const { data } = await HttpClient.patch(`${urlApi}requests/${id}/statut`, JSON.stringify(body));
  return data;
}




// Rejeter (motif)
export async function updateRefusRequest(id, body) {
  const { data } = await HttpClient.post(`${urlApi}requests/${id}/rejeter`, JSON.stringify(body));
  return data;
}

/* ========================= ATTRIBUER PARCELLE À UNE DEMANDE ========================= */

export async function attributeParcelleToRequest(requestId, parcelleId, {
  montant, superficie, dateEffet, dateFin
}) {
  const payload = { parcelleId, montant, superficie, dateEffet, dateFin };
  const { data } = await HttpClient.post(
    `${urlApi}requests/${requestId}/attribuer-parcelle`,
    payload
  );
  return data;
}
