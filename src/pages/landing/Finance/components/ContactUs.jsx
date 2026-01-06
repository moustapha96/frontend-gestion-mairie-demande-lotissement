/* eslint-disable react/prop-types */
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LuSend, LuPaperclip } from "react-icons/lu";
import { TextAreaFormInput, TextFormInput } from "@/components";
import { HttpClient } from "@/helpers";
import { toast } from "sonner";

/** ===== Validation (Sénégal) =====
 * Téléphone : +221 77/76/70/78/75/72/33 + 7 chiffres (tolère espaces)
 */
const telSnRegex =
  /^(?:\+221\s?)?(?:(?:7[05678]|75|72|77|76|78|70|33)\s?\d{3}\s?\d{2}\s?\d{2}|\d{9})$/;

const contactFormSchema = yup.object({
  nom: yup.string().required("Veuillez renseigner votre nom"),
  email: yup
    .string()
    .email("Veuillez saisir un email valide")
    .required("Veuillez renseigner votre email"),
  telephone: yup
    .string()
    .matches(telSnRegex, "Numéro SN invalide (ex: +221 77 123 45 67)")
    .required("Veuillez renseigner votre numéro de téléphone"),
  categorie: yup
    .string()
    .oneOf(
      [
        "DEMANDE_PARCELLE",
        "SUIVI_DOSSIER",
        "LITIGE_FONCIER",
        "PAIEMENT",
        "ATTESTATION_QUITUS",
        "CORRECTION_DONNEES",
        "AUTRE",
      ],
      "Sélection invalide"
    )
    .required("Veuillez choisir une catégorie"),
  reference: yup
    .string()
    .trim()
    .max(40, "40 caractères max")
    .optional(),
  message: yup
    .string()
    .required("Veuillez décrire clairement votre demande"),
  consent: yup
    .boolean()
    .oneOf([true], "Vous devez accepter le traitement de vos données"),
  // pièce jointe optionnelle
  pieceJointe: yup
    .mixed()
    .test("fileSize", "Fichier trop volumineux (max 5 Mo)", (file) => {
      if (!file) return true;
      return file.size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Format autorisé: PDF/JPG/PNG", (file) => {
      if (!file) return true;
      return ["application/pdf", "image/jpeg", "image/png"].includes(file.type);
    })
    .optional(),
});

const urlApi = import.meta.env.VITE_API_URL

