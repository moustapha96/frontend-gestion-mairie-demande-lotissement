import { PageMetaData, PasswordFormInput, ThirdPartyAuth } from "@/components";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const ResetPassword = () => {
  const resetFormSchema = yup.object({
    newPassword: yup.string().required("Please enter your new password"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Passwords must match"),
  });
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(resetFormSchema),
    defaultValues: {
      newPassword: "password",
      confirmPassword: "password",
    },
  });
  return (
    <>
      <PageMetaData title="Reset Password" />

      <form onSubmit={handleSubmit(() => {})} className="mt-10 shrink">
        <PasswordFormInput
          label="New Password"
          containerClassName="mb-4"
          name="newPassword"
          labelClassName="block text-base/normal text-zinc-200 font-semibold"
          fullWidth
          className="block w-full rounded border-white/10 py-2.5 bg-transparent text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
          control={control}
        />
        <PasswordFormInput
          label="Confirm New Password"
          containerClassName="mb-4"
          name="confirmPassword"
          labelClassName="block text-base/normal text-zinc-200 font-semibold"
          fullWidth
          className="block w-full rounded border-white/10 py-2.5 bg-transparent text-white/80 focus:border-white/25 focus:outline-0 focus:ring-0"
          control={control}
        />

        <div className="mb-6 flex flex-col justify-center gap-4">
          <button
            type="submit"
            className="relative inline-flex w-full items-center justify-center rounded bg-primary px-6 py-3 text-base capitalize text-white transition-all hover:bg-primary-700"
          >
            Reset Password
          </button>
        </div>
      </form>
      <ThirdPartyAuth />
      <p className="shrink text-center text-zinc-200">
        Back To ?
        <Link to="/auth/sign-in" className="ms-1 text-primary">
          <b>Login</b>
        </Link>
      </p>
    </>
  );
};

export default ResetPassword;
