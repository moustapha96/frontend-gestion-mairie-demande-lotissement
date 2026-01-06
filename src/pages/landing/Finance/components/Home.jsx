// import { Link } from "react-router-dom";


// import { LuChevronLeft, LuChevronRight } from "react-icons/lu";


// import startup11 from "@/assets/mairie/image7.jpeg";
// import startup12 from "@/assets/mairie/image8.jpeg";

// const sliderImages = [startup11, startup12];
// const HomeHome = () => {
//   return (
//     <>
//       <section
//         id="home"
//         className="relative flex items-center justify-center overflow-hidden bg-default-100 bg-[url('../images/other/bg-lines-2.png')] bg-cover bg-no-repeat pb-10 pt-24 dark:bg-default-50 dark:bg-[url('../images/other/bg-lines-2-dark.png')] lg:py-28"
//       >
//         <div className="container">
//           <div className="relative">
//             <div className="grid items-center gap-6 lg:grid-cols-2">
//               <div className="max-w-xl">
//                 <span className="rounded-md border border-primary bg-primary/20 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
//                   startups Marketing
//                 </span>
//                 <h2 className="my-5 text-4xl font-medium text-default-950 md:text-5xl/tight">
//                   Easily, Quickly Craft Your Stunning Online Presence
//                 </h2>
//                 <p className="mb-10 text-base">
//                   We're a renowned studio with expertise in design and
//                   engineering. Our objective is to bring significance to the
//                   work process.
//                 </p>
//                 <Link
//                   to=""
//                   className="rounded-md bg-primary px-6 py-3 text-white transition-all duration-300 hover:bg-primary-500"
//                 >
//                   Reach Out to Us
//                 </Link>
//               </div>
//               <div>
//                 <div className="relative">
//                   <div className="relative z-10 hidden xl:block">
//                     <div className="before:absolute before:-end-10 before:-top-10 before:-z-10 before:h-28 before:w-28 before:bg-[url('../images/other/dot.svg')]" />
//                   </div>
//                   <div
//                     data-hs-carousel='{"loadingClasses": "opacity-0","isAutoPlay": true}'
//                     className="relative z-20"
//                   >
//                     <div className="hs-carousel relative min-h-[350px] w-full overflow-hidden rounded-lg lg:min-h-[650px]">
//                       <div className="hs-carousel-body absolute bottom-0 start-0 top-0 flex flex-nowrap opacity-0 transition-transform duration-700">
//                         {sliderImages.map((image, idx) => (
//                           <div className="hs-carousel-slide" key={idx}>
//                             <img src={image} className="h-full w-full" />
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                     <div className="hidden xl:block">
//                       <button
//                         type="button"
//                         className="hs-carousel-prev hs-carousel:disabled:opacity-50 absolute inset-y-0 start-0 inline-flex h-full w-[46px] -translate-x-1/2 items-center justify-center text-gray-800 disabled:pointer-events-none"
//                       >
//                         <div className="inline-flex size-10 items-center justify-center rounded-full bg-gray-100 text-primary shadow transition-all hover:bg-primary hover:text-white">
//                           <LuChevronLeft className="size-6" />
//                         </div>
//                         <span className="sr-only">Previous</span>
//                       </button>
//                       <button
//                         type="button"
//                         className="hs-carousel-next hs-carousel:disabled:opacity-50 absolute inset-y-0 end-0 inline-flex h-full w-[46px] translate-x-1/2 items-center justify-center text-gray-800 disabled:pointer-events-none"
//                       >
//                         <span className="sr-only">Next</span>
//                         <div className="inline-flex size-10 items-center justify-center rounded-full bg-gray-100 text-primary shadow transition-all hover:bg-primary hover:text-white">
//                           <LuChevronRight className="size-6" />
//                         </div>
//                       </button>
//                     </div>
//                   </div>
//                   <div className="relative z-10 hidden xl:block">
//                     <div className="after:absolute after:-bottom-10 after:-start-10 after:-z-10 after:h-28 after:w-28 after:bg-[url('../images/other/dot.svg')]" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default HomeHome;

/* Hero d'accueil — Commune de Kaolack (Gestion Foncier) */
import { Link } from "react-router-dom";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

import startup11 from "@/assets/mairie/image7.jpeg";
import startup12 from "@/assets/mairie/image8.jpeg";

const sliderImages = [startup11, startup12];

