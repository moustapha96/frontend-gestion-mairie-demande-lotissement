

// import { Link } from "react-router-dom";
// import { LuCircle, LuMoveRight } from 'react-icons/lu'
// import finance9 from '@/assets/images.jpg'
// import finance8 from '@/assets/message_maire.jpg'
// import finance10 from '@/assets/logo.png';

// import image1 from "@/assets/mairie/image1.jpeg"
// import image2 from "@/assets/mairie/image2.jpeg"
// import image3 from "@/assets/mairie/image3.jpeg"
// import image4 from "@/assets/mairie/image4.jpeg"
// import image5 from "@/assets/mairie/image5.jpeg"
// import image6 from "@/assets/mairie/image6.jpeg"
// import image7 from "@/assets/mairie/image7.jpeg"
// import image8 from "@/assets/mairie/image8.jpeg"
// import image9 from "@/assets/mairie/image9.jpeg"
// import image10 from "@/assets/mairie/image10.jpeg"

// const Feature1 = () => {


//   return (
//     <section id="services" className="py-10 lg:py-20">
//       <div className="container">
//         <div className="flex items-end justify-between mb-10">
//           <div className="max-w-2xl mx-auto text-center">
//             <span className="py-1 px-3 rounded-md text-xs font-medium uppercase tracking-wider border border-primary bg-primary/20 text-primary">Nos Experts</span>
//             <h2 className="text-4xl font-medium text-default-950 mt-4">Nos Services</h2>
//           </div>
//         </div>



//         <div className="container">
//           <div className="grid lg:grid-cols-2 gap-6 items-center">
//             <div>
//               <span className="py-1 px-3 rounded-md text-xs font-medium uppercase tracking-wider border border-primary bg-primary/20 text-primary">Projets en Vedette</span>
//               <h2 className="text-4xl/tight font-medium text-default-950 mt-4">Simplifiez vos démarches foncières avec notre nouveau portail</h2>
//               <p className="text-base text-default-900 mt-5">La mairie de Kaolack a lancé une plateforme en ligne pour faciliter les demandes de terrain. Ce portail vise à rendre le processus plus transparent et accessible à tous les citoyens.</p>
//               <div className="group mt-5">
//                 <Link to="/demande-terrain" className="inline-flex items-center justify-center gap-2 rounded-full py-2 px-4 bg-primary/20 text-primary text-sm transition-all duration-200 hover:bg-primary hover:text-white">
//                   En savoir plus
//                   <LuMoveRight className="w-6 h-6 inline-block" />
//                 </Link>
//               </div>
//             </div>
//             <div>
//               <img src={image6} className="h-full w-full rounded-lg" alt="Projet foncier à Kaolack" />
//             </div>
//           </div>
//         </div>

//         <div className="container">
//           <div className="grid lg:grid-cols-2 gap-6 items-center">
//             <div>
//               <img src={image7} className="h-full w-full rounded-lg" />
//             </div>
//             <div>
//               <span className="py-1 px-3 rounded-md text-xs font-medium uppercase tracking-wider border border-primary bg-primary/20 text-primary">Attribution de terrains</span>
//               <h2 className="text-4xl/tight font-medium text-default-950 mt-4">Simplifiez vos démarches d'attribution de terrain avec la Mairie de Kaolack</h2>
//               <ul role="list" className="mt-6 space-y-2 text-sm text-default-700 -ms-3 ps-6">
//                 <li className="flex items-center gap-3">
//                   <LuCircle className="shrink inline-block h-2 w-2 text-primary fill-primary" />
//                   <span className="grow text-base font-medium">Accédez facilement aux informations sur les terrains disponibles.</span>
//                 </li>
//                 <li className="flex items-center gap-3">
//                   <LuCircle className="shrink inline-block h-2 w-2 text-primary fill-primary" />
//                   <span className="grow text-base font-medium">Suivez l'état d'avancement de votre demande en temps réel.</span>
//                 </li>
//                 <li className="flex items-center gap-3">
//                   <LuCircle className="shrink inline-block h-2 w-2 text-primary fill-primary" />
//                   <span className="grow text-base font-medium">Bénéficiez d'un accompagnement personnalisé tout au long du processus.</span>
//                 </li>
//               </ul>
//               <div className="group mt-5">
//                 <Link to="/demande-de-terrain" className="inline-flex items-center justify-center gap-2 rounded-full py-2 px-4 bg-primary/20 text-primary text-sm transition-all duration-200 hover:bg-primary hover:text-white">
//                   En savoir plus
//                   <LuMoveRight className="w-6 h-6 inline-block" />
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>


