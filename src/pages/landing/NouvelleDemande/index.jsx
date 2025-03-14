'use client'

import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { PageMetaData, TopNavBar } from '@/components'
import ResponsiveAuthLayout from '../../../layouts/ResponsiveAuthLayout'
import { AppContext } from '../../../AppContext'
import { toast } from "sonner"
import { LoaderCircleIcon } from 'lucide-react'
import { nouvelleDemande } from '@/services/demandeService'
import { getLocalitesWeb } from '@/services/localiteService'
import { formatPhoneNumber, formatPrice } from '@/utils/formatters'


const applicantSchema = yup.object({

  prenom: yup.string().required("Veuillez entrer votre prénom"),
  nom: yup.string().required("Veuillez entrer votre nom"),
  email: yup.string().email("Veuillez entrer un email valide").required("L'email est requis"),
  telephone: yup
    .string()
    .matches(/^(70|76|77|78|79)[0-9]{7}$/, "Le numéro de téléphone doit commencer par 70, 76, 77, 78 ou 79 suivis de 7 chiffres")
    .required("Le numéro de téléphone est requis"),
  adresse: yup.string().required("L'adresse est requise"),
  profession: yup.string().required("La profession est requise"),
  lieuNaissance: yup.string().required("Le lieu de naissance est requis"),
  dateNaissance: yup
    .date()
    .required("La date de naissance est requise")
    .max(new Date(), "La date ne peut pas être dans le futur")
    .test("age", "Vous devez avoir au moins 18 ans", function (value) {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age >= 18;
    }),
  numeroElecteur: yup
    .string()
    .required("Le numéro de carte nationale est requis")
    .matches(/^\d{13}$/, "Le numéro doit contenir exactement 13 chiffres"),

  possedeAutreTerrain: yup.boolean(),
  typeDocument: yup.string().required("Le type de document est requis"),
  typeDemande: yup.string().required("Le type de demande est requis"),
  usagePrevu: yup.string().required("L'usage prevu est requis"),
  superficie: yup.number().required("La superficie est requise"),
  localiteId: yup.number().required("La localité est requise"),

  recto: yup.mixed().test("fileRequired", "Le recto du document est requis", (value) => {
    return value && value.length === 1;
  }),
  verso: yup.mixed().test("fileRequired", "Le verso du document est requis", (value) => {
    return value && value.length === 1;
  }),
})


