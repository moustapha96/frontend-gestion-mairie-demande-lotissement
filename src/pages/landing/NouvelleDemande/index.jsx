
'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import dayjs from "dayjs";
import { PageMetaData, TopNavBar } from '@/components'
import ResponsiveAuthLayout from '../../../layouts/ResponsiveAuthLayout'
import { toast } from "sonner"
import { LoaderCircleIcon } from 'lucide-react'
import { nouvelleDemande } from '@/services/demandeService'
import { getLocalitesWeb } from '@/services/localiteService'
import { formatPhoneNumber, formatPrice } from '@/utils/formatters'
import { menuItems } from '@/assets/data'

/** Options métier (alignées sur ta page de référence) */
const TYPE_DEMANDE_OPTIONS = [
  { label: "Attribution", value: "Attribution" },
  { label: "Régularisation", value: "Régularisation" },
  { label: "Authentification", value: "Authentification" },
];

const TYPE_DOCUMENT_OPTIONS = [
  { label: "CNI", value: "CNI" },
  { label: "Passeport", value: "PASSEPORT" },
  { label: "Carte Consulaire", value: "CARTE_CONSULAIRE" },
];

const TYPE_TITRE_OPTIONS = [
  { label: "Permis d'occuper", value: "Permis d'occuper" },
  { label: "Bail communal", value: "Bail communal" },
  { label: "Proposition de bail", value: "Proposition de bail" },
  { label: "Transfert définitif", value: "Transfert définitif" },
];

const SITUATION_OPTIONS = [
  { value: "Célibataire", label: "Célibataire" },
  { value: "Marié(e)", label: "Marié(e)" },
  { value: "Veuf(ve)", label: "Veuf(ve)" },
  { value: "Divorcé(e)", label: "Divorcé(e)" },
];

const STATUT_LOGEMENT_OPTIONS = [
  { value: "Propriétaire", label: "Propriétaire" },
  { value: "Locataire", label: "Locataire" },
  { value: "Hébergé(e)", label: "Hébergé(e)" },
];

/* ========================= Validation ========================= */
const applicantSchema = yup.object({
  /* Step 0 */
  prenom: yup.string().required("Veuillez entrer votre prénom"),
  nom: yup.string().required("Veuillez entrer votre nom"),
  email: yup.string().email("Veuillez entrer un email valide").required("L'email est requis"),
  telephone: yup
    .string()
    .matches(/^(70|75|76|77|78|79)[0-9]{7}$/, "Doit commencer par 70/75/76/77/78/79 + 7 chiffres")
    .required("Le numéro de téléphone est requis"),
  adresse: yup.string().required("L'adresse est requise"),
  profession: yup.string().required("La profession est requise"),
  lieuNaissance: yup.string().required("Le lieu de naissance est requis"),
  dateNaissance: yup
    .date()
    .required("La date de naissance est requise")
    .max(dayjs().subtract(18, "year").toDate(), "Vous devez avoir au moins 18 ans")
    .test("age", "Vous devez avoir au moins 18 ans", (value) => !!value && dayjs().diff(dayjs(value), "year") >= 18),

  situationMatrimoniale: yup.string()
    .oneOf(SITUATION_OPTIONS.map(o => o.value))
    .required("Veuillez sélectionner la situation matrimoniale"),

  statutLogement: yup.string()
    .oneOf(STATUT_LOGEMENT_OPTIONS.map(o => o.value))
    .required("Veuillez sélectionner le statut du logement"),

  nombreEnfant: yup.number()
    .typeError("Nombre d'enfants invalide")
    .min(0, "Doit être ≥ 0")
    .required("Le nombre d'enfants est requis"),

  /* Step 1 */
  typeDemande: yup.string().oneOf(TYPE_DEMANDE_OPTIONS.map(o => o.value)).required("Le type de demande est requis"),
  localiteId: yup.number().typeError("Sélectionnez une localité").required("La localité est requise"),
  usagePrevu: yup.string().required("L'usage prévu est requis"),
  superficie: yup.number().typeError("Entrez une superficie valide").required("La superficie est requise").min(1, "≥ 1"),
  typeTitre: yup.string().oneOf(TYPE_TITRE_OPTIONS.map(o => o.value)).nullable().optional(),

  /* Step 2 */
  typeDocument: yup.string().oneOf(TYPE_DOCUMENT_OPTIONS.map(o => o.value)).required("Le type de document est requis"),
  numeroElecteur: yup
    .string()
    .transform((v) => (v || '').replace(/\s/g, ''))
    .required("Le Numéro d'Identification National est requis")
    .matches(/^[a-zA-Z0-9]{13,15}$/, "Le numéro doit contenir 13 à 15 caractères"),
  recto: yup.mixed().test("fileRequired", "Le recto du document est requis", (v) => v && v.length === 1),
  verso: yup.mixed().test("fileRequired", "Le verso du document est requis", (v) => v && v.length === 1),

  /* Booléens */
  possedeAutreTerrain: yup.boolean().default(false),
  terrainAKaolack: yup.boolean().default(false),
  terrainAilleurs: yup.boolean().default(false),
});

