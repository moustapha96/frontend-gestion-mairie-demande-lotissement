// src/services/auditLogService.js
import { HttpClient } from "@/helpers";

const urlApi = import.meta.env.VITE_API_URL; 

export async function getAuditLogsPaginated(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") query.append(k, v);
  });

  // ton controller attend /api/audit-logs
  const { data } = await HttpClient.get(`${urlApi}audit-logs?${query.toString()}`);
  return data; // { data: [...], meta: {...} }
}
