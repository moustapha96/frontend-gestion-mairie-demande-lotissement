

import { Link } from "react-router-dom";
import { LuCircle, LuMoveRight } from 'react-icons/lu'
import finance9 from '@/assets/images/landing/finance/img-9.png'
import finance8 from '@/assets/images/landing/finance/img-8.png'
import finance10 from '@/assets/images/landing/finance/img-10.jpg';


const Feature1 = () => {


  return (
    <section id="services" className="py-10 lg:py-20">
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <div className="max-w-2xl mx-auto text-center">
            <span className="py-1 px-3 rounded-md text-xs font-medium uppercase tracking-wider border border-primary bg-primary/20 text-primary">Nos Experts</span>
            <h2 className="text-4xl font-medium text-default-950 mt-4">Nos Services</h2>
          </div>
        </div>



        <div className="container">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <div>
              <span className="py-1 px-3 rounded-md text-xs font-medium uppercase tracking-wider border border-primary bg-primary/20 text-primary">Projets en Vedette</span>
              <h2 className="text-4xl/tight font-medium text-default-950 mt-4">Simplifiez vos démarches foncières avec notre nouveau portail</h2>
              <p className="text-base text-default-900 mt-5">La mairie de Kaolack a lancé une plateforme en ligne pour faciliter les demandes de terrain. Ce portail vise à rendre le processus plus transparent et accessible à tous les citoyens.</p>
              <div className="group mt-5">
                <Link to="/demande-terrain" className="inline-flex items-center justify-center gap-2 rounded-full py-2 px-4 bg-primary/20 text-primary text-sm transition-all duration-200 hover:bg-primary hover:text-white">
                  En savoir plus
                  <LuMoveRight className="w-6 h-6 inline-block" />
                </Link>
              </div>
            </div>
            <div>
              <img src={finance8} className="h-full w-full rounded-lg" alt="Projet foncier à Kaolack" />
            </div>
          </div>
        </div>

        <div className="container">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <div>
              <img src={finance9} className="h-full w-full rounded-lg" />
            </div>
            <div>
              <span className="py-1 px-3 rounded-md text-xs font-medium uppercase tracking-wider border border-primary bg-primary/20 text-primary">Attribution de terrains</span>
              <h2 className="text-4xl/tight font-medium text-default-950 mt-4">Simplifiez vos démarches d'attribution de terrain avec la Mairie de Kaolack</h2>
              <ul role="list" className="mt-6 space-y-2 text-sm text-default-700 -ms-3 ps-6">
                <li className="flex items-center gap-3">
                  <LuCircle className="shrink inline-block h-2 w-2 text-primary fill-primary" />
                  <span className="grow text-base font-medium">Accédez facilement aux informations sur les terrains disponibles.</span>
                </li>
                <li className="flex items-center gap-3">
                  <LuCircle className="shrink inline-block h-2 w-2 text-primary fill-primary" />
                  <span className="grow text-base font-medium">Suivez l'état d'avancement de votre demande en temps réel.</span>
                </li>
                <li className="flex items-center gap-3">
                  <LuCircle className="shrink inline-block h-2 w-2 text-primary fill-primary" />
                  <span className="grow text-base font-medium">Bénéficiez d'un accompagnement personnalisé tout au long du processus.</span>
                </li>
              </ul>
              <div className="group mt-5">
                <Link to="/demande-de-terrain" className="inline-flex items-center justify-center gap-2 rounded-full py-2 px-4 bg-primary/20 text-primary text-sm transition-all duration-200 hover:bg-primary hover:text-white">
                  En savoir plus
                  <LuMoveRight className="w-6 h-6 inline-block" />
                </Link>
              </div>
            </div>
          </div>
        </div>


        <div className="container">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <div>
              <span className="py-1 px-3 rounded-md text-xs font-medium uppercase tracking-wider border border-primary bg-primary/20 text-primary">Accès aux Conseillers</span>
              <h2 className="text-4xl/tight font-medium text-default-950 mt-4">Support Personnalisé et Conseils d'Experts</h2>
              <p className="text-base mt-5">Bénéficiez d'un accompagnement expert et de retours précieux adaptés à vos besoins. Nos conseillers sont là pour vous aider à naviguer dans les défis administratifs et à prendre des décisions éclairées.</p>
              <div className="group mt-5">
                <Link to="" className="inline-flex items-center justify-center gap-2 rounded-full py-2 px-4 bg-primary/20 text-primary text-sm transition-all duration-200 hover:bg-primary hover:text-white">En savoir plus
                  <LuMoveRight className="w-6 h-6 inline-block" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <img src={finance10} className="rounded-xl" />
              <div className="hidden lg:block">
                <div className="absolute -top-20 -end-20">
                  <div className="max-w-md">
                    <div className="p-6 bg-white border border-default-200 rounded-xl dark:bg-default-50">
                      <h2 className="text-xl font-medium text-default-950">Obtenez des Conseils sur les Demandes de Terrain</h2>
                      <p className="text-base mt-4">Planifiez une consultation gratuite avec nos experts en urbanisme et en aménagement du territoire pour vous guider dans vos démarches.</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-8 -start-20">
                  <div className="inline-block">
                    <div className="p-5 bg-white border border-default-200 rounded-xl dark:bg-default-50">
                      <h4 className="text-xl font-medium text-default-950">Support Prioritaire</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Feature1;
