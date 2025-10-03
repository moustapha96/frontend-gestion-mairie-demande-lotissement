import { AssetType, ExpertType } from "./types";

import avatar1 from '@/assets/images/avatars/img-1.jpg'
import avatar3 from '@/assets/images/avatars/img-3.jpg'
import finance3 from '@/assets/images/landing/finance/img-3.jpg'
import finance4 from '@/assets/images/landing/finance/img-4.jpg'
import finance5 from '@/assets/images/landing/finance/img-5.jpg'
import image_bannier from "@/assets/logo_200X200.png"

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

export { experts, valuableAssets }