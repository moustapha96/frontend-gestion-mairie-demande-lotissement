import { LuLineChart, LuMail, LuPhone, LuSave } from "react-icons/lu";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <section id="contact" className="py-10 lg:py-20">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <span className="py-1 px-3 rounded-md text-xs font-semibold uppercase tracking-wider border border-primary bg-primary/20 text-primary">
            Contact & Informations
          </span>
          <h2 className="text-4xl font-bold text-default-950 mt-4">
            Nous contacter
          </h2>
          <p className="mt-3 text-default-700">
            Service du Domaine & Urbanisme — Commune de Kaolack
          </p>
        </div>

        <div className="flex flex-wrap items-stretch justify-center gap-6 mt-8">
          {/* Téléphone */}
          <a
            href="tel:+221339411256"
            className="group w-[260px] text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md"
            aria-label="Appeler le service du domaine"
            title="Appeler"
          >
            <div className="h-20 w-20 rounded-md border border-default-200 text-default-950 bg-white/60 dark:bg-default-50 mx-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <LuPhone className="h-10 w-10" aria-hidden="true" />
            </div>
            <h4 className="text-xl font-semibold text-default-950 mt-5">
              Appeler
            </h4>
            <p className="text-base text-default-800 mt-1">
              33 941 12 56 • 33 941 15 35
            </p>
            <p className="text-xs text-default-500 mt-1">
              Lun–Ven · 08h–16h30
            </p>
          </a>

          {/* Email */}
          <a
            href="mailto:support@kaolackcommune.sn"
            className="group w-[260px] text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md"
            aria-label="Envoyer un email"
            title="Envoyer un email"
          >
            <div className="h-20 w-20 rounded-md border border-default-200 text-default-950 bg-white/60 dark:bg-default-50 mx-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <LuMail className="h-10 w-10" aria-hidden="true" />
            </div>
            <h4 className="text-xl font-semibold text-default-950 mt-5">
              Email
            </h4>
            <p className="text-base text-default-800 mt-1">
              support@kaolackcommune.sn
            </p>
            <p className="text-xs text-default-500 mt-1">
              Réponse sous 24–48h ouvrées
            </p>
          </a>

          {/* Réseaux & suivi */}
          <a
            href="https://facebook.com/CommuneDeKaolack"
            target="_blank"
            rel="noreferrer"
            className="group w-[260px] text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md"
            aria-label="Nous suivre sur les réseaux sociaux"
            title="Nous suivre"
          >
            <div className="h-20 w-20 rounded-md border border-default-200 text-default-950 bg-white/60 dark:bg-default-50 mx-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <LuLineChart className="h-10 w-10" aria-hidden="true" />
            </div>
            <h4 className="text-xl font-semibold text-default-950 mt-5">
              Suivez-nous
            </h4>
            <p className="text-base text-default-800 mt-1">
              Facebook.com/CommuneDeKaolack
            </p>
            <p className="text-xs text-default-500 mt-1">
              Actualités • Annonces commission
            </p>
          </a>

          {/* Guichet / Lien interne */}
          <Link
            to="/guichet-unique"
            className="group w-[260px] text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md"
            aria-label="Guichet unique et démarches"
            title="Guichet unique"
          >
            <div className="h-20 w-20 rounded-md border border-default-200 text-default-950 bg-white/60 dark:bg-default-50 mx-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <LuSave className="h-10 w-10" aria-hidden="true" />
            </div>
            <h4 className="text-xl font-semibold text-default-950 mt-5">
              Guichet unique
            </h4>
            <p className="text-base text-default-800 mt-1">
              Déposer une demande, suivre un dossier
            </p>
            <p className="text-xs text-default-500 mt-1">
              Démarches & formulaires en ligne
            </p>
          </Link>
        </div>

        {/* Bandeau note */}
        <div className="mx-auto max-w-3xl mt-8 text-center">
          <p className="text-sm text-default-600">
            Pour toute question relative à une demande en cours, merci d’indiquer la{" "}
            <strong>référence dossier</strong> (ex. KLK-2025-00421) lors de votre appel ou
            dans l’objet du mail.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
