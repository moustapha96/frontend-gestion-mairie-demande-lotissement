import {
  LuAlertOctagon,
  LuArchive,
  LuComponent,
  LuFile,
  LuFileText,
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

const agentMenu = [
  {
    name: "Dashboard",
    link: "/agent/dashboard",
    icon: LuRadar,
  },
  {
    name: "Demandes",
    link: "/agent/demandes",
    icon: LuArchive,
  },
  {
    name: "Demandeurs",
    link: "/agent/demandeurs",
    icon: LuUsers,
  },{
    name: "Lotissement",
    link: "/agent/lotissements",
    icon: LuTarget,
  },
  {
    name: "Lots",
    link: "/agent/lots",
    icon: LuTarget,
  },
  {
    name: "Parcelles",
    link: "/agent/parcelles",
    icon: LuTarget,
  },
   {
    name: "Plans",
    link: "/agent/plans",
    icon: LuTarget,
  },
  {
    name: "Localité",
    link: "/agent/localites",
    icon: LuTarget,
  },
   {
      name: "Articles",
      link: "/agent/articles",
      icon: LuFileText,
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

export { agentMenu,  apps };
