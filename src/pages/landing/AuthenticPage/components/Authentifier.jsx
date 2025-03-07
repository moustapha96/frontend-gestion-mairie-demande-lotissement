// import { LuMoveRight } from "react-icons/lu";
// import { useLayoutContext } from "@/context";
// import hosting3 from "@/assets/images/landing/hosting/3.png"; // Image illustrant le concept de migration rapide
// import hosting5 from "@/assets/images/landing/hosting/5.png"; // Image illustrant la sécurité de l'authentification
// import { Link } from "react-router-dom";

// const Authentifier = () => {
//     const { themeMode } = useLayoutContext();
//     return (
//         <>
//             {/* Section Sécurité et Authentification */}
//             <section id="Fonctionnalités" className="py-10 lg:py-20 bg-gray-100">
//                 <div className="container">
//                     <div className="grid md:grid-cols-2 gap-6 items-center">
//                         {/* Image - Sécurité de l'authentification */}
//                         <div className="flex justify-center">
//                             <img src={hosting5} alt="Authentification sécurisée avec AuthenticPage" className="rounded-lg shadow-lg animate-fadeIn" />
//                         </div>

//                         {/* Texte - Sécurité et confiance */}
//                         <div className="text-justify">
//                             <span className="text-sm uppercase text-primary font-semibold tracking-widest">
//                                 Sécurité de Confiance
//                             </span>
//                             <h2 className="text-3xl md:text-4xl font-bold text-[#24377A]">
//                                 Une Authentification Fiable Dès le Départ
//                             </h2>
//                             <div className="w-16 h-1 bg-[#24377A] mx-auto my-4 rounded"></div>

//                             <p className="text-base text-default-600 mb-5 leading-relaxed">
//                                 AuthenticPage est votre solution de confiance pour valider vos diplômes et documents importants. Notre technologie avancée
//                                 de vérification des fraudes garantit que chaque document est authentique et sécurisé. Nous ne nous contentons pas d'utiliser des algorithmes ; nous utilisons un système tangible de détection de la fraude qui assure l'intégrité de chaque document en toute confidentialité.
//                             </p>
//                             <p className="text-base text-default-600 mb-5 leading-relaxed">
//                                 Avec des fonctionnalités telles que la boîte aux lettres électronique avancée, le stockage sécurisé dans le cloud et les mises à jour d'authentification en temps réel, AuthenticPage offre une sécurité inégalée, simplifiant le processus de gestion et de vérification documentaire.
//                             </p>
//                             <Link
//                                 to="/authentification"
//                                 className="inline-flex gap-2 text-xl items-center relative text-primary group font-medium"
//                             >
//                                 <span className="absolute h-px w-7/12 group-hover:w-full transition-all duration-500 rounded bg-primary/80 -bottom-0" />
//                                 Découvrez Comment ça Fonctionne
//                                 <LuMoveRight className="h-5 w-5" />
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Section Processus Simplifié */}
//             <section className="py-10 lg:py-20 bg-white">
//                 <div className="container">
//                     <div className="grid md:grid-cols-2 gap-6 items-center">
//                         {/* Texte - Processus rapide et simplifié */}
//                         <div className="text-justify">
//                             <span className="text-sm uppercase text-primary font-semibold tracking-widest">
//                                 Processus Simplifié
//                             </span><br />
//                             <h2 className="text-3xl md:text-4xl font-bold text-[#24377A]">
//                                 Migration Rapide et Efficace
//                             </h2>
//                             <div className="w-16 h-1 bg-[#24377A] mx-auto my-4 rounded"></div>

//                             <p className="text-base text-default-600 mb-5 leading-relaxed">
//                                 AuthenticPage vous permet de migrer et authentifier vos documents avec une rapidité et une efficacité sans précédent. Notre plateforme est conçue pour réduire les temps d'arrêt et maximiser la productivité, en rendant le processus aussi fluide que possible.
//                             </p>
//                             <p className="text-base text-default-600 mb-5 leading-relaxed">
//                                 Profitez d'une intégration complète avec des mises à jour en temps réel et une sécurité renforcée par notre système unique d'ADN de document. Nos solutions vous offrent une sérénité totale face aux risques de fraude documentaire et d'usurpation d'identité.
//                             </p>
//                             <Link
//                                 to="/contact"
//                                 className="inline-flex gap-2 text-xl items-center relative text-primary group font-medium"
//                             >
//                                 <span className="absolute h-px w-7/12 group-hover:w-full transition-all duration-500 rounded bg-primary/80 -bottom-0" />
//                                 Contactez-nous pour en Savoir Plus
//                                 <LuMoveRight className="h-5 w-5" />
//                             </Link>
//                         </div>

//                         {/* Image - Migration rapide */}
//                         <div className="flex justify-center">
//                             <img src={hosting3} alt="Processus d'authentification rapide et sécurisé" className="rounded-lg shadow-lg animate-fadeIn h-96" />
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// };

// export default Authentifier;

import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Authentifier = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        // Logique d'authentification ici
        toast.success("Authentifié avec succès!");
    };

    return (
        <section className="py-10">
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("email", { required: true })} placeholder="Email" />
                {errors.email && <span>Email requis</span>}

                <input {...register("password", { required: true })} type="password" placeholder="Mot de passe" />
                {errors.password && <span>Mot de passe requis</span>}

                <button type="submit">Se connecter</button>
            </form>
        </section>
    );
};

export default Authentifier;