/* ========================= UI Helpers ========================= */
const Stepper = ({ steps, currentStep }) => (
  <div className="mb-8">
    <div className="flex justify-between">
      {steps.map((step, index) => (
        <div key={index} className="flex-1">
          <div className="relative flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
              ${index <= currentStep ? 'border-primary bg-primary text-white' : 'border-gray-300 bg-white text-gray-500'}`}>
              {index + 1}
            </div>
            <div className="absolute -bottom-6 w-32 text-center text-sm font-medium text-gray-500">
              {step}
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${index < currentStep ? 'bg-primary' : 'bg-gray-300'}`} />
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const safe = (v) => (v === null || v === undefined || v === "" ? "—" : v);
const fmtDateTime = (v) => (v ? dayjs(String(v).replace(" ", "T")).format("DD/MM/YYYY HH:mm") : "—");

/* ========================= Normalisation réponse ========================= */
const normalizeDemandeInfo = (res) => {
  if (!res) return null;

  const d = res.demande || {};
  const localiteObj = res.quartier || d.quartier || null;

  // URLs absolues prioritaires
  const rectoAbs =
    res.rectoUrl ||
    (d.recto?.startsWith("http") ? d.recto : d.recto ? `${window.location.origin}${d.recto}` : null);

  const versoAbs =
    res.versoUrl ||
    (d.verso?.startsWith("http") ? d.verso : d.verso ? `${window.location.origin}${d.verso}` : null);

  // “demandeur” : prendre res.user si présent
  const u = res.user || {};
  const demandeur = Object.keys(u).length
    ? {
        prenom: u.prenom ?? null,
        nom: u.nom ?? null,
        email: u.email ?? null,
        telephone: u.telephone ?? null,
        adresse: u.adresse ?? null,
        profession: u.profession ?? null,
        numeroElecteur: u.numeroElecteur ?? null,
        dateNaissance: u.dateNaissance ?? null,
        lieuNaissance: u.lieuNaissance ?? null,
        situationMatrimoniale: u.situationMatrimoniale ?? null,
        statutLogement: u.situationDemandeur ?? null, // mapping backend
        nombreEnfant: u.nombreEnfant ?? null,
        enabled: u.enabled,
        roles: u.roles || [],
      }
    : {
        prenom: d.prenom ?? null,
        nom: d.nom ?? null,
        email: d.email ?? null,
        telephone: d.telephone ?? null,
        adresse: d.adresse ?? null,
        profession: d.profession ?? null,
        numeroElecteur: d.numeroElecteur ?? null,
        dateNaissance: d.dateNaissance ?? null,
        lieuNaissance: d.lieuNaissance ?? null,
        situationMatrimoniale: d.situationMatrimoniale ?? null,
        statutLogement: d.statutLogement ?? null,
        nombreEnfant: d.nombreEnfant ?? null,
      };

  return {
    userExist: !!res.userExist,
    demande: {
      id: d.id,
      numero: d.numero ?? null, // ex: DP202510161429
      typeDemande: d.typeDemande,
      typeTitre: d.typeTitre,
      typeDocument: d.typeDocument,
      superficie: d.superficie,
      usagePrevu: d.usagePrevu,
      possedeAutreTerrain: !!d.possedeAutreTerrain,
      terrainAKaolack: !!d.terrainAKaolack,
      terrainAilleurs: !!d.terrainAilleurs,
      statut: d.statut,
      dateCreation: d.dateCreation,
      recto: rectoAbs,
      verso: versoAbs,
      localite: d.localite || localiteObj?.nom || null,
    },
    localite: localiteObj
      ? {
          id: localiteObj.id,
          nom: localiteObj.nom,
          prix: localiteObj.prix ?? 0,
          description: localiteObj.description ?? null,
          latitude: localiteObj.latitude ?? null,
          longitude: localiteObj.longitude ?? null,
        }
      : null,
    demandeur,
  };
};

/* ========================= Page ========================= */
export default function NouvelleDemandePage() {
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [localites, setLocalites] = useState([])
  const [demandeInfo, setDemandeInfo] = useState(null)

  const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm({
    resolver: yupResolver(applicantSchema),
    defaultValues: {
      possedeAutreTerrain: false,
      terrainAKaolack: false,
      terrainAilleurs: false,
      typeDocument: "CNI",
    }
  })

  const [currentStep, setCurrentStep] = useState(0)
  const steps = ['Informations Personnelles', 'Détails de la Demande', 'Documents & Validation']

  const nextStep = () => {
    const currentFields = getCurrentStepFields()
    const hasErrors = currentFields.some(field => !!errors[field])
    if (!hasErrors) setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    else toast.error("Veuillez remplir tous les champs obligatoires")
  }
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

  const getCurrentStepFields = () => {
    switch (currentStep) {
      case 0: return ['prenom', 'nom', 'email', 'telephone', 'adresse', 'profession', 'lieuNaissance', 'dateNaissance', 'situationMatrimoniale', 'statutLogement', 'nombreEnfant']
      case 1: return ['typeDemande', 'localiteId', 'usagePrevu', 'superficie', 'typeTitre']
      case 2: return ['typeDocument', 'numeroElecteur', 'recto', 'verso']
      default: return []
    }
  }

  useEffect(() => {
    const fetchLocalite = async () => {
      try {
        const resp = await getLocalitesWeb()
        setLocalites(resp || [])
      } catch (error) {
        console.error(error)
        toast.error("Erreur lors du chargement des localités")
      }
    }
    fetchLocalite()
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const formData = new FormData()
      // Demandeur
      formData.append('prenom', data.prenom)
      formData.append('nom', data.nom)
      formData.append('email', data.email)
      formData.append('telephone', data.telephone)
      formData.append('profession', data.profession)
      formData.append('lieuNaissance', data.lieuNaissance)
      formData.append('adresse', data.adresse)
      formData.append('dateNaissance', dayjs(data.dateNaissance).format('YYYY-MM-DD'))
      formData.append('numeroElecteur', (data.numeroElecteur || '').replace(/\s/g, ''))

      formData.append('situationMatrimoniale', data.situationMatrimoniale ?? '')
      formData.append('situationDemandeur', data.statutLogement ?? '') // mapping
      formData.append('nombreEnfant', String(data.nombreEnfant ?? 0))

      // Demande
      formData.append('possedeAutreTerrain', String(!!data.possedeAutreTerrain))
      formData.append('terrainAKaolack', String(!!data.terrainAKaolack))
      formData.append('terrainAilleurs', String(!!data.terrainAilleurs))
      formData.append('typeDocument', data.typeDocument)
      formData.append('typeDemande', data.typeDemande)
      formData.append('typeTitre', data.typeTitre || '')
      formData.append('usagePrevu', data.usagePrevu)
      formData.append('superficie', String(data.superficie))
      formData.append('localiteId', String(data.localiteId))

      // Fichiers
      formData.append('recto', data.recto[0])
      formData.append('verso', data.verso[0])

      const response = await nouvelleDemande(formData) // service doit POST multipart/form-data
      const normalized = normalizeDemandeInfo(response)
      console.log(normalized)
      setDemandeInfo(normalized)
      setSubmitStatus('success')
      toast.success('Demande envoyée avec succès')
      reset()
      setCurrentStep(0)
    } catch (error) {
      console.error(error)
      setSubmitStatus('error')
      setErrorMessage(error?.message || "Erreur lors de l’envoi")
      toast.error(error?.message || "Erreur lors de l’envoi")
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Prénom</label>
                <input id="prenom" {...register('prenom')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                {errors.prenom && <p className="mt-2 text-sm text-red-600">{errors.prenom.message}</p>}
              </div>
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom</label>
                <input id="nom" {...register('nom')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                {errors.nom && <p className="mt-2 text-sm text-red-600">{errors.nom.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input id="email" type="email" {...register('email')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input id="telephone" {...register('telephone')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                {errors.telephone && <p className="mt-2 text-sm text-red-600">{errors.telephone.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">Adresse</label>
              <input id="adresse" {...register('adresse')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              {errors.adresse && <p className="mt-2 text-sm text-red-600">{errors.adresse.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="profession" className="block text-sm font-medium text-gray-700">Profession</label>
                <input id="profession" {...register('profession')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                {errors.profession && <p className="mt-2 text-sm text-red-600">{errors.profession.message}</p>}
              </div>
              <div>
                <label htmlFor="lieuNaissance" className="block text-sm font-medium text-gray-700">Lieu de naissance</label>
                <input id="lieuNaissance" {...register('lieuNaissance')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                {errors.lieuNaissance && <p className="mt-2 text-sm text-red-600">{errors.lieuNaissance.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700">Date de naissance</label>
              <input id="dateNaissance" type="date" {...register('dateNaissance')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              {errors.dateNaissance && <p className="mt-2 text-sm text-red-600">{errors.dateNaissance.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="situationMatrimoniale" className="block text-sm font-medium text-gray-700">
                  Situation matrimoniale
                </label>
                <select
                  id="situationMatrimoniale"
                  {...register('situationMatrimoniale')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="">Sélectionner</option>
                  {SITUATION_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {errors.situationMatrimoniale && (
                  <p className="mt-2 text-sm text-red-600">{errors.situationMatrimoniale.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="statutLogement" className="block text-sm font-medium text-gray-700">
                  Statut logement
                </label>
                <select
                  id="statutLogement"
                  {...register('statutLogement')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="">Sélectionner</option>
                  {STATUT_LOGEMENT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {errors.statutLogement && (
                  <p className="mt-2 text-sm text-red-600">{errors.statutLogement.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombreEnfant" className="block text-sm font-medium text-gray-700">
                  Nombre d'enfants
                </label>
                <input
                  id="nombreEnfant"
                  type="number"
                  min={0}
                  {...register('nombreEnfant')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="0"
                />
                {errors.nombreEnfant && (
                  <p className="mt-2 text-sm text-red-600">{errors.nombreEnfant.message}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="typeDemande" className="block text-sm font-medium text-gray-700">Type de demande</label>
                <select id="typeDemande" {...register('typeDemande')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                  <option value="">Sélectionnez le type</option>
                  {TYPE_DEMANDE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                {errors.typeDemande && <p className="mt-2 text-sm text-red-600">{errors.typeDemande.message}</p>}
              </div>

              <div>
                <label htmlFor="localiteId" className="block text-sm font-medium text-gray-700">Localité</label>
                <select id="localiteId" {...register('localiteId')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                  <option value="">Sélectionnez la localité</option>
                  {localites.map((l) => (
                    <option key={l.id} value={l.id}>{l.nom}</option>
                  ))}
                </select>
                {errors.localiteId && <p className="mt-2 text-sm text-red-600">{errors.localiteId.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="usagePrevu" className="block text-sm font-medium text-gray-700">Usage prévu</label>
              <textarea id="usagePrevu" rows={3} {...register('usagePrevu')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
              {errors.usagePrevu && <p className="mt-2 text-sm text-red-600">{errors.usagePrevu.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="superficie" className="block text-sm font-medium text-gray-700">Superficie (m²)</label>
                <input id="superficie" type="number" step="0.01" {...register('superficie')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                {errors.superficie && <p className="mt-2 text-sm text-red-600">{errors.superficie.message}</p>}
              </div>
              <div>
                <label htmlFor="typeTitre" className="block text-sm font-medium text-gray-700">Type de titre (facultatif)</label>
                <select id="typeTitre" {...register('typeTitre')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                  <option value="">—</option>
                  {TYPE_TITRE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="inline-flex items-center gap-2">
                <input id="possedeAutreTerrain" type="checkbox" {...register('possedeAutreTerrain')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                <span className="text-sm text-gray-700">Possède un autre terrain</span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input id="terrainAKaolack" type="checkbox" {...register('terrainAKaolack')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                <span className="text-sm text-gray-700">Terrain à Kaolack</span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input id="terrainAilleurs" type="checkbox" {...register('terrainAilleurs')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                <span className="text-sm text-gray-700">Terrain ailleurs</span>
              </label>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="typeDocument" className="block text-sm font-medium text-gray-700">Type de document</label>
              <select id="typeDocument" {...register('typeDocument')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                {TYPE_DOCUMENT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {errors.typeDocument && <p className="mt-2 text-sm text-red-600">{errors.typeDocument.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="recto" className="block text-sm font-medium text-gray-700">Recto du document</label>
                <input id="recto" type="file" accept=".pdf,.jpg,.jpeg,.png" {...register('recto')}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary hover:file:bg-primary-100" />
                {errors.recto && <p className="mt-2 text-sm text-red-600">{errors.recto.message}</p>}
              </div>
              <div>
                <label htmlFor="verso" className="block text-sm font-medium text-gray-700">Verso du document</label>
                <input id="verso" type="file" accept=".pdf,.jpg,.jpeg,.png" {...register('verso')}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary hover:file:bg-primary-100" />
                {errors.verso && <p className="mt-2 text-sm text-red-600">{errors.verso.message}</p>}
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">Formats acceptés: PDF, JPG, JPEG, PNG</p>

            <div>
              <label htmlFor="numeroElecteur" className="block text-sm font-medium text-gray-700">Numéro d'Identification National (NIN)</label>
              <input
                id="numeroElecteur"
                type="text"
                maxLength={15}
                pattern="^[A-Za-z0-9]{13,15}$"
                {...register('numeroElecteur')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="13 à 15 caractères"
              />
              {errors.numeroElecteur && <p className="mt-2 text-sm text-red-600">{errors.numeroElecteur.message}</p>}
              <p className="mt-1 text-xs text-gray-500">Le numéro doit contenir entre 13 et 15 caractères (chiffres/lettres).</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      <PageMetaData title="Nouvelle demande de terrain" />
      <TopNavBar menuItems={menuItems} hasDownloadButton position="fixed" />

      <section className="md:py-20 flex items-center justify-center relative overflow-hidden bg-cover bg-gradient-to-l from-primary/20 to-primary/20 via-primary/0">
        <div className="container">
          <ResponsiveAuthLayout title="Nouvelle demande de terrain">
            {/* Messages de statut */}
            {submitStatus === 'success' && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                <p className="font-bold">Succès</p>
                <p>Votre demande a été envoyée avec succès.</p>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p className="font-bold">Erreur</p>
                <p>{errorMessage}</p>
              </div>
            )}

            {/* Bloc récapitulatif après création */}
            {demandeInfo && (
              <div className="mb-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Détails de votre demande</h3>

                {/* Bandeau compte si un user existe */}
                {demandeInfo.demandeur?.email && (
                  <div className="mb-6 p-4 rounded-md border bg-blue-50 text-blue-800">
                    <p className="font-medium">
                      Votre compte a été {(demandeInfo.userExist ? "retrouvé" : "créé")} avec l’identifiant :
                      <span className="ml-1 underline">{demandeInfo.demandeur.email}</span>
                    </p>
                    {"enabled" in (demandeInfo.demandeur || {}) && (
                      <p className="text-sm">Statut du compte : {demandeInfo.demandeur.enabled ? "Actif" : "Inactif"}</p>
                    )}
                    <p className="text-sm">
                      Connectez-vous à votre espace pour suivre l’avancement de votre demande.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Informations de la demande</h4>
                      <div className="mt-2 space-y-2">
                        <p><span className="font-medium">N° interne:</span> {safe(demandeInfo.demande.id)}</p>
                        <p><span className="font-medium">Référence (numero):</span> {safe(demandeInfo.demande.numero)}</p>
                        <p><span className="font-medium">Type:</span> {safe(demandeInfo.demande.typeDemande)}</p>
                        <p><span className="font-medium">Type de titre:</span> {safe(demandeInfo.demande.typeTitre)}</p>
                        <p><span className="font-medium">Statut:</span> {safe(demandeInfo.demande.statut)}</p>
                        <p><span className="font-medium">Date de création:</span> {fmtDateTime(demandeInfo.demande.dateCreation)}</p>
                        <p><span className="font-medium">Superficie:</span> {safe(demandeInfo.demande.superficie)} m²</p>
                        <p><span className="font-medium">Usage prévu:</span> {safe(demandeInfo.demande.usagePrevu)}</p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <span className={`px-2 py-0.5 text-xs rounded ${demandeInfo.demande.possedeAutreTerrain ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
                            Autre terrain : {demandeInfo.demande.possedeAutreTerrain ? "Oui" : "Non"}
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded ${demandeInfo.demande.terrainAKaolack ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
                            À Kaolack : {demandeInfo.demande.terrainAKaolack ? "Oui" : "Non"}
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded ${demandeInfo.demande.terrainAilleurs ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
                            Ailleurs : {demandeInfo.demande.terrainAilleurs ? "Oui" : "Non"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Informations du demandeur</h4>
                      <div className="mt-2 space-y-2">
                        <p>
                          <span className="font-medium">Nom complet:</span>{" "}
                          {safe(`${demandeInfo.demandeur?.prenom ?? ""} ${demandeInfo.demandeur?.nom ?? ""}`.trim())}
                        </p>
                        <p><span className="font-medium">Email:</span> {safe(demandeInfo.demandeur?.email)}</p>
                        <p><span className="font-medium">Téléphone:</span> {safe(formatPhoneNumber?.(demandeInfo.demandeur?.telephone) ?? demandeInfo.demandeur?.telephone)}</p>
                        <p><span className="font-medium">Adresse:</span> {safe(demandeInfo.demandeur?.adresse)}</p>
                        <p><span className="font-medium">Profession:</span> {safe(demandeInfo.demandeur?.profession)}</p>
                        <p><span className="font-medium">Situation matrimoniale:</span> {safe(demandeInfo.demandeur?.situationMatrimoniale)}</p>
                        <p><span className="font-medium">Statut logement:</span> {safe(demandeInfo.demandeur?.statutLogement)}</p>
                        <p><span className="font-medium">Nombre d'enfants:</span> {safe(demandeInfo.demandeur?.nombreEnfant)}</p>
                        {Array.isArray(demandeInfo.demandeur?.roles) && demandeInfo.demandeur.roles.length > 0 && (
                          <p><span className="font-medium">Rôles:</span> {demandeInfo.demandeur.roles.join(", ")}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Localité</h4>
                      <div className="mt-2 space-y-2">
                        <p><span className="font-medium">Nom:</span> {safe(demandeInfo.localite?.nom || demandeInfo.demande.localite)}</p>
                        {"prix" in (demandeInfo.localite || {}) && (
                          <p><span className="font-medium">Prix:</span> {formatPrice ? formatPrice(demandeInfo.localite?.prix) : safe(demandeInfo.localite?.prix)}</p>
                        )}
                        {demandeInfo.localite?.latitude != null && demandeInfo.localite?.longitude != null && (
                          <p>
                            <span className="font-medium">Coordonnées:</span>{" "}
                            {demandeInfo.localite.latitude} / {demandeInfo.localite.longitude}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Documents</h4>
                      <div className="mt-2 space-y-2">
                        <p><span className="font-medium">Type de document:</span> {safe(demandeInfo.demande.typeDocument)}</p>
                        <p><span className="font-medium">N° d’identification:</span> {safe(demandeInfo.demandeur?.numeroElecteur)}</p>
                       
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => { setDemandeInfo(null); setCurrentStep(0); }}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark"
                  >
                    Faire une nouvelle demande
                  </button>
                </div>
              </div>
            )}

            {/* Stepper */}
            <Stepper steps={steps} currentStep={currentStep} />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-6">
              {renderStepContent()}
              <div className="flex justify-between mt-8 pt-6 border-t">
                {currentStep > 0 && (
                  <button type="button" onClick={prevStep}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    Précédent
                  </button>
                )}
                {currentStep < steps.length - 1 ? (
                  <button type="button" onClick={nextStep}
                    className="ml-auto px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark">
                    Suivant
                  </button>
                ) : (
                  <button type="submit" disabled={loading}
                    className={`ml-auto px-4 py-2 text-sm font-medium text-white bg-primary rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'}`}>
                    {loading ? (
                      <span className="flex items-center">
                        <LoaderCircleIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Envoi en cours...
                      </span>
                    ) : ('Soumettre la demande')}
                  </button>
                )}
              </div>
            </form>
          </ResponsiveAuthLayout>
        </div>
      </section>
    </>
  )
}
