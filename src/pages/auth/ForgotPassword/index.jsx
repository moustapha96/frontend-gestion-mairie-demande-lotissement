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

    data={...data,uri : window.location.origin}
    console.log(data)
    setLoading(true);
    try {
      const response = await fetch(urlApi + "password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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

export default ForgotPassword;