export default function ContactUs() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const { control, handleSubmit, register, reset, setValue, watch } = useForm({
    resolver: yupResolver(contactFormSchema),
    defaultValues: {
      nom: "",
      email: "",
      telephone: "",
      categorie: "",
      reference: "",
      message: "",
      consent: false,
      pieceJointe: undefined,
    },
  });

  const pieceJointe = watch("pieceJointe");

  const onSubmit = async (values) => {
    setLoading(true);
    setServerError("");

    try {
      // Prépare le payload : multipart si pièce jointe, sinon JSON
      if (values.pieceJointe) {
        const fd = new FormData();
        fd.append("nom", values.nom);
        fd.append("email", values.email);
        fd.append("telephone", values.telephone);
        fd.append("categorie", values.categorie);
        if (values.reference) fd.append("reference", values.reference);
        fd.append("message", values.message);
        fd.append("consent", String(values.consent));
        fd.append("pieceJointe", values.pieceJointe);

        try {
          const res = await HttpClient.post(`${urlApi}contact`, fd,
            { headers: { "Content-Type": "multipart/form-data" } });
        } catch (e) {
          console.log(e);
          setServerError(
            "Impossible d'envoyer votre message pour le moment. Réessayez plus tard."
          );
        }
      } else {

        try {
          const res = await HttpClient.post(`${urlApi}contact`,
            {
              nom: values.nom,
              email: values.email,
              telephone: values.telephone,
              categorie: values.categorie,
              reference: values.reference || null,
              message: values.message,
              consent: values.consent,
            },
            { headers: { "Content-Type": "application/json" } });
        } catch (e) {
          console.log(e);
          setServerError(
            "Impossible d'envoyer votre message pour le moment. Réessayez plus tard."
          );
        }

      }

      // success UX
      reset();
      toast.success("Votre message a été envoyé. Nous reviendrons vers vous rapidement.");
    } catch (e) {
      setServerError(
        "Impossible d'envoyer votre message pour le moment. Réessayez plus tard."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-10 lg:py-20">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="py-1 px-3 rounded-md text-xs font-semibold uppercase tracking-wider border border-primary bg-primary/20 text-primary">
            Contact • Service du Domaine – Kaolack
          </span>
          <h2 className="text-4xl/tight font-bold text-default-950 mt-4">
            Un besoin sur votre dossier foncier ?
          </h2>
          <p className="text-lg mt-5 text-default-700">
            Déposez votre question
          </p>
        </div>

        <div className="max-w-3xl mx-auto mt-16">
          <div className="p-8 rounded-md bg-default-50 border border-default-200">
            <form onSubmit={handleSubmit(onSubmit)} className="relative">
              <h3 className="text-2xl font-semibold text-default-950 mb-6">
                Formulaire de contact
              </h3>

              {serverError ? (
                <div className="mb-5 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {serverError}
                </div>
              ) : null}

              <div className="grid sm:grid-cols-2 gap-6">
                <TextFormInput
                  name="nom"
                  label="Nom & Prénom(s)"
                  labelClassName="text-default-500"
                  className="bg-default-50 px-3 text-sm"
                  placeholder="Ex: Ndiaye Fatou"
                  fullWidth
                  control={control}
                />
                <TextFormInput
                  name="email"
                  label="Email"
                  type="email"
                  labelClassName="text-default-500"
                  className="bg-default-50 px-3 text-sm"
                  placeholder="Ex: fatou.ndiaye@mail.com"
                  fullWidth
                  control={control}
                />

                <TextFormInput
                  name="telephone"
                  label="Téléphone (+221)"
                  labelClassName="text-default-500"
                  className="bg-default-50 px-3 text-sm"
                  placeholder="Ex: +221 77 123 45 67"
                  fullWidth
                  control={control}
                />

                {/* Catégorie (select natif) */}
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm text-default-500">
                    Catégorie
                  </label>
                  <select
                    {...register("categorie")}
                    className="w-full rounded-md border border-default-200 bg-default-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Choisir une catégorie…
                    </option>
                    <option value="DEMANDE_PARCELLE">Demande de parcelle</option>
                    <option value="SUIVI_DOSSIER">Suivi de dossier</option>
                    <option value="LITIGE_FONCIER">Signalement de litige</option>
                    <option value="PAIEMENT">Paiement / reçu</option>
                    <option value="ATTESTATION_QUITUS">Attestation / Quitus</option>
                    <option value="CORRECTION_DONNEES">Correction de données</option>
                    <option value="AUTRE">Autre</option>
                  </select>
                </div>

                {/* Référence dossier (optionnelle) */}
                <TextFormInput
                  name="reference"
                  label="Référence dossier (optionnel)"
                  labelClassName="text-default-500"
                  className="bg-default-50 px-3 text-sm"
                  placeholder="Ex: KLK-2025-00421"
                  fullWidth
                  control={control}
                />

                {/* Message */}
                <div className="sm:col-span-2">
                  <TextAreaFormInput
                    name="message"
                    label="Message"
                    labelClassName="text-default-500"
                    className="bg-default-50 px-3 text-sm"
                    rows={5}
                    placeholder="Décrivez votre demande le plus précisément possible…"
                    containerClassName="mb-3"
                    control={control}
                    fullWidth
                  />
                </div>

                {/* Pièce jointe (optionnelle) */}
                {/* <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm text-default-500">
                    Pièce jointe (PDF/JPG/PNG – max 5 Mo)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-default-200 bg-white px-3 py-2 text-sm shadow hover:bg-default-50">
                      <LuPaperclip className="h-4 w-4" />
                      Joindre un fichier
                      <input
                        type="file"
                        accept="application/pdf,image/jpeg,image/png"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          setValue("pieceJointe", f, { shouldValidate: true });
                        }}
                      />
                    </label>
                    {pieceJointe ? (
                      <span className="text-xs text-default-600">
                        {pieceJointe.name} ({Math.round(pieceJointe.size / 1024)} Ko)
                      </span>
                    ) : (
                      <span className="text-xs text-default-500">Aucun fichier</span>
                    )}
                  </div>
                </div> */}

                {/* Consentement RGPD-like */}
                <div className="sm:col-span-2">
                  <label className="inline-flex items-start gap-2 text-sm text-default-700">
                    <input
                      type="checkbox"
                      className="mt-1"
                      {...register("consent")}
                    />
                    <span>
                      J’accepte que mes données soient utilisées pour traiter ma demande
                      conformément aux règles en vigueur de la Commune de Kaolack.
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 inline-flex items-center rounded-md bg-primary/90 px-5 py-2.5 text-white transition-all hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70"
                aria-label="Envoyer le message"
              >
                {loading ? "Envoi…" : "Envoyer le message"}
                <LuSend className="ms-2 h-5 w-5 rotate-45" />
              </button>
            </form>

            {/* Coordonnées utiles */}
            <div className="mt-8 text-sm text-default-600">
              <p>
                <strong>Service du Domaine & Urbanisme – Commune de Kaolack</strong>
              </p>
              <p>Accueil guichet unique : Lundi–Vendredi, 08h–16h30</p>
              <p>Email: domaine@kaolack.sn • Tél: +221 33 9XX XX XX</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
