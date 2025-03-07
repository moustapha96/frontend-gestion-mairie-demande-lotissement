// import { LuMoveRight } from "react-icons/lu"
// import { Link } from "react-router-dom"

// import finance10 from '@/assets/images/landing/finance/img-10.jpg'

// const Feature3 = () => {
//   return (
//     <section className="py-10 lg:py-20">
//       <div className="container">
//         <div className="grid lg:grid-cols-2 gap-6 items-center">
//           <div>
//             <span className="py-1 px-3 rounded-md text-xs font-medium uppercase tracking-wider border border-primary bg-primary/20 text-primary">Access Advisors</span>
//             <h2 className="text-4xl/tight font-medium text-default-950 mt-4"> Personalized Expert Support and Feedback</h2>
//             <p className="text-base mt-5">Receive expert support and valuable feedback tailored to your business's needs. Our advisors are here to help you navigate financial challenges and make informed decisions. </p>
//             <div className="group mt-5">
//               <Link to="" className="inline-flex items-center justify-center gap-2 rounded-full py-2 px-4 bg-primary/20 text-primary text-sm transition-all duration-200 hover:bg-primary hover:text-white">Read More
//                 <LuMoveRight className="w-6 h-6 inline-block" />
//               </Link>
//             </div>
//           </div>
//           <div className="relative">
//             <img src={finance10} className="rounded-xl" />
//             <div className="hidden lg:block">
//               <div className="absolute -top-20 -end-20">
//                 <div className="max-w-md">
//                   <div className="p-6 bg-white border border-default-200 rounded-xl dark:bg-default-50">
//                     <h2 className="text-xl font-medium text-default-950">Obtain Financing and Fundraising Advice</h2>
//                     <p className="text-base mt-4">Schedule a free consultation with our financing and fundraising expert.</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute -bottom-8 -start-20">
//                 <div className="inline-block">
//                   <div className="p-5 bg-white border border-default-200 rounded-xl dark:bg-default-50">
//                     <h4 className="text-xl font-medium text-default-950">Priority Support</h4>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Feature3

import { LuMoveRight } from "react-icons/lu";
import { Link } from "react-router-dom";

import finance10 from '@/assets/images/landing/finance/img-10.jpg';

const Feature3 = () => {
  return (
    <section className="py-10 lg:py-20">
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
    </section>
  );
}

export default Feature3;
