
"use client"
import { useEffect, useState } from "react"
import { LuSearch, LuChevronLeft, LuChevronRight, LuPlus, LuFileEdit, LuEye, LuList, LuPlusSquare } from "react-icons/lu"
import { Link } from "react-router-dom"
import { cn } from "@/utils"
import { AdminBreadcrumb } from "@/components"
import { getLocalites } from "@/services/localiteService"
import { List, Loader2 } from "lucide-react"
import { formatCoordinates, formatPrice } from "@/utils/formatters"

const AdminLocaliteListe = () => {
    const [loading, setLoading] = useState(false)
    const [localites, setLocalites] = useState([])
    const [filter, setFilter] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(5)
    const [error, setError] = useState(null)

    useEffect(() => {

        const fetchLocalite = async () => {
            setLoading(true)
            try {
                const resp = await getLocalites();
                setLocalites(resp);
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchLocalite();
    }, [])
    const filteredLocalites = localites.filter(
        (localite) =>
            localite.nom.toLowerCase().includes(filter.toLowerCase()) ||
            localite.description.toLowerCase().includes(filter.toLowerCase()),
    )

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredLocalites.slice(indexOfFirstItem, indexOfLastItem)

    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Erreur: {error}</div>

    return <>
        <AdminBreadcrumb title="Liste des localités" />
        <section>
            <div className="container">
                <div className="my-6 space-y-6">
                    <div className="grid grid-cols-1">
                        <div className="bg-white dark:bg-default-50 shadow-lg rounded-lg overflow-hidden">

                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                <h4 className="text-xl font-semibold text-gray-800 dark:text-white uppercase">Liste des localités</h4>
                            </div>


                            <div className="flex items-center justify-end border-b gap-4 border-gray-200 px-6 py-4">
                                <Link
                                    to="/admin/localites/nouvelle"
                                    className="text-primary flex items-center gap-2"
                                >
                                    <LuPlusSquare className="mr-2" />  Ajouter une localité
                                </Link>
                            </div>


                            <div className="p-6">
                                <div className="flex mb-4">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            placeholder="Rechercher par nom ou description..."
                                            value={filter}
                                            onChange={(e) => setFilter(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                        <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Nom
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Coordonnées
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Prix
                                                </th>
                                                {/* <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Description
                                                </th> */}
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Lotissements
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {currentItems.map((localite) => (
                                                <tr key={localite.id} className="hover:bg-gray-50 transition-colors duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {localite.nom}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{formatCoordinates(localite.latitude, localite.longitude)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">

                                                        {formatPrice(localite.prix)}
                                                    </td>
                                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{localite.description}</td> */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {localite.lotissements.length > 0 && <>
                                                            <Link to={`/admin/localites/${localite.id}/lotissements`}
                                                                className="text-primary hover:text-primary-700 transition-colors duration-200 flex justify-center items-center px-4 py-2 "
                                                            >
                                                                {localite.lotissements.length} <List />
                                                            </Link>

                                                        </>}

                                                        {localite.lotissements.length == 0 && <>
                                                            <Link to={`/admin/localites/${localite.id}/lotissements/nouveau`}
                                                                className="text-primary hover:text-primary-700 transition-colors duration-200 flex justify-center items-center px-4 py-2 " >
                                                                <LuPlus className="mr-2" /> Ajouter
                                                            </Link>


                                                        </>}

                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex items-center space-x-4 justify-between">
                                                            <Link
                                                                to={`/admin/localites/${localite.id}/modification`}
                                                                className="text-primary hover:text-primary-700 transition-colors duration-200 flex items-center"
                                                            >
                                                                <LuFileEdit className="mr-1" /> Modifier
                                                            </Link>

                                                            <Link
                                                                to={`/admin/localites/${localite.id}/details`}
                                                                className="text-primary hover:text-primary-700 transition-colors duration-200 flex items-center"
                                                            >
                                                                <LuEye className="mr-1" /> Détails
                                                            </Link>
                                                        </div>
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

                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-gray-700">
                                        Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredLocalites.length)} sur{" "}
                                        {filteredLocalites.length} entrées
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={cn(
                                                "px-3 py-1 rounded-md",
                                                currentPage === 1
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : "bg-white text-gray-700 hover:bg-gray-50",
                                            )}
                                        >
                                            <LuChevronLeft className="h-5 w-5" />
                                        </button>
                                        {Array.from({ length: Math.ceil(filteredLocalites.length / itemsPerPage) }).map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => paginate(index + 1)}
                                                className={cn(
                                                    "px-3 py-1 rounded-md",
                                                    currentPage === index + 1
                                                        ? "bg-primary text-white"
                                                        : "bg-white text-gray-700 hover:bg-gray-50",
                                                )}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === Math.ceil(filteredLocalites.length / itemsPerPage)}
                                            className={cn(
                                                "px-3 py-1 rounded-md",
                                                currentPage === Math.ceil(filteredLocalites.length / itemsPerPage)
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : "bg-white text-gray-700 hover:bg-gray-50",
                                            )}
                                        >
                                            <LuChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>

}
export default AdminLocaliteListe

