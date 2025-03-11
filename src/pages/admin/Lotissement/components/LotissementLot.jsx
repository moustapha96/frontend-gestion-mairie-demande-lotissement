

"use client"
import { AdminBreadcrumb } from "@/components"
import { LuSearch, LuPlusCircle, LuFileEdit, LuX } from "react-icons/lu"
import { Link, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { getLotissementDetails, getLotissementLot } from "@/services/lotissementService"
import { createLot, updateLot } from "@/services/lotsService"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { formatCoordinates, formatPrice } from "@/utils/formatters"

const AdminLotissementLot = () => {
    const { id } = useParams()
    const [lots, setLots] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingLot, setEditingLot] = useState(null)
    const [formData, setFormData] = useState({ numeroLot: "", superficie: "", statut: "", prix: "", usage: "" })
    const [lotissement, setLotissemet] = useState(null);
    useEffect(() => {
        const fetchLots = async () => {
            try {
                const data = await getLotissementLot(id)
                setLots(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        const fetchLotissement = async () => {
            try {
                const data = await getLotissementDetails(id)
                setLotissemet(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchLotissement()
        fetchLots()
    }, [id])

    const handleOpenModal = (lot = null) => {
        setEditingLot(lot)
        setFormData(lot || { numeroLot: "", superficie: "", statut: "", prix: "", usage: "" })
        setModalOpen(true)
    }

    const handleCloseModal = () => {
        setModalOpen(false)
        setEditingLot(null)
        setFormData({ numeroLot: "", superficie: "", statut: "", prix: "", usage: "" })
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
                await createLot({ ...formData, lotissementId: id })
                toast.success("Lot ajouté avec succès")
            }
            handleCloseModal()
            const updatedLots = await getLotissementLot(id)
            setLots(updatedLots)
        } catch (error) {
            console.error("Erreur lors de l'ajout ou de la modification du lot", error)
        }
    }

    // if (loading) return <div className="flex justify-center items-center h-screen">Chargement des lots...</div>
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Erreur: {error}</div>

    const filteredLots = lots.filter(
        (lot) =>
            lot.numeroLot.toLowerCase().includes(filter.toLowerCase()) ||
            lot.usage.toLowerCase().includes(filter.toLowerCase()),
    )

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredLots.slice(indexOfFirstItem, indexOfLastItem)

    return (
        <>
            <AdminBreadcrumb title="Liste des Lots" />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                <h4 className="text-xl font-semibold text-gray-800 uppercase">Liste des Lots</h4>

                                {lotissement && <>
                                    <h4 className="text-xl font-semibold text-gray-800 uppercase">
                                        <Link to={`/admin/lotissements/${id}/details`} >Lotissement :
                                            <span className="ml-2 text-primary">
                                                {lotissement.nom}
                                            </span>
                                        </Link>
                                    </h4>

                                </>}

                            </div>
                            <div className="flex items-center justify-end border-b border-gray-200 px-6 py-4">

                                <button onClick={() => handleOpenModal()} className="text-primary flex items-center gap-2">
                                    <LuPlusCircle /> Ajouter un Lot
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="flex mb-4">
                                    <input
                                        type="text"
                                        placeholder="Rechercher..."
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300"
                                    />
                                    <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéro Lot</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Superficie</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coordonnées</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentItems.map((lot) => (
                                            <tr key={lot.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm">{lot.numeroLot}</td>
                                                <td className="px-6 py-4 text-sm">{lot.superficie} m²</td>
                                                <td className="px-6 py-4 text-sm">
                                                    {formatCoordinates(lot.latitude, lot.longitude)}

                                                </td>

                                                <td className="px-6 py-4 text-sm">{lot.statut}</td>
                                                <td className="px-6 py-4 text-sm">{formatPrice(lot.prix)}</td>
                                                <td className="px-6 py-4 text-sm">{lot.usage}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <button
                                                        onClick={() => handleOpenModal(lot)}
                                                        className="flex justify-center items-center space-x-4 text-primary"
                                                    >
                                                        <LuFileEdit /> Modifier
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
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">{editingLot ? "Modifier le Lot" : "Ajouter un Lot"}</h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                                <LuX className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="numeroLot" className="block text-sm font-medium text-gray-700">
                                    Numéro du Lot
                                </label>
                                <input
                                    type="text"
                                    name="numeroLot"
                                    id="numeroLot"
                                    value={formData.numeroLot}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="superficie" className="block text-sm font-medium text-gray-700">
                                    Superficie (m²)
                                </label>
                                <input
                                    type="number"
                                    name="superficie"
                                    id="superficie"
                                    value={formData.superficie}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="statut" className="block text-sm font-medium text-gray-700">
                                    Statut
                                </label>
                                <select
                                    name="statut"
                                    id="statut"
                                    value={formData.statut}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                    required
                                >
                                    <option value="">Sélectionner un statut</option>
                                    <option value="disponible">Disponible</option>
                                    <option value="reserve">Réservé</option>
                                    <option value="vendu">Vendu</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="prix" className="block text-sm font-medium text-gray-700">
                                    Prix (FCFA)
                                </label>
                                <input
                                    type="number"
                                    name="prix"
                                    id="prix"
                                    value={formData.prix}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="usage" className="block text-sm font-medium text-gray-700">
                                    Usage
                                </label>
                                <input
                                    type="text"
                                    name="usage"
                                    id="usage"
                                    value={formData.usage}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                    required
                                />
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    className="mr-3 inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                    onClick={handleCloseModal}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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

export default AdminLotissementLot

