import { LuLineChart, LuMail, LuMoveRight, LuPhone, LuSave } from "react-icons/lu";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { TextFormInput } from "@/components";

const Contact = () => {
  const contactFormSchema = yup.object({
    email: yup
      .string()
      .email("Veuillez entrer un email valide")
      .required("Veuillez entrer votre email"),
    name: yup.string().required("Veuillez entrer votre nom"),
    subject: yup.string().required("Veuillez entrer le sujet de votre message"),
    requirement: yup.string().required("Veuillez entrer vos besoins"),
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(contactFormSchema),
  });

  const onSubmit = (data) => {
    // Logique pour gérer l'envoi du formulaire
    console.log(data);
  };

  return (
    <section id="Contact" className="py-10 lg:py-20 bg-default-100 dark:bg-default-50 bg-no-repeat bg-cover bg-[url('../images/other/bg-lines-2.png')] dark:bg-[url('../images/other/bg-lines-2-dark.png')]">
      <div className="container">
        <div className="flex flex-wrap items-center justify-around gap-6">
          <div className="text-center">
            <div className="h-20 w-20 rounded-md border border-default-200 text-default-950 bg-white/5 mx-auto flex items-center justify-center">
              <LuPhone className="h-10 w-10" />
            </div>
            <h4 className="text-xl font-medium text-default-950 mt-5">Appelez-nous</h4>
            <p className="text-base text-default-800 mt-1">+0088 66956 66</p>
          </div>
          <div className="text-center">
            <div className="h-20 w-20 rounded-md border border-default-200 text-default-950 bg-white/5 mx-auto flex items-center justify-center">
              <LuMail className="h-10 w-10" />
            </div>
            <h4 className="text-xl font-medium text-default-950 mt-5">Envoyez-nous un email</h4>
            <p className="text-base text-default-800 mt-1">support@authenticpage.com</p>
          </div>
          <div className="text-center">
            <div className="h-20 w-20 rounded-md border border-default-200 text-default-950 bg-white/5 mx-auto flex items-center justify-center">
              <LuLineChart className="h-10 w-10" />
            </div>
            <h4 className="text-xl font-medium text-default-950 mt-5">Suivez-nous</h4>
            <p className="text-base text-default-800 mt-1">Facebook.com/AuthenticPage</p>
          </div>
          <div className="text-center">
            <div className="h-20 w-20 rounded-md border border-default-200 text-default-950 bg-white/5 mx-auto flex items-center justify-center">
              <LuSave className="h-10 w-10" />
            </div>
            <h4 className="text-xl font-medium text-default-950 mt-5">Découvrez notre travail</h4>
            <p className="text-base text-default-800 mt-1">authenticpage.com</p>
          </div>
        </div>

        <div className="grid xl:grid-cols-2 grid-cols-1 gap-6 items-center">
          <div>
            <h2 className="md:text-4xl text-3xl font-medium text-default-950">
              Nous vous aidons à sécuriser un avantage concurrentiel
            </h2>
            <p className="text-default-600 text-base font-medium my-5">
              Avec AuthenticPage, validez vos diplômes en toute simplicité et sécurité.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center justify-center h-10 px-4 bg-primary/20 text-primary rounded-md hover:bg-primary hover:text-white transition-all"
            >
              En savoir plus
              <LuMoveRight className="h-6 w-6 ml-2" />
            </Link>
          </div>
          <div className="p-8 rounded-lg">
            <div className="p-6 rounded-md bg-white dark:bg-default-100">
              <h3 className="text-2xl font-medium text-default-950">
                N'hésitez pas à nous contacter !
              </h3>
              <p className="text-base mt-3">
                Nous sommes là pour répondre à toutes vos questions concernant nos services.
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
                <TextFormInput
                  name="name"
                  label="Nom"
                  labelClassName="text-default-950"
                  className="h-12 rounded py-4 ps-4 text-default-950 dark:bg-default-50"
                  placeholder="Votre nom"
                  control={control}
                  fullWidth
                />
                <TextFormInput
                  name="email"
                  label="Email"
                  type="email"
                  labelClassName="text-default-950"
                  className="h-12 rounded py-4 ps-4 text-default-950 dark:bg-default-50"
                  placeholder="Votre email"
                  control={control}
                  fullWidth
                />
                <TextFormInput
                  name="subject"
                  label="Sujet"
                  labelClassName="text-default-950"
                  className="h12 rounded py=4 ps=4 text-default=950 dark:bg-default=50"
                  placeholder="Sujet de votre message"
                  control={control}
                  fullWidth
                />
                <TextFormInput
                  name="requirement"
                  label="Vos besoins"
                  labelClassName="text-default950"
                  placeholder="Dites-nous ce dont vous avez besoin"
                  control={control}
                  fullWidth
                />
                <button
                  type="submit"
                  className="px6 py2 text-lg rounded text-white bg-black hover:bg-gray-dark transition-all"
                >
                  Envoyer
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;