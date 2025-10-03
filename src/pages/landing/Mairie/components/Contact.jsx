import { LuLineChart, LuMail, LuMoveRight, LuPhone, LuSave } from "react-icons/lu";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { TextFormInput } from "@/components";
import { useState } from "react";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";
import { createContact } from "../../../../services/contactService";

const Contact = () => {
  const contactFormSchema = yup.object({
    email: yup
      .string()
      .email("Veuillez entrer un email valide")
      .required("Veuillez entrer votre email"),
    name: yup.string().required("Veuillez entrer votre nom"),
    subject: yup.string().required("Veuillez entrer le sujet de votre message"),
    object: yup.string().required("Veuillez entrer vos besoins"),
  });

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(contactFormSchema),
  });

  const onSubmit = async (data) => {
    console.log(data);
    setLoading(true);

    const res = await createContact(data);

    console.log(res)
    if (res.ok) {
      toast.success("Message envoyé avec succés!");
      setLoading(false);
      reset();
    } else {
      setLoading(false);
      toast.error("Une erreur s'est produite!");
    }
  };

  const [loading, setLoading] = useState(false)

  return (
    <section
      id="Contact"
      className="py-16 lg:py-24 bg-default-100 dark:bg-default-50 bg-no-repeat bg-cover bg-[url('../images/other/bg-lines-2.png')] dark:bg-[url('../images/other/bg-lines-2-dark.png')]"
    >
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section de contact rapide */}
        <div className="flex flex-wrap justify-around gap-8 mb-12">
          {[
            { icon: LuPhone, title: "Appelez-nous", details: "33 941 12 56 / 33 941 15 35" },
            { icon: LuMail, title: "Envoyez-nous un email", details: "support@kaolackcommune.sn" },
            { icon: LuLineChart, title: "Suivez-nous", details: "Facebook.com/kaolackcommune" },
            { icon: LuSave, title: "Découvrez notre travail", details: "kaolackcommune.sn" },
          ].map((contact, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center p-6 bg-white dark:bg-default-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <contact.icon className="h-10 w-10 text-primary-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-200">{contact.title}</h4>
              <p className="text-base text-gray-600 dark:text-gray-400 mt-2">{contact.details}</p>
            </div>
          ))}
        </div>

        {/* Section de formulaire */}
        <div className="grid xl:grid-cols-2 grid-cols-1 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Nous vous aidons à sécuriser un avantage concurrentiel
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-6">
              Avec AuthenticPage, validez vos diplômes en toute simplicité et sécurité.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center justify-center mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-rougeLogo transition-colors"
            >
              En savoir plus
              <LuMoveRight className="h-6 w-6 ml-2" />
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              N'hésitez pas à nous contacter !
            </h3>
            <p className="text-base text-gray-600 dark:text-gray-300 mt-4">
              Nous sommes là pour répondre à toutes vos questions concernant nos services.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
              <TextFormInput
                name="name"
                label="Nom"
                labelClassName="text-gray-900 dark:text-white"
                className="h-12 rounded-md py-4 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Votre nom"
                control={control}
                fullWidth
              />
              <TextFormInput
                name="email"
                label="Email"
                type="email"
                labelClassName="text-gray-900 dark:text-white"
                className="h-12 rounded-md py-4 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Votre email"
                control={control}
                fullWidth
              />
              <TextFormInput
                name="subject"
                label="Sujet"
                labelClassName="text-gray-900 dark:text-white"
                className="h-12 rounded-md py-4 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Sujet de votre message"
                control={control}
                fullWidth
              />
              <TextFormInput
                name="object"
                label="Vos besoins"
                labelClassName="text-gray-900 dark:text-white"
                className="h-24 rounded-md py-4 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Dites-nous ce dont vous avez besoin"
                control={control}
                fullWidth
                multiline
              />


              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary focus:outline-none  ${loading ? "cursor-not-allowed" : "cursor-pointer hover:bg-rougeLogo"}  `}
              >
                {!loading ? "Envoyer" : "Enregistrement..."}
                {loading && <LoaderCircleIcon className="animate-spin" />}

              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

