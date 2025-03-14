// import { Link } from "react-router-dom"
// import { LuMoveRight, LuPlay, LuStar } from "react-icons/lu"
// import { FaQuoteRight } from "react-icons/fa6"
// import { Swiper, SwiperSlide } from "swiper/react"

// import finance from '@/assets/images/landing/finance/img-1.png'
// import financeBackground from '@/assets/images/landing/finance/bg-1.png'
// import financeBackground2 from '@/assets/images/landing/finance/bg-2.png'
// import avatar1 from '@/assets/images/avatars/img-1.jpg'
// import avatar3 from '@/assets/images/avatars/img-3.jpg'

// import 'swiper/css'

// const slideImages = [avatar1, avatar3]
// const Hero = () => {
//   return (
//     <>
//       <section id="accueil" className="md:py-20 flex items-center justify-center relative overflow-hidden bg-cover bg-gradient-to-l from-primary/5 to-primary/10 via-primary/0">
//         <div className="container">
//           <div className="grid lg:grid-cols-2 grid-cols-1 2xl:gap-20">
//             <div className="pt-[132px] pb-20">
//               <h2 className="text-3xl xl:text-5xl/tight font-medium text-default-950">A Financial Planning and Growth Platform for Entrepreneurs</h2>
//               <p className="sm:text-lg mt-6">Pellentesque lectus, with neque cursus sapien, massa laoreet varius. Ultricies faucibus donec tellus cras ornare. Aliquam mattis neque sed sit arcu egestas quisque quisque.</p>
//               <div className="flex flex-wrap items-center mt-10 gap-6">
//                 <Link to="/nouvelle-demande" className="inline-flex items-center justify-center gap-2 text-base py-3 px-10 rounded-full text-white bg-primary hover:bg-primary-700 transition-all duration-700">Nouvelle demande<LuMoveRight className="h-6 w-6" /></Link>
//                 <button className="relative flex items-center justify-center gap-4 text-base group" data-hs-overlay="#watchvideomodal">
//                   <span className="h-12 w-12 flex items-center justify-center gap-4 rounded-full text-base font-medium bg-primary/40 text-primary transition-all duration-300 ring-4 ring-primary/20 group-hover:bg-primary/80 group-hover:text-white"><LuPlay className="h-5 w-5" /></span>
//                   <span className="text-base font-medium">Comment ça marche</span>
//                 </button>
//               </div>
//             </div>
//             <div>
//               <div className="relative opacity-100 z-20">
//                 <img src={finance} className="h-[700px] rounded-b-full mx-auto" />
//                 <div className="absolute top-40 end-0 -z-10">
//                   <img src={financeBackground} className="h-[250px] mx-auto" />
//                 </div>
//                 <div className="absolute inset-x-0 top-auto bottom-5 -z-10">
//                   <img src={financeBackground2} className="h-[450px] mx-auto" />
//                 </div>
//                 <div className="absolute z-20 end-0 bottom-0">
//                   <div className="max-w-xs overflow-hidden rounded-md shadow">
//                     <Swiper loop>
//                       {slideImages.map((image, idx) => {
//                         return (
//                           <SwiperSlide key={idx}>
//                             <div className="relative">
//                               <div className="p-4 rounded-md bg-white relative dark:bg-default-50">
//                                 <div className="flex items-center gap-5">
//                                   <img src={image} className="w-12 rounded-full" />
//                                   <div>
//                                     <h6 className="text-sm text-default-600">Very convenient to use project manager!</h6>
//                                     <p className="mt-2">
//                                       <span className="flex gap-1 items-center text-yellow-300 text-base">
//                                         {Array.from(new Array(4)).map((_val, idx) => {
//                                           return (
//                                             <LuStar key={idx} className="h-5 w-5 fill-yellow-300" />
//                                           )
//                                         })}
//                                         <LuStar className="h-5 w-5" />
//                                       </span>
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <div className="absolute end-1 bottom-0">
//                                   <FaQuoteRight className="text-2xl text-orange-500/20" />
//                                 </div>
//                               </div>
//                             </div>
//                           </SwiperSlide>
//                         )
//                       })}
//                     </Swiper>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <div id="watchvideomodal" className="hs-overlay hidden w-full h-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
//         <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 duration-500 mt-0 opacity-0 ease-in-out transition-all sm:max-w-2xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
//           <div className="flex flex-col w-full pointer-events-auto rounded-xl overflow-x-hidden">
//             <iframe className="w-full" height={400} src="https://www.youtube.com/embed/NbR-wVOpJwA?si=OlR2e-UItbGilVlu" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default Hero

