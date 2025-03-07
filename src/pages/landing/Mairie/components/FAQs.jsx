import company3 from "@/assets/images/landing/company/img-12.png";
import company4 from "@/assets/images/landing/company/img-14.png";
import { cn } from "@/utils";
import { LuChevronUp } from "react-icons/lu";

const faqContent = [
  {
    title: "Comment puis-je authentifier mon diplôme ?",
    description:
      "Pour authentifier votre diplôme, créez un compte sur notre plateforme et soumettez une demande d'authentification. Un frais de 50 $ sera appliqué pour chaque demande.",
  },
  {
    title: "Quelles institutions peuvent utiliser AuthenticPage ?",
    description:
      "AuthenticPage est conçu pour être utilisé par des universités, écoles et autres institutions académiques qui souhaitent vérifier les diplômes et certificats de leurs étudiants.",
  },
  {
    title: "Quel est le coût de l'abonnement pour les structures ?",
    description:
      "Les structures peuvent s'abonner à notre service pour 100 $ par mois, ce qui leur permet de soumettre un nombre illimité de demandes d'authentification.",
  },
  {
    title: "Les données sont-elles sécurisées ?",
    description:
      "Oui, nous mettons en œuvre des mesures de sécurité avancées pour protéger les données sensibles de nos utilisateurs et garantir la confidentialité des informations.",
  },
  {
    title: "Que faire si j'ai des problèmes avec ma demande d'authentification ?",
    description:
      "Si vous rencontrez des problèmes, veuillez contacter notre service client via la page de contact. Nous sommes là pour vous aider.",
  },
];

const FAQs = () => {
  return (
    <section id="FAQ" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Titre Section */}
        <div className="text-center mb-12">
          <span className="inline-block bg-primary-100 text-primary-600 py-1 px-4 rounded-full text-xs font-semibold uppercase tracking-wider">
            Notre FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#24377A]">
    Questions Fréquemment Posées
</h2>
<div className="w-16 h-1 bg-[#24377A] mx-auto my-4 rounded"></div>

        </div>

        {/* FAQ et Images */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* FAQ Accordion */}
          <div>
            <div className="space-y-6">
              {faqContent.map((faq, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm",
                    { "shadow-lg": idx === 0 }
                  )}
                >
                  <button
                    className="w-full text-left px-6 py-5 flex items-center justify-between text-gray-900 dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                    aria-controls={`faq-accordion-${idx}`}
                  >
                    {faq.title}
                    <LuChevronUp className="h-5 w-5 transition-transform duration-300" />
                  </button>
                  <div
                    id={`faq-accordion-${idx}`}
                    className={cn(
                      "px-6 py-4 text-gray-600 dark:text-gray-300 text-sm",
                      { hidden: idx !== 0 }
                    )}
                  >
                    {faq.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img src={company4} alt="Illustration principale" className="w-full rounded-lg" />
            </div>
            <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 w-3/4 sm:w-1/2 lg:w-2/3 xl:w-1/2">
              <img src={company3} alt="Illustration secondaire" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
