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
  },
  {
    name: "Maps",
    link: "/admin/maps",
    icon : LuMap
  },
  {
    name: "Demandes",
    link: "/admin/demandes",
    icon: LuAlertOctagon,
  },
  {
    name: "Demandeur",
    link: "/admin/demandeurs",
    icon: LuUsers,
  },
  {
    name: "Lotissement",
    link: "/admin/lotissements",
    icon: LuTarget,
  },
  {
    name: "Lots",
    link: "/admin/lots",
    icon: LuTarget,
  },
  {
    name: "Parcelles",
    link: "/admin/parcelles",
    icon: LuTarget,
  },
   {
    name: "Plans",
    link: "/admin/plans",
    icon: LuTarget,
  },
  {
    name: "Localité",
    link: "/admin/localites",
    icon: LuTarget,
  }, 
  {
    name: "Configuration",
    link: "/admin/configurations",
    icon: LuSettings, 
  },
  {
    name: "Documents",
    link: "/admin/documents",
    icon: LuShoppingBag,
  },
  // {
  //   name: "Modèles Documents",
  //   link: "/admin/document-models",
  //   icon: LuFileText,
  //   role: "ROLE_SUPER_ADMIN"
  // }
];





const apps = [
  {
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

export { adminMenu,  apps };