//         <div className="container">
//           <div className="grid lg:grid-cols-2 gap-6 items-center">
//             <div>
//               <span className="py-1 px-3 rounded-md text-xs font-medium uppercase tracking-wider border border-primary bg-primary/20 text-primary">Accès aux Conseillers</span>
//               <h2 className="text-4xl/tight font-medium text-default-950 mt-4">Support Personnalisé et Conseils d'Experts</h2>
//               <p className="text-base mt-5">Bénéficiez d'un accompagnement expert et de retours précieux adaptés à vos besoins. Nos conseillers sont là pour vous aider à naviguer dans les défis administratifs et à prendre des décisions éclairées.</p>
//               <div className="group mt-5">
//                 <Link to="" className="inline-flex items-center justify-center gap-2 rounded-full py-2 px-4 bg-primary/20 text-primary text-sm transition-all duration-200 hover:bg-primary hover:text-white">En savoir plus
//                   <LuMoveRight className="w-6 h-6 inline-block" />
//                 </Link>
//               </div>
//             </div>
//             <div className="relative">
//               <img src={image8} className="rounded-xl" />
//               <div className="hidden lg:block">
//                 <div className="absolute -top-20 -end-20">
//                   <div className="max-w-md">
//                     <div className="p-6 bg-white border border-default-200 rounded-xl dark:bg-default-50">
//                       <h2 className="text-xl font-medium text-default-950">Obtenez des Conseils sur les Demandes de Terrain</h2>
//                       <p className="text-base mt-4">Planifiez une consultation gratuite avec nos experts en urbanisme et en aménagement du territoire pour vous guider dans vos démarches.</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="absolute -bottom-8 -start-20">
//                   <div className="inline-block">
//                     <div className="p-5 bg-white border border-default-200 rounded-xl dark:bg-default-50">
//                       <h4 className="text-xl font-medium text-default-950">Support Prioritaire</h4>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// };

// export default Feature1;


import { Link } from "react-router-dom";
import { LuCircle, LuMoveRight } from "react-icons/lu";

import image1 from "@/assets/mairie/image1.jpeg";
import image2 from "@/assets/mairie/image2.jpeg";
import image3 from "@/assets/mairie/image3.jpeg";
import image4 from "@/assets/mairie/image4.jpeg";
import image5 from "@/assets/mairie/image5.jpeg";
import image6 from "@/assets/mairie/image6.jpeg";
import image7 from "@/assets/mairie/image7.jpeg";
import image8 from "@/assets/mairie/image8.jpeg";
import image9 from "@/assets/mairie/image9.jpeg";
import image10 from "@/assets/mairie/image10.jpeg";

