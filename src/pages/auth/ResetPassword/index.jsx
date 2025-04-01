import { PageMetaData, PasswordFormInput } from "@/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useContext } from "react";
import { AppContext } from "../../../AppContext";
import { toast } from "sonner";

import {Link, useNavigate, useLocation } from "react-router-dom";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";

const ResetPassword = () => {

  const navigate = useNavigate();
  const { urlApi } = useContext(AppContext);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  console.log(token)
  
  if (!token) {
    navigate("/auth/forgot-pass");
    return;
  }

  const [loading, setLoading] = useState(false);

  const resetFormSchema = yup.object({
    newPassword: yup.string().required("Veuillez entrer votre nouveau mot de passe"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Les mots de passe doivent correspondre"),
  });
  const { control, handleSubmit , reset } = useForm({
    resolver: yupResolver(resetFormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });


  const onSubmit = async (data) => {
    setLoading(true);
    if( !token ){
      toast.error("Token non trouvé");
      setLoading(false);
      return;
    }

    try {
      const datas = {
        password: data.newPassword,
        confirmPassword: data.confirmPassword,
        token: token
      }
      console.log(datas)
      const response = await fetch(urlApi + "password-reset/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datas)
      });
      const res = await response.json();
     
      if (res.code == "400") {
        console.log(res)
        toast.error(res.message, {
          position: "top-right",
          duration: 2000,
        })
        setLoading(false);
        return;
      }

      if (res.code == "200") {
        toast.success(res.message);
        reset();
        navigate("/auth/sign-in");
        setLoading(false);
        return;
      }
      if( res.code != "200" && res.code != "400" ) {
        toast.error(res.message);
      }
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  }
  return (
    <>
      <PageMetaData title="Reset Password" />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 shrink">
        <PasswordFormInput
          label="Nouveau mot de passe"
          containerClassName="mb-4"
          name="newPassword"
          labelClassName="block text-base/normal text-zinc-200 font-semibold"
          fullWidth
          className="block w-full rounded border-white/10 py-2.5 bg-transparent text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
          control={control}
        />
        <PasswordFormInput
          label="Confirmer le nouveau mot de passe"
          containerClassName="mb-4"
          name="confirmPassword"
          labelClassName="block text-base/normal text-zinc-200 font-semibold"
          fullWidth
          className="block w-full rounded border-white/10 py-2.5 bg-transparent text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
          control={control}
        />

        <div className="mb-6 flex flex-col text-center text-sm justify-between items-center gap-x-1 gap-y-2">
          <button
            type="submit"
            className="group mt-5 inline-flex w-2/3 items-center justify-center rounded bg-primary px-6 py-2.5 text-white backdrop-blur-2xl transition-all hover:text-white"
          >
            {loading ? "Chargement..." : "Réinitialiser le mot de passe"}
            {loading && <LoaderCircleIcon className="animate-spin" />}
          </button>
        </div>
      </form>
      {/* <ThirdPartyAuth /> */}
      <p className="shrink text-center text-zinc-200">
        <Link to="/auth/sign-in" className="ms-1 text-primary">
          <b>Connectez-vous</b>
        </Link>
      </p>
    </>
  );
};

export default ResetPassword;
