// import React from "react";
// import { FaCheckCircle } from "react-icons/fa"; // Icône pour les valeurs
// import aboutImage from "@/assets/images/landing/hosting/about-us1.jpg"; // Image illustrative (ajoute ton propre chemin d'image)

// const AboutUs = () => {
//     return (
//         <section id="A propos" className="py-20 bg-default-100 dark:bg-default-50">
//             <div className="container mx-auto">
//                 {/* Section titre avec un style plus grand et centré */}
//                 <div className="text-center mb-16">

//                 <h2 className="text-3xl md:text-4xl font-bold text-[#24377A]">
//                   À Propos de Nous
//                  </h2>
//          <div className="w-16 h-1 bg-[#24377A] mx-auto my-4 rounded"></div>



//                     {/* Paragraphe étendu pour occuper toute la largeur */}
//                     <p className="text-base text-default-600 mt-4 text-justify">
//                         AuthenticPage est le leader de la vérification documentaire, auquel les institutions gouvernementales, les ambassades, les écoles, les entreprises et les particuliers du monde entier font confiance. Notre objectif est de redéfinir les normes de sécurité en offrant une solution innovante, qui renforce la confiance et simplifie la gestion des documents.
//                     </p>
//                 </div>

//                 {/* Grid avec texte et image */}
//                 <div className="grid lg:grid-cols-2 gap-10 items-center">
//                     {/* Texte à gauche */}
//                     <div>
//                         <div className="mb-10">
//                             <h3 className="text-2xl font-semibold text-default-950 mb-4">
//                                 Notre Mission
//                             </h3>
//                             <p className="text-base text-default-600 text-justify">
//                                 Notre mission est de simplifier le processus d'authentification des diplômes et certificats académiques pour les étudiants et les institutions. Nous nous engageons à offrir une plateforme fiable qui renforce la confiance dans les qualifications académiques.
//                             </p>
//                         </div>

//                         <div className="mb-10">
//                             <h3 className="text-2xl font-semibold text-default-950 mb-4">
//                                 Notre Vision
//                             </h3>
//                             <p className="text-base text-default-600 text-justify">
//                                 Nous aspirons à devenir la référence mondiale en matière d'authentification des documents académiques, en garantissant la sécurité et l'intégrité des informations tout en facilitant l'accès à l'éducation pour tous.
//                             </p>
//                         </div>
//                     </div>

//                     {/* Image à droite */}
//                     <div className="flex justify-center">
//                         <img src={aboutImage} alt="Illustration à propos de nous" className="rounded-lg shadow-lg" />
//                     </div>
//                 </div>

//                 {/* Section Valeurs sous forme de cartes */}
//                 <div className="grid lg:grid-cols-3 gap-8 mt-16">
//                     <div className="bg-white p-6 rounded-lg shadow-md text-center">
//                         <FaCheckCircle className="text-red-600 text-3xl mb-4 mx-auto" />
//                         <h4 className="text-xl font-semibold text-default-950 mb-2">Intégrité</h4>
//                         <p className="text-base text-default-600 text-justify">
//                             Nous agissons avec honnêteté et transparence dans toutes nos interactions.
//                         </p>
//                     </div>

//                     <div className="bg-white p-6 rounded-lg shadow-md text-center">
//                         <FaCheckCircle className="text-red-600 text-3xl mb-4 mx-auto" />
//                         <h4 className="text-xl font-semibold text-default-950 mb-2">Innovation</h4>
//                         <p className="text-base text-default-600 text-justify">
//                             Nous cherchons constamment à améliorer nos services et à adopter de nouvelles technologies.
//                         </p>
//                     </div>

//                     <div className="bg-white p-6 rounded-lg shadow-md text-center">
//                         <FaCheckCircle className="text-red-600 text-3xl mb-4 mx-auto" />
//                         <h4 className="text-xl font-semibold text-default-950 mb-2">Accessibilité</h4>
//                         <p className="text-base text-default-600 text-justify">
//                             Nous croyons que chaque étudiant mérite un accès équitable à l'éducation.
//                         </p>
//                     </div>
//                 </div>
//             </div>

//             {/* Ajout de l'animation pour le titre */}
//             <style jsx>{`
//                 @keyframes fadeInUp {
//                     from {
//                         opacity: 0;
//                         transform: translateY(20px);
//                     }
//                     to {
//                         opacity: 1;
//                         transform: translateY(0);
//                     }
//                 }

//                 .animate-fade-in-up {
//                     animation: fadeInUp 0.7s ease-in-out;
//                 }

//                 .animate-underline {
//                     animation: fadeInUp 1s ease-in-out 0.5s;
//                     animation-fill-mode: both;
//                 }
//             `}</style>
//         </section>
//     );
// };

// export default AboutUs;

import React from "react";

const AboutUs = () => {
    return (
        <section id="A propos" className="py-20 bg-default-100">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold">À Propos de Nous</h2>
                <p className="text-base mt-4">
                    CCBME est dédié à fournir des solutions innovantes pour la gestion des adhésions et des commandes.
                </p>
                {/* Ajoutez plus de contenu ici */}
            </div>
        </section>
    );
};

export default AboutUs;