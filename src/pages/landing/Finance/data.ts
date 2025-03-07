import { AssetType, ExpertType } from "./types";

import avatar1 from '@/assets/images/avatars/img-1.jpg'
import avatar3 from '@/assets/images/avatars/img-3.jpg'
import finance3 from '@/assets/images/landing/finance/img-3.jpg'
import finance4 from '@/assets/images/landing/finance/img-4.jpg'
import finance5 from '@/assets/images/landing/finance/img-5.jpg'

const experts: ExpertType[] = [
  {
    name: "Eric Houston",
    position: "Founder & CEO of Luminous",
    description: "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Sed fringilla mauris sit amet nibh.Sed consequat.",
    image: avatar1,
  },
  {
    name: "Robby Winston",
    position: "CEO of Product",
    description: "Vault's expert support enabled us to secure the necessary capital for our expansion. Plus, it's quicker and more cost-effective than hiring a consultant. Sed fringilla mauris sit amet nibh.Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,",
    image: avatar3,
  },
]

const valuableAssets: AssetType[] = [
  {
    title: "10 Techniques Simples pour Améliorer Votre Demande de Terrain",
    description: "Découvrez des méthodes efficaces pour optimiser votre dossier de demande de terrain auprès de la Mairie de Kaolack.",
    image: finance3,
  },
  {
    title: "5 Applications Pratiques de l'Intelligence Artificielle dans la Gestion des Terrains",
    description: "Explorez comment l'IA peut faciliter le processus d'attribution et de gestion des terrains municipaux.",
    image: finance4,
  },
  {
    title: "Cette Innovation Attendue Pourrait Révolutionner la Gestion des Terrains à Kaolack",
    description: "Une nouvelle technologie prometteuse pour améliorer l'efficacité des services municipaux liés aux terrains.",
    image: finance5,
  },
]

export { experts, valuableAssets }