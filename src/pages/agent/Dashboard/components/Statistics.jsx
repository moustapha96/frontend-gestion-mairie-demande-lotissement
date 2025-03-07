// import { LuTrendingUp } from "react-icons/lu";
// import { statisticData } from "../data";
// import StatisticWidget from "./StatisticWidget";
// import { Files, Users } from "lucide-react";

// const Statistics = ({ demandesCount, demandeursCount, institutsCount, documentsCount }) => {
//   return (
//     <div className="grid gap-6 lg:grid-cols-3">

//       <div className="rounded-md border border-default-200 bg-white dark:bg-default-50">
//         <div className="p-5">
//           <div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium text-default-600">
//                 Nombre de demandes
//               </span>
//               <span className="text-teal-500">
//                 <LuTrendingUp className="me-1 inline size-4" />
//                 {demandesCount}%
//               </span>
//             </div>
//             <div className="flex items-end justify-between gap-4">
//               <h3 className="text-3xl font-medium text-default-800">{demandesCount}</h3>
//               <Files size={70} ></Files>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="rounded-md border border-default-200 bg-white dark:bg-default-50">
//         <div className="p-5">
//           <div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium text-default-600">
//                 Nombre de demandeurs
//               </span>
//               <span className="text-teal-500">
//                 <LuTrendingUp className="me-1 inline size-4" />
//                 {demandeursCount}%
//               </span>
//             </div>
//             <div className="flex items-end justify-between gap-4">
//               <h3 className="text-3xl font-medium text-default-800">{demandeursCount}</h3>
//               <Users size={70} ></Users>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="rounded-md border border-default-200 bg-white dark:bg-default-50">
//         <div className="p-5">
//           <div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium text-default-600">
//                 Nombre d'instituts
//               </span>
//               <span className="text-teal-500">
//                 <LuTrendingUp className="me-1 inline size-4" />
//                 {institutsCount}%
//               </span>
//             </div>
//             <div className="flex items-end justify-between gap-4">
//               <h3 className="text-3xl font-medium text-default-800">{institutsCount}</h3>
//               <Users size={70} ></Users>
//             </div>
//           </div>
//         </div>
//       </div>


//       <div className="rounded-md border border-default-200 bg-white dark:bg-default-50">
//         <div className="p-5">
//           <div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium text-default-600">
//                 Nombre de documents
//               </span>
//               <span className="text-teal-500">
//                 <LuTrendingUp className="me-1 inline size-4" />
//                 {documentsCount}%
//               </span>
//             </div>
//             <div className="flex items-end justify-between gap-4">
//               <h3 className="text-3xl font-medium text-default-800">{documentsCount}</h3>
//               <Files size={70} ></Files>
//             </div>
//           </div>
//         </div>
//       </div>



//     </div>
//   );
// };

// export default Statistics;


import { LuTrendingUp } from "react-icons/lu";
import { CheckCircle, Clock, XCircle, ShoppingCart } from "lucide-react";

const StatisticCard = ({ title, count, icon: Icon, color }) => (
  <div className="rounded-md border border-default-200 bg-white dark:bg-default-50">
    <div className="p-5">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-default-600">
            {title}
          </span>
          <span className={`text-${color}-500`}>
            <LuTrendingUp className="me-1 inline size-4" />
            {count}
          </span>
        </div>
        <div className="flex items-end justify-between gap-4">
          <h3 className="text-3xl font-medium text-default-800">{count}</h3>
          <Icon size={70} className={`text-${color}-500`} />
        </div>
      </div>
    </div>
  </div>
);

const Statistics = ({ commandesApprouvees, commandesEnCours, commandesRejetees, totalCommandes }) => {
  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <StatisticCard
        title="Commandes approuvées"
        count={commandesApprouvees}
        icon={CheckCircle}
        color="green"
      />
      <StatisticCard
        title="Commandes en cours"
        count={commandesEnCours}
        icon={Clock}
        color="yellow"
      />
      <StatisticCard
        title="Commandes rejetées"
        count={commandesRejetees}
        icon={XCircle}
        color="red"
      />
      <StatisticCard
        title="Total des commandes"
        count={totalCommandes}
        icon={ShoppingCart}
        color="blue"
      />
    </div>
  );
};

export default Statistics;