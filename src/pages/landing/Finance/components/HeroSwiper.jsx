
// export default HeroSwiper;

/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Controller, Autoplay, EffectFade, Navigation } from "swiper/modules";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

/** ==== VISUELS ==== */
import image7 from "@/assets/mairie/image7.jpeg";
import image8 from "@/assets/mairie/image8.jpeg";
import image9 from "@/assets/mairie/image9.jpeg";
import image10 from "@/assets/mairie/image10.jpeg";

/** ==== CONTENU MÉTIER (Kaolack) ==== */
const heroSwiperSlides = [
  {
    title: "Demande de parcelle en ligne",
    description:
      "Soumettez votre demande de terrain sans vous déplacer. Un parcours guidé, des pièces faciles à téléverser, et une référence unique pour suivre votre dossier.",
    ctas: [
      { label: "Faire une demande", to: "/demandes/nouvelle" },
      { label: "Suivre mon dossier", to: "/demandes/suivi" },
    ],
  },
  {
    title: "Suivi et transparence",
    description:
      "Soyez informé à chaque étape : dépôt, instruction, commission, décision. Recevez des notifications SMS/Email et consultez l’historique des actions.",
    ctas: [
      { label: "Consulter l’état", to: "/demandes/suivi" },
      { label: "FAQ procédures", to: "/aide/procedures" },
    ],
  },
  {
    title: "Cartographie & Cadastre (SIG)",
    description:
      "Visualisez les zones loties, disponibilités, servitudes et affectations. Une cartographie à jour pour éviter les conflits et fluidifier l’attribution.",
    ctas: [
      { label: "Voir la carte", to: "/carte-fonciere" },
      { label: "Règlement d’urbanisme", to: "/documents/reglement-urbanisme" },
    ],
  },
  {
    title: "Paiements & Quitus sécurisés",
    description:
      "Réglez vos frais (étude, bornage, délivrance) via mobile money ou guichet partenaire. Téléchargez vos reçus et obtenez votre quitus lorsque tout est validé.",
    ctas: [
      { label: "Mes paiements", to: "/mon-compte/paiements" },
      { label: "Barème communal", to: "/documents/bareme" },
    ],
  },
];

const thumbImages = [image7, image8, image9, image10];

export default function HeroSwiper() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // pour éviter les out-of-sync si on modifie la longueur
  const slides = useMemo(() => heroSwiperSlides.slice(0, thumbImages.length), []);

  return (
    <section
      id="home"
      aria-label="Accueil Gestion Foncier Kaolack"
      className="bg-cover bg-no-repeat bg-[url('../images/other/bg-lines-2.png')] dark:bg-[url('../images/other/bg-lines-2-dark.png')]"
    >
      <div className="grid xl:grid-cols-5 grid-cols-1 gap-6 items-end">
        {/* ==== Colonne gauche : visuels plein écran (thumbs / master) ==== */}
        <div className="xl:col-span-3">
          <Swiper
            onSwiper={setThumbsSwiper}
            speed={900}
            watchSlidesProgress
            loop={false}
            effect="fade"
            modules={[Thumbs, EffectFade]}
            className="mySwiper swiper-hero h-[54vh] md:h-[66vh] xl:h-[78vh] rounded-3xl overflow-hidden"
          >
            {thumbImages.map((image, idx) => (
              <SwiperSlide key={idx} className="relative">
                {/* image d'arrière-plan */}
                <img
                  src={image}
                  alt={`Illustration Kaolack foncier ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading="eager"
                  fetchpriority={idx === 0 ? "high" : "auto"}
                />
                {/* overlay gradient + voile */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent pointer-events-none" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* ==== Colonne droite : messages + CTA (contrôlée par la gauche) ==== */}
        <div className="relative xl:col-span-2 p-6 xl:p-0">
          <Swiper
            speed={900}
            spaceBetween={10}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            watchSlidesProgress
            modules={[Thumbs, Controller, Autoplay, Navigation]}
            thumbs={{
              swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            loop
            navigation={{ nextEl: ".cre-button-next", prevEl: ".cre-button-prev" }}
            className="mySwiper2 swiper-hero relative me-10 h-[54vh] md:h-[66vh] xl:h-[78vh]"
          >
            {slides.map((slide, idx) => (
              <SwiperSlide key={idx} className="flex">
                <div className="flex flex-col items-start justify-end w-full pb-16 px-2 md:px-6">
                  {/* ruban commune */}
                  <span className="inline-flex items-center text-xs tracking-wide uppercase font-semibold bg-white/80 dark:bg-white/10 backdrop-blur px-3 py-1 rounded-full shadow">
                    Commune de Kaolack • Service du Domaine & Urbanisme
                  </span>

                  <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-default-950 dark:text-white mt-5 max-w-2xl leading-tight">
                    {slide.title}
                  </h1>

                  <p className="w-full md:w-4/5 text-base md:text-lg font-medium mt-4 text-default-700 dark:text-default-200">
                    {slide.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {slide.ctas?.map((cta, i) => (
                      <Link
                        key={`${idx}-${i}`}
                        to={cta.to}
                        className={[
                          "px-5 py-3 rounded-2xl text-sm font-semibold shadow",
                          i === 0
                            ? "bg-primary text-white hover:opacity-95"
                            : "bg-white text-default-900 hover:bg-default-50 dark:bg-default-900 dark:text-white dark:hover:bg-default-800",
                        ].join(" ")}
                        aria-label={cta.label}
                      >
                        {cta.label}
                      </Link>
                    ))}
                  </div>

                  {/* petits indicateurs opérationnels */}
                  <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-default-600 dark:text-default-300">
                    <div className="rounded-xl border border-default-200/70 dark:border-default-800/70 bg-white/70 dark:bg-default-900/50 backdrop-blur px-3 py-2">
                      Délais indicatifs : <strong>7–30 jours</strong>
                    </div>
                    <div className="rounded-xl border border-default-200/70 dark:border-default-800/70 bg-white/70 dark:bg-default-900/50 backdrop-blur px-3 py-2">
                      Statut en temps réel & notifications
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ==== Boutons de navigation ==== */}
          <div className="absolute inset-x-0 bottom-6 z-10">
            <div className="flex items-center justify-end gap-5 relative pe-10">
              <button
                type="button"
                className="cre-button-prev"
                aria-label="Précédent"
                title="Précédent"
              >
                <div className="h-12 w-12 rounded-full border border-default-200 bg-default-50 hover:bg-primary text-default-900 hover:text-white flex items-center justify-center">
                  <LuArrowLeft className="h-6 w-6" />
                </div>
              </button>
              <button
                type="button"
                className="cre-button-next"
                aria-label="Suivant"
                title="Suivant"
              >
                <div className="h-12 w-12 rounded-full border border-default-200 bg-default-50 hover:bg-primary text-default-900 hover:text-white flex items-center justify-center">
                  <LuArrowRight className="h-6 w-6" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
