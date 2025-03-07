"use client"
import { AdminBreadcrumb } from "@/components"
import { createLocalite } from "@/services/localiteService"
import { cn } from "@/utils"
import { Loader2, Save } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const AdminLocaliteAjouter = () => {
    const [nom, setNom] = useState("")
    const [prix, setPrix] = useState("")
    const [description, setDescription] = useState("")
    const [longitude, setLongitude] = useState("")  // Nouvel état
    const [latitude, setLatitude] = useState("")    // Nouvel état
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const body = {
                nom,
                prix: Number(prix),
                description,
                longitude: parseFloat(longitude),
                latitude: parseFloat(latitude)
            }
            await createLocalite(body);
            toast.success("Localité ajoutée avec succès!");
            navigate("/admin/localites")
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'ajout de la localité");
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <AdminBreadcrumb title="Nouvelle localité" />
            <section className="flex justify-center items-center min-h-screen">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-2xl">
                    <h2 className="text-2xl font-bold text-center mt-6">Ajouter une nouvelle localité</h2>
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
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
                                <label htmlFor="prix" className="block text-sm font-medium text-gray-700">
                                    Prix
                                </label>
                                <input
                                    type="number"
                                    id="prix"
                                    value={prix}
                                    onChange={(e) => setPrix(e.target.value)}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                                        Longitude
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        id="longitude"
                                        value={longitude}
                                        onChange={(e) => setLongitude(e.target.value)}
                                        required
                                        placeholder="-17.4441"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                                        Latitude
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        id="latitude"
                                        value={latitude}
                                        onChange={(e) => setLatitude(e.target.value)}
                                        required
                                        placeholder="14.6937"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
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
                                    {loading ? "Enregistrement" : "Ajouter la localité"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AdminLocaliteAjouter