import { useState } from "react";
import { LuFileCheck, LuLayers, LuFileLock } from "react-icons/lu";
import backgroundImage from "@/assets/images/landing/hosting/services.jpg";

const services = [
  {
    title: "1. Outil d'authentification et de vérification",
    description: (
      <>
        <strong>Système avancé de vérification des fraudes</strong> : AuthenticPage ne s'appuie pas vraiment sur un algorithme pour vérifier un document. Notre système tangible de détection de la fraude utilise des technologies avancées telles que le micro-clouding pour prouver la provenance des documents à travers un numéro de document d'authentification (ADN), préalablement stocké dans un micro-cloud et accessible via un numéro d'accès unique, garantissant la provenance au plus haut niveau de sécurité et de confidentialité des documents.
      </>
    ),
    icon: LuFileCheck,
    moreInfo: (
      <>
        AuthenticPage fournit une solution complète et orientée vers l'avenir au problème de la fraude documentaire, offrant aux institutions gouvernementales, aux ambassades, aux écoles, aux institutions financières, aux entreprises et aux particuliers l'assurance que les documents qu'ils reçoivent sont authentiques et valides.
        <strong> Intégration sécurisée du stockage en nuage</strong> : Nous proposons une intégration sécurisée du stockage en nuage, ce qui permet aux utilisateurs de stocker leurs documents importants dans un endroit centralisé. Cela permet non seulement de faciliter l'accès et la sauvegarde, mais aussi de renforcer la sécurité et la redondance.
        Accès facile : Notre interface conviviale permet une vérification rapide et pratique des documents, rendant le processus transparent et sans tracas. Avec notre technologie de pointe et notre engagement à satisfaire nos clients, nous sommes convaincus qu'AuthenticPage est le choix idéal pour tous les besoins de vérification de documents.
        <strong> Mises à jour de l'authentification en temps réel</strong> : Notre plateforme fournit des mises à jour d'authentification en temps réel, permettant aux utilisateurs de recevoir des notifications instantanées concernant le statut et la vérification (ou l'application) de leurs documents. Ceci élimine le besoin d'un suivi manuel et procure une tranquillité d'esprit.
      </>
    ),
  },
  {
    title: "2. Outil d'authentification de masse",
    description:
      "Cet outil est principalement destiné aux écoles afin de les aider à authentifier des milliers de diplômes, de certificats et de bulletins de note en un clic en générant des numéros de documents d'authentification (connus sous le nom de AND) pour chacun d'entre eux. La génération de numéros de documents d'authentification fait référence au processus de création de numéros d'identification uniques pour des documents importants afin de garantir leur authenticité et de prévenir la fraude.",
    icon: LuLayers,
    moreInfo: `Le numéro de document d'authentification est un identifiant unique qui peut être utilisé pour vérifier la validité et l'origine du document à travers AuthenticPage.com. Il peut aider à établir l'authenticité et l'intégrité du document, en particulier lorsqu'il est combiné avec d'autres mesures de sécurité telles que le cryptage, les signatures numériques, ou le filigrane.
    En générant des numéros de documents d'authentification, les universités, les entreprises et les particuliers disposent d'un moyen fiable de suivre et de vérifier l'authenticité de documents importants, tels que les contrats, les documents financiers, les pièces d'identité délivrées par le gouvernement, les diplômes ou tout autre certificat académique. Cela permet de réduire le risque de fraude et de garantir la fiabilité des documents dans le cadre de diverses procédures juridiques, financières ou administratives.`,
  },
  {
    title: "3. Outil de demande (fonctionnalité)",
    description:
      "Recevoir le document de la source : Recevez les documents des candidats auprès des institutions émettrices en un seul clic. Suivez la progression sur le tableau de la liste de contrôle et recevez une notification lorsqu'une demande est prête à être examinée.",
    icon: LuFileLock,
    moreInfo: `AuthenticPage-Application est un outil de transmission de documents qui aide les écoles, les banques, les ambassades ou toutes les institutions ou entreprises qui ont besoin de documents de la part des candidats et qui veulent s'assurer qu'ils ne sont pas faux, à les obtenir directement de la source (l'émetteur), et non venant des candidats.`,
  },
];

const Services = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <section
      id="Nos Services"
      className="py-14 lg:py-24 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container">
        {/* Titre de la section */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#24377A] animate-fade-in-up">
            Nos Services
          </h2>
          <div className="w-16 h-1 bg-[#24377A] mx-auto my-4 rounded"></div>
          <p className="text-lg text-default-600">
            AuthenticPage est une solution logicielle documentaire composée de 3 outils :
          </p>
        </div>

        {/* Grille des services avec espace entre chaque bloc */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-12">
          {services.map((service, idx) => {
            const Icon = service.icon;
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="relative group hover:scale-105 transition-transform duration-300 h-auto overflow-visible"
              >
                <div className="relative border border-default-200 rounded-lg p-8 bg-white text-center shadow-lg group-hover:shadow-2xl transition-shadow duration-500 min-h-[450px]">
                  {/* Icône du service */}
                  <div className="flex justify-center mb-6">
                    <Icon className="h-14 w-14 text-[#E41021]" />
                  </div>
                  {/* Titre et description du service */}
                  <h3 className="text-2xl font-semibold text-[#24377A] mb-4">
                    {service.title}
                  </h3>
                  <p className="text-justify text-base text-default-600 leading-relaxed mb-4">
                    {service.description}
                  </p>
                  {/* Description complète conditionnelle */}
                  {isExpanded && (
                    <p className="text-justify text-base text-default-600 leading-relaxed">
                      {service.moreInfo}
                    </p>
                  )}
                  {/* Bouton En savoir plus */}
                  <button
                    onClick={() => handleExpand(idx)}
                    className="mt-4 inline-block px-4 py-2 text-sm font-semibold text-white bg-[#24377A] rounded hover:bg-[#1d2f69] transition-colors"
                  >
                    {isExpanded ? "Réduire" : "En savoir plus"}
                  </button>
                </div>
                {/* Arrière-plan visuel */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#012C4E] to-[#012C4E]/80 opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10 rounded-lg" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Ajout de l'animation pour le titre */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default Services;