const Stepper = ({ steps, currentStep }) => (
  <div className="mb-8">
    <div className="flex justify-between">
      {steps.map((step, index) => (
        <div key={index} className="flex-1">
          <div className="relative flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
              ${index <= currentStep
                ? 'border-primary bg-primary text-white'
                : 'border-gray-300 bg-white text-gray-500'}`}>
              {index + 1}
            </div>
            <div className="absolute -bottom-6 w-32 text-center text-sm font-medium text-gray-500">
              {step}
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${index < currentStep ? 'bg-primary' : 'bg-gray-300'
                }`} />
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default function NouvelleDemandePage() {
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [localites, setLocalites] = useState([])
  const [demandeInfo, setDemandeInfo] = useState(null);

  const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm({
    resolver: yupResolver(applicantSchema)
  })

  const [currentStep, setCurrentStep] = useState(0)
  const steps = [
    'Informations Personnelles',
    'Détails de la Demande',
    'Documents & Validation'
  ]

  const nextStep = () => {
    const values = getValues()
    const currentFields = getCurrentStepFields()
    const hasErrors = currentFields.some(field => errors[field])

    if (!hasErrors) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    } else {
      toast.error("Veuillez remplir tous les champs obligatoires")
    }
  }


  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

  const getCurrentStepFields = () => {
    switch (currentStep) {
      case 0:
        return ['prenom', 'nom', 'email', 'telephone', 'adresse', 'profession', 'lieuNaissance', 'dateNaissance']
      case 1:
        return ['typeDemande', 'localiteId', 'usagePrevu', 'superficie']
      case 2:
        return ['typeDocument', 'document', 'numeroElecteur']
      default:
        return []
    }
  }

  useEffect(() => {
    const fetchLocalite = async () => {
      try {
        const resp = await getLocalitesWeb()
        console.log(resp)
        setLocalites(resp)
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
      console.log(data)
      const formData = new FormData()
      // formData.append("document", data.document[0]);
      formData.append('adresse', data.adresse)
      formData.append('numeroElecteur', data.numeroElecteur)
      formData.append('prenom', data.prenom)
      formData.append('nom', data.nom)
      formData.append('email', data.email)
      formData.append('telephone', data.telephone)
      formData.append('profession', data.profession)
      formData.append('lieuNaissance', data.lieuNaissance)
      formData.append('dateNaissance', data.dateNaissance.toISOString().split('T')[0]);

      formData.append('possedeAutreTerrain', data.possedeAutreTerrain)
      formData.append('typeDocument', data.typeDocument)
      formData.append('typeDemande', data.typeDemande)
      formData.append('usagePrevu', data.usagePrevu)
      formData.append('superficie', data.superficie)
      formData.append('localiteId', data.localiteId)

      formData.append("recto", data.recto[0]);
      formData.append("verso", data.verso[0]);

      const response = await nouvelleDemande(formData)
      setDemandeInfo(response) // Stockez la réponse
      setSubmitStatus('success')
      toast.success('Demande envoyée avec succès')
      reset()
    } catch (error) {
      console.error(error)
      setSubmitStatus('error')
      setErrorMessage(error.message)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            {/* Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                  Prénom
                </label>
                <input
                  id="prenom"
                  {...register('prenom')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
                {errors.prenom && <p className="mt-2 text-sm text-red-600">{errors.prenom.message}</p>}
              </div>

              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  id="nom"
                  {...register('nom')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
                {errors.nom && <p className="mt-2 text-sm text-red-600">{errors.nom.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <input
                  id="telephone"
                  {...register('telephone')}

                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
                {errors.telephone && <p className="mt-2 text-sm text-red-600">{errors.telephone.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                Adresse
              </label>
              <input
                id="adresse"
                {...register('adresse')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              {errors.adresse && <p className="mt-2 text-sm text-red-600">{errors.adresse.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
                  Profession
                </label>
                <input
                  id="profession"
                  {...register('profession')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
                {errors.profession && <p className="mt-2 text-sm text-red-600">{errors.profession.message}</p>}
              </div>

              <div>
                <label htmlFor="lieuNaissance" className="block text-sm font-medium text-gray-700">
                  Lieu de naissance
                </label>
                <input
                  id="lieuNaissance"
                  {...register('lieuNaissance')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
                {errors.lieuNaissance && <p className="mt-2 text-sm text-red-600">{errors.lieuNaissance.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700">
                Date de naissance
              </label>
              <input
                id="dateNaissance"
                type="date"
                {...register('dateNaissance')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              {errors.dateNaissance && <p className="mt-2 text-sm text-red-600">{errors.dateNaissance.message}</p>}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            {/* Détails de la demande */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="typeDemande" className="block text-sm font-medium text-gray-700">
                  Type de demande
                </label>
                <select
                  id="typeDemande"
                  {...register('typeDemande')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="">Sélectionnez le type</option>
                  <option value="PERMIS_OCCUPATION">Permis d'occupation</option>
                  <option value="PROPOSITION_BAIL">Proposition de bail</option>
                  <option value="BAIL_COMMUNAL">Bail communal</option>
                </select>
                {errors.typeDemande && <p className="mt-2 text-sm text-red-600">{errors.typeDemande.message}</p>}
              </div>

              <div>
                <label htmlFor="localiteId" className="block text-sm font-medium text-gray-700">
                  Localité
                </label>
                <select
                  id="localiteId"
                  {...register('localiteId')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="">Sélectionnez la localité</option>
                  {localites.map((localite) => (
                    <option key={localite.id} value={localite.id}>
                      {localite.nom}
                    </option>
                  ))}
                </select>
                {errors.localiteId && <p className="mt-2 text-sm text-red-600">{errors.localiteId.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="usagePrevu" className="block text-sm font-medium text-gray-700">
                Usage prévu
              </label>
              <textarea
                id="usagePrevu"
                {...register('usagePrevu')}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              {errors.usagePrevu && <p className="mt-2 text-sm text-red-600">{errors.usagePrevu.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="superficie" className="block text-sm font-medium text-gray-700">
                  Superficie (m²)
                </label>
                <input
                  id="superficie"
                  type="number"
                  step="0.01"
                  {...register('superficie')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
                {errors.superficie && <p className="mt-2 text-sm text-red-600">{errors.superficie.message}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Documents et validation */}
            <div>
              <label htmlFor="typeDocument" className="block text-sm font-medium text-gray-700">
                Type de document
              </label>
              <select
                id="typeDocument"
                {...register('typeDocument')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="">Sélectionnez le type</option>
                <option value="CNI">CNI</option>
                <option value="PASSPORT">Passport</option>
                <option value="EXTRAIT DE NAISSANCE">Extrait de Naissance</option>
                <option value="AUTRE">Autre</option>
              </select>
              {errors.typeDocument && <p className="mt-2 text-sm text-red-600">{errors.typeDocument.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="recto" className="block text-sm font-medium text-gray-700">
                  Recto du document
                </label>
                <input
                  id="recto"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  {...register('recto')}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary hover:file:bg-primary-100"
                />
                {errors.recto && <p className="mt-2 text-sm text-red-600">{errors.recto.message}</p>}
              </div>

              <div>
                <label htmlFor="verso" className="block text-sm font-medium text-gray-700">
                  Verso du document
                </label>
                <input
                  id="verso"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  {...register('verso')}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary hover:file:bg-primary-100"
                />
                {errors.verso && <p className="mt-2 text-sm text-red-600">{errors.verso.message}</p>}
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Formats acceptés: PDF, JPG, JPEG, PNG
            </p>

            <div>
              <label htmlFor="numeroElecteur" className="block text-sm font-medium text-gray-700">
                Numéro de carte nationale
              </label>
              <input
                id="numeroElecteur"
                type="text" // Changer en type text pour permettre la validation personnalisée
                maxLength={14} // Limiter à 14 caractères
                pattern="\d*" // N'autoriser que les chiffres sur mobile
                inputMode="numeric" // Afficher le clavier numérique sur mobile
                {...register('numeroElecteur')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="14 chiffres"
              />
              {errors.numeroElecteur && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.numeroElecteur.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Le numéro doit contenir exactement 14 chiffres
              </p>
            </div>




            <div className="flex items-center">
              <input
                id="possedeAutreTerrain"
                type="checkbox"
                {...register('possedeAutreTerrain')}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="possedeAutreTerrain" className="ml-2 block text-sm text-gray-700">
                Je possède déjà un terrain
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <PageMetaData title="Nouvelle demande de terrain" />
      <TopNavBar menuItems={["accueil", "services", "ressources"]} position="fixed" hasDownloadButton />

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

            {demandeInfo && (
              <div className="mb-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Détails de votre demande</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Informations de la demande</h4>
                      <div className="mt-2 space-y-2">
                        <p><span className="font-medium">N° de demande:</span> {demandeInfo.demande.id}</p>
                        <p><span className="font-medium">Type:</span> {demandeInfo.demande.typeDemande}</p>
                        <p><span className="font-medium">Statut:</span> {demandeInfo.demande.statut}</p>
                        <p><span className="font-medium">Date de création:</span> {new Date(demandeInfo.demande.dateCreation).toLocaleString()}</p>
                        <p><span className="font-medium">Superficie:</span> {demandeInfo.demande.superficie} m²</p>
                        <p><span className="font-medium">Usage prévu:</span> {demandeInfo.demande.usagePrevu}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Informations du demandeur</h4>
                      <div className="mt-2 space-y-2">
                        <p><span className="font-medium">Nom complet:</span> {demandeInfo.demande.demandeur.prenom} {demandeInfo.demande.demandeur.nom}</p>
                        <p><span className="font-medium">Email:</span> {demandeInfo.demande.demandeur.email}</p>
                        <p><span className="font-medium">Téléphone:</span> {formatPhoneNumber(demandeInfo.demande.demandeur.telephone)} </p>
                        <p><span className="font-medium">Adresse:</span> {demandeInfo.demande.demandeur.adresse}</p>
                        <p><span className="font-medium">Profession:</span> {demandeInfo.demande.demandeur.profession}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Informations de la localité</h4>
                      <div className="mt-2 space-y-2">
                        <p><span className="font-medium">Nom:</span> {demandeInfo.localite.nom}</p>
                        <p><span className="font-medium">Prix:</span> {formatPrice(demandeInfo.localite.prix)} </p>
                        <p><span className="font-medium">Description:</span> {demandeInfo.localite.description}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Documents</h4>
                      <div className="mt-2 space-y-2">
                        <p><span className="font-medium">Type de document:</span> {demandeInfo.demande.typeDocument}</p>
                        <p><span className="font-medium">N° Électeur:</span> {demandeInfo.demande.demandeur.numeroElecteur}</p>
                        <p><span className="font-medium">Documents fournis:</span> Recto et Verso du {demandeInfo.demande.typeDocument}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => {
                      setDemandeInfo(null);
                      setCurrentStep(0);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark"
                  >
                    Faire une nouvelle demande
                  </button>
                </div>
              </div>
            )}

            {/* Stepper */}
            <Stepper steps={steps} currentStep={currentStep} />

            {/* Formulaire */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-6">
              {renderStepContent()}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Précédent
                  </button>
                )}

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className={`ml-auto px-4 py-2 text-sm font-medium text-white bg-primary rounded-md
                      ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'}`}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <LoaderCircleIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Envoi en cours...
                      </div>
                    ) : (
                      'Soumettre la demande'
                    )}
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