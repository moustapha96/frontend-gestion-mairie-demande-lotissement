
/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import {
  MapPinned, FilePlus2, FileSearch, Gavel, Layers, Ruler,
  FileCheck2, CreditCard, Stamp, Building2, Bell, ShieldCheck
} from "lucide-react";

const services = [
  { title: "Déposer une demande de parcelle", icon: FilePlus2, to: "/demandes/nouvelle" },
  { title: "Instruction du dossier", icon: FileSearch, to: "/demandes/suivi" },
  { title: "Passage en commission", icon: Gavel, to: "/commission/calendrier" },
  { title: "Cartographie & Cadastre (SIG)", icon: MapPinned, to: "/carte-fonciere" },
  { title: "Gestion des lotissements", icon: Layers, to: "/lotissements" },
  { title: "Bornage & métrés", icon: Ruler, to: "/services/bornage" },
  { title: "Certificats & attestations", icon: FileCheck2, to: "/documents/certificats" },
  { title: "Paiements (Wave/OM)", icon: CreditCard, to: "/mon-compte/paiements" },
  { title: "Quitus & décisions", icon: Stamp, to: "/documents/quitus" },
  { title: "Affectations & titres", icon: Building2, to: "/affectations" },
  { title: "Notifications & suivi", icon: Bell, to: "/demandes/suivi" },
  { title: "Conformité & traçabilité", icon: ShieldCheck, to: "/transparence" },
];

export default function BusinessSolutions() {
  return (
    <section id="solutions" className="py-10 lg:py-20">
      <div className="container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="rounded-md border border-primary bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Services Foncier
          </span>
          <h2 className="mt-4 text-4xl/tight font-bold text-default-950">
            Ce que nous proposons
          </h2>
          <p className="mt-5 text-base text-default-700">
            Un guichet unique pour gérer vos demandes de terrain à Kaolack :
            dépôt en ligne, instruction transparente, commission, paiements
            sécurisés et documents officiels dématérialisés.
          </p>
        </div>

        {/* Marquee */}
        <div className="relative m-auto flex gap-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="marquee__group flex min-w-full flex-shrink-0 items-center justify-around gap-8 animate-marquee">
            {services.map((item, idx) => {
              const Icon = item.icon;
              const card = (
                <div className="rounded-xl bg-white p-6 text-center shadow-lg dark:bg-default-50">
                  <div className="flex justify-center">
                    <Icon className="h-10 w-10 text-primary" aria-hidden="true" />
                  </div>
                  <h4 className="mt-5 text-lg font-semibold text-default-950">
                    {item.title}
                  </h4>
                </div>
              );
              return (
                <div key={`row1-${idx}`} className="w-64 py-5">
                  {item.to ? (
                    <Link
                      to={item.to}
                      aria-label={item.title}
                      className="block focus:outline-none focus-visible:ring focus-visible:ring-primary/40 rounded-xl"
                    >
                      {card}
                    </Link>
                  ) : (
                    card
                  )}
                </div>
              );
            })}
          </div>

          {/* deuxième groupe pour l’animation infinie */}
          <div
            aria-hidden="true"
            className="marquee__group flex min-w-full flex-shrink-0 items-center justify-around gap-8 animate-marquee"
          >
            {services.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={`row2-${idx}`} className="w-64 py-5">
                  <div className="rounded-xl bg-white p-6 text-center shadow-lg dark:bg-default-50">
                    <div className="flex justify-center">
                      <Icon className="h-10 w-10 text-primary" aria-hidden="true" />
                    </div>
                    <h4 className="mt-5 text-lg font-semibold text-default-950">
                      {item.title}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
