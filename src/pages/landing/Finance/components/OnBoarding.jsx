// import brand1 from '@/assets/images/brand/1.png'
// import brand2 from '@/assets/images/brand/2.png'
// import brand3 from '@/assets/images/brand/3.png'
// import brand4 from '@/assets/images/brand/4.png'
// import brand5 from '@/assets/images/brand/5.png'
// import brand6 from '@/assets/images/brand/6.png'
// import finance6 from '@/assets/images/landing/finance/img-6.jpg'
// import finance7 from '@/assets/images/landing/finance/img-7.png'

// const brands = [brand1, brand2, brand3, brand4, brand5, brand6]
// const OnBoarding = () => {
//   return (
//     <section id="onboarding" className="py-10 lg:py-20">
//       <div className="container">
//         <div className="grid lg:grid-cols-2 gap-6 items-center">
//           <div>
//             <div className="max-w-2xl">
//               <span className="py-1 px-3 rounded-md text-xs font-medium uppercase tracking-wider border border-primary bg-primary/20 text-primary">Smooth Onboarding</span>
//               <h2 className="text-4xl font-medium text-default-950 mt-4">Effortless Integrations for a Quick Start</h2>
//               <p className="text-base mt-5">Link Vault with your current financial technology stack to simplify data comprehension and decision-making.</p>
//             </div>
//             <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 mt-10">
//               {brands.map((image, idx) => {
//                 return (
//                   <div key={idx} className="p-10 rounded-xl border border-default-200">
//                     <img src={image} />
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//           <div className="relative lg:mb-0">
//             <div className="relative h-full">
//               <img src={finance6} className="mx-auto rounded-xl h-full" />
//             </div>
//             <div className="absolute inset-x-0 -bottom-14 hidden sm:block">
//               <img src={finance7} className="h-full rounded-xl" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default OnBoarding
// Importez vos propres images
import brand1 from '@/assets/images/brand/1.png'
import brand2 from '@/assets/images/brand/2.png'
import brand3 from '@/assets/images/brand/3.png'
import brand4 from '@/assets/images/brand/4.png'
import brand5 from '@/assets/images/brand/5.png'
import brand6 from '@/assets/images/brand/6.png'
import urbanismeImg from '@/assets/images/landing/finance/img-6.jpg'
import cultureImg from '@/assets/images/landing/finance/img-7.png'



const brands = [brand1, brand2, brand3, brand4, brand5, brand6];

const OnBoarding = () => {
  return (
    <section id="onboarding" className="py-10 lg:py-20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          <div>
            <div className="max-w-2xl">
              <span className="py-1 px-3 rounded-md text-xs font-medium uppercase tracking-wider border border-primary bg-primary/20 text-primary">Développement Urbain</span>
              <h2 className="text-4xl font-medium text-default-950 mt-4">Solutions intégrées pour le développement urbain et culturel</h2>
              <p className="text-base mt-5">Découvrez comment nos solutions aident à la planification urbaine, au développement de lotissements, et à la promotion d'initiatives culturelles pour enrichir notre communauté.</p>
            </div>
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 mt-10">
              {brands.map((image, idx) => {
                return (
                  <div key={idx} className="p-10 rounded-xl border border-default-200">
                    <img src={image} alt={`Projet ${idx + 1}`} />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative lg:mb-0">
            <div className="relative h-full">
              <img src={urbanismeImg} className="mx-auto rounded-xl h-full" alt="Urbanisme" />
            </div>
            <div className="absolute inset-x-0 -bottom-14 hidden sm:block">
              <img src={cultureImg} className="h-full rounded-xl" alt="Culture" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnBoarding;
