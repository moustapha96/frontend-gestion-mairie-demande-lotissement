// src/rbac/roles.js
export const ROLES = {
    SUPER_ADMIN: "ROLE_SUPER_ADMIN",
    ADMIN: "ROLE_ADMIN",
    MAIRE: "ROLE_MAIRE",
    CHEF_SERVICE: "ROLE_CHEF_SERVICE",
    PRESIDENT_COMMISSION: "ROLE_PRESIDENT_COMMISSION",
    PERCEPTEUR: "ROLE_PERCEPTEUR",
    AGENT: "ROLE_AGENT",
    DEMANDEUR: "ROLE_DEMANDEUR",
};

// Hiérarchie (héritage)
const ROLE_HIERARCHY = {
    [ROLES.SUPER_ADMIN]: [
        ROLES.ADMIN,
        ROLES.MAIRE,
        ROLES.CHEF_SERVICE,
        ROLES.PRESIDENT_COMMISSION,
        ROLES.PERCEPTEUR,
        ROLES.AGENT,
        ROLES.DEMANDEUR,
    ],
    [ROLES.ADMIN]: [
        ROLES.MAIRE,
        ROLES.CHEF_SERVICE,
        ROLES.PRESIDENT_COMMISSION,
        ROLES.PERCEPTEUR,
        ROLES.AGENT,
        ROLES.DEMANDEUR,
    ],
};

export const normalizeRoles = (raw) => {
    if (!raw) return [];
    const arr = Array.isArray(raw) ? raw : [raw];
    return arr
        .filter(Boolean)
        .map((r) => String(r).trim().toUpperCase())
        .map((r) => (r.startsWith("ROLE_") ? r : `ROLE_${r}`));
};

export const expandRoles = (roles) => {
    const base = new Set(normalizeRoles(roles));
    const addChildren = (r) => {
        const children = ROLE_HIERARCHY[r] || [];
        for (const c of children) {
            if (!base.has(c)) {
                base.add(c);
                addChildren(c);
            }
        }
    };
    [...base].forEach(addChildren);
    return [...base];
};

export const hasAnyRole = (userRoles = [], allowed = []) => {
    if (!allowed || allowed.length === 0) return true; // pas de restriction
    const set = new Set(expandRoles(userRoles));
    return allowed.some((r) => set.has(r));
};