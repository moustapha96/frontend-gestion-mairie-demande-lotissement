import { Suspense } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo_200X200.png";
const AuthLayout = ({ children }) => {
  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat p-2 lg:p-0"
      style={{ backgroundColor: `white` }}
    >
      <div className="absolute inset-0 bg-black/1" />
      <div className="flex  h-screen w-full items-center justify-center">
        <div className="max-w-4xl overflow-hidden rounded-lg bg-black/60  backdrop-blur-3xl">
          <div className="grid lg:grid-cols-3">
            <div className="col-span-1  hidden py-2.5 ps-2.5 lg:block">
              <div className="relative h-full overflow-hidden rounded-md">
                <div className="absolute inset-0 bg-black/40" />
                <img
                  src={logo}
                  className="object-contain h-full w-full"
                  alt="Logo Gestion de la mairie"
                />
              </div>
            </div>


            <div className="col-span-2" >
              <div className=" p-6 flex h-full flex-col justify-center">
                <div className=" flex justify-between">
                  <span></span>

                  <Link to="/" className="mb-8 block shrink">
                    <span className=" text-primary font-bold text-2xl   hover:text-primary-light" >Accueil</span>
                  </Link>

                  <span></span>

                </div>

                <Suspense fallback={<div />}>{children}</Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
