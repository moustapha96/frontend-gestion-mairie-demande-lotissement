import { AssetType, ExpertType } from "./types";
import {
  LuClipboardSignature,
  LuContact2,
  LuFolderKanban,
  LuImage,
  LuNewspaper,
  LuStore,
} from "react-icons/lu";



import avatar1 from '@/assets/images/avatars/img-1.jpg'
import avatar3 from '@/assets/images/avatars/img-3.jpg'
import finance3 from '@/assets/images/landing/finance/img-3.jpg'
import finance4 from '@/assets/images/landing/finance/img-4.jpg'
import finance5 from '@/assets/images/landing/finance/img-5.jpg'
import image_bannier from "@/assets/logo_200X200.png"


import image1 from "@/assets/mairie/image1.jpeg"
import image2 from "@/assets/mairie/image2.jpeg"
import image3 from "@/assets/mairie/image3.jpeg"
import image4 from "@/assets/mairie/image4.jpeg"
import image5 from "@/assets/mairie/image5.jpeg"
import image6 from "@/assets/mairie/image6.jpeg"
import image7 from "@/assets/mairie/image7.jpeg"
import image8 from "@/assets/mairie/image8.jpeg"
import image9 from "@/assets/mairie/image9.jpeg"
import image10 from "@/assets/mairie/image10.jpeg"

const heroSwiperSlides = [
  {
    title: "Crafting Vision into Reality: Design Agency at Your Service",
    description:
      "Their ability to understand our vision and translate it into a comprehensive marketing strategy is truly exceptional.",
  },
  {
    title: "Innovative Design Solutions: Unleashing Creativity for You",
    description:
      "Their ability to understand our vision and translate it into a comprehensive marketing strategy is truly exceptional.",
  },
  {
    title: "Design Excellence Redefined: Elevate Your Brand with Our Agency",
    description:
      "Their ability to understand our vision and translate it into a comprehensive marketing strategy is truly exceptional.",
  },
];


const services = [
  {
    title: "Search Engine Optimization",
    icon: LuNewspaper,
  },
  {
    title: "Social Media Marketing",
    icon: LuFolderKanban,
  },
  {
    title: "E-commerce Solutions",
    icon: LuClipboardSignature,
  },
  {
    title: "Pay-Per-Click Advertising",
    icon: LuStore,
  },
  {
    title: " Branding  Strategy",
    icon: LuContact2,
  },
  {
    title: "Marketing Copywriting",
    icon: LuImage,
  },
];


const experts: ExpertType[] = [
  {
    name: "Nom Expert 1",
    position: "Poste de l'expert 1",
    description: "Description de l'expert 1. Par exemple, ses réalisations ou son expertise en gestion foncière.",
    image: image_bannier,
  },
  {
    name: "Nom Expert 2",
    position: "Poste de l'expert 2",
    description: "Description de l'expert 2. Par exemple, ses réalisations ou son expertise en gestion foncière.",
    image: image_bannier,
  },
]

const valuableAssets: AssetType[] = [
  {
    title: "10 Techniques Simples pour Améliorer Votre Demande de Terrain",
    description: "Découvrez des méthodes efficaces pour optimiser votre dossier de demande de terrain auprès de la Mairie de Kaolack.",
    image: image_bannier,
  },
  {
    title: "5 Applications Pratiques de l'Intelligence Artificielle dans la Gestion des Terrains",
    description: "Explorez comment l'IA peut faciliter le processus d'attribution et de gestion des terrains municipaux.",
    image: image_bannier,
  },
  {
    title: "Cette Innovation Attendue Pourrait Révolutionner la Gestion des Terrains à Kaolack",
    description: "Une nouvelle technologie prometteuse pour améliorer l'efficacité des services municipaux liés aux terrains.",
    image: image_bannier,
  },
]

export { experts, valuableAssets , heroSwiperSlides , services }