import { Link } from "react-router-dom";
import { LuMoveRight, LuPlay, LuStar } from "react-icons/lu";
import { FaQuoteRight } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";

import finance from '@/assets/images/landing/finance/img-1.png'
import financeBackground from '@/assets/images/landing/finance/bg-1.png'
import financeBackground2 from '@/assets/images/landing/finance/bg-2.png'
import avatar1 from '@/assets/images/avatars/img-1.jpg'
import avatar3 from '@/assets/images/avatars/img-3.jpg'

import 'swiper/css';

const slideImages = [avatar1, avatar3];

const Hero = () => {
  return (
    <>
      <section id="accueil" className="md:py-20 flex items-center justify-center relative overflow-hidden bg-cover bg-gradient-to-l from-primary/5 to-primary/10 via-primary/0">
        <div className="container">
          <div className="grid lg:grid-cols-2 grid-cols-1 2xl:gap-20">
            <div className="pt-[132px] pb-20">
              <h2 className="text-3xl xl:text-5xl/tight font-medium text-default-950">
                Plateforme de Gestion des Demandes de Terrain de la Mairie de Kaolack
              </h2>
              <p className="sm:text-lg mt-6">
                Bienvenue sur le portail officiel de la Mairie de Kaolack dédié aux demandes de terrains. Simplifiez vos démarches administratives et suivez l'évolution de votre dossier en toute transparence.
              </p>
              <div className="flex flex-wrap items-center mt-10 gap-6">
                <Link to="/nouvelle-demande" className="inline-flex items-center justify-center gap-2 text-base py-3 px-10 rounded-full text-white bg-primary hover:bg-primary-700 transition-all duration-700">
                  Nouvelle Demande
                  <LuMoveRight className="h-6 w-6" />
                </Link>
                <button className="relative flex items-center justify-center gap-4 text-base group" data-hs-overlay="#watchvideomodal">
                  <span className="h-12 w-12 flex items-center justify-center gap-4 rounded-full text-base font-medium bg-primary/40 text-primary transition-all duration-300 ring-4 ring-primary/20 group-hover:bg-primary/80 group-hover:text-white">
                    <LuPlay className="h-5 w-5" />
                  </span>
                  <span className="text-base font-medium">Comment ça marche</span>
                </button>
              </div>
            </div>
            <div>
              <div className="relative opacity-100 z-20">
                <img src={finance} className="h-[700px] rounded-b-full mx-auto" alt="Mairie de Kaolack" />
                <div className="absolute top-40 end-0 -z-10">
                  <img src={financeBackground} className="h-[250px] mx-auto" alt="Motif de fond" />
                </div>
                <div className="absolute inset-x-0 top-auto bottom-5 -z-10">
                  <img src={financeBackground} className="h-[450px] mx-auto" alt="Motif de fond" />
                </div>
                <div className="absolute z-20 end-0 bottom-0">
                  <div className="max-w-xs overflow-hidden rounded-md shadow">
                    <Swiper loop>
                      {slideImages.map((image, idx) => (
                        <SwiperSlide key={idx}>
                          <div className="relative">
                            <div className="p-4 rounded-md bg-white relative dark:bg-default-50">
                              <div className="flex items-center gap-5">
                                <img src={image} className="w-12 rounded-full" alt={`Témoignage ${idx + 1}`} />
                                <div>
                                  <h6 className="text-sm text-default-600">
                                    "Service rapide et efficace pour obtenir mon terrain à Kaolack !"
                                  </h6>
                                  <p className="mt-2">
                                    <span className="flex gap-1 items-center text-yellow-300 text-base">
                                      {Array.from({ length: 5 }).map((_, starIdx) => (
                                        <LuStar key={starIdx} className="h-5 w-5 fill-yellow-300" />
                                      ))}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div className="absolute end-1 bottom-0">
                                <FaQuoteRight className="text-2xl text-orange-500/20" />
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div id="watchvideomodal" className="hs-overlay hidden w-full h-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 duration-500 mt-0 opacity-0 ease-in-out transition-all sm:max-w-2xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
          <div className="flex flex-col w-full pointer-events-auto rounded-xl overflow-x-hidden">
            <iframe className="w-full" height={400} src="https://www.youtube.com/watch?v=rteYudk2ZIA" title="Présentation du service de demande de terrain" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
