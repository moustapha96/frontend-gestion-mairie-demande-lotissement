


import unauthorizedImg from "@/assets/images/other/logout.png";// Remplacez par une image adaptée
import { PageMetaData } from "@/components";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <>
      <PageMetaData title="Accès non autorisé" />
      <div className="my-auto text-center">
        <h4 className="mb-4 text-2xl font-bold text-white">
          Accès non autorisé
        </h4>
        <p className="mx-auto mb-5 max-w-sm text-default-300">
          Vous n'avez pas les droits nécessaires pour accéder à cette page.
        </p>
        <div className="flex items-start justify-center">

          <svg
            className="h-40 text-default-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>

        </div>
      </div>
      <p className="shrink text-center text-zinc-200">
        Vous souhaitez accéder à une autre section ?
        <Link to="/admin/dashboard" className="ms-1 text-primary">
          <b>Retour au tableau de bord</b>
        </Link>
      </p>
    </>
  );
};

export default Unauthorized;
