"use client"
import { AdminBreadcrumb } from "@/components"
import { LuSearch, LuPlusCircle, LuFileEdit, LuX } from "react-icons/lu"
import { useState, useEffect } from "react"
import { getLotissements, getLotissementLot } from "@/services/lotissementService"
import { createLot, updateLot, updateLotStatut } from "@/services/lotsService"
import { toast } from "sonner"
import { cn } from "@/utils"
import { createParcelle, getParcelles, getParcellesByLotissement, updateParcelle, updateParcellestatut } from "@/services/parcelleService"
import { Loader, Loader2 } from "lucide-react"

const AdminParcelle = () => {
    const [lotissements, setLotissements] = useState([])
    const [parcelles, setParcelles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState("")
    const [selectedLotissement, setSelectedLotissement] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [editingParcelle, setEditingParcelle] = useState(null)
    const [formData, setFormData] = useState({
        numero: "",
        superface: "",
        statut: "",
        lotissementId: "",
        longitude: "",  // Ajout longitude
        latitude: "",   // Ajout latitude
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const lotissementsData = await getLotissements()
                setLotissements(lotissementsData)
                if (lotissementsData.length > 0) {
                    setSelectedLotissement(lotissementsData[0].id)
                    const parcellesData = await getParcelles(lotissementsData[0].id)
                    setParcelles(parcellesData)
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleLotissementChange = async (e) => {
        setLoading(true)
        const lotissementId = e.target.value
        setSelectedLotissement(lotissementId)
        try {
            const data = await getParcellesByLotissement(lotissementId)
            console.log(data)
            setParcelles(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (parcelle = null) => {
        setEditingParcelle(parcelle)
        setFormData(
            parcelle || {
                numero: "",
                superface: "",
                statut: "",
                lotissementId: selectedLotissement,
                longitude: "",
                latitude: ""
            },
        )
        setModalOpen(true)
    }


    const handleCloseModal = () => {
        setModalOpen(false)
        setEditingParcelle(null)
        setFormData({
            numero: "",
            superface: "",
            statut: "",
            lotissementId: selectedLotissement,
            longitude: "",
            latitude: ""
        })
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            console.log(formData)
            if (editingParcelle) {
                await updateParcelle(editingParcelle.id, formData)
                toast.success("Parcelle mise à jour avec succès")
            } else {
                await createParcelle(formData)
                toast.success("Parcelle ajoutée avec succès")
            }
            handleCloseModal()
            const updatedParcelles = await getParcelles(selectedLotissement)
            setParcelles(updatedParcelles)
        } catch (error) {
            toast.error("Erreur lors de l'ajout ou de la modification de la parcelle")
        } finally {
            setLoading(false)
        }
    }

    // if (loading) return <div className="flex justify-center items-center h-screen">Chargement...</div>
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Erreur: {error}</div>

    const filteredParcelles = parcelles.filter(
        (parcelle) =>
            parcelle.numero.toLowerCase().includes(filter.toLowerCase()) ||
            parcelle.statut.toLowerCase().includes(filter.toLowerCase()),
    )

    const handleUpdateStatut = async (parcelleId, nouveauStatut) => {
        try {
            await updateParcellestatut(parcelleId, nouveauStatut);
            const updatedParcelles = parcelles.map(parcelle => {
                if (parcelle.id === parcelleId) {
                    return { ...parcelle, statut: nouveauStatut };
                }
                return parcelle;
            });
            setParcelles(updatedParcelles);
            toast.success("Statut de la parcelle mis à jour avec succès");
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du statut");
        }
    };

    return (
        <>
            <AdminBreadcrumb title="Liste des Parcelles" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="bg-white dark:bg-default-50 shadow-lg rounded-lg overflow-hidden">

                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                <h4 className="text-xl font-semibold text-gray-800 dark:text-white uppercase">Liste des Parcelles</h4>
                            </div>


                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                <select
                                    value={selectedLotissement}
                                    onChange={handleLotissementChange}
                                    className="mb-4 md:mb-0 p-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                >
                                    {lotissements.map((lotissement) => (
                                        <option key={lotissement.id} value={lotissement.id}>
                                            {lotissement.nom}
                                        </option>
                                    ))}
                                </select>

                                <div className="flex items-center">
                                    <div className="relative mr-4">
                                        <input
                                            type="text"
                                            placeholder="Rechercher..."
                                            value={filter}
                                            onChange={(e) => setFilter(e.target.value)}
                                            className="pl-10 pr-4 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                        />
                                        <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>
                            </div>



                            <div className="flex items-center justify-end border-b gap-4 border-gray-200 px-6 py-4">
                                <button onClick={() => handleOpenModal()} className="text-primary flex items-center gap-2">
                                    <LuPlusCircle /> Ajouter une Parcelle
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Lotissement
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Numéro
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Surface
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Coordonnées
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Statut
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredParcelles.map((parcelle) => (
                                            <tr key={parcelle.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">{parcelle.lotissement.nom}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{parcelle.numero}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{parcelle.superface} m²</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{parcelle.longitude}, {parcelle.latitude}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <select
                                                        value={parcelle.statut}
                                                        onChange={(e) => handleUpdateStatut(parcelle.id, e.target.value)}
                                                        className={cn(
                                                            "text-sm border rounded-md py-1 px-2 focus:ring-2 focus:ring-opacity-50 focus:outline-none",
                                                            {
                                                                'bg-green-100 text-green-800 border-green-500': parcelle.statut === 'DISPONIBLE',
                                                                'bg-red-100 text-red-800 border-red-500': parcelle.statut === 'OCCUPE',
                                                                'bg-yellow-100 text-yellow-800 border-yellow-500': parcelle.statut === 'RESERVER',
                                                                'bg-gray-100 text-gray-800 border-gray-500': parcelle.statut === 'VENDU'
                                                            }
                                                        )}
                                                    >
                                                        <option value="DISPONIBLE">Disponible</option>
                                                        <option value="OCCUPE">Occupé</option>
                                                        <option value="RESERVER">Réservé</option>
                                                        <option value="VENDU">Vendu</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button onClick={() => handleOpenModal(parcelle)} className="text-primary hover:text-primary-dark">
                                                        <LuFileEdit className="inline mr-1" /> Modifier
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    {loading && (
                                        <tbody className="w-full">
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12">
                                                    <div className="flex items-center justify-center">
                                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingParcelle ? "Modifier la Parcelle" : "Ajouter une Parcelle"}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                                <LuX className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
                                    Numéro de la Parcelle
                                </label>
                                <input
                                    type="text"
                                    id="numero"
                                    name="numero"
                                    value={formData.numero}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="superface" className="block text-sm font-medium text-gray-700">
                                    Surface (m²)
                                </label>
                                <input
                                    type="number"
                                    id="superface"
                                    name="superface"
                                    value={formData.superface}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="statut" className="block text-sm font-medium text-gray-700">
                                    Statut
                                </label>
                                <select
                                    id="statut"
                                    name="statut"
                                    value={formData.statut}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                                    required
                                >
                                    <option value="">Sélectionner un statut</option>
                                    <option value="DISPONIBLE">Disponible</option>
                                    <option value="OCCUPE">Occupé</option>
                                    <option value="RESERVER">Réservé</option>
                                    <option value="VENDU">Vendu</option>
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
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                                        placeholder="-17.4441"
                                        required
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
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                                        placeholder="14.6937"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-6 mt-6">


                                <button type="button"
                                    onClick={handleCloseModal}
                                    className="text-primary-dark ">
                                    Annuler
                                </button>

                                <button onClick={() => handleOpenModal(parcelle)} className="text-primary  hover:text-primary-dark">
                                    {loading ? <Loader2 className="animate-spin inline mr-2" size={20} /> : <LuFileEdit className="inline mr-1" />} {editingParcelle ? "Modifier" : "Ajouter"}
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default AdminParcelle
