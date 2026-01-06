/* Galerie foncière – Kaolack */
import { Link } from "react-router-dom";
import { LuMoveRight } from "react-icons/lu";

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

const items = [
  { src: image1, title: "Lotissement Médina Baye", tag: "Lotissement", to: "/lotissements/medina-baye", alt: "Vue aérienne du lotissement Médina Baye à Kaolack" },
  { src: image2, title: "Bornage Unité 4", tag: "Bornage", to: "/bornage/unite-4", alt: "Opération de bornage avec piquets et décamètre" },
  { src: image3, title: "Carte SIG – Zones Disponibles", tag: "Cartographie", to: "/carte-fonciere?layer=disponibilites", alt: "Carte SIG des disponibilités foncières" },
  { src: image4, title: "Réhabilitation Voirie", tag: "Aménagement", to: "/amenagements/voirie-rehab", alt: "Travaux de réhabilitation de voirie" },
  { src: image5, title: "Titres Délivrés T3", tag: "Titres", to: "/documents/titres?trim=3", alt: "Dossiers traités et titres fonciers délivrés au T3" },
  { src: image6, title: "Affectations Sociales", tag: "Affectation", to: "/affectations/sociales", alt: "Parcelles affectées à des équipements sociaux" },
  { src: image7, title: "Plan de Masse – Extension Est", tag: "Urbanisme", to: "/urbanisme/plans?zone=est", alt: "Plan de masse de la zone d’extension Est" },
  { src: image8, title: "Servitudes & Réserves", tag: "Réglementation", to: "/documents/reglement-urbanisme#servitudes", alt: "Schéma des servitudes et réserves foncières" },
  { src: image9, title: "Suivi des Dossiers", tag: "Transparence", to: "/demandes/suivi", alt: "Interface de suivi des demandes foncières" },
  { src: image10, title: "Barème & Paiements", tag: "Paiement", to: "/mon-compte/paiements", alt: "Informations sur le barème et les paiements" },
];

// duplique pour la 2e rangée (défilement infini)
const items2 = [...items];

export default function Portfolio() {
  return (
    <section id="galerie" className="py-10 lg:py-20">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-4 text-4xl font-bold text-default-950">
              Galerie foncière & aménagements
            </h2>
            <p className="text-base text-default-700">
              Aperçu des opérations de la Commune de Kaolack : lotissements, bornages,
              cartographie SIG, titres délivrés et projets d’aménagement. Cliquez pour
              ouvrir la page détaillée.
            </p>
          </div>

          <div>
            <Link
              // to="/carte-fonciere"
              className="inline-flex items-center justify-center gap-2 border border-default-200 bg-primary px-6 py-2 text-white transition-all duration-300 hover:bg-primary/90 rounded-md"
              aria-label="Voir la carte foncière"
            >
              Voir la carte SIG
            </Link>
          </div>
        </div>
      </div>

      {/* Rangée 1 */}
      <div className="mt-14">
        <div className="relative m-auto flex gap-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="marquee__group flex min-w-full flex-shrink-0 items-center justify-around gap-8 animate-marquee">
            {items.map((it, idx) => (
              <Link
                key={`row1-${idx}`}
                // to={it.to}
                aria-label={`${it.title} – ${it.tag}`}
                className="group relative block w-[32rem] max-w-full"
              >
                <img
                  className="h-72 w-full object-cover rounded-2xl shadow transition-transform duration-500 group-hover:scale-[1.02]"
                  src={it.src}
                  alt={it.alt}
                  loading={idx > 2 ? "lazy" : "eager"}
                  fetchpriority={idx === 0 ? "high" : "auto"}
                />
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-default-900">
                    {it.tag}
                  </span>
                  <h3 className="mt-2 text-white text-lg font-semibold drop-shadow">
                    {it.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* deuxième groupe (boucle continue) */}
          <div
            aria-hidden="true"
            className="marquee__group flex min-w-full flex-shrink-0 items-center justify-around gap-8 animate-marquee"
          >
            {items2.map((it, idx) => (
              <div key={`row1b-${idx}`} className="relative w-[32rem] max-w-full">
                <img
                  className="h-72 w-full object-cover rounded-2xl shadow"
                  src={it.src}
                  alt=""
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-default-900">
                    {it.tag}
                  </span>
                  <h3 className="mt-2 text-white text-lg font-semibold drop-shadow">
                    {it.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rangée 2 – sens inverse */}
        <div className="marquee--reverse m-auto mt-8 flex gap-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="marquee__group flex min-w-full flex-shrink-0 items-center justify-around gap-8 animate-marquee-reverse delay-[2s]">
            {items.map((it, idx) => (
              <Link
                key={`row2-${idx}`}
                to={it.to}
                aria-label={`${it.title} – ${it.tag}`}
                className="group relative block w-[28rem] max-w-full"
              >
                <img
                  className="h-64 w-full object-cover rounded-2xl shadow transition-transform duration-500 group-hover:scale-[1.02]"
                  src={it.src}
                  alt={it.alt}
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-default-900">
                    {it.tag}
                  </span>
                  <h3 className="mt-2 text-white text-lg font-semibold drop-shadow">
                    {it.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div
            aria-hidden="true"
            className="marquee__group flex min-w-full flex-shrink-0 items-center justify-around gap-8 animate-marquee-reverse delay-[2s]"
          >
            {items2.map((it, idx) => (
              <div key={`row2b-${idx}`} className="relative w-[28rem] max-w-full">
                <img
                  className="h-64 w-full object-cover rounded-2xl shadow"
                  src={it.src}
                  alt=""
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-default-900">
                    {it.tag}
                  </span>
                  <h3 className="mt-2 text-white text-lg font-semibold drop-shadow">
                    {it.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA global */}
      <div className="mt-12 flex items-center justify-center">
        <Link
          to="/galerie"
          className="inline-flex items-center justify-center gap-2 rounded border border-default-200 px-6 py-2 text-base font-medium text-default-950 transition-all duration-300 hover:bg-primary hover:text-white"
          aria-label="Voir plus de projets fonciers"
        >
          Voir plus
          <LuMoveRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
