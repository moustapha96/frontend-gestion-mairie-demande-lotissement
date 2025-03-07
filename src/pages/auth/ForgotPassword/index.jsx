import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { PageMetaData, TextFormInput, ThirdPartyAuth } from "@/components";
import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../../AppContext";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";
const ForgotPassword = () => {
  const { urlApi } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const resetFormSchema = yup.object({
    email: yup.string().required("Please enter your email"),
  });
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(resetFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(urlApi + "rh/reset-password/" + data.email, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      console.log(res)
      if (res) {
        setLoading(false);
        toast.success(res.message);
        reset();
        navigate("/auth/sign-in");
        return;
      }
      if (!response.ok) {
        setLoading(false);
        toast.error(res.message);
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.log(error.message)
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <>
      <PageMetaData title="Forgot Password" />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 shrink">
        <TextFormInput
          containerClassName="mb-4"
          label="Email address"
          name="email"
          labelClassName="block text-base/normal text-zinc-200 font-semibold"
          className="block rounded border-white/10 bg-transparent py-2.5 text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
          placeholder="Enter your email"
          fullWidth
          control={control}
        />
        <div className="mb-6 flex flex-col justify-center gap-4">
          <button
            type="submit"
            className="relative inline-flex w-full items-center justify-center rounded bg-primary px-6 py-3 text-base capitalize text-white transition-all hover:bg-primary-700"
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

export default ForgotPassword;
