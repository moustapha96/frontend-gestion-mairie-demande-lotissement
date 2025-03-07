


import {
  PageMetaData,
  PasswordFormInput,
  TextFormInput,
} from "@/components";
import useLogin from "./useLogin";
import { Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

const SignIn = () => {
  const { loading, login, control } = useLogin();

  return (
    <>
      <PageMetaData title="Connexion" />

      <form className="mt-2 shrink" onSubmit={login}>
        <TextFormInput
          containerClassName="mb-4"
          label="Adresse email"
          name="email"
          labelClassName="block text-base/normal text-zinc-200 font-semibold"
          className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
          fullWidth
          control={control}
        />

        <PasswordFormInput
          label="Mot de passe"
          containerClassName="mb-4"
          name="password"
          labelClassName="block text-base/normal text-zinc-200 font-semibold"
          fullWidth
          className="block w-full rounded border-white/10 py-2.5 bg-transparent text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
          control={control}
        />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-x-1 gap-y-2">
          <div></div>

        </div>

        <div className="text-center text-sm justify-between ">
          <button
            type="submit"
            disabled={loading}
            className="group mt-5 inline-flex w-2/3 items-center justify-center rounded bg-primary px-6 py-2.5 text-white backdrop-blur-2xl transition-all hover:text-white"

          >
            {loading ? "Chargement..." : "Se connecter"}
            {loading && <LoaderCircle className="ml-2 animate-spin" />}
          </button>



          <p className="mt-4 text-center text-sm text-primary-light ">
            Déjà inscrit ?{' '}
            <Link to={'/inscription'} className="font-medium text-primary hover:text-primary-dark">
              {"S'inscrire"}
            </Link>
          </p>
        </div>
      </form>

      <br />

    </>
  );
};

export default SignIn;