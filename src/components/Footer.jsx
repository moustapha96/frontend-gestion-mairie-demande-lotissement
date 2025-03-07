

import { footerLinks } from "@/assets/data"; // Assurez-vous que ces données sont correctement définies
import { yupResolver } from "@hookform/resolvers/yup";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as yup from "yup";

import { TextFormInput } from "@/components";

import logo from "@/assets/logo_200X200.png";

const Footer = () => {
  const subscribeFormSchema = yup.object({
    email: yup
      .string()
      .email("Veuillez entrer un email valide")
      .required("Veuillez entrer votre email"),
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(subscribeFormSchema),
  });

  const onSubmit = (data) => {
    console.log(data); // Logique pour gérer l'envoi du formulaire
  };

  return (
    <footer>
      <div className="border-y border-default-200">
        <div className="container py-20">
          <div className="grid xl:grid-cols-5 md:grid-cols-3 gap-10 lg:gap-16">
            <div className="xl:col-span-2 md:col-span-3">
              <div>
                <Link to="/">
                  <img
                    src={logo}
                    alt="AuthenticPage Logo"
                    className="h-16 flex dark:hidden"
                  />
                  <img
                    src={logo}
                    alt="Logo Gestions de la mairie"
                    className="h-16 hidden dark:flex"
                  />
                </Link>
                {/* <p className="text-base text-default-800 mt-6">
                  Mairie de Kaolack
                </p> */}

              </div>
            </div>
            {/* {footerLinks.map((item, idx) => (
              <div key={idx}>
                <ul className="flex flex-col gap-3">
                  <h5 className="xl:text-xl lg:text-lg font-medium text-default-800 mb-2">
                    {item.title}
                  </h5>
                  {item.items.map((linkItem, linkIdx) => {
                    const Icon = linkItem.icon;
                    return (
                      <Fragment key={linkIdx}>
                        {Icon ? (
                          <li className="flex items-center gap-5 group">

                            <Link
                              to={`${linkItem.link ? linkItem.link : ""}`}
                              className="h-10 w-10 inline-flex items-center justify-center border border-default-300 text-default-800 rounded-lg transition-all duration-700 group-hover:bg-primary group-hover:text-white group-hover:border-primary"
                            >
                              <Icon className="h-5 w-5" />
                            </Link>
                            <h5 className="text-base font-medium text-default-800">
                              {linkItem.name}
                            </h5>
                          </li>
                        ) : (
                          <li>
                            {linkItem.page ? (

                              <a href={`${linkItem.link}`} className="text-base text-default-700 hover:text-default-950 transition-all">
                                {linkItem.name}

                              </a>
                            ) : (

                              <a href={`/#${linkItem.link}`} className="text-base text-default-700 hover:text-default-950 transition-all">
                                {linkItem.name}

                              </a>
                            )}
                          </li>
                        )}
                      </Fragment>
                    );
                  })}
                </ul>
              </div>
            ))} */}
          </div>
        </div>
      </div>
      <div className="py-4">
        <div className="container flex h-full flex-wrap items-center justify-center text-center md:justify-between md:text-start">
          <p className="text-base text-default-900">
            {new Date().getFullYear()} ©
            <Link
              className="text-primary"
              to=""
              target="_blank"
            >
              La Mairie
            </Link>
          </p>
          <p className="text-base">
            <Link to="/terms">Conditions d'utilisation &amp; Politique</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;