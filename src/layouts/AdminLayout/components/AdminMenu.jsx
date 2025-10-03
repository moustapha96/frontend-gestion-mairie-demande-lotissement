// src/components/AdminMenu.jsx
import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { adminMenu } from "../data";
import { cn } from "@/utils";
import { LuMenu, LuX, LuChevronDown } from "react-icons/lu";
import { useAuthContext } from "@/context"; // doit exposer user.roles (array)

const hasAccess = (userRoles = [], item) => {
  const roles = item?.roles || (item?.role ? [item.role] : null);
  if (!roles || roles.length === 0) return true;
  return userRoles.some((r) => roles.includes(r));
};

const isActivePath = (pathname, item) => {
  if (item.link && pathname === item.link) return true;
  if (item.children?.length) {
    return item.children.some((ch) => ch.link && pathname.startsWith((ch.link ?? "").split("?")[0]));
  }
  return false;
};

export default function AdminMenu() {
  const { pathname } = useLocation();
  const { user } = useAuthContext();
  const userRoles = Array.isArray(user?.roles) ? user.roles : [user.roles];
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openIdx, setOpenIdx] = useState(null); // quel parent est “déployé” au 1er niveau

  // filtre par rôles (y compris children)
  const items = useMemo(() => {
    const filterTree = (list) =>
      list
        .filter((i) => hasAccess(userRoles, i))
        .map((i) => ({ ...i, children: i.children ? filterTree(i.children) : undefined }))
        .filter((i) => !i.children || i.children.length > 0);
    return filterTree(adminMenu);
  }, [userRoles]);

  // ouvrir automatiquement le parent actif
  useEffect(() => {
    const foundIdx = items.findIndex((it) => isActivePath(pathname, it) && it.children?.length);
    setOpenIdx(foundIdx >= 0 ? foundIdx : null);
  }, [pathname, items]);

  // ferme menu mobile au changement de route
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const openParent = openIdx !== null ? items[openIdx] : null;

  return (
    <nav className="border-b border-default-200 bg-white text-sm font-medium shadow-sm shadow-default-100 dark:bg-default-50">
      {/* Header (logo + burger) */}
      <div className="container mx-auto flex items-center justify-between px-3 py-2.5">
        <Link to="/admin/dashboard" className="font-bold text-default-800">
          {user && user.roles.includes("ROLE_ADMIN") ? "Admin" : user.roles.includes('ROLE_MAIRE') ? "Monsieur le Maire" :
            user.roles.includes("ROLE_PRESIDENT_COMMISSION") ? "Monsieur le Président de la Commission" :
              user.roles.includes("ROLE_AGENT") ? "Monsieur l'Agent" :
                user.roles.includes("ROLE_PERCEPTEUR")? "Monsieur le Perceptrice" : " Utilisateur "}
        </Link>

        <button
          type="button"
          className="rounded-lg p-2 hover:bg-default-100 md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Ouvrir le menu"
        >
          {mobileOpen ? <LuX className="size-6" /> : <LuMenu className="size-6" />}
        </button>
      </div>

      {/* Rangée top-level (affichée en md+ toujours, en mobile si ouvert) */}
      <div className={cn("border-t border-default-200", "md:border-t-0")}>
        <div
          className={cn(
            "container mx-auto px-3",
            "md:block",
            mobileOpen ? "block" : "hidden md:block"
          )}
        >
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar py-2.5">
            {items.map((item, idx) => {
              const Icon = item.icon;
              const active = isActivePath(pathname, item);
              const isParent = !!item.children?.length;
              const isOpen = openIdx === idx;

              // bouton parent (déploie la rangée 2)
              if (isParent) {
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className={cn(
                      "shrink-0 snap-center inline-flex items-center gap-2 rounded-full px-3 py-2 font-semibold transition-all",
                      "text-default-600 hover:bg-default-100 hover:text-default-800",
                      (active || isOpen) && "bg-primary/10 text-primary"
                    )}
                    aria-expanded={isOpen}
                  >
                    {Icon && <Icon className="size-5" />}
                    <span>{item.name}</span>
                    <LuChevronDown
                      className={cn("size-4 transition-transform", isOpen && "rotate-180")}
                    />
                  </button>
                );
              }

              // lien simple
              return (
                <Link
                  key={idx}
                  to={item.link}
                  className={cn(
                    "shrink-0 snap-center inline-flex items-center gap-2 rounded-full px-3 py-2 font-semibold transition-all",
                    "text-default-600 hover:bg-default-100 hover:text-default-800",
                    active && "bg-primary/10 text-primary"
                  )}
                >
                  {Icon && <Icon className="size-5" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rangée sous-menu au 1er niveau (sous la barre principale) */}
      <div
        className={cn(
          "overflow-hidden border-t border-default-200 transition-[max-height,opacity] duration-300 ease-in-out",
          openParent ? "max-h-28 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {openParent && (
          <div className="container mx-auto px-3">
            <div className="flex gap-1 overflow-x-auto custom-scrollbar py-2">
              {openParent.children.map((ch, cidx) => {
                const childPath = (ch.link ?? "").split("?")[0];
                const childActive = childPath && pathname.startsWith(childPath);
                return (
                  <Link
                    key={cidx}
                    to={ch.link}
                    className={cn(
                      "shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold",
                      "text-default-700 hover:bg-default-100",
                      childActive && "bg-primary/10 text-primary"
                    )}
                  >
                    {ch.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}