export default function Feature1() {
  return (
    <section id="resources" className="py-12 lg:py-20">
      <div className="container">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="py-1 px-3 rounded-md text-xs font-semibold uppercase tracking-wider border border-primary bg-primary/20 text-primary">
            Services Foncier
          </span>
          <h2 className="text-4xl font-bold text-default-950 mt-4">
            Simplifiez vos démarches foncières
          </h2>
          <p className="mt-3 text-default-700">
            Dépôt de demande, suivi en temps réel, commission, paiements et documents officiels — tout en ligne.
          </p>
        </div>

        {/* Bloc 1 : Portail démarches */}
        <div className="grid lg:grid-cols-2 gap-8 items-center rounded-2xl">
          <div>
            <span className="py-1 px-3 rounded-md text-xs font-semibold uppercase tracking-wider border border-primary bg-primary/20 text-primary">
              Portail citoyen
            </span>
            <h3 className="text-3xl/tight font-semibold text-default-950 mt-4">
              Déposez et suivez votre demande de parcelle en ligne
            </h3>
            <p className="text-base text-default-800 mt-4">
              La Commune de Kaolack met à votre disposition un portail unique pour
              <strong> déposer</strong> vos demandes, <strong>téléverser</strong> vos pièces,
              <strong> suivre</strong> l’instruction et <strong>recevoir</strong> les décisions.
            </p>
            <div className="mt-5">
              <Link
                to="/demandes/nouvelle"
                className="inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-5 bg-primary text-white text-sm font-semibold transition-all duration-200 hover:bg-primary/90"
                aria-label="Aller au dépôt de demande"
              >
                Faire une demande
                <LuMoveRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src={image6}
              alt="Interface du portail de demandes foncières de la Commune de Kaolack"
              className="h-full w-full rounded-2xl object-cover shadow-lg"
              loading="eager"
              fetchpriority="high"
            />
            {/* badge flottant */}
            <div className="hidden sm:block">
              <div className="absolute -bottom-5 -left-5">
                <div className="inline-block rounded-xl border border-default-200 bg-white/90 dark:bg-default-50 px-4 py-3 shadow">
                  <h4 className="text-sm font-semibold text-default-950">
                    Statut en temps réel
                  </h4>
                  <p className="text-xs text-default-600 mt-0.5">Notifications SMS/Email</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bloc 2 : Attribution & suivi */}
        <div className="mt-14 grid lg:grid-cols-2 gap-8 items-center rounded-2xl">
          <div className="order-2 lg:order-1">
            <img
              src={image7}
              alt="Vue de terrain avec repères de bornage à Kaolack"
              className="h-full w-full rounded-2xl object-cover shadow-lg"
              loading="lazy"
            />
          </div>
          <div className="order-1 lg:order-2">
            <span className="py-1 px-3 rounded-md text-xs font-semibold uppercase tracking-wider border border-primary bg-primary/20 text-primary">
              Attribution de terrains
            </span>
            <h3 className="text-3xl/tight font-semibold text-default-950 mt-4">
              Instruction, commission & décision en toute transparence
            </h3>
            <ul role="list" className="mt-5 space-y-2 text-sm text-default-700 -ms-3 ps-6">
              <li className="flex items-start gap-3">
                <LuCircle className="mt-2 shrink-0 h-2 w-2 text-primary fill-primary" />
                <span className="grow text-base">
                  Consultez les <strong>terrains disponibles</strong> et les <strong>servitudes</strong> sur la carte SIG.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <LuCircle className="mt-2 shrink-0 h-2 w-2 text-primary fill-primary" />
                <span className="grow text-base">
                  Suivez l’<strong>état d’avancement</strong> : dépôt → instruction → commission → décision.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <LuCircle className="mt-2 shrink-0 h-2 w-2 text-primary fill-primary" />
                <span className="grow text-base">
                  Recevez vos <strong>attestations</strong> et <strong>quitus</strong> en ligne une fois validés.
                </span>
              </li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                // to="/demandes/suivi"
                className="inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-5 bg-default-900 text-white text-sm font-semibold transition-all hover:bg-default-800"
                aria-label="Suivre une demande"
              >
                Suivre mon dossier
                <LuMoveRight className="w-5 h-5" />
              </Link>
              <Link
                // to="/carte-fonciere"
                className="inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-5 bg-primary/15 text-primary text-sm font-semibold transition-all hover:bg-primary hover:text-white"
                aria-label="Voir la carte foncière"
              >
                Voir la carte SIG
                <LuMoveRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bloc 3 : Conseils & accompagnement */}
        <div className="mt-14 grid lg:grid-cols-2 gap-8 items-center rounded-2xl">
          <div>
            <span className="py-1 px-3 rounded-md text-xs font-semibold uppercase tracking-wider border border-primary bg-primary/20 text-primary">
              Accès aux conseillers
            </span>
            <h3 className="text-3xl/tight font-semibold text-default-950 mt-4">
              Support personnalisé & conseils d’experts
            </h3>
            <p className="text-base text-default-800 mt-4">
              Bénéficiez d’un accompagnement par nos équipes (urbanisme, domaine, SIG).
              Nous vous aidons à constituer un dossier conforme et à anticiper les étapes clés.
            </p>
            <div className="mt-5">
              <Link
                to="/rendez-vous"
                className="inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-5 bg-primary/15 text-primary text-sm font-semibold transition-all hover:bg-primary hover:text-white"
                aria-label="Prendre rendez-vous"
              >
                Prendre rendez-vous
                <LuMoveRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <img
              src={image8}
              alt="Conseillère renseignant un usager au guichet unique"
              className="rounded-2xl object-cover shadow-lg"
              loading="lazy"
            />
            {/* cartes flottantes décoratives */}
            <div className="hidden lg:block">
              <div className="absolute -top-12 -right-10">
                <div className="max-w-sm p-5 bg-white/95 border border-default-200 rounded-xl shadow">
                  <h4 className="text-lg font-semibold text-default-950">
                    Conseil gratuit d’orientation
                  </h4>
                  <p className="text-sm text-default-700 mt-2">
                    Check-list des pièces, conformité de la zone et délais indicatifs.
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-8">
                <div className="inline-block p-4 bg-white/95 border border-default-200 rounded-xl shadow">
                  <h5 className="text-sm font-semibold text-default-950">
                    Support prioritaire
                  </h5>
                  <p className="text-xs text-default-600">Canal dédié pour dossiers urgents</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
