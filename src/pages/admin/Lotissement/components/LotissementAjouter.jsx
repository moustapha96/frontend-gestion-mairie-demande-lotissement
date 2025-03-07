"use client"
import { AdminBreadcrumb } from "@/components"
import { createLocalite, getLocalites } from "@/services/localiteService"
import { createLotissement } from "@/services/lotissementService"
import { cn } from "@/utils"
import { Loader2, Save } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const AdminLotissementAjouter = () => {
    const [nom, setNom] = useState("")
    const [localites, setLocalite] = useState([])
    const [localiteId, setLocaliteId] = useState()
    const [localisation, setLocalisation] = useState("")
    const [description, setDescription] = useState("")
    const [statut, setStatut] = useState("en cours")
    const [dateCreation, setDateCreation] = useState(new Date().toISOString().slice(0, 16))
    const [loading, setLoading] = useState(false)
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
        const fetechLocalite = async () => {
            try {
                const res = await getLocalites()
                console.log(res)
                setLocalite(res)
            } catch (error) {
                console.error(error);
            }
        }
        fetechLocalite()
    }, [])
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const body = {
                nom,
                localisation,
                description,
                statut,
                dateCreation: new Date(dateCreation).toLocaleDateString(),
                localiteId: localiteId,
                longitude: parseFloat(longitude),
                latitude: parseFloat(latitude)
            }
            console.log(body)
            const res = await createLotissement(body);
            console.log(res)
            toast.success("Lotissement ajouté avec succès!");
            navigate("/admin/lotissements")
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'ajout du lotissement");
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <AdminBreadcrumb title="Nouveau lotissement" />
            <section className="flex justify-center items-center min-h-screen">
                <div className="bg-white dark:bg-default-50 shadow-lg rounded-lg overflow-hidden w-full max-w-2xl">
                    <h2 className="text-2xl font-bold text-center mt-6">Ajouter un nouveau lotissement</h2>
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!localites ? <>
                                <div className="flex justify-center" >
                                    <Loader2 className="animate-spin mr-2" size={23} />
                                </div>
                            </> : <>
                                <div>
                                    <label htmlFor="localite" className="block text-sm font-medium text-gray-700  dark:text-white ">
                                        Localité
                                    </label>
                                    <select id="localite" value={localiteId} onChange={(e) => setLocaliteId(e.target.value)} required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
                                        <option >Selectionnez une localité</option>
                                        {localites.map((localite) => (
                                            <option key={localite.id} value={localite.id}>
                                                {localite.nom}
                                            </option>
                                        ))}

                                    </select>
                                </div>
                            </>}


                            <div>
                                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 dark:text-white">
                                    Nom
                                </label>
                                <input
                                    type="text"
                                    id="nom"
                                    value={nom}
                                    onChange={(e) => setNom(e.target.value)}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                />
                            </div>
                            <div>
                                <label htmlFor="localisation" className="block text-sm font-medium text-gray-700 dark:text-white ">
                                    Localisation
                                </label>
                                <input
                                    type="text"
                                    id="localisation"
                                    value={localisation}
                                    onChange={(e) => setLocalisation(e.target.value)}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                />
                            </div>
                            <div>
                                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 dark:text-white">
                                    Longitude
                                </label>
                                <input
                                    type="text"
                                    id="longitude"
                                    value={longitude}
                                    onChange={(e) => setLongitude(e.target.value)}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                />
                            </div>
                            <div>
                                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 dark:text-white">
                                    Latitude
                                </label>
                                <input
                                    type="text"
                                    id="latitude"
                                    value={latitude}
                                    onChange={(e) => setLatitude(e.target.value)}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-white">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="statut" className="block text-sm font-medium text-gray-700 dark:text-white">
                                    Statut
                                </label>
                                <select
                                    id="statut"
                                    value={statut}
                                    onChange={(e) => setStatut(e.target.value)}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                >
                                    <option value="en cours">En cours</option>
                                    <option value="planifié">Planifié</option>
                                    <option value="achevé">Achevé</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="dateCreation" className="block text-sm font-medium text-gray-700 dark:text-white">
                                    Date de création
                                </label>
                                <input
                                    type="datetime-local"
                                    id="dateCreation"
                                    disabled
                                    value={dateCreation}
                                    onChange={(e) => setDateCreation(e.target.value)}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                />
                            </div>
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={cn(
                                        "w-1/2 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                                        loading && "opacity-50 cursor-not-allowed",
                                    )}
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin mr-2" size={20} />
                                    ) : (
                                        <Save className="mr-2" size={20} />
                                    )}
                                    {loading ? "Enregistrement" : "Ajouter le lotissement"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AdminLotissementAjouter