export default function HomeHome() {
  return (
    <section
      id="home"
      className="relative flex items-center justify-center overflow-hidden bg-default-100 bg-[url('../images/other/bg-lines-2.png')] bg-cover bg-no-repeat pb-12 pt-24 dark:bg-default-50 dark:bg-[url('../images/other/bg-lines-2-dark.png')] lg:py-28"
      aria-label="Accueil Gestion Foncier Kaolack"
    >
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Colonne gauche : message + CTA */}
          <div className="max-w-xl">
            <span className="rounded-md border border-primary bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Commune de Kaolack • Service du Domaine
            </span>

            <h1 className="my-5 text-4xl md:text-5xl/tight font-bold text-default-950">
              Demander une parcelle, suivre votre dossier, payer en ligne
            </h1>

            <p className="mb-6 text-base text-default-700">
              Un portail unique pour vos démarches foncières : dépôt de demande,
              instruction transparente, passage en commission, décisions et
              documents officiels dématérialisés.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                // to="/demandes/nouvelle"
                className="rounded-md bg-primary px-6 py-3 text-white font-semibold transition-all hover:bg-primary/90"
                aria-label="Déposer une nouvelle demande"
              >
                Faire une demande
              </Link>
              <Link
                // to="/demandes/suivi"
                className="rounded-md border border-default-200 bg-white px-6 py-3 text-default-900 font-semibold transition-all hover:bg-default-100 dark:bg-default-50 dark:hover:bg-default-100/60"
                aria-label="Suivre mon dossier"
              >
                Suivre mon dossier
              </Link>
              <Link
                // to="/carte-fonciere"
                className="rounded-md border border-primary/30 bg-primary/10 px-6 py-3 text-primary font-semibold transition-all hover:bg-primary hover:text-white"
                aria-label="Voir la carte foncière"
              >
                Voir la carte SIG
              </Link>
            </div>

            {/* mini points forts */}
            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-default-600">
              <div className="rounded-lg border border-default-200 bg-white/70 dark:bg-default-50 px-3 py-2">
                Notifications SMS/Email
              </div>
              <div className="rounded-lg border border-default-200 bg-white/70 dark:bg-default-50 px-3 py-2">
                Paiement Wave / OM
              </div>
            </div>
          </div>

          {/* Colonne droite : slider visuel */}
          <div className="relative">
            {/* décor */}
            <div className="relative z-10 hidden xl:block">
              <div className="before:absolute before:-end-10 before:-top-10 before:-z-10 before:h-28 before:w-28 before:bg-[url('../images/other/dot.svg')]" />
            </div>

            <div className="relative z-20">
              <Swiper
                modules={[Autoplay, EffectFade, Navigation]}
                effect="fade"
                speed={800}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                navigation={{
                  nextEl: ".hero-next",
                  prevEl: ".hero-prev",
                }}
                className="relative h-[360px] w-full overflow-hidden rounded-2xl shadow-lg lg:h-[560px]"
              >
                {sliderImages.map((image, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={image}
                      alt={`Illustration foncière ${idx + 1}`}
                      className="h-full w-full object-cover"
                      loading={idx === 0 ? "eager" : "lazy"}
                      fetchpriority={idx === 0 ? "high" : "auto"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Boutons navigation */}
              <div className="hidden xl:block">
                <button
                  type="button"
                  className="hero-prev absolute inset-y-0 start-0 inline-flex h-full w-[46px] -translate-x-1/2 items-center justify-center text-gray-800"
                  aria-label="Précédent"
                  title="Précédent"
                >
                  <div className="inline-flex size-10 items-center justify-center rounded-full bg-gray-100 text-primary shadow transition-all hover:bg-primary hover:text-white">
                    <LuChevronLeft className="size-6" />
                  </div>
                </button>
                <button
                  type="button"
                  className="hero-next absolute inset-y-0 end-0 inline-flex h-full w-[46px] translate-x-1/2 items-center justify-center text-gray-800"
                  aria-label="Suivant"
                  title="Suivant"
                >
                  <div className="inline-flex size-10 items-center justify-center rounded-full bg-gray-100 text-primary shadow transition-all hover:bg-primary hover:text-white">
                    <LuChevronRight className="size-6" />
                  </div>
                </button>
              </div>
            </div>

            {/* décor bas */}
            <div className="relative z-10 hidden xl:block">
              <div className="after:absolute after:-bottom-10 after:-start-10 after:-z-10 after:h-28 after:w-28 after:bg-[url('../images/other/dot.svg')]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
