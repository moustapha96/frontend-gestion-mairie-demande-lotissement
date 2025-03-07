"use client"
import { AdminBreadcrumb } from "@/components";
import { getLocalites } from "@/services/localiteService";
import { getLotissementDetails, updateLotissement, createLotissement } from "@/services/lotissementService";
import { cn } from "@/utils";
import { Loader2, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AdminLotissementModifier = ({ isEditing = false }) => {
    const [nom, setNom] = useState("");
    const [localites, setLocalite] = useState([])
    const [localiteId, setLocaliteId] = useState()
    const [localisation, setLocalisation] = useState("");
    const [description, setDescription] = useState("");
    const [statut, setStatut] = useState("en cours");
    const [dateCreation, setDateCreation] = useState(new Date().toISOString().slice(0, 16));
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");


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

    useEffect(() => {
        const fetchLotissement = async () => {
            try {
                const res = await getLotissementDetails(id);
                setNom(res.nom);
                setLocalisation(res.localisation);
                setDescription(res.description);
                setStatut(res.statut);
                setDateCreation(res.dateCreation.replace(" ", "T"));
                setLocaliteId(res.localite.id);
                setLongitude(res.longitude || "");  // Ajout longitude
                setLatitude(res.latitude || "");    // Ajout latitude
            } catch (error) {
                console.log(error);
            }
        };
        if (id) {
            fetchLotissement();
        }
    }, [id, isEditing]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const body = {
                nom,
                localisation,
                description,
                statut,
                dateCreation: dateCreation.replace("T", " "),
                localiteId,
                longitude: parseFloat(longitude),
                latitude: parseFloat(latitude)
            };
            await updateLotissement(id, body);
            toast.success("Lotissement mis à jour avec succès!");
            navigate("/admin/lotissements");
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'enregistrement du lotissement");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AdminBreadcrumb title={isEditing ? "Mise à jour du lotissement" : "Nouveau lotissement"} />
            <section className="flex justify-center items-center min-h-screen">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-2xl p-6">
                    <h2 className="text-2xl font-bold text-center mb-6">
                        {isEditing ? "Modifier le lotissement" : "Ajouter un nouveau lotissement"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {!localites ? <>
                            <div className="flex justify-center" >
                                <Loader2 className="animate-spin mr-2" size={23} />
                            </div>
                        </> : <>
                            <div>
                                <label htmlFor="localite" className="block text-sm font-medium text-gray-700">
                                    Localité
                                </label>
                                <select id="localite" value={localiteId} onChange={(e) => setLocaliteId(e.target.value)} required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
                                    <option >Selectionnez une localité</option>
                                    {localites.map((localite) => (
                                        <option key={localite.id} value={localite.id} selected={localite.id === localiteId} >
                                            {localite.nom}
                                        </option>
                                    ))}

                                </select>
                            </div>
                        </>}

                        <div>
                            <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                                Nom
                            </label>
                            <input type="text" id="nom" value={nom} onChange={(e) => setNom(e.target.value)} required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" />
                        </div>
                        <div>
                            <label htmlFor="localisation" className="block text-sm font-medium text-gray-700">
                                Localisation
                            </label>
                            <input type="text" id="localisation" value={localisation} onChange={(e) => setLocalisation(e.target.value)} required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"></textarea>
                        </div>
                        <div>
                            <label htmlFor="statut" className="block text-sm font-medium text-gray-700">
                                Statut
                            </label>
                            <select id="statut" value={statut} onChange={(e) => setStatut(e.target.value)} required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
                                <option value="en cours">En cours</option>
                                <option value="planifié">Planifié</option>

                                <option value="acheve">Achevé</option>
                            </select>
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

                        <div className="flex justify-center">
                            <button type="submit" disabled={loading}
                                className={cn("w-1/2 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                                    loading && "opacity-50 cursor-not-allowed")}>
                                {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Save className="mr-2" size={20} />}
                                {loading ? "Enregistrement..." : "Modifier"}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default AdminLotissementModifier;
