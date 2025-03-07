import {
  LuAlertOctagon,
  LuArchive,
  LuComponent,
  LuFile,
  LuMessagesSquare,
  LuRadar,
  LuShieldOff,
  LuSnowflake,
  LuTarget,
  LuUsers,
} from "react-icons/lu";

import github from "@/assets/images/brand/github.png";
import bitbucket from "@/assets/images/brand/bitbucket.png";
import dropbox from "@/assets/images/brand/dropbox.png";
import slack from "@/assets/images/brand/slack.png";
import dribble from "@/assets/images/brand/dribbble.png";
import behance from "@/assets/images/brand/behance.png";

const demandeurMenu = [
  {
    name: "Dashboard",
    link: "/demandeur/dashboard",
    icon: LuRadar,
  },
  {
    name: "Demandes",
    link: "/demandeur/demandes",
    icon: LuArchive,
  },
  {
    name: "Nouvelle demande",
    link: "/demandeur/nouveau-demande",
    icon: LuFile,
  },
 
  {
    name: "Documents",
    link: "/demandeur/documents",
    icon: LuFile,
  },

  
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

export { demandeurMenu,  apps };
