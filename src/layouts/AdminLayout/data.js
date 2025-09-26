import {
    LuAlertOctagon,
    LuMap,
    LuRadar,
    LuSettings,
    LuShieldOff,
    LuShoppingBag,
    LuTarget,
    LuUsers,
    LuFileText,
} from "react-icons/lu";

import github from "@/assets/images/brand/github.png";
import bitbucket from "@/assets/images/brand/bitbucket.png";
import dropbox from "@/assets/images/brand/dropbox.png";
import slack from "@/assets/images/brand/slack.png";
import dribble from "@/assets/images/brand/dribbble.png";
import behance from "@/assets/images/brand/behance.png";


const adminMenu = [

    {
        name: "Dashboard",
        link: "/admin/dashboard",
        icon: LuRadar,
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_MAIRE", "ROLE_CHEF_SERVICE", "ROLE_PRESIDENT_COMMISSION", "ROLE_PERCEPTEUR", "ROLE_AGENT"],
    },
    {
        name: "Maps",
        link: "/admin/maps",
        icon: LuMap,
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_MAIRE", "ROLE_CHEF_SERVICE", "ROLE_AGENT"]
    },

    {
        name: "Demandes",
        icon: LuAlertOctagon,
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_MAIRE", "ROLE_CHEF_SERVICE", "ROLE_PRESIDENT_COMMISSION", "ROLE_PERCEPTEUR", "ROLE_AGENT"],
        children: [
            { name: "Demandes", link: "/admin/demandes" },
            {
                name: "Nouvelle demande",
                link: "/admin/demande/nouvelle",
                roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_AGENT"]
            },
        ],
    },
    {
        name: "Demandeurs",
        icon: LuUsers,
        roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"],
        children: [
            { name: "Liste des demandeurs", link: "/admin/demandeurs" },
            { name: "Liste des Habitants", link: "/admin/recherche-electeurs" },
        ],
    },

    {
        name: "Géographie",
        icon: LuTarget,
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_MAIRE", "ROLE_CHEF_SERVICE", "ROLE_PRESIDENT_COMMISSION", "ROLE_PERCEPTEUR", "ROLE_AGENT"],
        children: [
            { name: "Quartiers", link: "/admin/quartiers" },
            { name: "Lotissements", link: "/admin/lotissements" },
            { name: "Parcelles", link: "/admin/parcelles" },
            { name: "iLots", link: "/admin/lots" },
            { name: "Plans", link: "/admin/plans" },
        ],
    },

    {
        name: "Articles",
        link: "/admin/articles",
        icon: LuFileText,
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_MAIRE", "ROLE_CHEF_SERVICE", "ROLE_AGENT"],
    },
    {
        name: "Documents",
        link: "/admin/documents",
        icon: LuShoppingBag,
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_MAIRE"],
    },

    {
        name: "Titres",
        link: "/admin/titres",
        icon: LuShieldOff,
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_MAIRE", "ROLE_CHEF_SERVICE", "ROLE_PRESIDENT_COMMISSION", "ROLE_AGENT"],
    },

    {
        name: "Utilisateurs",
        link: "/admin/utilisateurs",
        icon: LuUsers,
        roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_MAIRE"]
    },

    {
        name: "Configuration",
        icon: LuSettings,
        roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_MAIRE"],
        children: [
            { name: "Paramètres", link: "/admin/configurations" },
            { name: "Audit Logs", link: "/admin/audits", roles: ["ROLE_SUPER_ADMIN"] },
        ],
    },
];

const adminMenus = [{
        name: "Dashboard",
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_MAIRE", "ROLE_CHEF_SERVICE", "ROLE_PRESIDENT_COMMISSION", "ROLE_PERCEPTEUR", "ROLE_AGENT"],
        link: "/admin/dashboard",
        icon: LuRadar,
    },
    {
        name: "Maps",
        link: "/admin/maps",
        icon: LuMap,
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_MAIRE", "ROLE_CHEF_SERVICE", "ROLE_AGENT"]
    },

    {
        name: "Demandes",
        icon: LuAlertOctagon,
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_MAIRE", "ROLE_CHEF_SERVICE", "ROLE_PRESIDENT_COMMISSION", "ROLE_PERCEPTEUR", "ROLE_AGENT"],
        children: [
            { name: "Demandes", link: "/admin/demandes" },
            { name: "Nouvelle demande", link: "/admin/demande/nouvelle", roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_AGENT"] },
        ],
    },

    {
        name: "Demandeurs",
        icon: LuUsers,
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_MAIRE", "ROLE_CHEF_SERVICE", "ROLE_AGENT"],
        children: [
            { name: "Liste des demandeurs", link: "/admin/demandeurs" },
            { name: "Liste des Habitants", link: "/admin/recherche-electeurs", roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_AGENT"] },
        ],
    },

    {
        name: "Géographie",
        icon: LuTarget,
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_MAIRE", "ROLE_CHEF_SERVICE", "ROLE_AGENT"],
        children: [
            { name: "Quartiers", link: "/admin/quartiers" },
            { name: "Lotissements", link: "/admin/lotissements" },
            { name: "Parcelles", link: "/admin/parcelles" },
            { name: "iLots", link: "/admin/lots" },
            { name: "Plans", link: "/admin/plans" },
        ],
    },

    {
        name: "Articles",
        link: "/admin/articles",
        icon: LuFileText,
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_MAIRE", "ROLE_CHEF_SERVICE", "ROLE_AGENT"]
    },
    {
        name: "Documents",
        link: "/admin/documents",
        icon: LuShoppingBag,
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_CHEF_SERVICE", "ROLE_PERCEPTEUR"]
    },
    {
        name: "Titres",
        link: "/admin/titres",
        icon: LuShieldOff,
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_MAIRE", "ROLE_PRESIDENT_COMMISSION", "ROLE_PERCEPTEUR", "ROLE_CHEF_SERVICE"]
    },

    {
        name: "Utilisateurs",
        link: "/admin/utilisateurs",
        icon: LuUsers,
        roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"]
    },
    {
        name: "Configuration",
        icon: LuSettings,
        roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"],
        children: [
            { name: "Paramètres", link: "/admin/configurations" },
            { name: "Audit Logs", link: "/admin/audits", roles: ["ROLE_SUPER_ADMIN"] },
        ],
    },
];



const apps = [{
        name: "GitHub",
        image: github,
    },
    {
        name: "Bitbucket",
        image: bitbucket,
    },
    {
        name: "Dropbox",
        image: dropbox,
    },
    {
        name: "Slack",
        image: slack,
    },
    {
        name: "Dribble",
        image: dribble,
    },
    {
        name: "Behance",
        image: behance,
    },
];

export { adminMenu, apps };