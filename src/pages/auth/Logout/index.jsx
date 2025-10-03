
import logoutImg from "@/assets/images/other/logout.png";
import { PageMetaData } from "@/components";
import { useAuthContext } from "@/context";
import { Link } from "react-router-dom";

const Logout = () => {
  const { removeSession } = useAuthContext();
  removeSession();
  return (
    <>
      <PageMetaData title="Déconnexion" />

      <div className="my-auto text-center">
        <h4 className="mb-4 text-2xl font-bold text-white">À bientôt !</h4>
        <p className="mx-auto mb-5 max-w-sm text-default-300">
          Vous êtes maintenant déconnecté avec succès.
        </p>
        <div className="flex items-start justify-center">
          <img src={logoutImg} className="h-40" alt="Déconnexion" />
        </div>
      </div>
      <p className="shrink text-center text-zinc-200">
        Vous avez déjà un compte ?
        <Link to="/auth/sign-in" className="ms-1 text-primary">
          <b>Connexion</b>
        </Link>
      </p>
    </>
  );
};

export default Logout;
