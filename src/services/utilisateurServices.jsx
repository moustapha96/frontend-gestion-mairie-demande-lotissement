// src/services/userService.js
import { HttpClient } from "@/helpers";

const urlApi =
    import.meta.env.VITE_API_URL;

// ---------- LISTE PAGINÉE ----------
export async function getUsersPaginated(params = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") qs.append(k, v);
    });
    const { data } = await HttpClient.get(`${urlApi}user/liste?${qs.toString()}`);
    return data; // { data: [...], meta: {...} }
}

// ---------- DÉTAILS ----------
export async function getUserDetails(id) {
    const { data } = await HttpClient.get(`${urlApi}user/${id}/details`);
    return data;
}

// ---------- ACTIONS COMPTE ----------
export async function updateActivatedStatus(id, body) {
    const { data } = await HttpClient.put(
        `${urlApi}user/update-activated-status/${id}`, body
    );
    return data;
}

export async function setCompteEnable(id, status /* "actif" | "inactif" */ ) {
    const { data } = await HttpClient.put(
        `${urlApi}users/set-compte-enable/${id}`, { enabled: status }
    );
    return data;
}

export async function updateUserRole(id, role /* "ROLE_..." */ ) {
    const { data } = await HttpClient.put(
        `${urlApi}user/${id}/update-role`, { role }
    );
    return data;
}

export async function updateUserProfile(id, payload) {
    const { data } = await HttpClient.put(
        `${urlApi}user/update-profile/${id}`,
        payload
    );
    return data;
}

export async function updatePassword(id, payload /* { currentPassword, newPassword } */ ) {
    const { data } = await HttpClient.put(
        `${urlApi}user/${id}/update-password`,
        payload
    );
    return data;
}

export async function uploadProfileImage(formData /* includes userId + file */ ) {
    const { data } = await HttpClient.post(
        `${urlApi}user/upload-profile-picture`,
        formData, { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
}

// ---------- CRÉATIONS ----------
export async function createAdminUser(payload) {
    const { data } = await HttpClient.post(`${urlApi}user/create-admin`, payload);
    return data;
}

export async function createUser(payload) {
    const { data } = await HttpClient.post(`${urlApi}user/create`, payload);
    return data;
}