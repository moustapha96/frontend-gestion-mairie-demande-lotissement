
import { HttpClient } from '../helpers';
const urlApi = import.meta.env.VITE_API_URL



function makeBodyAndHeaders(payload) {
  const isFD = (typeof FormData !== "undefined") && payload instanceof FormData;

  // 1) Si c'est déjà un FormData, on le renvoie tel quel, SANS header 'Content-Type'
  if (isFD) {
    return { body: payload, headers: {} }; // <-- pas de Content-Type ici
  }

  // 2) Détecter fichiers si payload objet "brut"
  const hasFile =
    (payload && typeof File !== "undefined" && (
      payload?.recto instanceof File ||
      payload?.verso instanceof File
    ));

  // 3) Si pas de fichier -> JSON
  if (!hasFile) {
    return {
      body: JSON.stringify(payload ?? {}),
      headers: { "Content-Type": "application/json" },
    };
  }

  // 4) Sinon, construire un FormData (et ne pas fixer Content-Type)
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (typeof File !== "undefined" && v instanceof File) {
      fd.append(k, v);
    } else if (typeof v === "boolean") {
      fd.append(k, String(v));
    } else {
      fd.append(k, String(v));
    }
  });
  return { body: fd, headers: {} }; // <-- pas de Content-Type ici
}

/** CREATE */
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
/** LIST */
export async function listRequests(params) {
    const { data } = await HttpClient.get(`${urlApi}nouveau-demandes`, { params });
    return data; // { success, items, total, page, pageSize }
}

export async function listRequestsUser(id, params) {
    const { data } = await HttpClient.get(`${urlApi}nouveau-demandes/demandeur/${id}`, { params });
    return data; // { success, items, total, page, pageSize }
}


export async function listRequestsElecteur( nin,  params) {
    const { data } = await HttpClient.get(`${urlApi}nouveau-demandes/electeur/${nin}`, { params });
    return data; // { success, items, total, page, pageSize }
}


/** GET ONE */
export async function getDemande(id) {
    const { data } = await HttpClient.get(`${urlApi}nouveau-demandes/${id}`);
    return data; // { success, item }
}



/** UPDATE (PATCH) */
export async function updateDemande(id, payload) {
    const { body, headers } = makeBodyAndHeaders(payload);
    const { data } = await HttpClient.patch(`${urlApi}nouveau-demandes/${id}`, body, { headers });
    return data; // { success, item }
}

/** DELETE */
export async function deleteDemande(id) {
    const { data } = await HttpClient.delete(`${urlApi}nouveau-demandes/${id}`);
    return data; // { success:true }
}




















/** ========================= LISTING / LECTURE ========================= */

// Détails d’une demande
export async function getDetailsRequest(id) {
    const { data } = await HttpClient.get(`${urlApi}nouveau-demandes/${id}/details`);
    return data; // demande complète
}

// Documents (recto/verso) — adapte si ton back expose un autre chemin
export async function getFileRequest(id) {
    const { data } = await HttpClient.get(`${urlApi}requests/${id}/document`);
    return data; // { recto: base64, verso: base64 }
}

/** ========================= ÉCRITURE / WORKFLOW ========================= */

// Mettre le rapport
export async function updateRapportRequest(id, body) {
    const { data } = await HttpClient.put(`${urlApi}requests/${id}/rapport`, JSON.stringify(body));
    return data;
}

// Mettre la recommandation
export async function updateRecommandationRequest(id, body) {
    const { data } = await HttpClient.put(`${urlApi}requests/${id}/recommandation`, JSON.stringify(body));
    return data;
}

// Mettre la décision de la commission
export async function updateDecisionCommissionRequest(id, body) {
    const { data } = await HttpClient.put(`${urlApi}requests/${id}/decision-commission`, JSON.stringify(body));
    return data;
}

// Mettre à jour le statut (PATCH)
export async function updateStatutRequest(id, body) {
    const { data } = await HttpClient.patch(`${urlApi}requests/${id}/statut`, JSON.stringify(body));
    return data;
}


export async function setNiveauRequest(id, niveauId) {
    const { data } = await HttpClient.patch(`${urlApi}requests/${id}/niveau`, 
      JSON.stringify({ niveauId }));
    return data;
}

// Valider l’étape (initialiser/avancer/terminer)
export async function validateEtapeRequest(id) {
    const { data } = await HttpClient.post(`${urlApi}requests/${id}/valider-etape`, null);
    return data;
}

// Rejeter (avec motif)
export async function updateRefusRequest(id, body) {
    const { data } = await HttpClient.post(`${urlApi}requests/${id}/rejeter`, JSON.stringify(body));
    return data;
}
