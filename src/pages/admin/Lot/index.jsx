"use client"
import { AdminBreadcrumb } from "@/components"
import { LuSearch, LuPlusCircle, LuFileEdit, LuX } from "react-icons/lu"
import { useState, useEffect } from "react"
import { getLotissements, getLotissementLot } from "@/services/lotissementService"
import { createLot, updateLot, updateLotStatut } from "@/services/lotsService"
import { toast } from "sonner"
import { cn } from "@/utils"
import { Loader2 } from "lucide-react"
import { formatCoordinates, formatPrice } from "@/utils/formatters"

const AdminLot = () => {
    const [lots, setLots] = useState([])
    const [lotissements, setLotissements] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState("")
    const [selectedLotissement, setSelectedLotissement] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [editingLot, setEditingLot] = useState(null)
    const [formData, setFormData] = useState({
        numeroLot: "",
        superficie: "",
        statut: "",
        prix: "",
        usage: "",
        lotissementId: "",
        longitude: "",  // Ajout du champ longitude
        latitude: "",   // Ajout du champ latitude
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const lotissementData = await getLotissements()
                setLotissements(lotissementData)
                if (lotissementData.length > 0) {
                    setSelectedLotissement(lotissementData[0].id)
                    const lotsData = await getLotissementLot(lotissementData[0].id)
                    setLots(lotsData)
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
        const lotissementId = e.target.value
        setSelectedLotissement(lotissementId)
        try {
            const data = await getLotissementLot(lotissementId)
            setLots(data)
        } catch (err) {
            setError(err.message)
        }
    }

    const handleOpenModal = (lot = null) => {
        setEditingLot(lot)
        setFormData(
            lot || { numeroLot: "", superficie: "", statut: "", prix: "", usage: "", lotissementId: selectedLotissement, longitude: "", latitude: "" },
        )
        setModalOpen(true)
    }

    const handleCloseModal = () => {
        setModalOpen(false)
        setEditingLot(null)
        setFormData({ numeroLot: "", superficie: "", statut: "", prix: "", usage: "", lotissementId: selectedLotissement, longitude: "", latitude: "" })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingLot) {
                await updateLot(editingLot.id, formData)
                toast.success("Lot mis à jour avec succès")
            } else {
                await createLot(formData)
                toast.success("Lot ajouté avec succès")
            }
            handleCloseModal()
            const updatedLots = await getLotissementLot(selectedLotissement)
            setLots(updatedLots)
        } catch (error) {
            toast.error("Erreur lors de l'ajout ou de la modification du lot")
        }
    }

    // if (loading) return <div className="flex justify-center items-center h-screen">Chargement...</div>
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Erreur: {error}</div>

    const filteredLots = lots.filter(
        (lot) =>
            lot.numeroLot.toLowerCase().includes(filter.toLowerCase()) ||
            lot.usage.toLowerCase().includes(filter.toLowerCase()),
    )


    const handleUpdateStatut = async (lotId, nouveauStatut) => {
        try {
            await updateLotStatut(lotId, nouveauStatut);
            const updatedLots = lots.map(lot => {
                if (lot.id === lotId) {
                    return { ...lot, statut: nouveauStatut };
                }
                return lot;
            });
            setLots(updatedLots);
            toast.success("Statut du lot mis à jour avec succès");
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du statut");
        }
    };


    return (
        <>
            <AdminBreadcrumb title="Liste des Lots" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="bg-white dark:bg-default-50 shadow-lg rounded-lg overflow-hidden">


                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                <h4 className="text-xl font-semibold text-gray-800 dark:text-white uppercase">Liste des Lots</h4>
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
                                    <LuPlusCircle /> Ajouter un Lot
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Numéro
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Superficie
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Coordonnées
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Statut
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Prix
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Usage
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredLots.map((lot) => (
                                            <tr key={lot.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">{lot.numeroLot}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{lot.superficie} m²</td>
                                                <td className="px-6 py-4 whitespace-nowrap"> {formatCoordinates(lot.latitude, lot.longitude)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">

                                                    <select
                                                        value={lot.statut}
                                                        onChange={(e) => handleUpdateStatut(lot.id, e.target.value)}
                                                        className={cn(
                                                            "text-sm border rounded-md py-1 px-2 focus:ring-2 focus:ring-opacity-50 focus:outline-none",
                                                            {
                                                                'bg-green-100 text-green-800 border-green-500': lot.statut === 'DISPONIBLE',
                                                                'bg-red-100 text-red-800 border-red-500': lot.statut === 'OCCUPE',
                                                                'bg-yellow-100 text-yellow-800 border-yellow-500': lot.statut === 'RESERVER',
                                                                'bg-gray-100 text-gray-800 border-gray-500': lot.statut === 'VENDU'
                                                            }
                                                        )}
                                                    >
                                                        <option value="DISPONIBLE">Disponible</option>
                                                        <option value="OCCUPE">Occupé</option>
                                                        <option value="RESERVER">Réservé</option>
                                                        <option value="VENDU">Vendu</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">  {formatPrice(lot.prix)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{lot.usage}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button onClick={() => handleOpenModal(lot)} className="text-primary hover:text-primary-dark">
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
                                {editingLot ? "Modifier le Lot" : "Ajouter un Lot"}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                                <LuX className="h-6 w-6" />
                            </button>
                        </div>



                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="numeroLot" className="block text-sm font-medium text-gray-700">
                                    Numéro du Lot
                                </label>
                                <input
                                    type="text"
                                    id="numeroLot"
                                    name="numeroLot"
                                    value={formData.numeroLot}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="superficie" className="block text-sm font-medium text-gray-700">
                                    Superficie (m²)
                                </label>
                                <input
                                    type="number"
                                    id="superficie"
                                    name="superficie"
                                    value={formData.superficie}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="prix" className="block text-sm font-medium text-gray-700">
                                    Prix (FCFA)
                                </label>
                                <input
                                    type="number"
                                    id="prix"
                                    name="prix"
                                    value={formData.prix}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="usage" className="block text-sm font-medium text-gray-700">
                                    Usage
                                </label>
                                <input
                                    type="text"
                                    id="usage"
                                    name="usage"
                                    value={formData.usage}
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
                            <div>
                                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                                    Longitude
                                </label>
                                <input
                                    type="text"
                                    id="longitude"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                                    Latitude
                                </label>
                                <input
                                    type="text"
                                    id="latitude"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    {editingLot ? "Modifier" : "Ajouter"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default AdminLot

