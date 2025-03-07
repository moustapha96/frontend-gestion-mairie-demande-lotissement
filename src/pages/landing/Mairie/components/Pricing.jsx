import { Link } from "react-router-dom";
import { LuMoveRight } from "react-icons/lu";
import { FaCheckCircle } from "react-icons/fa";

const Pricing = () => {
  return (
    <section id="Tarification" className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 lg:px-0">
        {/* En-tête de la section */}
        <div className="max-w-2xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#24377A]">
    Tarification
</h2>
<div className="w-16 h-1 bg-[#24377A] mx-auto my-4 rounded"></div>


          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            L’authentification est gratuite pour toutes les écoles.
          </p>
        </div>

        {/* Cartes de tarification */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Abonnement pour Universités et Embassades */}
          <div className="bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg transition-transform transform hover:-translate-y-[5px] hover:shadow-xl duration-300 relative overflow-hidden">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-4">
              <FaCheckCircle className="text-[#012C4E] mr-2" />
              Abonnement pour Universités et Embassades
            </h3>
            <p className="text-xl text-[#012C4E] font-bold mt-4">$1000 <span className="text-lg font-normal">par mois</span></p>
            <p className="text-base text-gray-600 dark:text-gray-300 mt-4">
              Accès illimité aux vérifications de diplômes, attestations bancaires et autres, ainsi qu'une authentification illimitée de documents.
            </p>
            <p className="text-sm text-red-600 mt-2 italic">NB: l’authentification est gratuite pour toutes les écoles et universités. Seule la vérification est tarifée.</p>
            <div className="flex justify-between items-center mt-6">
              <Link to="/inscription" className="bg-[#012C4E] hover:bg-[#011A34] text-white font-medium inline-flex items-center px-4 py-2 rounded transition duration-200">
                Créer un compte <LuMoveRight className="ml-1" />
              </Link>
              <span className="text-lg text-gray-900 dark:text-gray-300">Tous utilisateurs</span>
            </div>
          </div>

          {/* Plan Entreprise */}
          <div className="bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg transition-transform transform hover:-translate-y-[5px] hover:shadow-xl duration-300 relative overflow-hidden">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-4">
              <FaCheckCircle className="text-[#012C4E] mr-2" />
              Plan Entreprise
            </h3>
            <p className="text-xl text-[#012C4E] font-bold mt-4">$100 <span className="text-lg font-normal">par document</span></p>
            <p className="text-base text-gray-600 dark:text-gray-300 mt-4">
              Cette option est pour les entreprises et organisations pour l’obtention de tout sorte de document : attestation de solde, attestation de travail, documents bancaires, et autres. Recevez ces documents directement venant de l’attestaire avec une sécurité optimale et une flexibilité inégalée.
            </p>
            <div className="flex justify-between items-center mt-6">
              <Link to="/enterprise" className="bg-[#012C4E] hover:bg-[#011A34] text-white font-medium inline-flex items-center px-4 py-2 rounded transition duration-200">
                En savoir plus <LuMoveRight className="ml-1" />
              </Link>
              <span className="text-lg text-gray-900 dark:text-gray-300">Utilisateurs illimités</span>
            </div>
          </div>

          {/* Frais pour Étudiants (optionnel) */}
          {/* Si vous souhaitez ajouter une section pour les étudiants, vous pouvez décommenter ce bloc */}
          {/* 
          <div className="bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg transition-transform transform hover:-translate-y-[5px] hover:shadow-xl duration-300 relative overflow-hidden">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-4">
              <FaCheckCircle className="text-[#012C4E] mr-2" />
              Frais pour Étudiants
            </h3>
            <p className="text-xl text-[#012C4E] font-bold mt-4">$50 <span className="text-lg font-normal">par demande</span></p>
            <p className="text-base text-gray-600 dark:text-gray-300 mt-4">
              Authentification rapide et sécurisée des documents académiques. Créez un compte pour soumettre vos demandes.
            </p>
            <div className="flex justify-between items-center mt-6">
              <Link to="/inscription" className="bg-[#012C4E] hover:bg-[#011A34] text-white font-medium inline-flex items-center px-4 py-2 rounded transition duration-200">
                Créer un compte étudiant <LuMoveRight className="ml-1" />
              </Link>
              <span className="text-lg text-gray-900 dark:text-gray-300">Par demande</span>
            </div>
          </div> 
          */}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
