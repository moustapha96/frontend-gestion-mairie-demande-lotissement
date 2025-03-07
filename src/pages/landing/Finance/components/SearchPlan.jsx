// import { LuSearch } from "react-icons/lu"

// import backgroundLine2 from '@/assets/images/other/bg-lines-2.png'

// const SearchPlan = () => {
//   return (
//     <section className="py-10 lg:py-20">
//       <div className="container">
//         <div className="rounded-lg shadow bg-cover bg-gradient-to-l from-primary/5 to-primary/10 via-primary/0">
//           <div className="py-20 px-6 bg-no-repeat bg-cover" style={{ backgroundImage: `url(${backgroundLine2})` }}>
//             <div className="max-w-2xl mx-auto text-center">
//               <h2 className="md:text-4xl text-3xl font-medium text-default-950 mt-5">Obtain Your Customizable Financial Survival Plan.</h2>
//               <p className="text-base  text-default-950 mt-6">Nunc egestas, augue at pellentesque laoreet, felis eros vehicula leo, at malesuada velit leo quis pede.</p>
//               <form className="max-w-2xl mx-auto space-y-2 mt-6">
//                 <div className="relative">
//                   <input type="email" id="subcribe" className="py-4 ps-4 pe-14 w-full h-12 rounded-md bg-default-50 text-default-950 border-default-200 focus:ring-0 focus:border-default-200" placeholder="Type Your Email" name="email" />
//                   <button type="submit" className="inline-flex items-center justify-center gap-2 px-3 absolute top-[6px] end-[6px] h-9">
//                     <LuSearch className="h-6 w-6 text-default-950" />
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default SearchPlan

import { LuSearch } from "react-icons/lu"
import backgroundLine2 from '@/assets/images/other/bg-lines-2.png'

const SearchPlan = () => {
  return (
    <section className="py-10 lg:py-20">
      <div className="container">
        <div className="rounded-lg shadow bg-cover bg-gradient-to-l from-primary/5 to-primary/10 via-primary/0">
          <div className="py-20 px-6 bg-no-repeat bg-cover" style={{ backgroundImage: `url(${backgroundLine2})` }}>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="md:text-4xl text-3xl font-medium text-default-950 mt-5">Recherchez les Services et Informations de la Mairie de Kaolack.</h2>
              <p className="text-base text-default-950 mt-6">Trouvez facilement les services municipaux, les informations locales et les démarches administratives disponibles à Kaolack.</p>
              <form className="max-w-2xl mx-auto space-y-2 mt-6">
                <div className="relative">
                  <input type="text" id="search" className="py-4 ps-4 pe-14 w-full h-12 rounded-md bg-default-50 text-default-950 border-default-200 focus:ring-0 focus:border-default-200" placeholder="Rechercher..." name="search" />
                  <button type="submit" className="inline-flex items-center justify-center gap-2 px-3 absolute top-[6px] end-[6px] h-9">
                    <LuSearch className="h-6 w-6 text-default-950" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SearchPlan
